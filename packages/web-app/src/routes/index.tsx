import { createFileRoute } from '@tanstack/react-router'
import { PassageFetcher } from '@/features/home/components/PassageFetcher'

export const Route = createFileRoute('/')({
  component: HomeScreen,
})

function HomeScreen() {
  return <PassageFetcher />
}
