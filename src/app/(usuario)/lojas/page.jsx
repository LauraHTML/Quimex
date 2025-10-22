"use client"

import { useState } from "react"
import { useAuth } from "@/app/contexts/auth-context"
import { canManageLojas } from "@/lib/utils/permissions"
import { mockLojas } from "@/lib/mock-data"
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
import { Plus, Building2, Phone, MapPin, Trash2, Edit2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LojasPage() {
  const { user } = useAuth()
  const [lojas, setLojas] = useState(mockLojas)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLoja, setEditingLoja] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    telefone: "",
    tipo: "filial",
  })

  if (!user || !canManageLojas(user)) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  const handleEditLoja = (loja) => {
    setEditingLoja(loja)
    setFormData({
      nome: loja.nome,
      cnpj: loja.cnpj,
      endereco: loja.endereco,
      cidade: loja.cidade,
      estado: loja.estado,
      telefone: loja.telefone,
      tipo: loja.tipo,
    })
    setIsDialogOpen(true)
  }

  const handleSaveLoja = () => {
    if (editingLoja) {
      setLojas(
        lojas.map((l) =>
          l.id === editingLoja.id
            ? {
                ...l,
                nome: formData.nome,
                cnpj: formData.cnpj,
                endereco: formData.endereco,
                cidade: formData.cidade,
                estado: formData.estado,
                telefone: formData.telefone,
                tipo: formData.tipo,
              }
            : l,
        ),
      )
    } else {
      const newLoja = {
        id: String(Date.now()),
        nome: formData.nome,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        telefone: formData.telefone,
        tipo: formData.tipo,
        ativo: true,
      }
      setLojas([...lojas, newLoja])
    }

    setIsDialogOpen(false)
    setEditingLoja(null)
    setFormData({
      nome: "",
      cnpj: "",
      endereco: "",
      cidade: "",
      estado: "",
      telefone: "",
      tipo: "filial",
    })
  }

  const handleDeleteLoja = (id) => {
    const loja = lojas.find((l) => l.id === id)
    if (loja?.tipo === "matriz") {
      alert("Não é possível excluir a loja matriz!")
      return
    }
    if (confirm("Tem certeza que deseja excluir esta loja?")) {
      setLojas(lojas.filter((l) => l.id !== id))
    }
  }

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingLoja(null)
      setFormData({
        nome: "",
        cnpj: "",
        endereco: "",
        cidade: "",
        estado: "",
        telefone: "",
        tipo: "filial",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lojas</h1>
          <p className="text-muted-foreground mt-1">Gerencie as lojas da rede Quimx</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Loja
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLoja ? "Editar Loja" : "Adicionar Loja"}</DialogTitle>
              <DialogDescription>
                {editingLoja ? "Atualize os dados da loja" : "Preencha os dados da nova loja"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Loja</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Quimx Centro"
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
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua Exemplo, 123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 3000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matriz">Matriz</SelectItem>
                    <SelectItem value="filial">Filial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCloseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLoja}>{editingLoja ? "Salvar" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lojas.map((loja) => (
          <Card key={loja.id} className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      loja.tipo === "matriz"
                        ? "bg-purple-500/10 group-hover:bg-purple-500/20"
                        : "bg-primary/10 group-hover:bg-primary/20"
                    }`}
                  >
                    <Building2 className={`h-5 w-5 ${loja.tipo === "matriz" ? "text-purple-500" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">{loja.nome}</CardTitle>
                      <Badge variant={loja.tipo === "matriz" ? "default" : "secondary"} className="text-xs">
                        {loja.tipo}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditLoja(loja)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {loja.tipo !== "matriz" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLoja(loja.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p>{loja.endereco}</p>
                  <p>
                    {loja.cidade} - {loja.estado}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {loja.telefone}
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">CNPJ: {loja.cnpj}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
