export class Consumer {
    constructor(consumer, topic) {
        this.consumer = consumer
        this.topic = topic || process.env.KAFKA_CONSUMER_TOPIC
    }

    async connect() {
        await this.consumer.connect()
        await this.consumer.subscribe({
            topic: this.topic,
            fromBeginning: false
        })
    }

    async getMessages(cb) {
        await this.connect()
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                cb(message.value.toString())
            },
        })
    }
}
