import AppDataSource from './src/data-source';
import { seedProducts } from './src/product.seed';

AppDataSource.initialize()
  .then(async () => {
    console.log('🌱 Seeding started...');

    await seedProducts(AppDataSource);

    console.log('🌱 Seeding finished!');
    process.exit();
  })
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  });
