"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { mockProdutos, mockLojas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Package,
  DollarSign,
  Hash,
  Edit2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// delete
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ProdutosPage() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState(mockProdutos);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    sku: "",
    preco: "",
    estoque: "",
    lojaId: "",
  });

  if (!user) return null;

  const filteredByRole =
    user.role === "admin_matriz"
      ? produtos
      : produtos.filter((p) => p.lojaId === user.lojaId);

  const filteredProdutos = filteredByRole.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.includes(searchTerm) ||
      p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduto = (produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      sku: produto.sku,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString(),
      lojaId: produto.lojaId,
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduto = () => {
    if (editingProduto) {
      setProdutos(
        produtos.map((p) =>
          p.id === editingProduto.id
            ? {
                ...p,
                nome: formData.nome,
                descricao: formData.descricao,
                sku: formData.sku,
                preco: Number.parseFloat(formData.preco),
                estoque: Number.parseInt(formData.estoque),
                lojaId: formData.lojaId || user.lojaId || "1",
              }
            : p
        )
      );
    } else {
      const newProduto = {
        id: String(Date.now()),
        nome: formData.nome,
        descricao: formData.descricao,
        sku: formData.sku,
        preco: Number.parseFloat(formData.preco),
        estoque: Number.parseInt(formData.estoque),
        lojaId: formData.lojaId || user.lojaId || "1",
        ativo: true,
      };
      setProdutos([...produtos, newProduto]);
    }

    setIsDialogOpen(false);
    setEditingProduto(null);
    setFormData({
      nome: "",
      descricao: "",
      sku: "",
      preco: "",
      estoque: "",
      lojaId: "",
    });
  };

  const handleDeleteProduto = (id) => {
      setProdutos(produtos.filter((p) => p.id !== id));
  };

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingProduto(null);
      setFormData({
        nome: "",
        descricao: "",
        sku: "",
        preco: "",
        estoque: "",
        lojaId: "",
      });
    }
  };

  const getLojaNome = (lojaId) => {
    const loja = mockLojas.find((l) => l.id === lojaId);
    return loja?.nome || "N/A";
  };

  const getStockBadgeVariant = (estoque) => {
    if (estoque > 10) return "default";
    if (estoque > 0) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Produtos Químicos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de produtos químicos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduto ? "Editar Produto" : "Adicionar Produto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduto
                  ? "Atualize os dados do produto"
                  : "Preencha os dados do novo produto"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ácido Sulfúrico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição detalhada do produto químico"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="QMX-001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) =>
                      setFormData({ ...formData, preco: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={formData.estoque}
                    onChange={(e) =>
                      setFormData({ ...formData, estoque: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              {user.role === "admin_matriz" && (
                <div className="space-y-2">
                  <Label htmlFor="loja">Loja</Label>
                  <Select
                    value={formData.lojaId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, lojaId: value })
                    }
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
              <Button
                variant="outline"
                onClick={() => handleCloseDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProduto}>
                {editingProduto ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, SKU ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProdutos.map((produto) => (
          <Card
            key={produto.id}
            className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-shrink min-w-0 flex-wrap">
                  <div className="p-2.5 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Package className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {produto.nome}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {produto.descricao}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditProduto(produto)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Tem certeza que deseja excluir este produto?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isto irá apagar
                          permanentemente o produto dos nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduto(produto.id)}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span className="font-mono">{produto.sku}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>
                <Badge variant={getStockBadgeVariant(produto.estoque)}>
                  Estoque: {produto.estoque}
                </Badge>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {getLojaNome(produto.lojaId)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        </div>
      )}
    </div>
  );
}
