"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
  Minus,
} from "lucide-react";

import { mockProdutos, mockLojas } from "@/lib/mock-data";

export default function PDV() {
  const [produtos, setProdutos] = useState(mockProdutos);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [showPayment, setShowPayment] = useState(false);

  // Categorias atualizadas para corresponder à tabela e em português
 const classificacao = [...new Set(produtos.map(produto => produto.classificacao.toLowerCase()))];

  const produtoFiltrado = produtos.filter((produto) => {
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoriaSelecionada === "Todos" || produto.classificacao.toLowerCase() === categoriaSelecionada.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const addToCart = (produto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === produto.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantidade = (id, change) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantidade = item.quantidade + change;
          return newQuantidade > 0 ? { ...item, quantidade: newQuantidade } : item;
        }
        return item;
      })
    );
  };

  const total = cart.reduce((soma, item) => soma + parseFloat(item.preco) * item.quantidade, 0);

  const handlePayment = (method) => {
    alert(`Pagamento de R$ ${total.toFixed(2)} realizado via ${method}`);
    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">QUIMEX</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Caixa - Produtos Químicos
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Operador</p>
              <p className="text-sm font-medium">Caixa 01</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome ou código do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </header>

        {/* Filtro */}
        <div className="px-6 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground mr-2">
              Filtrar:
            </span>
            <div className="flex gap-2 flex-wrap">
              {classificacao.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setCategoriaSelecionada(categoria)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    categoriaSelecionada === categoria ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {produtoFiltrado.map((produto) => (
              <button
                key={produto.id}
                onClick={() => addToCart(produto)}
                className="bg-card border border-border rounded-lg p-0 hover:border-primary hover:shadow-lg transition-all text-left"
              >
                {/* Faixa de cor da categoria */}
                <div
                  className={`${produto.codigoCor} w-full h-2 rounded-t-lg`}
                ></div>

                <div className="p-4 space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">
                    {produto.code}
                  </p>
                  <h3 className="font-semibold text-sm text-foreground leading-tight">
                    {produto.nome}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {produto.classificacao}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carrinho */}
      <div className="w-[450px] border-l border-border bg-card flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Carrinho de Compras
          </h2>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">Nenhum item no carrinho</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-background border border-border rounded-lg p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-mono">
                        {item.code}
                      </p>
                      <h3 className="font-semibold text-sm text-foreground leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantidade(item.id, -1)}
                            disabled={item.quantidade <= 1}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-bold text-sm text-foreground min-w-[3ch] text-center">
                            {item.quantidade}x
                          </span>
                          <button
                            onClick={() => updateQuantidade(item.id, 1)}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total e Pagamento */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Finalizar Venda
          </button>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Forma de Pagamento
              </h2>
              <button
                onClick={() => setShowPayment(false)}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Total a pagar:
              </p>
              <p className="text-3xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Débito", icon: <CreditCard /> },
                { name: "Crédito", icon: <CreditCard /> },
                { name: "Dinheiro", icon: <Banknote /> },
                { name: "PIX", icon: <Smartphone /> },
              ].map((method) => (
                <button
                  key={method.name}
                  onClick={() => handlePayment(method.name)}
                  className="flex flex-col items-center gap-3 p-6 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 text-primary">{method.icon}</div>
                  <span className="font-semibold text-foreground">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
