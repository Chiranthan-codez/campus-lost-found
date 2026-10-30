import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg, fmtDate } from '../services/api';
import { useAuth } from '../services/auth';
import StatusBadge from '../components/StatusBadge';
import ClaimList from '../components/ClaimList';
import Field from '../components/Field';
import Notice from '../components/Notice';
export default function ItemDetail() {
  const { id } = useParams(), { user } = useAuth(), nav = useNavigate(), loc = useLocation();
  const [item, setItem] = useState(null), [err, setErr] = useState(''), [ok, setOk] = useState(loc.state?.notice || '');
  const [why, setWhy] = useState(''), [details, setDetails] = useState(''), [ferr, setFerr] = useState('');
  const load = () => api.get('/items/' + id).then(r => setItem(r.data)).catch(e => setErr(errMsg(e)));
  useEffect(() => { load(); }, [id]);
  if (!item) return err ? <Notice>{err}</Notice> : <p>Loading…</p>;
  const owner = user && item.userId._id === user.id;
  const claim = async e => {
    e.preventDefault(); setErr(''); setOk('');
    if (why.trim().length < 10) return setFerr('Explain why this item is yours (at least 10 characters)');
    setFerr('');
    try {
      await api.post(`/items/${id}/claims`, { message: `Why it's mine: ${why}\nIdentifying details: ${details || 'none given'}` });
      setOk('Claim submitted. The finder will review it.'); setWhy(''); setDetails(''); load();
    } catch (e) { setErr(errMsg(e)); }
  };
  const returned = async () => { try { await api.patch('/items/' + id, { status: 'RETURNED' }); setOk('Marked as returned.'); load(); } catch (e) { setErr(errMsg(e)); } };
  const del = async () => { if (!confirm('Delete this report?')) return; try { await api.delete('/items/' + id); nav('/my-reports'); } catch (e) { setErr(errMsg(e)); } };
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        {item.imageUrl ? <img src={item.imageUrl} alt={`Photo of ${item.title}`} className="w-full rounded-3xl object-cover" />
          : <div className="h-64 rounded-3xl bg-soft flex items-center justify-center text-muted">No photo provided</div>}
      </div>
      <div>
        <Notice type="success">{ok}</Notice><Notice>{err}</Notice>
        <div className="flex gap-2 mb-3"><span className="pill bg-ink text-white dark:text-[#0e1015]">{item.type === 'LOST' ? 'Lost' : 'Found'}</span><StatusBadge status={item.status} /></div>
        <h1 className="text-4xl">{item.title}</h1>
        <p className="my-4 whitespace-pre-wrap">{item.description}</p>
        {item.additionalDetails && (
          <div className="my-4 p-4 rounded-2xl bg-soft border border-hairline-soft">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted mb-1">Additional Details & Identifying Features</h4>
            <p className="whitespace-pre-wrap text-sm">{item.additionalDetails}</p>
          </div>
        )}
        <dl className="space-y-1">
          <div><dt className="inline font-semibold">Category: </dt><dd className="inline">{item.category}</dd></div>
          <div><dt className="inline font-semibold">Location: </dt><dd className="inline">{item.location}</dd></div>
          <div><dt className="inline font-semibold">Date: </dt><dd className="inline">{fmtDate(item.date)}</dd></div>
          <div><dt className="inline font-semibold">Reported by: </dt><dd className="inline">{item.userId.name}</dd></div>
        </dl>
        {owner && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={`/items/${id}/edit`} className="btn-outline">Edit</Link>
            {item.status !== 'RETURNED' && <button className="btn" onClick={returned}>Mark as returned</button>}
            <button className="btn-outline" onClick={del}>Delete</button>
          </div>
        )}
      </div>
      <section className="md:col-span-2" aria-labelledby="c-h">
        {owner && item.type === 'FOUND' && <><h2 id="c-h" className="text-3xl mb-4">Claims.</h2><ClaimList itemId={id} onChange={load} /></>}
        {!owner && item.type === 'FOUND' && item.status !== 'RETURNED' && (
          <div className="max-w-xl"><h2 id="c-h" className="text-3xl mb-4">Is this yours?</h2>
            {user ? (
              <form onSubmit={claim} noValidate>
                <Field id="why" label="Why does this item belong to you?" required as="textarea" rows={3} error={ferr} value={why} onChange={e => setWhy(e.target.value)} />
                <Field id="details" label="Identifying details (optional)" hint="Something only the owner would know." value={details} onChange={e => setDetails(e.target.value)} />
                <button className="btn">Submit claim</button>
              </form>
            ) : <p><Link to="/login" state={{ from: `/items/${id}` }} className="underline font-semibold">Log in</Link> to submit a claim.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
