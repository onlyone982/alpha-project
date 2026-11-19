/** 자주 쓰는 스타일 묶음. 디자인을 다듬을 때 여기만 고치면 전체에 반영됩니다. */
export const ui = {
  input:
    'w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-accent focus:outline-none',
  label: 'mb-1 block text-xs font-medium text-muted',
  button:
    'inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-line px-3 py-2 text-sm transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50',
  buttonPrimary:
    'inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
  buttonDanger:
    'inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-danger/50 px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10 disabled:opacity-50',
  card: 'rounded-2xl border border-line bg-surface p-4',
  chip: 'rounded-full border border-line px-2.5 py-1 text-xs',
}
