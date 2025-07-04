import type { Metadata } from "next"
import { SettingsPage } from "@/components/settings/settingsPage"
import { getCurrentUser } from "@/lib/data"

export const metadata: Metadata = {
  title: "Configurações - MyFinance",
  description: "Gerencie suas configurações e preferências",
}

export default async function Settings() {
  const user = await getCurrentUser()

  return (
    <SettingsPage user={user} />
  )
}
