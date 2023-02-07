import { open } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url';

export async function loadLocations(id) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = resolve(__dirname, '..', 'locations', `${id}.txt`)
    const file = await open(filePath)
    const location = []

    for await (const line of file.readLines()) {
        const [lat, long] = line.split(',')
        location.push({ lat, long })
    }

    return location
}


export function sleep(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}