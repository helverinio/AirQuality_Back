"""
populate_alerts.py

Purpose:
- Query recent PM10 and PM2.5 measurements from the project's PostgreSQL database.
- Convert each measurement value to ICA (Índice de Calidad del Aire) using breakpoint tables.
- Insert an alert into the `alerts` table for ICA values above a configured threshold (default: 101, "Dañino para grupos sensibles" and worse).

Usage:
- Install dependency: pip install psycopg2-binary
- Set DB connection via environment variables (one of these options is required):
    DATABASE_URL (postgresql://user:pass@host:port/dbname)
  or set individually:
    PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
- Run:
    python scripts\populate_alerts.py --hours 24

Assumptions and notes:
- Measurement table: "AirQualityMeasurements" with columns "MeasurementID", "DateTime", "Value", "PollutantID", "StationID".
- Pollutant table: "Pollutant" with column "Description" containing strings like "PM10" or "PM2.5".
- Station table: "Station" with column "StationName".
- Alerts table: "alerts" with columns "content", "alertDateTime", "isRead" (isRead boolean default false).
- Threshold to create alerts: ICA >= 101 (configurable via --threshold). If you want alerts for lower ICA (e.g. >=51), pass --threshold 51.
- PM10 breakpoints: taken from your provided table.
- PM2.5 breakpoints: inferred from typical AQI breakpoints (EPA). If you need different PM2.5 ranges, edit the PM2_5_BREAKPOINTS in the script.

This script is idempotent in the sense that it does not check for duplicates; if you run it multiple times it may insert multiple alerts for the same measurement. You can extend it to deduplicate by checking existing alerts contents or by adding a measurement_id column in alerts.
"""

import os
import argparse
import datetime
from urllib.parse import urlparse
import psycopg2
from psycopg2.extras import RealDictCursor


# Conversion breakpoint tables
PM10_BREAKPOINTS = [
    # C_low, C_high, I_low, I_high, category
    (0, 54, 0, 50, 'Bueno'),
    (55, 154, 51, 100, 'Moderado'),
    (155, 254, 101, 150, 'Dañino (grupos sensibles)'),
    (255, 354, 151, 200, 'Dañino'),
    (355, 424, 201, 300, 'Muy dañino'),
    (425, 604, 301, 500, 'Peligroso'),
]

# PM2.5 breakpoints (using common EPA-like breakpoints)
PM25_BREAKPOINTS = [
    (0.0, 12.0, 0, 50, 'Bueno'),
    (12.1, 35.4, 51, 100, 'Moderado'),
    (35.5, 55.4, 101, 150, 'Dañino (grupos sensibles)'),
    (55.5, 150.4, 151, 200, 'Dañino'),
    (150.5, 250.4, 201, 300, 'Muy dañino'),
    (250.5, 500.4, 301, 500, 'Peligroso'),
]


def compute_ica(value: float, pollutant: str):
    """Compute ICA for a single value and pollutant ("PM10" or "PM2.5").

    Returns (ica_int, category_str) or (None, None) if pollutant not supported or value out of range.
    """
    table = None
    if pollutant.upper() == 'PM10':
        table = PM10_BREAKPOINTS
    elif pollutant.upper() in ('PM2.5', 'PM25', 'PM_2.5'):
        table = PM25_BREAKPOINTS
    else:
        return None, None

    for c_low, c_high, i_low, i_high, category in table:
        if value >= c_low and value <= c_high:
            # linear interpolation
            ica = ((i_high - i_low) / (c_high - c_low)) * (value - c_low) + i_low
            return int(round(ica)), category

    # value beyond defined table (e.g., > max), extrapolate using last segment
    c_low, c_high, i_low, i_high, category = table[-1]
    if value > c_high:
        ica = ((i_high - i_low) / (c_high - c_low)) * (value - c_low) + i_low
        return int(round(ica)), category

    return None, None


def get_db_conn_from_env():
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        # parse and return connection dict
        u = urlparse(database_url)
        return psycopg2.connect(
            dbname=u.path[1:], user=u.username, password=u.password, host=u.hostname, port=u.port
        )

    # else use individual vars
    return psycopg2.connect(
        dbname=os.environ.get('PGDATABASE', 'postgres'),
        user=os.environ.get('PGUSER', 'postgres'),
        password=os.environ.get('PGPASSWORD', ''),
        host=os.environ.get('PGHOST', 'localhost'),
        port=os.environ.get('PGPORT', 5432),
    )


