'use client'

import type React from "react"
import { NotificationProvider } from "@/lib/notifications/client"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}
