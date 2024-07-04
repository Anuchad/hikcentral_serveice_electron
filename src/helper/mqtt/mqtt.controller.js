const amqplib = require("amqplib");
const urlConnection = `amqp://${process.env.MQTT_USERNAME}:${process.env.MQTT_PASSWORD}@${process.env.MQTT_DOMAIN}`;

async function connnectMqtt() {
  console.log("connect Mqtt", urlConnection);
  const conn = await amqplib.connect(urlConnection);
  const channel = await conn.createChannel();
  return channel;
}

async function consumerMessage() {
  console.log("connect Mqtt");
  const conn = await amqplib.connect(urlConnection);
  const channel = await conn.createChannel();
  channel.consume(process.env.MQTT_QUEUSE_SUBSCRIBE, async (msg) => {
    if (msg !== null) {
      const data = msg.content.toString();
      console.log(data);
      channel.ack(msg);
    }
  });
}

async function sendMessage(data) {
  const conn = await amqplib.connect(urlConnection);
  const channel = await conn.createChannel();
  const queuse = process.env.MQTT_QUEUSE_PUBLISH;
  channel.assertQueue(queuse, {
    durable: false,
  });
  channel.sendToQueue(queuse, Buffer.from(JSON.stringify(data)));
  console.log("send Mqtt message");
  channel.close();
}

module.exports = {
  connnectMqtt,
  consumerMessage,
  sendMessage,
};
