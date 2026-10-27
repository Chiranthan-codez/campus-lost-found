const style = { OPEN: 'bg-soft text-ink', CLAIM_PENDING: 'bg-white border border-ink text-ink', RETURNED: 'bg-ink text-white' };
const label = { OPEN: 'Open', CLAIM_PENDING: 'Claim pending', RETURNED: 'Returned' };
export default function StatusBadge({ status }) { return <span className={'pill ' + style[status]}>{label[status]}</span>; }
