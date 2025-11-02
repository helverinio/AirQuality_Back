export class CreateMeasurementDto {
  stationID?: number;
  dateTime: string | Date;
  pollutantID?: number;
  value: number | string;
}
