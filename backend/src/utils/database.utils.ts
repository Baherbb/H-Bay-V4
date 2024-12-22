import { Transaction } from 'sequelize';
import sequelize from '../config/database';
import Product from '../models/product.model';
import CartItem from '../models/cart-items.model';

export async function reorderProductIds() {
    try {
        const products = await Product.findAll({
            order: [['id', 'ASC']]
        });

        await sequelize.transaction(async (t) => {
            await sequelize.query('ALTER TABLE products DISABLE TRIGGER ALL', { transaction: t });
            await sequelize.query('ALTER TABLE cart_items DISABLE TRIGGER ALL', { transaction: t });

            console.log('Reordering product IDs');
            for (let i = 0; i < products.length; i++) {
                const newId = i + 1;
                
                await sequelize.query(
                    `UPDATE cart_items SET product_id = ${newId} WHERE product_id = ${products[i].id}`,
                    { transaction: t }
                );
                
                await products[i].update({ id: newId }, { transaction: t });
            }

            await sequelize.query(
                `SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM products), false)`,
                { transaction: t }
            );

            await sequelize.query('ALTER TABLE products ENABLE TRIGGER ALL', { transaction: t });
            await sequelize.query('ALTER TABLE cart_items ENABLE TRIGGER ALL', { transaction: t });
        });

        console.log('Product IDs have been reordered successfully');
    } catch (error) {
        console.error('Error reordering product IDs:', error);
        throw error;
    }
}

export async function cleanupCartItems(variantId: number, transaction?: Transaction) {
    try {
        await CartItem.destroy({
            where: { variant_id: variantId },
            transaction: transaction || undefined,
        });
    } catch (error) {
        console.error('Error cleaning up cart items:', error);
        throw error;
    }
}