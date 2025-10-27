"use client"
 
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MaskedInput } from '@/components/ui/masked-input'
import { Label } from "@/components/ui/label"
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Eye,
  FlaskConical,
} from "lucide-react"
 
export default function FinancialDashboard() {
  const [filiais, setFiliais] = useState([
    { id: "1", nome: "Quimex SP", receita: 2850000, despesas: 1950000, lucro: 900000, margem: 31.6 },
    { id: "2", nome: "Quimex RJ", receita: 1950000, despesas: 1400000, lucro: 550000, margem: 28.2 },
    { id: "3", nome: "Quimex MG", receita: 1650000, despesas: 1200000, lucro: 450000, margem: 27.3 },
    { id: "4", nome: "Quimex PR", receita: 1200000, despesas: 900000, lucro: 300000, margem: 25.0 },
    { id: "5", nome: "Quimex RS", receita: 2100000, despesas: 1500000, lucro: 600000, margem: 28.6 },
    { id: "6", nome: "Quimex BA", receita: 980000, despesas: 750000, lucro: 230000, margem: 23.5 },
  ])
 
  const produtosPorFilial = {
    "Quimex SP": [
      { id: 1, nome: "Ácido Sulfúrico", quantidade: 120, preco: 850 },
      { id: 2, nome: "Hidróxido de Sódio", quantidade: 90, preco: 650 },
      { id: 3, nome: "Cloreto de Sódio", quantidade: 200, preco: 400 },
      { id: 4, nome: "Etanol Anidro", quantidade: 150, preco: 780 },
      { id: 5, nome: "Peróxido de Hidrogênio", quantidade: 75, preco: 560 },
    ],
    "Quimex RJ": [
      { id: 1, nome: "Ácido Nítrico", quantidade: 80, preco: 900 },
      { id: 2, nome: "Etanol Hidratado", quantidade: 120, preco: 720 },
    ],
    "Quimex MG": [
      { id: 1, nome: "Ácido Clorídrico", quantidade: 70, preco: 640 },
      { id: 2, nome: "Soda Cáustica", quantidade: 100, preco: 560 },
    ],
    "Quimex PR": [
      { id: 1, nome: "Acetona", quantidade: 50, preco: 750 },
      { id: 2, nome: "Etanol Anidro", quantidade: 60, preco: 780 },
    ],
    "Quimex RS": [
      { id: 1, nome: "Ácido Sulfúrico", quantidade: 110, preco: 850 },
      { id: 2, nome: "Cloreto de Sódio", quantidade: 150, preco: 420 },
    ],
    "Quimex BA": [
      { id: 1, nome: "Peróxido de Hidrogênio", quantidade: 90, preco: 560 },
      { id: 2, nome: "Ácido Acético", quantidade: 45, preco: 880 },
    ],
  }
 
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [filialSelecionada, setFilialSelecionada] = useState(null)
  const [formData, setFormData] = useState({
    filialId: "",
    tipo: "receita",
    valor: "",
    descricao: "",
  })
 
  const receitaTotal = filiais.reduce((acc, f) => acc + f.receita, 0)
  const despesasTotal = filiais.reduce((acc, f) => acc + f.despesas, 0)
  const lucroTotal = filiais.reduce((acc, f) => acc + f.lucro, 0)
  const saldoEmpresa = receitaTotal - despesasTotal
 
  const formatCurrency = (value) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`
    return `R$ ${value.toLocaleString("pt-BR")}`
  }
 
  const handleAddTransaction = () => {
    if (!formData.filialId || !formData.valor || !formData.descricao) {
      alert("Por favor, preencha todos os campos")
      return
    }
 
    const valor = parseFloat(formData.valor)
    const filialIndex = filiais.findIndex((f) => f.id === formData.filialId)
    if (filialIndex !== -1) {
      const updatedFiliais = [...filiais]
      const filial = updatedFiliais[filialIndex]
 
      if (formData.tipo === "receita") filial.receita += valor
      else filial.despesas += valor
 
      filial.lucro = filial.receita - filial.despesas
      filial.margem = (filial.lucro / filial.receita) * 100
 
      setFiliais(updatedFiliais)
    }
 
    setIsDialogOpen(false)
    setFormData({ filialId: "", tipo: "receita", valor: "", descricao: "" })
  }
 
  const handleVisualizar = (filial) => {
    setFilialSelecionada(filial)
    setIsDetalhesOpen(true)
  }
 
  const handleDownload = (filial) => {
    const produtos = produtosPorFilial[filial.nome] || []
    const csvContent = [
      ["Produto", "Quantidade", "Preço Unitário (R$)", "Total (R$)"],
      ...produtos.map((p) => [p.nome, p.quantidade, p.preco, p.quantidade * p.preco]),
    ]
      .map((row) => row.join(","))
      .join("\n")
 
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Relatorio_${filial.nome.replace(" ", "_")}.csv`
    a.click()
  }
 
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Dashboard Financeiro</h1>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              Visão geral do desempenho financeiro das filiais
            </p>
          </div>
 
          {/* Botão Nova Transação */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Transação</DialogTitle>
                <DialogDescription>Registre uma nova receita ou despesa</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Filial</Label>
                  <Select
                    value={formData.filialId}
                    onValueChange={(value) => setFormData({ ...formData, filialId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma filial" />
                    </SelectTrigger>
                    <SelectContent>
                      {filiais.map((filial) => (
                        <SelectItem key={filial.id} value={filial.id}>
                          {filial.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
 
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
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
                  <Label>Valor (R$)</Label>
                  <MaskedInput
                  id="valor"
                  type="currency"
                  value={formData.valor}
                  onChange={(value) => setFormData({ ...formData, valor: value })}
                  placeholder="R$ 0,00"
                />
                </div>
 
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Ex: Venda de produtos"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTransaction}>Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
 
        {/* Resumo */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { titulo: "Receita Total", valor: receitaTotal, icon: DollarSign, color: "text-success" },
            { titulo: "Despesas Totais", valor: despesasTotal, icon: TrendingDown, color: "text-destructive" },
            { titulo: "Lucro Líquido", valor: lucroTotal, icon: TrendingUp, color: "text-chart-3" },
            { titulo: "Saldo da Empresa", valor: saldoEmpresa, icon: FlaskConical, color: "text-primary" },
          ].map((item, i) => (
            <Card key={i} className="border-l-4 bg-card">
              <CardHeader className="pb-3 flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.titulo}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${item.color}`}>{formatCurrency(item.valor)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
 
        {/* Tabela de Filiais */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Análise Financeira por Filial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Filial</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Receita</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Despesas</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Lucro</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Margem</th>
                    <th className="text-center text-sm font-semibold text-muted-foreground pb-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filiais.map((filial) => (
                    <tr
                      key={filial.id}
                      className="border-b border-border hover:bg-muted/50 transition text-sm"
                    >
                      <td className="py-3 font-medium">{filial.nome}</td>
                      <td className="py-3 text-success">{formatCurrency(filial.receita)}</td>
                      <td className="py-3 text-destructive">{formatCurrency(filial.despesas)}</td>
                      <td className="py-3 text-chart-3">{formatCurrency(filial.lucro)}</td>
                      <td className="py-3">{filial.margem.toFixed(1)}%</td>
                      <td className="py-3 flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Visualizar"
                          onClick={() => handleVisualizar(filial)}
                        >
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Baixar relatório"
                          onClick={() => handleDownload(filial)}
                        >
                          <Download className="h-4 w-4 text-success" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
 
        {/* Modal Detalhes da Filial */}
        <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{filialSelecionada?.nome}</DialogTitle>
              <DialogDescription>Produtos em estoque</DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Produto</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Quantidade</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Preço Unitário (R$)</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {(filialSelecionada ? produtosPorFilial[filialSelecionada.nome] : []).map((p) => (
                    <tr key={p.id} className="border-b border-border text-sm">
                      <td className="py-2">{p.nome}</td>
                      <td className="py-2">{p.quantidade}</td>
                      <td className="py-2">{p.preco}</td>
                      <td className="py-2">{p.preco * p.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setIsDetalhesOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
 
 