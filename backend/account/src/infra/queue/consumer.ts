import amqp from 'amqplib';

async function main() {
    const conneciton = await amqp.connect("amqp://localhost");
    const channel = await conneciton.createChannel();
    channel.assertQueue('test', { durable: true });
    channel.consume("test", async function (msg: any) {
        const input = JSON.parse(msg.content.toString());
        console.log(input);
        channel.ack(msg);
    })
}

main();