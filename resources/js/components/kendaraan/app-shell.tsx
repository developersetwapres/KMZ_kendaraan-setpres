"use client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"

import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { useEffect, useState } from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login"
  const router = useRouter()

  // Hydration + auth state
  const [hydrated, setHydrated] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    setHydrated(true)
    try {
      const loggedIn = localStorage.getItem("sp-logged-in") === "true"
      setAuthed(loggedIn)
      console.log("[v0] Auth check:", { pathname, loggedIn })
      if (!loggedIn && !isAuthPage) {
        router.replace("/login")
      }
    } catch (err) {
      console.log("[v0] Error reading auth from localStorage:", (err as Error)?.message)
      if (!isAuthPage) router.replace("/login")
    }
  }, [isAuthPage, pathname, router])

  // Render login page without chrome
  if (isAuthPage) return <>{children}</>

  // During hydration or while redirecting unauthenticated users, avoid flash/blank issues.
  if (!hydrated) return null
  if (authed === false) return null

  return (
    <div className="min-h-dvh flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-page text-page-foreground">{children}</main>
      </div>
    </div>
  )
}
