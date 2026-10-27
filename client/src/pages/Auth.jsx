import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { errMsg } from '../services/api';
import Field from '../components/Field';
import Notice from '../components/Notice';
export default function Auth({ mode }) {
  const reg = mode === 'register', { login, register } = useAuth(), nav = useNavigate(), loc = useLocation();
  const [f, setF] = useState({ name: '', email: '', password: '' }), [errs, setErrs] = useState({}), [msg, setMsg] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setMsg('');
    const v = {};
    if (reg && !f.name.trim()) v.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = 'Enter a valid email address';
    if (f.password.length < 6) v.password = 'Password must be at least 6 characters';
    setErrs(v); if (Object.keys(v).length) return;
    try { reg ? await register(f.name, f.email, f.password) : await login(f.email, f.password); nav(loc.state?.from || '/', { replace: true }); }
    catch (e) { setMsg(errMsg(e)); }
  };
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-4xl mb-6">{reg ? 'Create your account.' : 'Welcome back.'}</h1>
      <Notice>{msg}</Notice>
      <form onSubmit={submit} noValidate>
        {reg && <Field id="name" label="Name" required autoComplete="name" error={errs.name} value={f.name} onChange={set('name')} />}
        <Field id="email" label="College email" type="email" required autoComplete="email" error={errs.email} value={f.email} onChange={set('email')} />
        <Field id="password" label="Password" type="password" required autoComplete={reg ? 'new-password' : 'current-password'} hint={reg ? 'At least 6 characters.' : undefined} error={errs.password} value={f.password} onChange={set('password')} />
        <button className="btn w-full">{reg ? 'Create account' : 'Log in'}</button>
      </form>
      <p className="mt-4">{reg ? 'Already registered?' : 'New here?'} <Link className="underline font-semibold" to={reg ? '/login' : '/register'}>{reg ? 'Log in' : 'Create an account'}</Link></p>
    </div>
  );
}
