'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react'

const products = [
  { name: 'Almond Brown', category: 'Bella Lenses', price: 2199, compare: 5250, tone: 'Warm amber', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=85' },
  { name: 'Ash Brown', category: 'Bella Lenses', price: 2199, compare: 5250, tone: 'Soft ash', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85' },
  { name: 'Bluish Grey', category: 'Bella Lenses', price: 2199, compare: 5250, tone: 'Cool grey', image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=85' },
  { name: 'Hazel Honey', category: 'Bella Lenses', price: 2199, compare: 5250, tone: 'Honey hazel', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85' },
  { name: 'Ocean Blue', category: 'Bella Lenses', price: 2199, compare: 5250, tone: 'Ocean blue', image: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=85' },
  { name: 'Platinum Grey', category: 'Bella Lenses', price: 2199, compare: 5250, tone: 'Platinum', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85' },
  { name: 'EL Dorado Aqua Marine', category: 'EL Dorado Lenses', price: 1749, compare: 3500, tone: 'Aqua marine', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85' },
  { name: 'EL Dorado Choco', category: 'EL Dorado Lenses', price: 1749, compare: 3500, tone: 'Chocolate', image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=85' },
]
const nav = ['Home', 'New Arrival', 'Bella Lenses', 'Hidrocor Lenses', 'Contact Lenses', 'Deals', 'Limited Time Deals', 'Solutions', 'Travel Kit', 'Cosmetics']
const money = (value: number) => `₨${value.toLocaleString('en-PK')}`

function ProductCard({ product }: { product: typeof products[number] }) {
  const [added, setAdded] = useState(false)
  return <article className="group min-w-[230px] flex-1">
    <div className="relative overflow-hidden bg-[#f2eee9] aspect-[0.82]">
      <img src={product.image} alt={`${product.name} contact lenses`} className="h-full w-full object-cover mix-blend-multiply transition duration-700 group-hover:scale-105" />
      <span className="absolute left-3 top-3 bg-[#253d35] px-3 py-1 text-[10px] font-semibold uppercase tracking-[.18em] text-white">Sale!</span>
      <button onClick={() => setAdded(!added)} className="absolute bottom-3 left-3 right-3 bg-white/95 py-3 text-[11px] font-semibold uppercase tracking-[.16em] opacity-0 transition group-hover:opacity-100">{added ? 'Added to cart' : 'Select options'}</button>
    </div>
    <div className="pt-4">
      <p className="text-[10px] uppercase tracking-[.18em] text-[#8d897f]">{product.category}</p>
      <h3 className="mt-1 text-lg font-medium text-[#202622]">{product.name}</h3>
      <div className="mt-2 flex items-center gap-2 text-sm"><span className="text-[#253d35]">{money(product.price)}</span><s className="text-[#9e9a93]">{money(product.compare)}</s></div>
    </div>
  </article>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cart, setCart] = useState(0)
  const [filter, setFilter] = useState('All')
  const visible = useMemo(() => filter === 'All' ? products : products.filter(p => p.category.startsWith(filter)), [filter])
  return <main className="min-h-screen bg-[#fcfbf8] text-[#202622]">
    <div className="bg-[#253d35] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[.24em] text-white">Free delivery across Pakistan on orders above ₨3,000</div>
    <header className="sticky top-0 z-30 border-b border-[#e5e0d8] bg-[#fcfbf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 lg:px-10">
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
        <a href="#top" className="font-serif text-3xl italic tracking-[-.08em] text-[#253d35]">isk<span className="text-[#b98d63]">lenses</span></a>
        <nav className="hidden items-center gap-6 lg:flex">{nav.map(item => <a key={item} href={item === 'Home' ? '#top' : `#${item.toLowerCase().replaceAll(' ', '-')}`} className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#565950] transition hover:text-[#b98d63]">{item}</a>)}</nav>
        <div className="flex items-center gap-4"><button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><Search size={18} strokeWidth={1.5} /></button><button onClick={() => setCart(cart + 1)} className="flex items-center gap-2 text-[11px] uppercase tracking-[.14em]"><ShoppingBag size={18} strokeWidth={1.5} />{cart} cart</button></div>
      </div>
      {searchOpen && <div className="border-t border-[#e5e0d8] px-5 py-4"><input autoFocus className="mx-auto block w-full max-w-xl border-b border-[#253d35] bg-transparent py-2 text-center outline-none" placeholder="Search lenses, colors, collections..." /></div>}
      {menuOpen && <nav className="flex flex-col gap-5 border-t border-[#e5e0d8] px-6 py-6 lg:hidden">{nav.map(item => <a key={item} href="#catalog" onClick={() => setMenuOpen(false)} className="text-xs font-semibold uppercase tracking-[.16em]">{item}</a>)}</nav>}
    </header>

    <section id="top" className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-24 lg:pt-20">
      <div className="max-w-xl"><p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.28em] text-[#b98d63]"><Sparkles size={14} /> See yourself differently</p><h1 className="font-serif text-6xl leading-[.95] tracking-[-.06em] sm:text-8xl">Colour your <em>world.</em></h1><p className="mt-7 max-w-md text-base leading-7 text-[#6c6c64]">Premium contact lenses for the moments you want to feel a little more like yourself. Original shades, all-day comfort, delivered across Pakistan.</p><a href="#catalog" className="mt-8 inline-flex items-center gap-3 bg-[#253d35] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.2em] text-white transition hover:bg-[#b98d63]">Shop the collection <ArrowRight size={15} /></a></div>
      <div className="relative overflow-hidden bg-[#e7ddd0]"><img src="https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1200&q=85" alt="Woman wearing colorful contact lenses" className="h-[540px] w-full object-cover object-center mix-blend-multiply lg:h-[650px]" /><div className="absolute bottom-5 left-5 bg-[#fcfbf8]/90 px-4 py-3 text-[10px] uppercase tracking-[.16em]">New season / 2026</div></div>
    </section>
    <section className="border-y border-[#e5e0d8] bg-[#f3eee7] px-5 py-4"><div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 text-[10px] font-semibold uppercase tracking-[.18em] text-[#5f6259]"><span>100% Original lenses</span><span>Nationwide delivery</span><span>14-day comfort promise</span><span>Easy WhatsApp support</span></div></section>
    <section id="catalog" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#b98d63]">Shop by colour</p><h2 className="mt-3 font-serif text-5xl tracking-[-.05em]">Find your shade.</h2></div><div className="flex gap-2">{['All', 'Bella', 'EL Dorado'].map(item => <button key={item} onClick={() => setFilter(item)} className={`border px-4 py-2 text-[10px] uppercase tracking-[.15em] ${filter === item ? 'border-[#253d35] bg-[#253d35] text-white' : 'border-[#d8d2c9] text-[#696a63]'}`}>{item}</button>)}</div></div><div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-7">{visible.map(product => <ProductCard key={product.name} product={product} />)}</div></section>
    <section id="solutions" className="grid bg-[#253d35] text-white lg:grid-cols-2"><div className="flex min-h-[430px] flex-col justify-center px-6 py-16 lg:px-16"><p className="text-[10px] uppercase tracking-[.25em] text-[#d8b38b]">The isklenses promise</p><h2 className="mt-5 max-w-lg font-serif text-5xl leading-[.98] tracking-[-.05em]">Made for your eyes. Chosen by your style.</h2><p className="mt-6 max-w-md leading-7 text-white/65">From subtle everyday enhancement to a whole new look, our curated collections make finding your perfect lens simple.</p><a href="#catalog" className="mt-8 flex w-fit items-center gap-3 border-b border-[#d8b38b] pb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#d8b38b]">Explore all lenses <ArrowRight size={14} /></a></div><div className="min-h-[430px] bg-[#d8c0a7]"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85" alt="Model portrait for isklenses" className="h-full w-full object-cover mix-blend-multiply" /></div></section>
    <footer className="border-t border-[#e5e0d8] px-5 py-12 lg:px-10"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row"><div><div className="font-serif text-3xl italic tracking-[-.08em] text-[#253d35]">isk<span className="text-[#b98d63]">lenses</span></div><p className="mt-3 max-w-xs text-sm leading-6 text-[#77776f]">Your eyes, your colour, your story. Original contact lenses delivered across Pakistan.</p></div><div className="flex gap-12 text-[10px] font-semibold uppercase tracking-[.16em] text-[#5f6259]"><div className="flex flex-col gap-3"><span className="text-[#b98d63]">Customer care</span><a href="#">Contact us</a><a href="#">Shipping & returns</a><a href="#">Lens guide</a></div><div className="flex flex-col gap-3"><span className="text-[#b98d63]">Follow along</span><a href="#">Instagram</a><a href="#">WhatsApp</a><a href="/admin">Admin portal</a></div></div></div><div className="mx-auto mt-12 max-w-[1440px] border-t border-[#e5e0d8] pt-5 text-[10px] uppercase tracking-[.16em] text-[#9c9b93]">© 2026 isklenses — Original lenses, original you.</div></footer>
  </main>
}
