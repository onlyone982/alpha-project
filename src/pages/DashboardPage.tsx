import { Hero } from '../components/Hero'
import { WidgetGrid } from '../components/WidgetGrid'
import { useUserProfile } from '../hooks/useUserProfile'
import { visibleWidgets } from '../widgets/registry'

export function DashboardPage() {
  const { profile } = useUserProfile()
  const widgets = visibleWidgets(profile?.settings.hiddenWidgets ?? [])

  return (
    <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <Hero />
      <WidgetGrid widgets={widgets} />
    </main>
  )
}
