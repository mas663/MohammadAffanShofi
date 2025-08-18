import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: subject || `New message from ${email}`,
      replyTo: email,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
      <div style="background: linear-gradient(to right, #0ea5e9, #6366f1); padding: 16px; color: white; text-align:center;">
        <h2 style="margin:0;">📩 New Contact Message</h2>
      </div>
      <div style="padding:20px; background-color:#fafafa; color:#111827;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="margin-top:8px; padding:12px; background:#fff; border:1px solid #e5e7eb; border-radius:6px;">
          ${message}
        </div>
      </div>
      <div style="background:#f3f4f6; padding:12px; text-align:center; font-size:12px; color:#6b7280;">
        This message was sent from your portfolio contact form.
      </div>
    </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
