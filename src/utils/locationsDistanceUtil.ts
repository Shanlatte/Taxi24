function convertDegreesToRadian(degrees: number): number {
    return (degrees / 180) * Math.PI;
}

// Function used to calculate distance between locations, the formula used is "Haversine", which calculates the 
// shortest distance between two points on a sphere using their latitudes and longitudes measured along the surface.
export function calculateDistanceBetweenLocations(
    degreesLatitude1: number = 0,
    degreesLongitude1: number = 0,
    degreesLatitude2: number = 0,
    degreesLongitude2: number = 0): number {

    const latitude1: number = convertDegreesToRadian(degreesLatitude1);
    const latitude2: number = convertDegreesToRadian(degreesLatitude2);
    const longitude1: number = convertDegreesToRadian(degreesLongitude1);
    const longitude2: number = convertDegreesToRadian(degreesLongitude2);

    const earthRadiusInKm: number = 6371.0088;

    const differenceInLatitude: number = latitude2 - latitude1;
    const differenceInLongitude: number = longitude2 - longitude1;

    const sqrtResult: number = Math.sqrt(
        Math.sin(differenceInLatitude / 2) *
        Math.sin(differenceInLatitude / 2) +
        Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(differenceInLongitude / 2) *
        Math.sin(differenceInLongitude / 2),
    );

    const distance: number = 2 * earthRadiusInKm * Math.asin(sqrtResult);
    return parseFloat(distance.toFixed(6));
};