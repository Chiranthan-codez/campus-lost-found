import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, ImageOff, Eye, Sparkles, Tag, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { fmtDate } from '../services/api';
import ItemPreviewModal from './ItemPreviewModal';

export default function ItemCard({ item, onPreview }) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const openPreview = (e) => {
    if (e) e.stopPropagation();
    if (onPreview) {
      onPreview(item);
    } else {
      setInternalModalOpen(true);
    }
  };

  const handleCardClick = (e) => {
    // Don't trigger modal if user clicked a direct external/internal link
    if (e.target.closest('a') && !e.target.closest('.preview-trigger')) {
      return;
    }
    openPreview(e);
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        className="group card overflow-hidden flex flex-col h-full cursor-pointer hover:border-ink hover:shadow-md transition-all duration-200 relative select-none"
      >
        {/* Top Image Container */}
        <div className="relative h-44 w-full overflow-hidden bg-soft border-b border-hairline-soft">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={`Photo of ${item.title}`}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="h-full w-full bg-soft flex flex-col items-center justify-center text-muted gap-1"
              role="img"
              aria-label="No photo provided"
            >
              <ImageOff size={28} aria-hidden="true" />
              <span className="text-xs">No photo</span>
            </div>
          )}

          {/* Quick Preview Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={openPreview}
              className="preview-trigger pointer-events-auto rounded-full bg-white dark:bg-[#181c24] text-ink text-xs font-semibold px-4 py-2 shadow-md flex items-center gap-1.5 hover:bg-soft transition-all scale-95 group-hover:scale-100 border border-hairline"
            >
              <Eye size={14} />
              <span>Click for Preview</span>
            </button>
          </div>

          {/* Category Tag on Image Corner */}
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
            <Tag size={10} />
            <span>{item.category}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-2.5 flex-1">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill bg-ink text-white dark:text-[#0e1015] text-xs font-semibold">
              {item.type === 'LOST' ? 'Lost' : 'Found'}
            </span>
            <StatusBadge status={item.status} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold leading-snug group-hover:text-soft-ink">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="line-clamp-2 text-muted text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Location & Date */}
          <div className="mt-auto pt-3 border-t border-hairline-soft space-y-1 text-sm text-soft-ink">
            <p className="flex items-center gap-1.5 truncate">
              <MapPin size={15} className="text-muted shrink-0" aria-hidden="true" />
              <span>{item.location}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CalendarDays size={15} className="text-muted shrink-0" aria-hidden="true" />
              <span>{fmtDate(item.date)}</span>
            </p>
          </div>

          {/* Bottom Card Footer with Preview and Full Page Links */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={openPreview}
              className="preview-trigger font-semibold text-ink underline hover:opacity-75 flex items-center gap-1"
            >
              <Sparkles size={12} className="text-amber-500" />
              <span>Quick Preview</span>
            </button>

            <Link
              to={`/items/${item._id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted hover:text-ink flex items-center gap-0.5"
            >
              <span>Full page</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </article>

      {/* Standalone Fallback Preview Modal (when not in a managed grid) */}
      {internalModalOpen && (
        <ItemPreviewModal
          item={item}
          onClose={() => setInternalModalOpen(false)}
        />
      )}
    </>
  );
}
