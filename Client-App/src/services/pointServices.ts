export interface CarPoint {
  Id: number;
  VID: number;
  Valid: boolean;
  DateTime: Date;
  Lat: number;
  Lon: number;
  Speed: number;
  Course: number;
}

/**
 * Point
 */
/*
export function Point() : CarPoint[] {
    var points;
    fetch(`/weatherforecast`)
        .then(response => points = response.json());
    return points;
}
*/
