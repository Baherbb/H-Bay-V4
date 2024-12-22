import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FRONTEND_URL } from '../config/constants';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465, 
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false 
            }
        });
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service is ready');
            return true;
        } catch (error) {
            console.error('Email service error:', error);
            return false;
        }
    }

    async sendResetPasswordEmail(email: string, resetToken: string): Promise<boolean> {
        const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"Your App Name" <${SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested a password reset. Please click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                    style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 4px; display: inline-block;">
                    Reset Password
                    </a>
                </div>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated email. Please do not reply.
                </p>
                </div>
                `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}
export const emailService = new EmailService();

