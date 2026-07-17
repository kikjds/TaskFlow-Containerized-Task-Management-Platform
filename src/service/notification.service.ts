import { Worker } from "bullmq";
import redisClient from "../lib/redis.js"
import { User } from "../model/user.model.js"
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

new Worker('notify', async (job) => {
    const taskId = job.data.taskId
    const userId = job.data.userId

    const email = await getUserEmail(userId)
    await notifyUser(email, taskId)
}, {connection: redisClient})

async function getUserEmail(userId: string) {
  try {
    const user = await User.findById(userId);
    return user?.email;
  } catch (error) {
    console.log(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
}
async function notifyUser(email: string | undefined, taskId: string) {
  if (!email) {
    throw new Error(`Email not found for task ${taskId}`);
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Task Notification",
      text: `You have a new notification for task ${taskId}`,
    });
    console.log(`Email sent to ${email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.log(`Failed to send email for task ${taskId}:`, error);
    throw error; 
  }
}