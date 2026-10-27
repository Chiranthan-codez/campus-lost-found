export default function Field({ id, label, required, error, hint, as: T = 'input', children, ...p }) {
  const desc = [hint && id + '-h', error && id + '-e'].filter(Boolean).join(' ') || undefined;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1 font-semibold">
        {label}{required && <><span aria-hidden="true"> *</span><span className="sr-only"> (required)</span></>}
      </label>
      {hint && <p id={id + '-h'} className="text-sm text-muted mb-1">{hint}</p>}
      <T id={id} className="input" required={required} aria-invalid={!!error} aria-describedby={desc} {...p}>{children}</T>
      {error && <p id={id + '-e'} role="alert" className="text-sm mt-1 font-semibold">Error: {error}</p>}
    </div>
  );
}
