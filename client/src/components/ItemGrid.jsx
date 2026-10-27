import ItemCard from './ItemCard';
import Notice from './Notice';
export default function ItemGrid({ items, error }) {
  if (error) return <Notice>{error}</Notice>;
  if (!items) return <p>Loading items…</p>;
  if (!items.length) return <p className="card p-8 text-center">No items found. Try a different search or filter.</p>;
  return <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map(i => <li key={i._id}><ItemCard item={i} /></li>)}</ul>;
}
