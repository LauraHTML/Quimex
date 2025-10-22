"use client"

import { useState } from "react"
import { useAuth } from "@/app/contexts/auth-context"
import { canAccessFinanceiro } from "@/lib/utils/permissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function FinanceiroPage() {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedTransacao, setSelectedTransacao] = useState(null)

  const [transacoes, setTransacoes] = useState([
    {
      id: "1",
      tipo: "receita",
      descricao: "Venda de Ácido Sulfúrico",
      valor: 5000,
      data: "2024-01-15",
      status: "pago",
      categoria: "vendas",
    },
    {
      id: "2",
      tipo: "despesa",
      descricao: "Compra de matéria-prima",
      valor: 3000,
      data: "2024-01-14",
      status: "pago",
      categoria: "fornecedores",
    },
    {
      id: "3",
      tipo: "despesa",
      descricao: "Aluguel da loja",
      valor: 2500,
      data: "2024-01-10",
      status: "pendente",
      categoria: "operacional",
    },
  ])

  const [formData, setFormData] = useState({
    tipo: "receita",
    descricao: "",
    valor: "",
    data: "",
    categoria: "vendas",
  })

  if (!user || !canAccessFinanceiro(user)) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Você não tem permissão para acessar o financeiro.</p>
      </div>
    )
  }

  const handleSaveTransacao = () => {
    const newTransacao = {
      id: String(Date.now()),
      tipo: formData.tipo,
      descricao: formData.descricao,
      valor: Number.parseFloat(formData.valor),
      data: formData.data,
      status: "pendente",
      categoria: formData.categoria,
    }
    setTransacoes([newTransacao, ...transacoes])
    setIsDialogOpen(false)
    setFormData({
      tipo: "receita",
      descricao: "",
      valor: "",
      data: "",
      categoria: "vendas",
    })
  }

  const handlePagarTransacao = (id) => {
    setTransacoes(transacoes.map((t) => (t.id === id ? { ...t, status: "pago" } : t)))
  }

  const handleDeleteTransacao = (id) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      setTransacoes(transacoes.filter((t) => t.id !== id))
    }
  }

  const handleViewDetails = (transacao) => {
    setSelectedTransacao(transacao)
    setDetailsModalOpen(true)
  }

  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita" && t.status === "pago")
    .reduce((sum, t) => sum + t.valor, 0)

  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa" && t.status === "pago")
    .reduce((sum, t) => sum + t.valor, 0)

  const saldo = totalReceitas - totalDespesas

  const despesasPendentes = transacoes
    .filter((t) => t.tipo === "despesa" && t.status === "pendente")
    .reduce((sum, t) => sum + t.valor, 0)

    
function formatDate(date) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

// Exemplo de uso do calendário (remova se não for usar como componente separado)
function Calendar28() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date("2025-06-01"))
  const [month, setMonth] = useState(date)
  const [valor, setValor] = useState(formatDate(date))

}
 const [month, setMonth] = useState<Date | undefined>(date)
  const [valor, setValor] = useState(formatDate(date))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Gestão financeira da Quimx</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Transação</DialogTitle>
              <DialogDescription>Registre uma nova receita ou despesa</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da transação"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Subscription Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={valor}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.valor)
            setValue(e.target.valor)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="fornecedores">Fornecedores</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTransacao}>Adicionar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-500">R$ {totalReceitas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total recebido</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-500">R$ {totalDespesas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total pago</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
              <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${saldo >= 0 ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"}`}
            >
              R$ {saldo.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Receitas - Despesas</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-500">
              R$ {despesasPendentes.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contas pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      transacao.tipo === "receita" ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"
                    }`}
                  >
                    {transacao.tipo === "receita" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transacao.descricao}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{transacao.data}</p>
                      <Badge variant="outline" className="text-xs">
                        {transacao.categoria}
                      </Badge>
                      <Badge variant={transacao.status === "pago" ? "default" : "secondary"} className="text-xs gap-1">
                        {transacao.status === "pago" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {transacao.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <p
                    className={`text-lg font-bold ${
                      transacao.tipo === "receita"
                        ? "text-green-700 dark:text-green-500"
                        : "text-red-700 dark:text-red-500"
                    }`}
                  >
                    {transacao.tipo === "receita" ? "+" : "-"} R$ {transacao.valor.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(transacao)} className="gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Detalhes</span>
                    </Button>
                    {transacao.status === "pendente" && transacao.tipo === "despesa" && (
                      <Button size="sm" onClick={() => handlePagarTransacao(transacao.id)} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Pagar</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTransacao(transacao.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Deletar</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>Informações completas da transação</DialogDescription>
          </DialogHeader>
          {selectedTransacao && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    selectedTransacao.tipo === "receita"
                      ? "bg-green-100 dark:bg-green-950"
                      : "bg-red-100 dark:bg-red-950"
                  }`}
                >
                  {selectedTransacao.tipo === "receita" ? (
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-semibold capitalize">{selectedTransacao.tipo}</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{selectedTransacao.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p
                      className={`text-xl font-bold ${
                        selectedTransacao.tipo === "receita"
                          ? "text-green-700 dark:text-green-500"
                          : "text-red-700 dark:text-red-500"
                      }`}
                    >
                      R$ {selectedTransacao.valor.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{selectedTransacao.data}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <Badge variant="outline" className="mt-1">
                      {selectedTransacao.categoria}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={selectedTransacao.status === "pago" ? "default" : "secondary"}
                      className="mt-1 gap-1"
                    >
                      {selectedTransacao.status === "pago" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {selectedTransacao.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setDetailsModalOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
