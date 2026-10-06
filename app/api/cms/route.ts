import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  const [navigation, content] = await Promise.all([
    pool.query('SELECT id, label, href, position, is_visible AS "isVisible" FROM navigation_items WHERE is_visible = true ORDER BY position ASC'),
    pool.query('SELECT key, value FROM cms_content ORDER BY key ASC'),
  ])
  return NextResponse.json({ navigation: navigation.rows, content: Object.fromEntries(content.rows.map((row: { key: string; value: string }) => [row.key, row.value])) })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  if (body.type === 'navigation') {
    if (!body.label || !body.href) return NextResponse.json({ error: 'Invalid navigation item' }, { status: 400 })
    const { rows } = await pool.query('INSERT INTO navigation_items (label, href, position) VALUES ($1,$2,$3) RETURNING id, label, href, position, is_visible AS "isVisible"', [body.label, body.href, Number(body.position) || 0])
    return NextResponse.json(rows[0], { status: 201 })
  }
  if (body.type === 'content' && body.key) {
    const { rows } = await pool.query('INSERT INTO cms_content (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now() RETURNING key, value', [body.key, String(body.value ?? '')])
    return NextResponse.json(rows[0])
  }
  return NextResponse.json({ error: 'Invalid CMS payload' }, { status: 400 })
}
