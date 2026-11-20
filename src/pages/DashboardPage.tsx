import { SeasonBand } from '../components/SeasonBand'
import { TipPopup } from '../components/TipPopup'
import { WidgetGrid } from '../components/WidgetGrid'
import { useLayout } from '../hooks/useLayout'

export function DashboardPage() {
  const { layout } = useLayout()
  return (
    <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <SeasonBand />
      <WidgetGrid layout={layout} />
      <TipPopup />
    </main>
  )
}
