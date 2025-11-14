"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"
import { Sidebar } from "../../components/sidebar/sidebar"
import { usePathname } from 'next/navigation'
import Loading from "../loading"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const nomeCaminho = usePathname()

  const mostrarSidebar = nomeCaminho !== '/pdv'

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading></Loading>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {mostrarSidebar && <Sidebar />}
      <main className={` ${mostrarSidebar === true ? "lg:pl-64" : "lg"}`}>
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
          </div>
      </main>
    </div>
  )
}
