import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_FROM_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  userEmail: string,
  subject: string,
  message: string
) => {
  try {
    const emailData = {
      from: process.env.SMTP_FROM_EMAIL,
      to: userEmail,
      subject,
      html: message,
    };

    await transporter.sendMail(emailData);
  } catch (error) {
    console.log('Error in Sending', error);
    return NextResponse.json(
      {
        message: 'Something went wrong' + error,
      },
      {
        status: 500,
      }
    );
  }
};
