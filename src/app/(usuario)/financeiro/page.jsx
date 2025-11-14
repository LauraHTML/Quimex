"use client"
 
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Eye,
  FlaskConical,
  Banknote,
  Calendar,
  CheckCircle,
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { MaskedInput } from "@/components/ui/masked-input"
 
// --- NOVAS VARIÁVEIS DE COR ---
const COLOR_RECEITA = "text-[#0F703A]"       // #0F703A (Verde Médio Forte)
const COLOR_DESPESAS = "text-[#20532A]"      // #20532A (Verde Escuro) - NOVO!
const COLOR_SALDO = "text-[#279D49]"         // #279D49 (Verde Claro Forte)
const COLOR_CONTA_PAGAR = "text-[#20532A]"   // #20532A (Verde Escuro)
 
const BORDER_RECEITA = "border-l-[#0F703A]"
const BORDER_DESPESAS = "border-l-[#20532A]" // NOVO!
const BORDER_SALDO = "border-l-[#279D49]"
const BORDER_CONTA_PAGAR = "border-l-[#20532A]"
 
const BG_PRINCIPAL = "bg-[#1B8742]"          // #1B8742 (Verde Médio)
const BG_CONTA_PAGAR_BUTTON = "bg-[#20532A]" // #20532A
const BG_PAGAR_BUTTON = "bg-[#0F703A]"       // #0F703A
 
