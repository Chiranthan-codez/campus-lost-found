export default function Notice({ type = 'error', children }) {
  if (!children) return null;
  return <p role={type === 'error' ? 'alert' : 'status'} className="rounded-2xl bg-soft px-4 py-3 mb-4 font-semibold">{type === 'error' ? 'Error: ' : 'Success: '}{children}</p>;
}
