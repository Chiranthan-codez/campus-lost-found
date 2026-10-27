import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api, { errMsg } from '../services/api';
import ItemGrid from '../components/ItemGrid';
export default function Home() {
  const [items, setItems] = useState(null), [err, setErr] = useState(''), [q, setQ] = useState(''), nav = useNavigate();
  useEffect(() => { api.get('/items', { params: { limit: 6 } }).then(r => setItems(r.data)).catch(e => setErr(errMsg(e))); }, []);
  const steps = [['Report', 'Post what you lost or found, with a photo if you have one.'], ['Search', 'Browse or filter reports to spot your item.'], ['Claim', 'Found items can be claimed. The finder reviews and hands it back.']];
  return (
    <>
      <section className="text-center py-10" aria-labelledby="hero">
        <h1 id="hero" className="text-5xl md:text-6xl">Lost it. Found it. Sorted.</h1>
        <p className="mt-4 text-xl text-muted mx-auto max-w-xl" style={{ fontWeight: 300 }}>Your campus lost and found, all in one place.</p>
        <form role="search" onSubmit={e => { e.preventDefault(); nav('/items?q=' + encodeURIComponent(q)); }} className="mx-auto mt-8 flex max-w-lg gap-2">
          <label htmlFor="q" className="sr-only">Search items by name</label>
          <input id="q" className="input rounded-full" placeholder="e.g. black wallet" value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn"><Search size={18} aria-hidden="true" />Search</button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/report?type=LOST" className="btn">Report Lost Item</Link>
          <Link to="/report?type=FOUND" className="btn-outline">Report Found Item</Link>
        </div>
      </section>
      <section aria-labelledby="recent" className="mt-10">
        <div className="flex items-center justify-between mb-6"><h2 id="recent" className="text-3xl">Recently reported.</h2><Link to="/items" className="btn-soft">View all</Link></div>
        <ItemGrid items={items} error={err} />
      </section>
      <section aria-labelledby="how" className="mt-20">
        <h2 id="how" className="text-3xl mb-6">How it works.</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(([t, d], i) => <li key={t} className="rounded-3xl bg-soft p-6"><p className="text-sm text-muted">Step {i + 1}</p><h3 className="text-2xl">{t}</h3><p className="mt-2">{d}</p></li>)}
        </ol>
      </section>
    </>
  );
}
