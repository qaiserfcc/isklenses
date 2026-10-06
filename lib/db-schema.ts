import { drizzle } from 'drizzle-orm/neon-http';
import { 
  pgTable, 
  text, 
  numeric, 
  timestamp, 
  jsonb, 
  integer,
  serial,
  varchar
} from 'drizzle-orm/pg-core';

// Define database schema
export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 255 }).unique(),
  name: varchar('name', { length: 500 }).notNull(),
  sku: varchar('sku', { length: 255 }).unique().notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 255 }),
  categoryId: integer('category_id'),
  specs: jsonb('specs'),
  sourceUrl: text('source_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  parentId: integer('parent_id'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
});

export const menuItemsTable = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 255 }).unique(),
  label: varchar('label', { length: 255 }).notNull(),
  url: text('url').notNull(),
  parentId: integer('parent_id'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const spreeProductsTable = pgTable('spree_products', {
  id: serial('id').primaryKey(),
  localProductId: integer('local_product_id').notNull(),
  spreeProductId: varchar('spree_product_id', { length: 255 }).unique(),
  spreeSku: varchar('spree_sku', { length: 255 }).unique(),
  syncedAt: timestamp('synced_at'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, synced, failed
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow()
});

export type Product = typeof productsTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type SpreeProduct = typeof spreeProductsTable.$inferSelect;
