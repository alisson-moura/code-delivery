export class Producer {
    constructor(producer, topic) {
        this.producer = producer
        this.topic = topic || process.env.KAFKA_PRODUCE_TOPIC
    }

    async connect() {
        await this.producer.connect()
    }

    async disconnect() {
        await this.producer.disconnect()
    }

    async sendMessage(message) {
        await this.connect()
        await this.producer.send({
            topic: this.topic,
            messages: [{ value: JSON.stringify(message) }],
        })
    }
}
