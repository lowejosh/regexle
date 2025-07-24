import { createFileRoute } from '@tanstack/react-router'
import { CheatSheet } from '@/components/pages/CheatSheet'

export const Route = createFileRoute('/cheatsheet')({
  component: CheatSheet,
})
