import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import nodemailer from 'nodemailer'

// Create a transporter using Gmail (you should configure this with your actual email service)
const createTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'demo@fitwell.health',
      pass: process.env.EMAIL_PASS || 'demo-password',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
      include: {
        patient: true,
        doctor: true,
        admin: true,
        superAdmin: true,
        attendant: true,
        controlRoom: true,
      },
    })

    if (!user) {
      // For security reasons, don't reveal whether the email exists
      // Return the same response as if the email exists
      return NextResponse.json({
        message: 'If your email is registered, you will receive a password reset link shortly.',
        success: true,
      })
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 400 }
      )
    }

    // Generate a secure reset token (in a real app, you'd store this in the database with expiration)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // In a real application, you would save this token to the database
    // For demo purposes, we'll just simulate the email sending

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    try {
      const transporter = createTransport()

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fitwell.health',
        to: email,
        subject: 'Password Reset Request - Fitwell Health',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Reset - Fitwell Health</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #2ba664 0%, #238a52 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #2ba664 0%, #238a52 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 14px;
              }
              .security-note {
                background: #f0f9ff;
                border: 1px solid #0284c7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Fitwell Health</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
              </div>
              
              <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.name},</h2>
                
                <p>We received a request to reset your password for your Fitwell Health account. If you didn't make this request, you can safely ignore this email.</p>
                
                <p>To reset your password, click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">
                  ${resetUrl}
                </p>
                
                <div class="security-note">
                  <strong>Security Information:</strong>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This link will expire in 15 minutes for your security</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share your password reset link with anyone</li>
                  </ul>
                </div>
                
                <p>If you have any questions or need assistance, please contact our support team.</p>
                
                <p>Best regards,<br>The Fitwell Health Team</p>
              </div>
              
              <div class="footer">
                <p>&copy; 2024 Fitwell Health. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }

      // Send email
      await transporter.sendMail(mailOptions)

      // In a real application, you would save the reset token to the database here
      // For demo purposes, we'll just log it
      console.log(`Password reset token generated for ${email}: ${resetToken}`)

      return NextResponse.json({
        message: 'Password reset link sent successfully',
        success: true,
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      
      // If email fails, still return success for security (don't reveal email service issues)
      // But log the error for debugging
      return NextResponse.json({
        message: 'If your email is registered, you will receive a password reset link shortly.',
        success: true,
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}