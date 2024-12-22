import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Op } from 'sequelize';
import User from '../models/user.model';
import { emailService } from '../services/email.service';

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(200).json({
                status: 'success',
                message: 'If a user with this email exists, they will receive password reset instructions.',
            });
            return;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Hash token
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        await user.update({
            reset_password_token: hashedToken,
            reset_password_expires: resetTokenExpiry,
        });

        // Attempt to send email
        const emailSent = await emailService.sendResetPasswordEmail(email, resetToken);

        if (!emailSent) {
            await user.update({
                reset_password_token: null,
                reset_password_expires: null,
            });
            throw new Error('Failed to send password reset email');
        }

        res.status(200).json({
            status: 'success',
            message: 'If a user with this email exists, they will receive password reset instructions.',
        });
    } catch (error) {
        console.error('Password reset error:', error);
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            res.status(400).json({
                status: 'error',
                message: 'Password must be at least 6 characters long',
            });
            return;
        }

        // Hash token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            where: {
                reset_password_token: hashedToken,
                reset_password_expires: {
                    [Op.gt]: new Date(), // Check if token hasn't expired
                },
            },
        });

        if (!user) {
            res.status(400).json({
                status: 'error',
                message: 'Password reset token is invalid or has expired',
            });
            return;
        }

        // Update password and clear reset token fields
        await user.update({
            password: password,
            reset_password_token: null,
            reset_password_expires: null,
        });

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        next(error);
    }
};