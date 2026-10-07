import nodemailer from "nodemailer"
import { OtpError } from "../types"

export async function sendEmailCode(email: string, otp: string, minutes: number): Promise<string> {
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587, secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: 4000, greetingTimeout: 4000, socketTimeout: 8000,
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}) })
  let deadline: ReturnType<typeof setTimeout> | undefined
  try {
    const message = transport.sendMail({
      from: { name: process.env.SMTP_FROM_NAME || "Younoya", address: process.env.SMTP_FROM_EMAIL || "noreply@younoya.com" },
      to: email, subject: "Your Younoya sign-in code",
      text: `Your Younoya verification code is ${otp}. It expires in ${minutes} minutes. Do not share this code.`,
      html: `<div style="background:#171411;color:#f3eee5;padding:32px;font-family:Arial,sans-serif;max-width:480px">
        <p style="color:#cfb68a;letter-spacing:3px">YOUNOYA</p><h2>Your sign-in code</h2>
        <p style="font-size:32px;letter-spacing:8px;color:#cfb68a">${otp}</p>
        <p>Valid for ${minutes} minutes. Keep this code private.</p></div>` })
    const result = await Promise.race([message, new Promise<never>((_resolve, reject) => {
      deadline = setTimeout(() => { transport.close(); reject(new Error("Delivery timed out")) }, 8000)
    })])
    if (!result.accepted?.length) throw new Error("Email not accepted")
    return result.messageId
  } catch {
    throw new OtpError("Could not request a code. Please try again after a minute.", 503, 60)
  } finally { clearTimeout(deadline); transport.close() }
}
