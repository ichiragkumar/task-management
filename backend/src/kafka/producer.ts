import { Kafka, Producer } from "kafkajs";
import { KAFKA_PROJECT_EVENTS } from "../config/types";



const kafka = new Kafka({
    clientId: "project-service",
    brokers:[process.env.KAFKA_BROKER!],
})

const producer = kafka.producer()

export const connectToKafkaProducer = async () =>{
    await producer.connect()
}   


export const emitProjectEvent = async (type: KAFKA_PROJECT_EVENTS, data: any) => {
  await producer.send({
    topic: 'project-events',
    messages: [{ key: type, value: JSON.stringify(data) }],
  });
};