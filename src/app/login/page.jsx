"use client"
 
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
 
export default function LoginPage() {
  const router = useRouter()
 
  const [theme, setTheme] = useState("dark")
  const [RE, setRE] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
 
  // Carrega tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }, [])
 
  // Alterna tema claro/escuro
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }
 
  // Envio do formulário
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError("")
  //   setLoading(true)
 
  //   if (!RE || !password || !profile) {
  //     setError("Preencha todos os campos antes de continuar.")
  //     setLoading(false)
  //     return
  //   }
 
  //   const success = await login(RE, password)
 
  //   if (success) {
  //     router.push("/dashboard")
  //   } else {
  //     setError("RE ou senha inválidos.")
  //     setLoading(false)
  //   }
  // }

   const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
 
    const res = await fetch(`http://localhost:8080/login`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Sending JSON data
      },
      body: JSON.stringify({
        RE: RE,
        senha: password,
        cargo: profile
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      if (res.status == 401) {
        setError("Usuário/Senha errados");
        setLoading(false);
      }
      if (res.status == 404) {
        setError("Usuário não encontrado");
        setLoading(false);
      }
    }
    else{
      setLoading(false);
    }

    const data = await res.json();

    if (data.cargo == "Administrador") {
      window.location.href = "/dashboard";
    } else if (data.cargo == "Gerente") {
      window.location.href = "/dashboard";
    } else if (data.cargo == "Vendedor") {
      window.location.href = "/pdv";
    }
  }
 
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0e1a]" : "bg-slate-50"
        }`}
    >
      {/* Botão de alternância de tema */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full border transition-all duration-300 backdrop-blur-sm ${theme === "dark"
            ? "bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/40"
            : "bg-white/80 border-slate-200 hover:bg-slate-100"
          }`}
        aria-label="Alternar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-slate-300" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>
 
      {/* Cartão de Login */}
      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-2xl border ${theme === "dark"
              ? "bg-slate-900/20 border-slate-800/30"
              : "bg-white border-slate-200"
            }`}
        >
          {/* Logo e título */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
              <Image src="/logo.png" width={60} height={60} alt="Logo" />
            </div>
            <h1
              className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Quimex
            </h1>
            <p
              className={`text-sm text-center ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Sistema de Gestão de Produtos Químicos
            </p>
          </div>
 
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo RE */}
            <div className="space-y-2">
              <Label
                htmlFor="RE"
                className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                RE
              </Label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}
                />
                <Input
                  id="RE"
                  type="text"
                  placeholder="xxxxxx"
                  value={RE}
                  onChange={(e) => setRE(e.target.value)}
                  required
                  className={`pl-10 h-12 rounded-lg transition-all duration-200 ${theme === "dark"
                      ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    } focus:border-accent focus:ring-blue-600/20`}
                />
              </div>
            </div>
 
            {/* Campo Senha */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Senha
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`pl-10 h-12 rounded-lg transition-all duration-200 ${theme === "dark"
                      ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    } focus:border-accent focus:ring-blue-600/20`}
                />
              </div>
            </div>
 
            {/* Campo Perfil */}
            <div className="space-y-2">
              <Label
                htmlFor="profile"
                className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Selecione o seu perfil:
              </Label>
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger
                  id="profile"
                  className={`h-12 rounded-lg transition-all duration-200 ${theme === "dark"
                      ? "bg-slate-950/50 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                    } focus:border-blue-600 focus:ring-blue-600/20`}
                >
                  <SelectValue placeholder="Escolha" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "dark"
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-slate-200"
                  }
                >
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                  </SelectContent>
              </Select>
            </div>
 
            {/* Erro */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
 
            {/* Botão de login */}
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-primary text-white font-semibold h-12 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 mt-6"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar no Sistema"}
            </Button>
 
          </form>
        </div>
      </div>
    </div>
  )
}