export default function FinancialDashboard() {
  const [filiais, setFiliais] = useState([
    // Lucro e Margem Removidos
    { id: "1", nome: "Quimex SP", receita: 2850000, despesas: 1950000 },
    { id: "2", nome: "Quimex RJ", receita: 1950000, despesas: 1400000 },
    { id: "3", nome: "Quimex MG", receita: 1650000, despesas: 1200000 },
    // { id: "4", nome: "Quimex PR", receita: 1200000, despesas: 900000 },
    { id: "5", nome: "Quimex RS", receita: 2100000, despesas: 1500000 },
    { id: "6", nome: "Quimex BA", receita: 980000, despesas: 750000 },
  ])
 
  // --- NOVO ESTADO: Contas a Pagar ---
  const [contasAPagar, setContasAPagar] = useState([
    { id: 1, filial: "Quimex SP", tipo: "Salário", descricao: "Salários Mês Atual", valor: 150000, vencimento: "2024-12-05", pago: false },
    { id: 2, filial: "Quimex RJ", tipo: "Fornecedor", descricao: "Compra de Metanol (Lote #RJ45)", valor: 250000, vencimento: "2024-11-30", pago: false },
    { id: 3, filial: "Quimex MG", tipo: "Aluguel", descricao: "Aluguel Armazém", valor: 35000, vencimento: "2024-12-10", pago: false },
    { id: 4, filial: "Quimex MG", tipo: "Luz", descricao: "Conta de Energia Elétrica", valor: 12000, vencimento: "2024-12-15", pago: false },
  ])
 
  // --- NOVO ESTADO: Formulário de Contas a Pagar ---
  const [isPayableDialogOpen, setIsPayableDialogOpen] = useState(false)
  const [payableFormData, setPayableFormData] = useState({
    filialId: "",
    tipo: "Fornecedor", // Default para Fornecedor
    descricao: "",
    valor: "",
    vencimento: "",
  })
  // --- ESTADOS EXISTENTES ---
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
 
  // --- CÁLCULOS E UTILS ---
  const receitaTotal = filiais.reduce((acc, f) => acc + f.receita, 0)
  const despesasTotal = filiais.reduce((acc, f) => acc + f.despesas, 0)
  // lucroTotal REMOVIDO
  const saldoEmpresa = receitaTotal - despesasTotal // Saldo ainda pode ser calculado
 
  // Novo cálculo para Contas Pendentes
  const contasPendentes = useMemo(() => contasAPagar.filter(c => !c.pago), [contasAPagar])
  const valorTotalPendente = contasPendentes.reduce((acc, c) => acc + c.valor, 0)
 
  const formatCurrency = (value) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }
 
  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }
 
  // --- HANDLERS EXISTENTES ---
  const handleAddTransaction = () => {
    if (!formData.filialId || !formData.valor || !formData.descricao) {
      console.error("Por favor, preencha todos os campos da transação.")
      return
    }
 
    const valor = parseFloat(formData.valor)
    const filialIndex = filiais.findIndex((f) => f.id === formData.filialId)
    if (filialIndex !== -1) {
      const updatedFiliais = [...filiais]
      const filial = updatedFiliais[filialIndex]
 
      if (formData.tipo === "receita") filial.receita += valor
      else filial.despesas += valor
 
      // Cálculo de Lucro e Margem REMOVIDO
      setFiliais(updatedFiliais)
    }
 
    setIsDialogOpen(false)
    setFormData({ filialId: "", tipo: "receita", valor: "", descricao: "" })
  }
 
  const handleVisualizar = (filial) => {
    setFilialSelecionada(filial)
    setIsDetalhesOpen(true)
  }
 
  const handleAddPayable = () => {
    if (!payableFormData.filialId || !payableFormData.valor || !payableFormData.descricao || !payableFormData.vencimento) {
      console.error("Por favor, preencha todos os campos da Conta a Pagar.")
      return
    }
 
    const valor = parseFloat(payableFormData.valor)
    const filialId = payableFormData.filialId
    const filialNome = filiais.find(f => f.id === filialId)?.nome || "Desconhecida"
 
    // Adiciona a nova conta à lista de contas a pagar
    const newPayable = {
      id: contasAPagar.length > 0 ? Math.max(...contasAPagar.map(c => c.id)) + 1 : 1,
      filial: filialNome,
      tipo: payableFormData.tipo,
      descricao: payableFormData.descricao,
      valor: valor,
      vencimento: payableFormData.vencimento,
      pago: false,
    }
 
    setContasAPagar(prevContas => [...prevContas, newPayable])
 
    setIsPayableDialogOpen(false)
    setPayableFormData({ filialId: "", tipo: "Fornecedor", descricao: "", valor: "", vencimento: "" })
  }
 
  const handleMarkAsPaid = (id) => {
    setContasAPagar(prevContas => {
      const contaIndex = prevContas.findIndex(c => c.id === id)
      if (contaIndex === -1 || prevContas[contaIndex].pago) return prevContas
 
      const updatedContas = [...prevContas]
      const contaPaga = {
        ...updatedContas[contaIndex],
        pago: true,
      }
      updatedContas[contaIndex] = contaPaga
 
      // 1. Atualiza a despesa total da filial ao pagar a conta
      const filialNome = contaPaga.filial
      const valorPago = contaPaga.valor
      const filialIndex = filiais.findIndex(f => f.nome === filialNome)
 
      if (filialIndex !== -1) {
        setFiliais(prevFiliais => {
          const updatedFiliais = [...prevFiliais]
          const filial = updatedFiliais[filialIndex]
 
          filial.despesas += valorPago
         
          // Recálculo de Lucro e Margem REMOVIDO
          return updatedFiliais
        })
      }
 
      return updatedContas
    })
  }
 
  const invoiceData = [
    { name: "Pagos", value: 345 },
    { name: "Pendentes", value: 234 },
    { name: "Vencidos", value: 514 },
  ]
 
  const totalInvoices = invoiceData.reduce((a, b) => a + b.value, 0)
    // 📄 Função para gerar relatório geral
    const handleDownloadReport = (filial) => {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text("Relatório Financeiro da Filial", 14, 20)
      doc.setFontSize(12)
      doc.text("Resumo Financeiro e Operacional", 14, 30)
      doc.line(14, 32, 195, 32)
     
      // Tabela de receita - Ajustada para não incluir Lucro/Margem
      doc.text("Receita Mensal (R$):", 14, 45)
      autoTable(doc, {
        startY: 50,
        head: [["Filial", "Receita", "Despesas"]], // Colunas Lucro e Margem Removidas
        body: filiais.map((d) => [d.nome, d.receita, d.despesas]), // Dados de Lucro e Margem Removidos
        theme: "grid",
        styles: { fontSize: 10 },
      })
   
      doc.save("relatorio_geral_filial.pdf")
    }
 
  const LancarContaAPagarDialog = () => (
    <Dialog open={isPayableDialogOpen} onOpenChange={setIsPayableDialogOpen}>
      <DialogTrigger asChild>
        {/* COR DO BOTÃO: Usando #20532A com hover mais escuro */}
        <Button
          variant="secondary"
          className={`gap-2 border border-border ${BG_CONTA_PAGAR_BUTTON} hover:bg-[#102A16] text-white`}
        >
          <Banknote className="h-4 w-4" />
          Lançar Conta a Pagar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lançar Conta a Pagar</DialogTitle>
          <DialogDescription>
            Registre uma despesa futura (Fornecedores, Salários, Despesas Fixas)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Filial</Label>
            <Select
              value={payableFormData.filialId}
              onValueChange={(value) => setPayableFormData({ ...payableFormData, filialId: value })}
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
            <Label>Tipo de Despesa</Label>
            <Select
              value={payableFormData.tipo}
              onValueChange={(value) => setPayableFormData({ ...payableFormData, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                <SelectItem value="Salário">Salário</SelectItem>
                <SelectItem value="Aluguel">Aluguel</SelectItem>
                <SelectItem value="Água">Água</SelectItem>
                <SelectItem value="Luz">Luz/Energia</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <div className={`space-y-2 ${payableFormData.tipo == "Fornecedor" ? "block" : "hidden"}`}>
            <Label>CNPJ do fornecedor</Label>
            <MaskedInput
              id="cnpj"
              mask="00.000.000/0000-00"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e })}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Pagamento Fornecedor B, Salário Gerente"
              value={payableFormData.descricao}
              onChange={(e) => setPayableFormData({ ...payableFormData, descricao: e.target.value })}
            />
          </div>
 
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={payableFormData.valor}
                onChange={(e) => setPayableFormData({ ...payableFormData, valor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Input
                type="date"
                value={payableFormData.vencimento}
                onChange={(e) => setPayableFormData({ ...payableFormData, vencimento: e.target.value })}
              />
            </div>
          </div>
 
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsPayableDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddPayable}>Lançar Conta</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
 
 
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
 
          {/* Botões de Ação */}
          <div className="flex gap-3">
            {LancarContaAPagarDialog()}
 
            {/* Botão Nova Transação */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {/* COR DO BOTÃO: #1B8742 com hover */}
                <Button className={`gap-2 ${BG_PRINCIPAL} text-primary-foreground hover:bg-[#146C34]`}>
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
                  {/* ... conteúdo do formulário ... */}
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
        </div>
 
        {/* Resumo - Cards com cores ajustadas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { titulo: "Receita Total", valor: receitaTotal, icon: DollarSign, color: COLOR_RECEITA, border: BORDER_RECEITA },
            {
                titulo: "Despesas Totais",
                valor: despesasTotal,
                icon: TrendingDown,
                color: COLOR_DESPESAS, // Cor Verde Escura Aplicada aqui
                border: BORDER_DESPESAS // Borda Verde Escura Aplicada aqui
            },
            { titulo: "Saldo da Empresa", valor: saldoEmpresa, icon: FlaskConical, color: COLOR_SALDO, border: BORDER_SALDO },
            { titulo: "Contas a Pagar", valor: valorTotalPendente, icon: Banknote, color: COLOR_CONTA_PAGAR, border: BORDER_CONTA_PAGAR },
          ].map((item, i) => (
            <Card key={i} className={`border-l-4 ${item.border} bg-card shadow-lg`}>
              <CardHeader className="pb-3 flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.titulo}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${item.color}`}>{formatCurrency(item.valor)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
 
        {/* Tabela de Filiais (EXISTENTE) */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Análise Financeira por Filial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">Filial</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Receita</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Despesas</th>
                    <th className="text-center text-sm font-semibold text-muted-foreground py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filiais.map((filial) => (
                    <tr
                      key={filial.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition text-sm"
                    >
                      <td className="py-3 px-2 font-medium">{filial.nome}</td>
                      <td className={`py-3 ${COLOR_RECEITA}`}>{formatCurrency(filial.receita)}</td>
                      {/* Cor da Despesa Ajustada aqui */}
                      <td className={`py-3 ${COLOR_DESPESAS}`}>{formatCurrency(filial.despesas)}</td>
                      <td className="py-3 flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Visualizar Detalhes"
                          onClick={() => handleVisualizar(filial)}
                        >
                          <Eye className={`h-4 w-4 ${COLOR_SALDO}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Baixar relatório"
                          onClick={() => handleDownloadReport(filial)}
                        >
                          <Download className={`h-4 w-4 ${COLOR_RECEITA}`} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
 
        {/* NOVO BLOCO: Controle de Contas a Pagar */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Banknote className={`h-5 w-5 ${COLOR_CONTA_PAGAR}`} />
              Contas a Pagar Pendentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">Controle de fornecedores, salários e despesas fixas a vencer.</p>
          </CardHeader>
          <CardContent>
            {contasPendentes.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">
                Nenhuma conta a pagar pendente!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">Filial</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">Tipo</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">Descrição</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">Valor</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3 flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Vencimento
                      </th>
                      <th className="text-center text-sm font-semibold text-muted-foreground py-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contasPendentes.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento)).map((conta) => (
                      <tr
                        key={conta.id}
                        className="border-b border-border last:border-b-0 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition text-sm"
                      >
                        <td className="py-3 px-2 font-medium">{conta.filial}</td>
                        <td className="py-3 text-muted-foreground">{conta.tipo}</td>
                        <td className="py-3">{conta.descricao}</td>
                        {/* Cor da Despesa Ajustada aqui */}
                        <td className={`py-3 ${COLOR_DESPESAS} font-semibold`}>{formatCurrency(conta.valor)}</td>
                        <td className="py-3">{formatShortDate(conta.vencimento)}</td>
                        <td className="py-3 flex items-center justify-center">
                          {/* COR DO BOTÃO: #0F703A com hover mais escuro */}
                          <Button
                            size="sm"
                            className={`${BG_PAGAR_BUTTON} hover:bg-[#07381C] text-white gap-1`}
                            onClick={() => handleMarkAsPaid(conta.id)}
                          >
                            <CheckCircle className="h-4 w-4" /> Pagar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
 
 
        {/* Modal Detalhes da Filial (EXISTENTE) */}
       <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-automax-w-[40vw] sm:max-w-1xl md:max-w-2xl lg:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{filialSelecionada?.nome}</DialogTitle>
              <DialogDescription>Produtos em estoque</DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="flex flex-row items-center text-left text-sm font-semibold text-muted-foreground  px-2">
                      <p className="text-primary bg-accent rounded px-3">Produto</p>
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2 px-2">
                      <p className="text-primary bg-accent rounded px-3">Quantidade</p>
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2 px-2">
                      <p className="text-primary bg-accent rounded px-3">Preço Unitário (R$)</p>
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2 px-2">
                      <p className="text-primary bg-accent rounded px-3">Total (R$)</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(filialSelecionada
                    ? produtosPorFilial[filialSelecionada.nome]
                    : []
                  ).map((p) => (
                    <tr key={p.id} className="border-b border-border text-sm">
                      <td className="py-2">{p.nome}</td>
                      <td className="py-2">{p.quantidade}</td>
                      <td className="py-2">{formatCurrency(p.preco)}</td>
                      <td className="py-2">
                        {formatCurrency(p.preco * p.quantidade)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDetalhesOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
 