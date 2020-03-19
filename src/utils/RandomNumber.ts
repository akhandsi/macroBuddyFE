/**
 * Get Random number between range <min,max>.
 *
 * @param min minimum number
 * @param max maximum number
 */
export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
