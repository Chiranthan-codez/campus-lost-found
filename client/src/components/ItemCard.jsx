import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, ImageOff } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { fmtDate } from '../services/api';
export default function ItemCard({ item }) {
  return (
    <article className="card overflow-hidden flex flex-col h-full">
      {item.imageUrl
        ? <img src={item.imageUrl} alt={`Photo of ${item.title}`} className="h-44 w-full object-cover" />
        : <div className="h-44 bg-soft flex items-center justify-center text-muted" role="img" aria-label="No photo provided"><ImageOff aria-hidden="true" /></div>}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex flex-wrap gap-2"><span className="pill bg-ink text-white">{item.type === 'LOST' ? 'Lost' : 'Found'}</span><StatusBadge status={item.status} /></div>
        <h3 className="text-xl"><Link to={`/items/${item._id}`} className="hover:underline">{item.title}</Link></h3>
        <p className="line-clamp-2 text-muted">{item.description}</p>
        <p className="flex items-center gap-1 text-sm"><MapPin size={16} aria-hidden="true" />{item.location}</p>
        <p className="flex items-center gap-1 text-sm"><CalendarDays size={16} aria-hidden="true" />{fmtDate(item.date)}</p>
      </div>
    </article>
  );
}
