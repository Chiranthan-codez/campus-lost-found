import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api, { errMsg, CATEGORIES } from '../services/api';
import Field from '../components/Field';
import Notice from '../components/Notice';
export default function ItemForm() {
  const { id } = useParams(), [sp] = useSearchParams(), nav = useNavigate(), editing = !!id;
  const [f, setF] = useState({ type: sp.get('type') === 'FOUND' ? 'FOUND' : 'LOST', title: '', category: 'other', description: '', location: '', date: '' });
  const [file, setFile] = useState(null), [errs, setErrs] = useState({}), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (editing) api.get('/items/' + id).then(({ data: i }) => setF({ type: i.type, title: i.title, category: i.category, description: i.description, location: i.location, date: i.date.slice(0, 10) })).catch(e => setMsg(errMsg(e)));
  }, [id]);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setMsg('');
    const v = {};
    if (!f.title.trim()) v.title = 'Enter an item name';
    if (!f.description.trim()) v.description = 'Add a short description';
    if (!f.location.trim()) v.location = 'Enter where on campus';
    if (!f.date) v.date = 'Choose a date';
    setErrs(v); if (Object.keys(v).length) return;
    const fd = new FormData(); Object.entries(f).forEach(([k, x]) => fd.append(k, x)); if (file) fd.append('image', file);
    setBusy(true);
    try {
      const r = editing ? await api.patch('/items/' + id, fd) : await api.post('/items', fd);
      nav('/items/' + r.data._id, { state: { notice: editing ? 'Report updated.' : 'Report submitted successfully.' } });
    } catch (e) { setMsg(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-4xl mb-2">{editing ? 'Edit report.' : 'Report an item.'}</h1>
      <p className="text-muted mb-6">Fields marked * are required.</p>
      <Notice>{msg}</Notice>
      <form onSubmit={submit} noValidate>
        <fieldset className="mb-4"><legend className="font-semibold mb-1">Report type <span aria-hidden="true">*</span></legend>
          <div className="flex gap-6">
            {[['LOST', 'I lost something'], ['FOUND', 'I found something']].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2"><input type="radio" name="type" value={v} checked={f.type === v} onChange={set('type')} className="h-5 w-5 accent-black" />{l}</label>
            ))}
          </div>
        </fieldset>
        <Field id="title" label="Item name" required error={errs.title} value={f.title} onChange={set('title')} maxLength={80} />
        <Field id="category" label="Category" required as="select" value={f.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</Field>
        <Field id="description" label="Description" required as="textarea" rows={4} hint="Colour, brand, marks. Don't share secret details of found items." error={errs.description} value={f.description} onChange={set('description')} maxLength={500} />
        <Field id="location" label="Location on campus" required error={errs.location} value={f.location} onChange={set('location')} />
        <Field id="date" label={f.type === 'LOST' ? 'Date lost' : 'Date found'} type="date" required max={new Date().toISOString().slice(0, 10)} error={errs.date} value={f.date} onChange={set('date')} />
        <Field id="image" label="Photo (optional)" type="file" accept="image/*" hint="Max 3 MB." onChange={e => setFile(e.target.files[0])} />
        <button className="btn w-full" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Submit report'}</button>
      </form>
    </div>
  );
}
