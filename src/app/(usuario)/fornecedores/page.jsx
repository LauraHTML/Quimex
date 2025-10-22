"use client"

import { useState } from "react"
import { useAuth } from "@/app/contexts/auth-context"
import { mockFornecedores } from "@/lib/mock-data"
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
import { Plus, Search, Trash2, Truck, Phone, Mail, User, Edit2 } from "lucide-react"

export default function FornecedoresPage() {
  const { user } = useAuth()
  const [fornecedores, setFornecedores] = useState(mockFornecedores)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    contato: "",
    telefone: "",
    email: "",
  })

  if (!user) return null

  const filteredFornecedores = fornecedores.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cnpj.includes(searchTerm) ||
      f.contato.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditFornecedor = (fornecedor) => {
    setEditingFornecedor(fornecedor)
    setFormData({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      contato: fornecedor.contato,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
    })
    setIsDialogOpen(true)
  }

  const handleSaveFornecedor = () => {
    if (editingFornecedor) {
      setFornecedores(
        fornecedores.map((f) =>
          f.id === editingFornecedor.id
            ? {
                ...f,
                nome: formData.nome,
                cnpj: formData.cnpj,
                contato: formData.contato,
                telefone: formData.telefone,
                email: formData.email,
              }
            : f,
        ),
      )
    } else {
      const newFornecedor = {
        id: String(Date.now()),
        nome: formData.nome,
        cnpj: formData.cnpj,
        contato: formData.contato,
        telefone: formData.telefone,
        email: formData.email,
        ativo: true,
      }
      setFornecedores([...fornecedores, newFornecedor])
    }

    setIsDialogOpen(false)
    setEditingFornecedor(null)
    setFormData({
      nome: "",
      cnpj: "",
      contato: "",
      telefone: "",
      email: "",
    })
  }

  const handleDeleteFornecedor = (id) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      setFornecedores(fornecedores.filter((f) => f.id !== id))
    }
  }

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingFornecedor(null)
      setFormData({
        nome: "",
        cnpj: "",
        contato: "",
        telefone: "",
        email: "",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <p className="text-muted-foreground mt-1">Gerencie os fornecedores de produtos químicos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFornecedor ? "Editar Fornecedor" : "Adicionar Fornecedor"}</DialogTitle>
              <DialogDescription>
                {editingFornecedor ? "Atualize os dados do fornecedor" : "Preencha os dados do novo fornecedor"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Química Industrial Ltda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contato">Nome do Contato</Label>
                <Input
                  id="contato"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  placeholder="João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 4000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@fornecedor.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCloseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFornecedor}>{editingFornecedor ? "Salvar" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CNPJ ou contato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFornecedores.map((fornecedor) => (
          <Card
            key={fornecedor.id}
            className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                    <Truck className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{fornecedor.nome}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">CNPJ: {fornecedor.cnpj}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditFornecedor(fornecedor)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFornecedor(fornecedor.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 flex-shrink-0" />
                {fornecedor.contato}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {fornecedor.telefone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{fornecedor.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFornecedores.length === 0 && (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhum fornecedor encontrado.</p>
        </div>
      )}
    </div>
  )
}
