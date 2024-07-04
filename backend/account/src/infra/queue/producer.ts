import amqp from 'amqplib';
import generateId from '../../utils/crypto';

async function main() {
    const conneciton = await amqp.connect("amqp://localhost");
    const channel = await conneciton.createChannel();
    channel.assertQueue('test', { durable: true });
    const input = {
        id: generateId()
    };
    channel.sendToQueue("test", Buffer.from(JSON.stringify(input)));
}

main();