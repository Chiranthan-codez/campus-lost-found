import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from './ItemCard';
import ItemPreviewModal from './ItemPreviewModal';
import Notice from './Notice';

export default function ItemGrid({ items, error }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState(null);

  // Automatically open preview modal if ?preview=<id> is present in URL
  useEffect(() => {
    const previewId = searchParams.get('preview');
    if (previewId && items && items.length) {
      const match = items.find((i) => i._id === previewId);
      if (match) {
        setActiveItem(match);
      }
    }
  }, [searchParams, items]);

  const handleOpenPreview = (item) => {
    setActiveItem(item);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('preview', item._id);
    setSearchParams(newParams, { replace: true });
  };

  const handleClosePreview = () => {
    setActiveItem(null);
    if (searchParams.has('preview')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('preview');
      setSearchParams(newParams, { replace: true });
    }
  };

  if (error) return <Notice>{error}</Notice>;
  if (!items) return <p>Loading items…</p>;
  if (!items.length) return <p className="card p-8 text-center">No items found. Try a different search or filter.</p>;

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i._id}>
            <ItemCard item={i} onPreview={handleOpenPreview} />
          </li>
        ))}
      </ul>

      {activeItem && (
        <ItemPreviewModal item={activeItem} onClose={handleClosePreview} />
      )}
    </>
  );
}
