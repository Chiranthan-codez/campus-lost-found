import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg, fmtDate } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ClaimList from '../components/ClaimList';
import Notice from '../components/Notice';
export default function MyReports() {
  const [items, setItems] = useState(null), [claims, setClaims] = useState(null), [err, setErr] = useState('');
  const load = () => {
    api.get('/items/mine').then(r => setItems(r.data)).catch(e => setErr(errMsg(e)));
    api.get('/claims/my').then(r => setClaims(r.data)).catch(e => setErr(errMsg(e)));
  };
  useEffect(load, []);
  const del = async i => { if (!confirm(`Delete "${i.title}"?`)) return; try { await api.delete('/items/' + i._id); load(); } catch (e) { setErr(errMsg(e)); } };
  return (
    <>
      <h1 className="text-4xl mb-6">My reports.</h1>
      <Notice>{err}</Notice>
      {!items ? <p>Loading…</p> : !items.length ? <p className="card p-8">You have no reports yet. <Link to="/report" className="underline font-semibold">Report an item</Link>.</p> : (
        <ul className="space-y-4">
          {items.map(i => (
            <li key={i._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl"><Link to={`/items/${i._id}`} className="hover:underline">{i.title}</Link></h2>
                  <p className="text-muted">{i.type === 'LOST' ? 'Lost' : 'Found'} · {fmtDate(i.date)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={i.status} />
                  <Link to={`/items/${i._id}/edit`} className="btn-outline">Edit</Link>
                  <button className="btn-outline" onClick={() => del(i)}>Delete</button>
                </div>
              </div>
              {i.type === 'FOUND' && <details className="mt-4"><summary className="cursor-pointer font-semibold">Claims on this item</summary><div className="mt-3"><ClaimList itemId={i._id} onChange={load} /></div></details>}
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-3xl mt-12 mb-4">Claims I submitted.</h2>
      {!claims ? <p>Loading…</p> : !claims.length ? <p className="text-muted">You haven't claimed anything.</p> : (
        <ul className="space-y-2">{claims.map(c => <li key={c._id} className="card p-4 flex flex-wrap justify-between gap-2">
          <Link to={`/items/${c.itemId?._id}`} className="font-semibold hover:underline">{c.itemId?.title || 'Deleted item'}</Link>
          <span className="pill bg-soft">{c.status.toLowerCase()}</span></li>)}</ul>
      )}
    </>
  );
}
