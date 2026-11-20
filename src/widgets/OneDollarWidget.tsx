export const ONE_DOLLAR_URL = 'https://onedollardrive.com/'

/** onedollardrive.com 바로가기 */
export function OneDollarWidget() {
  return (
    <a
      href={ONE_DOLLAR_URL}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col items-center justify-center gap-2 text-center"
    >
      <span className="flex size-16 items-center justify-center border border-line bg-surface text-2xl font-black text-accent group-hover:border-accent">
        $1
      </span>
      <span className="font-bold tracking-wide">ONE DOLLAR DRIVE</span>
      <span className="text-xs text-muted">드림 개러지 · 슈퍼카 하루 운전 응모</span>
      <span className="text-xs text-accent group-hover:underline">onedollardrive.com ↗</span>
    </a>
  )
}
