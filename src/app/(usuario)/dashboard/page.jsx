"use client"
 
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Users, TrendingUp, Building2, Factory } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts"
 
export default function DashboardPage() {
  const router = useRouter()
 
  // Detecta preferência do sistema e aplica modo escuro automaticamente
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.classList.toggle("dark", prefersDark)
  }, [])
 
  // Paleta personalizada (usando as variáveis do global.css como referência)
  const colors = ["#20532A", "#0F703A", "#1B8742", "#279D49", "#2EAF4A", "#7CC472", "#BEE2B9"]
 
  // Dados de exemplo
  const revenueData = [
    { name: "Jan", revenue: 3000 },
    { name: "Fev", revenue: 4200 },
    { name: "Mar", revenue: 9000 },
    { name: "Abr", revenue: 7500 },
    { name: "Mai", revenue: 5200 },
    { name: "Jun", revenue: 4800 },
    { name: "Jul", revenue: 6300 },
    { name: "Ago", revenue: 7100 },
    { name: "Set", revenue: 8200 },
    { name: "Out", revenue: 7600 },
    { name: "Nov", revenue: 8700 },
    { name: "Dez", revenue: 7900 },
  ]
 
  const salesData = [
    { month: "Jan", value: 5000 },
    { month: "Fev", value: 7200 },
    { month: "Mar", value: 6300 },
    { month: "Abr", value: 8900 },
    { month: "Mai", value: 9700 },
    { month: "Jun", value: 8200 },
    { month: "Jul", value: 6900 },
    { month: "Ago", value: 7600 },
    { month: "Set", value: 8100 },
    { month: "Out", value: 8500 },
    { month: "Nov", value: 8700 },
    { month: "Dez", value: 7900 },
  ]
 
  const invoiceData = [
    { name: "Pagos", value: 345 },
    { name: "Pendentes", value: 234 },
    { name: "Vencidos", value: 514 },
  ]
 
  const totalInvoices = invoiceData.reduce((a, b) => a + b.value, 0)
 
  return (
    <main className="w-full px-6 py-8 bg-transparent text-foreground transition-colors duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Sistema</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus produtos, vendas e operações
        </p>
      </div>
 
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total de Produtos", value: "1,234", icon: Package, note: "+12% em relação ao mês anterior" },
          { title: "Vendas do Mês", value: "R$ 45.231", icon: ShoppingCart, note: "+8% em relação ao mês anterior" },
          { title: "Fornecedores Ativos", value: "573", icon: Users, note: "+23 novos este mês" },
          { title: "Crescimento", value: "+18.2%", icon: TrendingUp, note: "Comparado ao trimestre anterior" },
        ].map(({ title, value, icon: Icon, note }) => (
          <div
            key={title}
            className="rounded-xl p-6 border bg-card border-border shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <Icon className="w-5 h-5 text-foreground/60" />
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <p className="text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
 
      {/* Cards secundários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Total de Funcionários", value: "128", icon: Users },
          { title: "Total de Lojas", value: "12", icon: Building2 },
          { title: "Total de Fornecedores", value: "64", icon: Factory },
        ].map(({ title, value, icon: Icon }) => (
          <div key={title} className="rounded-xl p-6 border bg-card border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{value}</div>
          </div>
        ))}
      </div>
 
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de barras */}
        <div className="rounded-xl p-6 border bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            Total de Receita: <span className="font-normal text-muted-foreground">R$ 120.000</span>
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#44403c33" />
              <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Bar dataKey="revenue" fill={colors[5]} radius={[5, 5, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
        {/* Gráfico de pizza */}
        <div className="rounded-xl p-6 border bg-card border-border shadow-sm flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={invoiceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {invoiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[colors[1], colors[4], colors[6]][index]} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold fill-foreground"
                >
                  {totalInvoices}
                </text>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  Faturas
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
 
          {/* Legenda */}
          <div className="mt-4 lg:mt-0 lg:ml-4 space-y-1 text-xs">
            {invoiceData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: [colors[1], colors[4], colors[6]][i] }}
                ></div>
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Gráfico de linha */}
      <div className="rounded-xl p-5 border bg-card border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Análise de Vendas</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#44403c33" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[4]}
              strokeWidth={2.5}
              dot={{ fill: colors[2], r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  )
}
 
 