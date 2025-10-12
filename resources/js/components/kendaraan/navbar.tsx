"use client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const router = useRouter()
  const { toast } = useToast()

  const onLogout = () => {
    localStorage.removeItem("sp-logged-in")
    toast({ title: "Berhasil keluar", description: "Sesi Anda telah diakhiri.", variant: "default" })
    router.replace("/login")
  }

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="font-semibold">Sistem Manajemen Kendaraan – Sekretariat Presiden</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="size-4 mr-2" />
          Keluar
        </Button>
      </div>
    </header>
  )
}
