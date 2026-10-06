import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  const { rows } = await pool.query('SELECT id, name, slug, collection, description, price, compare_price AS "comparePrice", image_url AS "imageUrl", tone, stock, status FROM products WHERE status = $1 ORDER BY created_at DESC', ['published'])
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, slug, collection, description = '', price, comparePrice = null, imageUrl = '', tone = '', stock = 0, status = 'draft' } = body
  if (!name || !slug || !collection || !Number.isInteger(price) || price < 0) return NextResponse.json({ error: 'Invalid product payload' }, { status: 400 })
  const { rows } = await pool.query('INSERT INTO products (name, slug, collection, description, price, compare_price, image_url, tone, stock, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, name, slug, collection, description, price, compare_price AS "comparePrice", image_url AS "imageUrl", tone, stock, status', [name, slug, collection, description, price, comparePrice, imageUrl, tone, stock, status])
  return NextResponse.json(rows[0], { status: 201 })
}
