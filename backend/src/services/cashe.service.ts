// // services/cache.service.ts
// import Redis from 'ioredis';
// import Product from '../models/product.model';

// const redis = new Redis(process.env.REDIS_URL);

// export class CacheService {
//     static async getProduct(id: number): Promise<Product | null> {
//         const cached = await redis.get(`product:${id}`);
//         if (cached) {
//             return JSON.parse(cached);
//         }
//         return null;
//     }

//     static async setProduct(id: number, product: Product): Promise<void> {
//         await redis.set(
//             `product:${id}`,
//             JSON.stringify(product),
//             'EX',
//             3600 // 1 hour
//         );
//     }
// }

