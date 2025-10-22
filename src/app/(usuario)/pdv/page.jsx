"use client"

import { useState } from "react"
import { useAuth } from "@/app/contexts/auth-context"
import { canAccessPDV } from "@/lib/utils/permissions"
import { mockProdutos } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, ShoppingCart, Trash2, Plus, Minus, DollarSign, Package } from "lucide-react"

export default function PDVPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [carrinho, setCarrinho] = useState([])

  if (!user || !canAccessPDV(user)) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Você não tem permissão para acessar o PDV.</p>
      </div>
    )
  }

  const produtos = user.role === "admin_matriz" ? mockProdutos : mockProdutos.filter((p) => p.lojaId === user.lojaId)

  const filteredProdutos = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find((item) => item.id === produto.id)
    if (itemExistente) {
      if (itemExistente.quantidade < produto.estoque) {
        setCarrinho(
          carrinho.map((item) => (item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item)),
        )
      }
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }])
    }
  }

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter((item) => item.id !== produtoId))
  }

  const alterarQuantidade = (produtoId, delta) => {
    setCarrinho(
      carrinho
        .map((item) => {
          if (item.id === produtoId) {
            const novaQuantidade = item.quantidade + delta
            if (novaQuantidade <= 0) return null
            if (novaQuantidade > item.estoque) return item
            return { ...item, quantidade: novaQuantidade }
          }
          return item
        })
        .filter(Boolean),
    )
  }

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  const finalizarVenda = () => {
    if (carrinho.length === 0) {
      alert("Adicione produtos ao carrinho!")
      return
    }
    const total = calcularTotal()
    alert(`Venda finalizada! Total: R$ ${total.toFixed(2)}`)
    setCarrinho([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">PDV - Ponto de Venda</h1>
        <p className="text-muted-foreground mt-1">Sistema de vendas da Quimx</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produtos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredProdutos.map((produto) => (
                  <div
                    key={produto.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{produto.nome}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{produto.sku}</p>
                          <Badge variant={produto.estoque > 10 ? "default" : "secondary"} className="text-xs">
                            Estoque: {produto.estoque}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <p className="text-lg font-bold text-green-600">R$ {produto.preco.toFixed(2)}</p>
                      <Button
                        size="sm"
                        onClick={() => adicionarAoCarrinho(produto)}
                        disabled={produto.estoque === 0}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Adicionar</span>
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProdutos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">Nenhum produto encontrado</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrinho */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Carrinho ({carrinho.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {carrinho.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Carrinho vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {carrinho.map((item) => (
                      <div key={item.id} className="space-y-2 p-3 rounded-lg border bg-card">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.nome}</p>
                            <p className="text-xs text-muted-foreground">R$ {item.preco.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removerDoCarrinho(item.id)}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => alterarQuantidade(item.id, -1)}
                              className="h-7 w-7"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantidade}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => alterarQuantidade(item.id, 1)}
                              className="h-7 w-7"
                              disabled={item.quantidade >= item.estoque}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {calcularTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">R$ {calcularTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={finalizarVenda} className="w-full gap-2" size="lg">
                    <DollarSign className="h-5 w-5" />
                    Finalizar Venda
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