def populate_alerts(hours: int = 24, threshold: int = 101, limit: int = 1000, add_column: bool = False):
    """Main routine: fetch measurements from last `hours` and create alerts where ICA >= threshold.

    Deduplication behavior:
    - If the `alerts` table has a `measurement_id` integer column, the script will check
      for existing alerts with the same measurement_id and skip inserting duplicates.
      When present, the script will also write the measurement_id into the new alert row.
    - If `measurement_id` column is not present, the script will deduplicate by identical
      `content` (skip insert if an alert with same content already exists).
    - If `--add-column` is passed, the script will attempt to ALTER TABLE to add
      the `measurement_id` column and create a unique index on it (best-effort).
    """
    conn = get_db_conn_from_env()
    try:
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                since = datetime.datetime.utcnow() - datetime.timedelta(hours=hours)

                # detect if alerts table has measurement_id column
                cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='alerts' AND column_name='measurement_id'")
                has_measurement_id = bool(cur.fetchone())

                if not has_measurement_id and add_column:
                    print('measurement_id column not found in alerts — attempting to add it')
                    try:
                        cur.execute('ALTER TABLE "alerts" ADD COLUMN IF NOT EXISTS "measurement_id" integer')
                        # create unique index to help deduplication (multiple NULLs allowed)
                        cur.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_alerts_measurement_id_unique ON "alerts"("measurement_id")')
                        has_measurement_id = True
                        print('Added measurement_id column and unique index')
                    except Exception as e:
                        print(f'Could not add measurement_id column/index: {e}')

                # Query recent measurements for PM10 and PM2.5
                sql = '''
                SELECT m."MeasurementID" as measurement_id,
                       m."DateTime" as date_time,
                       m."Value"::double precision as value,
                       p."Description" as pollutant,
                       s."StationName" as station_name
                FROM "AirQualityMeasurements" m
                LEFT JOIN "Pollutant" p ON m."PollutantID" = p."PollutantID"
                LEFT JOIN "Station" s ON m."StationID" = s."StationID"
                WHERE p."Description" IN ('PM10', 'PM2.5')
                  AND m."DateTime" >= %s
                ORDER BY m."DateTime" DESC
                LIMIT %s
                '''
                cur.execute(sql, (since, limit))
                rows = cur.fetchall()

                print(f"Found {len(rows)} measurements to evaluate (last {hours} hours)")

                inserted = 0
                skipped = 0
                for r in rows:
                    measurement_id = r['measurement_id']
                    pollutant = r['pollutant']
                    value = r['value']
                    dt = r['date_time']
                    station = r.get('station_name') or 'Estación desconocida'

                    if value is None or pollutant is None:
                        continue

                    try:
                        ica, category = compute_ica(float(value), pollutant)
                    except Exception as e:
                        print(f"Skipping measurement {measurement_id}: error computing ICA: {e}")
                        continue

                    if ica is None:
                        continue

                    if ica >= threshold:
                        # Mensaje en español. Incluye unidad (µg/m³) y fecha en formato ISO.
                        content = (
                            f"ICA {ica} ({category}) detectado para {pollutant} = {value} µg/m³ en {station} el {dt.isoformat()}"
                        )

                        # deduplicate
                        if has_measurement_id and measurement_id is not None:
                            cur.execute('SELECT 1 FROM "alerts" WHERE "measurement_id" = %s LIMIT 1', (measurement_id,))
                            if cur.fetchone():
                                skipped += 1
                                continue

                            insert_sql = 'INSERT INTO "alerts" ("content", "alertDateTime", "isRead", "measurement_id") VALUES (%s, %s, %s, %s)'
                            cur.execute(insert_sql, (content, dt, False, measurement_id))
                            inserted += 1
                        else:
                            # fallback dedup by exact content
                            cur.execute('SELECT 1 FROM "alerts" WHERE "content" = %s LIMIT 1', (content,))
                            if cur.fetchone():
                                skipped += 1
                                continue

                            insert_sql = 'INSERT INTO "alerts" ("content", "alertDateTime", "isRead") VALUES (%s, %s, %s)'
                            cur.execute(insert_sql, (content, dt, False))
                            inserted += 1

                print(f"Inserted {inserted} alerts (skipped {skipped}) — threshold {threshold}")
    finally:
        conn.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Populate alerts table from recent measurements (compute ICA).')
    parser.add_argument('--hours', type=int, default=24, help='Lookback window in hours (default 24)')
    parser.add_argument('--threshold', type=int, default=101, help='ICA threshold to create alerts (default 101)')
    parser.add_argument('--limit', type=int, default=1000, help='Max number of measurements to fetch (default 1000)')
    args = parser.parse_args()

    populate_alerts(hours=args.hours, threshold=args.threshold, limit=args.limit)
