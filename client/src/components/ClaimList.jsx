import { useEffect, useState } from 'react';
import api, { errMsg, fmtDate } from '../services/api';
import Notice from './Notice';
export default function ClaimList({ itemId, onChange }) {
  const [claims, setClaims] = useState(null), [err, setErr] = useState('');
  const load = () => api.get(`/items/${itemId}/claims`).then(r => setClaims(r.data)).catch(e => setErr(errMsg(e)));
  useEffect(() => { load(); }, [itemId]);
  const act = async (id, status) => {
    try { await api.patch('/claims/' + id, { status }); await load(); onChange?.(); } catch (e) { setErr(errMsg(e)); }
  };
  if (!claims) return err ? <Notice>{err}</Notice> : <p>Loading claims…</p>;
  if (!claims.length) return <p className="text-muted">No claims yet.</p>;
  return (
    <>
      <Notice>{err}</Notice>
      <ul className="space-y-3">
        {claims.map(c => (
          <li key={c._id} className="card p-4">
            <p className="font-semibold">{c.claimantId.name} <span className="font-normal text-muted">({c.claimantId.email}) · {fmtDate(c.createdAt)}</span></p>
            <p className="whitespace-pre-wrap my-2">{c.message}</p>
            <p className="mb-2">Status: <span className="pill bg-soft">{c.status.toLowerCase()}</span></p>
            {c.status === 'PENDING' && (
              <div className="flex gap-2">
                <button className="btn" onClick={() => act(c._id, 'ACCEPTED')}>Accept</button>
                <button className="btn-outline" onClick={() => act(c._id, 'REJECTED')}>Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
