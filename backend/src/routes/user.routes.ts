import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permissions';
import { Permission } from '../middleware/permissions';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import {
    createEmployee,
    getAllEmployees,
    getAllAdmins,
    updateEmployee,
    deleteEmployee,
    getUserProfile,
    updateUserProfile,
    updateUserEmail,
    updateUserPhone,
    updateUserPassword,
    updateProfilePicture
} from '../controllers/user.controller';

const router = Router();

const uploadDir = path.join(__dirname, '../../../uploads/profile-pictures');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `profile-${uniqueSuffix}.${ext}`);
    }
});

const upload = multer({ storage: storage });

router.use((req, res, next) => {
    console.log('Route accessed:', {
        path: req.path,
        method: req.method,
        auth: req.headers.authorization ? 'Present' : 'Missing'
    });
    next();
});

router.post(
    '/employees',
    authMiddleware,
    hasPermission(Permission.CREATE_EMPLOYEE),
    createEmployee
);

router.get(
    '/employees',
    authMiddleware,
    hasPermission(Permission.VIEW_USERS),
    getAllEmployees
);

router.get(
    '/admins',
    authMiddleware,
    hasPermission(Permission.VIEW_USERS),
    getAllAdmins
);

router.put(
    '/employees/:id',
    authMiddleware,
    hasPermission(Permission.MANAGE_USERS),
    updateEmployee
);

router.delete(
    '/employees/:id',
    authMiddleware,
    hasPermission(Permission.MANAGE_USERS),
    deleteEmployee
);

router.get(
    '/profile',
    authMiddleware,
    getUserProfile
);

router.put(
    '/profile',
    authMiddleware,
    updateUserProfile
);

router.put(
    '/email',
    authMiddleware,
    updateUserEmail
);

router.put(
    '/phone',
    authMiddleware,
    updateUserPhone
);

router.put(
    '/password',
    authMiddleware,
    updateUserPassword
);

router.post(
    '/profile-picture',
    authMiddleware,
    upload.single('profile_picture'),
    updateProfilePicture
);

export default router;