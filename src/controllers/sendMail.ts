import * as amqp from "amqplib";
import { Message } from "amqplib";
import nodemailer from "nodemailer";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

const rabbitMQUrl = "amqp://127.0.0.1";
const queueName = "email_queue";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_AUTH,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function setupConsumer(
  recipient: string,
  subject: string,
  content: string
): Promise<void> {
  const connection = await amqp.connect(rabbitMQUrl);
  // console.log("first", connection);
  const channel = await connection.createChannel();
  // console.log("a", channel);

  await channel.assertQueue(queueName, { durable: true });

  await channel.consume(queueName, (msg) => {
    if (msg) {
      consumeMessage(msg, recipient, subject, content).then(() => {
        channel.ack(msg);
      });
    }
  });

  console.log("Consumer is waiting for messages...");
}

async function consumeMessage(
  msg: Message,
  recipient: string,
  subject: string,
  content: string
): Promise<void> {
  console.log("Received:", content);

  const mailOptions = {
    from: "kolangk866@gmail.com",
    to: recipient,
    subject: subject || "Default Subject",
    text: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
