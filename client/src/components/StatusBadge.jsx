const style = {
  OPEN: 'bg-soft text-ink border border-hairline',
  CLAIM_PENDING: 'bg-transparent border border-ink text-ink',
  RETURNED: 'bg-ink text-white dark:text-[#0e1015]'
};

const label = {
  OPEN: 'Open',
  CLAIM_PENDING: 'Claim pending',
  RETURNED: 'Returned'
};

export default function StatusBadge({ status }) {
  return <span className={'pill ' + (style[status] || 'bg-soft text-ink')}>{label[status] || status}</span>;
}
