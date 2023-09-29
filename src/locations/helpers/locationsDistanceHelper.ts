export function convertDegreesToRadian(degrees: number): number {
    return (degrees / 180) * Math.PI;
}

export function calculateDistanceBetweenLocations(rawLatitude1: number = 0, rawLongitude1: number = 0, rawLatitude2: number = 0, rawLongitude2: number = 0): number {
    const latitude1: number = convertDegreesToRadian(rawLatitude1);
    const latitude2: number = convertDegreesToRadian(rawLatitude2);
    const longitude1: number = convertDegreesToRadian(rawLongitude1);
    const longitude2: number = convertDegreesToRadian(rawLongitude2);

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
    return parseFloat(distance.toFixed(2));
};