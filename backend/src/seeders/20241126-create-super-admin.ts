import { QueryInterface } from 'sequelize';
import User from '../models/user.model';
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '../config/constants';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        try {
            await User.create({
                name: 'Baher Nader',
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD, 
                user_type: 'super_admin',
                phone: '01001691976',
                created_at: new Date(),
                updated_at: new Date(),
            });
        } catch (error) {
            console.error('Error seeding super admin:', error);
            throw error;
        }
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        try {
            await queryInterface.bulkDelete('users', { email: SUPER_ADMIN_EMAIL });
        } catch (error) {
            console.error('Error removing super admin seed:', error);
            throw error;
        }
    },
};
