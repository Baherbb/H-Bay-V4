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

export type UserRole = 'customer' | 'employee' | 'admin' | 'super_admin';

export const RolePermissions: Record<UserRole, Permission[]> = {
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
    super_admin: Object.values(Permission)
};
