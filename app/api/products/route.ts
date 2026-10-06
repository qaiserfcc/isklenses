import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

const productFields = 'id, name, slug, collection, description, price, compare_price AS "comparePrice", image_url AS "imageUrl", tone, stock, status'

export async function GET(request: Request) {
  const includeDrafts = new URL(request.url).searchParams.get('admin') === 'true'
  const query = includeDrafts
    ? `SELECT ${productFields} FROM products ORDER BY created_at DESC`
    : `SELECT ${productFields} FROM products WHERE status = $1 ORDER BY created_at DESC`
  const { rows } = await pool.query(query, includeDrafts ? [] : ['published'])
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, slug, collection, description = '', price, comparePrice = null, imageUrl = '', tone = '', stock = 0, status = 'draft' } = body
  if (!name || !slug || !collection || !Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return NextResponse.json({ error: 'Invalid product payload' }, { status: 400 })
  const { rows } = await pool.query(`INSERT INTO products (name, slug, collection, description, price, compare_price, image_url, tone, stock, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${productFields}`, [name.trim(), slug.trim(), collection.trim(), description, price, comparePrice, imageUrl, tone, stock, status])
  return NextResponse.json(rows[0], { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status, stock, price, description, imageUrl } = body
  if (!Number.isInteger(Number(id))) return NextResponse.json({ error: 'Product id is required' }, { status: 400 })
  const { rows } = await pool.query(`UPDATE products SET status = COALESCE($2, status), stock = COALESCE($3, stock), price = COALESCE($4, price), description = COALESCE($5, description), image_url = COALESCE($6, image_url), updated_at = now() WHERE id = $1 RETURNING ${productFields}`, [id, status, stock, price, description, imageUrl])
  if (!rows[0]) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Product id is required' }, { status: 400 })
  const result = await pool.query('DELETE FROM products WHERE id = $1', [id])
  if (!result.rowCount) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
