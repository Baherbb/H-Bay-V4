import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { AppError } from "../middleware/error.middleware";
import path from "path";
import fs from 'fs';

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, phone, password, user_type } = req.body;

        if (user_type !== "employee" && user_type !== "admin") {
            res.status(400).json({
                success: false,
                message: "Invalid user type",
            });
            return;
        }

        const newUser = await User.create({
            name,
            email,
            phone,
            password,
            user_type,
        });

        res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
        });
    }
};

export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userType = req.query.user_type || "admin";

        const employees = await User.findAll({
            where: {
                user_type: "employee",
            },
        });

        res.status(200).json({
            success: true,
            data: employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching employees",
        });
    }
};

export const getAllAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userType = req.query.user_type || "admin";

        const employees = await User.findAll({
            where: {
                user_type: "admin", 
            },
        });

        res.status(200).json({
            success: true,
            data: employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching employees",
        });
    }
};

export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const employee = await User.findByPk(id);
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }

        await employee.update(updates);

        res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating employee",
        });
    }
};

export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const employee = await User.findByPk(id);
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }

        await employee.destroy();

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting employee",
        });
    }
};

export const getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const secUser = req.user as User;
        const userId = secUser.id;

        const user = await User.findByPk(userId, {
            attributes: {
                exclude: ["password", "reset_password_token", "reset_password_expires"],
            },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = req.user as User;
        const userId = user.id;
        const { name, phone } = req.body;

        const primaryUser = await User.findByPk(userId);
        if (!primaryUser) {
            throw new AppError("User not found", 404);
        }

        await primaryUser.update({
            name,
            phone,
        });

        res.status(200).json({
            status: "success",
            data: {
                primaryUser,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const secUser = req.user as User;
        const userId = secUser.id;
        const { email } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser && existingUser.id !== userId) {
            throw new AppError("Email already in use", 400);
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        await user.update({ email });

        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserPhone = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const secUser = req.user as User;
        const userId = secUser.id;
        const { phone } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        await user.update({ phone });

        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const secUser = req.user as User;
        const userId = secUser.id;
        const { current_password, new_password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const isPasswordValid = await user.comparePassword(current_password);
        if (!isPasswordValid) {
            throw new AppError("Current password is incorrect", 401);
        }

        await user.update({ password: new_password });

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req.user as User).id;
        const file = req.file;

        if (!file) {
            throw new AppError("No profile picture uploaded", 400);
        }


        const profilePicturePath = `/api/profile-pictures/${file.filename}`;
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.profile_picture) {
            const oldPicturePath = path.join(__dirname, '../../../uploads/profile-pictures', path.basename(user.profile_picture));
            if (fs.existsSync(oldPicturePath)) {
                fs.unlinkSync(oldPicturePath);
            }
        }

        await user.update({ profile_picture: profilePicturePath });

        res.status(200).json({
            status: "success",
            data: {
                user: {
                    ...user.toJSON(),
                    profile_picture: profilePicturePath
                }
            },
        });
    } catch (error) {
        next(error);
    }
};