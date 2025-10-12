"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Hardcoded credential
    if (username === "admin" && password === "presiden123") {
      localStorage.setItem("sp-logged-in", "true")
      toast({ title: "Login berhasil", description: "Selamat datang kembali." })
      router.replace("/dashboard")
    } else {
      toast({ title: "Login gagal", description: "Username atau password salah.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Masuk Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Masuk
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Gunakan username <span className="font-mono">admin</span> dan password{" "}
              <span className="font-mono">presiden123</span>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
