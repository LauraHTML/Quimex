"use client"

import { useAuth } from "@/app/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Store, Users, Package, DollarSign } from "lucide-react"
import { canViewConsolidated } from "../../../lib/utils/permissions"
import { mockLojas, mockUsers, mockProdutos, mockVendas } from "../../../lib/mock-data"
import { CardInfo } from "@/components/cards/CardFornecedor";

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const isConsolidated = canViewConsolidated(user)

  // Filter data based on user permissions
  const lojas = isConsolidated ? mockLojas : mockLojas.filter((l) => l.id === user.lojaId)
  const funcionarios = isConsolidated ? mockUsers : mockUsers.filter((u) => u.lojaId === user.lojaId)
  const produtos = isConsolidated ? mockProdutos : mockProdutos.filter((p) => p.lojaId === user.lojaId)
  const vendas = isConsolidated ? mockVendas : mockVendas.filter((v) => v.lojaId === user.lojaId)

  const totalVendas = vendas.reduce((sum, v) => sum + v.total, 0)

  const stats = [
    {
      title: "Lojas",
      value: lojas.length,
      icon: Store,
      description: isConsolidated ? "Total de lojas" : "Sua loja",
    },
    {
      title: "Funcionários",
      value: funcionarios.length,
      icon: Users,
      description: "Ativos no sistema",
    },
    {
      title: "Produtos",
      value: produtos.length,
      icon: Package,
      description: "Em estoque",
    },
    {
      title: "Vendas Hoje",
      value: `R$ ${totalVendas.toFixed(2)}`,
      icon: DollarSign,
      description: "Total de vendas",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold">Dashboard</h3>
        <p className="text-zinc-400 mt-2">
          Bem-vindo, {user.nome}
          {user.lojaId && ` - ${lojas[0]?.nome}`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className=" border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-zinc-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {isConsolidated && (
        <Card className="">
          <CardHeader>
            <CardTitle className="">Visão Consolidada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">
              Como administrador da matriz, você tem acesso a todos os dados de todas as lojas.
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
