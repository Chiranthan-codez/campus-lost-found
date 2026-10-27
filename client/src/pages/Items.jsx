import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg, CATEGORIES } from '../services/api';
import ItemGrid from '../components/ItemGrid';
import Field from '../components/Field';
export default function Items() {
  const [sp, setSp] = useSearchParams(), [items, setItems] = useState(null), [err, setErr] = useState('');
  const [f, setF] = useState({ q: sp.get('q') || '', category: sp.get('category') || '', type: sp.get('type') || '' });
  useEffect(() => {
    setItems(null); setErr('');
    api.get('/items', { params: Object.fromEntries(sp) }).then(r => setItems(r.data)).catch(e => setErr(errMsg(e)));
  }, [sp]);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = e => { e.preventDefault(); setSp(Object.fromEntries(Object.entries(f).filter(([, v]) => v))); };
  return (
    <>
      <h1 className="text-4xl mb-6">Browse items.</h1>
      <form role="search" onSubmit={submit} className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-4 items-end mb-6">
        <Field id="s-q" label="Item name" placeholder="Search by name" value={f.q} onChange={set('q')} />
        <Field id="s-cat" label="Category" as="select" value={f.category} onChange={set('category')}>
          <option value="">All categories</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Field>
        <Field id="s-type" label="Lost or found" as="select" value={f.type} onChange={set('type')}>
          <option value="">Lost and found</option><option value="LOST">Lost</option><option value="FOUND">Found</option>
        </Field>
        <div className="mb-4"><button className="btn w-full">Apply filters</button></div>
      </form>
      <ItemGrid items={items} error={err} />
    </>
  );
}
