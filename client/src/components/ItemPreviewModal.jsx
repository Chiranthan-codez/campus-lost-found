import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  MapPin, 
  CalendarDays, 
  User, 
  ImageOff, 
  ExternalLink, 
  Share2, 
  Check, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { fmtDate } from '../services/api';

export default function ItemPreviewModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!item) return;

    // Handle ESC key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/items/${item._id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const isFound = item.type === 'FOUND';
  const reporterName = typeof item.userId === 'object' && item.userId?.name ? item.userId.name : 'Campus Member';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#13161c] text-ink rounded-3xl border border-hairline shadow-2xl p-6 sm:p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill bg-ink text-white dark:text-[#0e1015] font-semibold text-xs tracking-wider uppercase">
              {item.type === 'LOST' ? 'Lost Item' : 'Found Item'}
            </span>
            <StatusBadge status={item.status} />
            <span className="pill bg-soft text-ink text-xs flex items-center gap-1 capitalize">
              <Tag size={13} aria-hidden="true" />
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy link to this item"
              className="p-2 rounded-full hover:bg-soft text-muted hover:text-ink transition-colors flex items-center gap-1.5 text-xs font-semibold px-3 border border-hairline-soft"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-soft text-muted hover:text-ink transition-colors"
              aria-label="Close preview modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Grid: Image + Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Enlarged Preview Image */}
          <div className="relative rounded-2xl overflow-hidden bg-soft border border-hairline-soft flex items-center justify-center min-h-[260px] md:min-h-[320px]">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={`Photo of ${item.title}`} 
                className="w-full h-full max-h-[380px] object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted p-8 text-center">
                <ImageOff size={48} className="mb-2 stroke-1" aria-hidden="true" />
                <p className="text-sm font-medium">No photo provided</p>
                <p className="text-xs text-muted mt-1">Finder/owner didn't upload an image</p>
              </div>
            )}
            
            {/* Quick pill tag over image */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-300" />
              <span>Quick Preview Mode</span>
            </div>
          </div>

          {/* Right Column: Title & Key Metadata */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <h2 id="preview-modal-title" className="text-2xl sm:text-3xl font-bold leading-tight">
                {item.title}
              </h2>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-ink">
                  <MapPin size={16} className="text-muted shrink-0" aria-hidden="true" />
                  <dt className="font-semibold text-muted">Location:</dt>
                  <dd className="font-medium">{item.location}</dd>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <CalendarDays size={16} className="text-muted shrink-0" aria-hidden="true" />
                  <dt className="font-semibold text-muted">Date:</dt>
                  <dd className="font-medium">{fmtDate(item.date)}</dd>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <User size={16} className="text-muted shrink-0" aria-hidden="true" />
                  <dt className="font-semibold text-muted">Reported by:</dt>
                  <dd className="font-medium">{reporterName}</dd>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <Clock size={16} className="text-muted shrink-0" aria-hidden="true" />
                  <dt className="font-semibold text-muted">Listed:</dt>
                  <dd className="font-medium">{new Date(item.createdAt || item.date).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {/* Status alert card */}
            <div className={`p-3.5 rounded-2xl text-xs border ${
              item.status === 'RETURNED'
                ? 'bg-soft text-muted border-hairline'
                : item.status === 'CLAIM_PENDING'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                : isFound
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={15} />
                <span>
                  {item.status === 'RETURNED' 
                    ? 'This item has already been reunited with its owner.' 
                    : item.status === 'CLAIM_PENDING'
                    ? 'A claim is currently under review by the finder.'
                    : isFound
                    ? 'Available to be claimed by its rightful owner.'
                    : 'Active lost report — notify if seen.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Extra Details Section */}
        <div className="space-y-4 pt-2 border-t border-hairline-soft">
          <div>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1.5">
              Primary Description
            </h3>
            <p className="text-ink leading-relaxed whitespace-pre-wrap text-base">
              {item.description}
            </p>
          </div>

          {/* More Description / Identifying Details Section */}
          <div className="p-4 rounded-2xl bg-soft border border-hairline-soft space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-ink" />
              <h4 className="font-bold text-sm tracking-wide text-ink">
                Extended Description & Identifying Notes
              </h4>
            </div>

            {item.additionalDetails ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-soft-ink">
                {item.additionalDetails}
              </p>
            ) : (
              <p className="text-sm text-muted italic">
                {isFound 
                  ? 'To protect against false claims, specific private identifiers (such as serial numbers or precise hidden marks) are kept by the finder and can be verified when submitting your claim.'
                  : 'No extra markings were noted. If you have seen an item matching this description, please visit the full item page to get in touch.'}
              </p>
            )}

            {/* Smart Contextual Guidance */}
            <div className="pt-2 text-xs text-muted border-t border-hairline flex items-center justify-between">
              <span>Category: <strong className="capitalize">{item.category}</strong></span>
              <span>Campus Verification Active</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline-soft">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-outline text-sm"
          >
            Close Preview
          </button>

          <Link 
            to={`/items/${item._id}`}
            className="btn text-sm"
          >
            <span>{isFound && item.status !== 'RETURNED' ? 'View Full Page & Claim' : 'Open Full Item Page'}</span>
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

