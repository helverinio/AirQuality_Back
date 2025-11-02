export class UpdateMeasurementDto {
  stationID?: number;
  dateTime?: string | Date;
  pollutantID?: number;
  value?: number | string;
}
