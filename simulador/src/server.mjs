import * as dotenv from 'dotenv'
dotenv.config()

import { Consumer } from './app/Consumer.mjs';
import { Producer } from './app/Producer.mjs'
import { consumer } from './infra/kafka/consumer.mjs';
import { producer } from './infra/kafka/producer.mjs';
import { loadLocations, sleep } from './app/utils.mjs'

async function sendLocations(route) {
    const producerLocations = new Producer(producer)
    const positions = await loadLocations(route.routeId)
    
    let index = 0
    for await (const position of positions) {
        let finished = positions.length == index + 1
        await producerLocations.sendMessage({ ...route, position, finished })
        index++
        await sleep(3)
    }
    await producerLocations.disconnect()
}

// {"clientId": 2, "routeId": 2}
async function getLocations() {
    const consumerLocations = new Consumer(consumer)
    async function cb(message, consumer) {
        const value = JSON.parse(message)
        if (value.routeId != null) {
            sendLocations(value)
        }
    }
    await consumerLocations.getMessages(cb)
}

async function main() {
    await getLocations()
}
main()