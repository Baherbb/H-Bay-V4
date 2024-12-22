import { QueryInterface } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.removeConstraint(
            'cart_items',
            'cart_items_variant_id_fkey'
        );

        await queryInterface.addConstraint('cart_items', {
            fields: ['variant_id'],
            type: 'foreign key',
            name: 'cart_items_variant_id_fkey',
            references: {
                table: 'product_variants',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        await queryInterface.changeColumn('cart_items', 'variant_id', {
            type: 'INTEGER',
            allowNull: true
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeConstraint(
            'cart_items',
            'cart_items_variant_id_fkey'
        );

        await queryInterface.addConstraint('cart_items', {
            fields: ['variant_id'],
            type: 'foreign key',
            name: 'cart_items_variant_id_fkey',
            references: {
                table: 'product_variants',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        });

        await queryInterface.changeColumn('cart_items', 'variant_id', {
            type: 'INTEGER',
            allowNull: false
        });
    }
};