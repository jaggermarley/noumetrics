"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { GlowCard } from "@/components/ui/glow-card"
import { Glow } from "@/components/ui/glow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Credenciais inválidas. Por favor, tente novamente.")
        return
      }

      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para o dashboard...",
      })

      // Redirecionar para o dashboard após o login
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Erro ao processar o login. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-950 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md gap-8">
        {/* Logo e título */}
        <motion.div
          className="flex flex-col items-center text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Glow
            variant="accent"
            size="lg"
            glow="always"
            glowColor="accent"
            className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-glow"
          >
            <span className="text-white text-xl font-bold">NM</span>
          </Glow>
          <h1 className="text-3xl font-bold tracking-tight">NouiMetrics</h1>
          <p className="text-muted-foreground mt-2">Acesse seu dashboard de marketing</p>
          {/* Adicionar credenciais de demonstração */}
          <div className="mt-2 text-xs text-muted-foreground p-2 border border-dashed border-muted-foreground/30 rounded-md">
            <p>Demo: admin@example.com / password</p>
          </div>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlowCard className="w-full" variant="default" hover="scale" shadow="md">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="#" className="text-xs text-accent hover:underline">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <div
                    className={`h-5 w-5 rounded-md border border-muted flex items-center justify-center cursor-pointer transition-colors ${
                      rememberMe ? "bg-accent border-accent" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                  <label
                    htmlFor="remember-me"
                    className="text-sm cursor-pointer"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Lembrar de mim
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 bg-accent hover:bg-accent/90 transition-colors duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent spinner" />
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </GlowCard>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            Precisa de ajuda?{" "}
            <a href="#" className="text-accent hover:underline">
              Contate o suporte
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} NouiMetrics. Todos os direitos reservados.
      </div>
    </div>
  )
}

