import { Kafka } from 'kafkajs'

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [`${process.env.KAFKA_BROKERS}`],
})

export const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP_ID })
