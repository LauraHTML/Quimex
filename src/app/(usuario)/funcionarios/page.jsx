"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/app/contexts/auth-context"
import { mockUsers, mockLojas } from "@/lib/mock-data"
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
import { Plus, Search, Trash2, UserCircle, Mail, Phone, Building2, Edit2 } from "lucide-react"
import { getRoleName } from "@/lib/utils/permissions"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//paginação
import { ControlePaginacao } from "@/components/paginacao/controlePaginacao";
import { CardFuncionarios } from "@/components/cards/CardFuncionarios";

export default function FuncionariosPage() {
  const { user } = useAuth()
  const [funcionarios, setFuncionarios] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    role: "vendedor",
    lojaId: "",
  })

  if (!user) return null

  console.log(formData.nome)

  const filteredByRole =
    user.role === "admin_matriz" ? funcionarios : funcionarios.filter((f) => f.lojaId === user.lojaId)

  const filteredFuncionarios = filteredByRole.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cpf.includes(searchTerm),
  )

  const handleEditFuncionario = (funcionario) => {
    setEditingFuncionario(funcionario)
    setFormData({
      nome: funcionario.nome,
      email: funcionario.email,
      cpf: funcionario.cpf,
      telefone: funcionario.telefone,
      role: funcionario.role,
      lojaId: funcionario.lojaId || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveFuncionario = () => {
    if (editingFuncionario) {
      // Edit funcionario
      setFuncionarios(
        funcionarios.map((f) =>
          f.id === editingFuncionario.id
            ? {
                ...f,
                nome: formData.nome,
                email: formData.email,
                cpf: formData.cpf,
                telefone: formData.telefone,
                role: formData.role,
                lojaId: formData.lojaId || (user.role === "admin_matriz" ? null : user.lojaId),
              }
            : f,
        ),
      )
    } else {
      // Add new
      const newFuncionario = {
        id: String(Date.now()),
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        role: formData.role,
        lojaId: formData.lojaId || (user.role === "admin_matriz" ? null : user.lojaId),
        ativo: true,
      }
      setFuncionarios([...funcionarios, newFuncionario])
    }

    setIsDialogOpen(false)
    setEditingFuncionario(null)
    setFormData({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      role: "vendedor",
      lojaId: "",
    })
  }

  const handleDeleteFuncionario = (id) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id))
    }
  }

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingFuncionario(null)
      setFormData({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        role: "vendedor",
        lojaId: "",
      })
    }
  }

  const getLojaNome = (lojaId) => {
    if (!lojaId) return "Matriz"
    const loja = mockLojas.find((l) => l.id === lojaId)
    return loja?.nome || "N/A"
  }

  //paginacao
  funcionarios.map((f) => {
    console.log(f.role)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Funcionários</h1>
          <p className="text-muted-foreground mt-1">Gerencie os funcionários da Quimex</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFuncionario ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
              <DialogDescription>
                {editingFuncionario ? "Atualize os dados do funcionário" : "Preencha os dados do novo funcionário"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@quimx.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {user.role === "admin_matriz" && <SelectItem value="admin_matriz">Administrador Matriz</SelectItem>}
                    <SelectItem value="gerente_filial">Gerente de Filial</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {user.role === "admin_matriz" && (
                <div className="space-y-2">
                  <Label htmlFor="loja">Loja</Label>
                  <Select
                    value={formData.lojaId}
                    onValueChange={(value) => setFormData({ ...formData, lojaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLojas.map((loja) => (
                        <SelectItem key={loja.id} value={loja.id}>
                          {loja.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCloseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFuncionario}>{editingFuncionario ? "Salvar" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-2">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">Visualizar por setor</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione setor</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <p>setor</p>
          </DropdownMenuContent>
        </DropdownMenu>
      <div className="flex flex-row gap-2 flex-wrap relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      </div>

      {/* Lista de Funcionários */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFuncionarios.map((funcionario) => (
          <Card
            key={funcionario.id}
            className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{funcionario.nome}</CardTitle>
                    <p className="text-xs text-muted-foreground uppercase mt-1 font-medium">
                      {getRoleName(funcionario.role)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditFuncionario(funcionario)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFuncionario(funcionario.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{funcionario.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {funcionario.telefone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                {getLojaNome(funcionario.lojaId)}
              </div>
              <div className="pt-2 mt-2 border-t">
                <p className="text-xs text-muted-foreground">CPF: {funcionario.cpf}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFuncionarios.length === 0 && (
        <div className="text-center py-12">
          <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhum funcionário encontrado.</p>
        </div>
      )}
    </div>
  )
}
