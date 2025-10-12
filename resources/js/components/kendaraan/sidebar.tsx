"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Users, ClipboardList, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kendaraan", label: "Kendaraan", icon: Car },
  { href: "/sopir", label: "Sopir", icon: Users },
  { href: "/penggunaan", label: "Penggunaan", icon: ClipboardList },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r bg-sidebar">
      <nav className="p-4 w-full">
        <div className="text-sm text-muted-foreground px-2 pb-2">Menu</div>
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent",
                  pathname === href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
