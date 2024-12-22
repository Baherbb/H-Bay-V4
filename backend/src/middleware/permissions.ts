import { Request, Response, NextFunction } from 'express';
import User, { UserType } from '../models/user.model';
export enum Permission {
    VIEW_PRODUCTS = 'view_products',
    CREATE_PRODUCT = 'create_product',
    UPDATE_PRODUCT = 'update_product',
    DELETE_PRODUCT = 'delete_product',
    MANAGE_INVENTORY = 'manage_inventory',

    VIEW_USERS = 'view_users',
    CREATE_EMPLOYEE = 'create_employee',
    CREATE_ADMIN = 'create_admin',
    MANAGE_USERS = 'manage_users',

    VIEW_DASHBOARD = 'view_dashboard',
    VIEW_ANALYTICS = 'view_analytics',

    VIEW_ORDERS = 'view_orders',
    MANAGE_ORDERS = 'manage_orders'
}

export const RolePermissions = {
    customer: [
        Permission.VIEW_PRODUCTS,
        Permission.VIEW_ORDERS
    ],

    employee: [
        Permission.VIEW_PRODUCTS,
        Permission.CREATE_PRODUCT,
        Permission.UPDATE_PRODUCT,
        Permission.MANAGE_INVENTORY,
        Permission.VIEW_ORDERS,
        Permission.MANAGE_ORDERS
    ],

    admin: [
        Permission.VIEW_PRODUCTS,
        Permission.CREATE_PRODUCT,
        Permission.UPDATE_PRODUCT,
        Permission.DELETE_PRODUCT,
        Permission.MANAGE_INVENTORY,
        Permission.VIEW_USERS,
        Permission.CREATE_EMPLOYEE,
        Permission.MANAGE_USERS,
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_ORDERS,
        Permission.MANAGE_ORDERS
    ],

    super_admin: [
        ...Object.values(Permission)
    ]
};



export const hasPermission = (requiredPermission: Permission) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as User;

        if (!user) {
            return next({
                status: 401,
                message: 'Authentication required',
            });
        }

        const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];

        if (!userPermissions.includes(requiredPermission)) {
            return next({
                status: 403,
                message: 'Insufficient permissions',
            });
        }

        next();
    };
};

export const hasPermissions = (requiredPermissions: Permission[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as User;

        if (!user) {
            return next({
                status: 401,
                message: 'Authentication required',
            });
        }

        const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];

        const hasAllPermissions = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasAllPermissions) {
            return next({
                status: 403,
                message: 'Insufficient permissions',
            });
        }

        next();
    };
};

