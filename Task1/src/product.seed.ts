import { DataSource } from 'typeorm';
import { Product } from './product/entity/product.entity';
import products from '../product.json';

export const seedProducts = async (dataSource: DataSource) => {
  const productRepository = dataSource.getRepository(Product);

  await productRepository.save(products);

  console.log('✅ Products Seeded Successfully!');
};
