"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { canManageLojas } from "@/lib/utils/permissions";
import { mockLojas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/ui/masked-input";
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
import { Plus, Search, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//paginacao
import { ControlePaginacao } from "@/components/paginacao/controlePaginacao";
import { CardLojas } from "@/components/cards/cardLojas";

export default function LojasPage() {
  const { user } = useAuth();
  const [lojas, setLojas] = useState(mockLojas);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    nomeGerente: "",
    cpfGerente: "",
    id: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    telefone: "",
    tipo: "filial",
  });

  // if (!user || !canManageLojas(user)) {
  //   return (
  //     <div className="text-center py-12">
  //       <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
  //       <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
  //     </div>
  //   )
  // }

  const handleEditLoja = (loja) => {
    setEditingLoja(loja);
    setFormData({
      nome: loja.nome,
      nomeGerente: loja.gerenteLoja,
      cpfGerente: loja.cpfGerente,
      cnpj: loja.cnpj,
      endereco: loja.endereco,
      cidade: loja.cidade,
      estado: loja.estado,
      telefone: loja.telefone,
      tipo: loja.tipo,
    });
    setIsDialogOpen(true);
  };

  const handleSaveLoja = () => {
    if (editingLoja) {
      setLojas(
        lojas.map((l) =>
          l.id === editingLoja.id
            ? {
                ...l,
                nome: formData.nome,
                nomeGerente: formData.nomeGerente,
                cpfGerente: formData.cpfGerente,
                cnpj: formData.cnpj,
                endereco: formData.endereco,
                cidade: formData.cidade,
                estado: formData.estado,
                telefone: formData.telefone,
                tipo: formData.tipo,
              }
            : l
        )
      );
    } else {
      const newLoja = {
        id: String(Date.now()),
        nome: formData.nome,
        nomeGerente: formData.nomeGerente,
        cpfGerente: formData.cpfGerente,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        telefone: formData.telefone,
        tipo: formData.tipo,
        ativo: true,
      };
      setLojas([...lojas, newLoja]);
    }

    setIsDialogOpen(false);
    setEditingLoja(null);
    setFormData({
      nome: "",
      nomeGerente: "",
      cpfGerente: "",
      cnpj: "",
      endereco: "",
      cidade: "",
      estado: "",
      telefone: "",
      tipo: "filial",
    });
  };

  const handleDeleteLoja = (id) => {
    const loja = lojas.find((l) => l.id === id);
    if (loja?.tipo === "Matriz") {
      alert("Não é possível excluir a loja matriz!");
      return;
    }
    setLojas(lojas.filter((l) => l.id !== id));
  };

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingLoja(null);
      setFormData({
        nome: "",
        nomeGerente: "",
        cpfGerente: "",
        cnpj: "",
        endereco: "",
        cidade: "",
        estado: "",
        telefone: "",
        tipo: "filial",
      });
    }
  };

  const tipoLoja = [
    ...new Set(mockLojas.map((loja) => loja.tipo.toLowerCase())),
  ];
  const [tipoLojaSelecionados, setTipoLojaSelecionados] = useState([]);

  const handleLojaChange = (loja, checked) => {
    loja;
    if (checked) {
      setTipoLojaSelecionados([...tipoLojaSelecionados, loja]);
    } else {
      setTipoLojaSelecionados(tipoLojaSelecionados.filter((l) => l !== loja));
    }
  };
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const filteredLojas = useMemo(() => {
    // Comece com a lista completa
    let listaFiltrada = lojas;

    if (tipoLojaSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter((loja) =>
        tipoLojaSelecionados.includes(loja.tipo.toLowerCase())
      );
    }

    //filtrar resultados
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();
      listaFiltrada = listaFiltrada.filter(
        (loja) =>
          loja.nome.toLowerCase().includes(lowerCaseSearch) ||
          loja.estado.toLowerCase().includes(lowerCaseSearch) ||
          loja.cidade.toLowerCase().includes(lowerCaseSearch) ||
          loja.endereco.toLowerCase().includes(lowerCaseSearch)
      );
    }
    // lista final filtrada
    return listaFiltrada;

    // O 'useMemo' só vai rodar esta lógica quando um destes 3 estados mudar.
  }, [lojas, tipoLojaSelecionados, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lojas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as lojas da rede Quimx
          </p>
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
              <DialogTitle>
                {editingLoja ? "Editar Loja" : "Adicionar Loja"}
              </DialogTitle>
              <DialogDescription>
                {editingLoja
                  ? "Atualize os dados da loja"
                  : "Preencha os dados da nova loja"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Loja</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Quimx Centro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do gerente</Label>
                <Input
                  id="nomeGerente"
                  value={formData.nomeGerente}
                  onChange={(e) =>
                    setFormData({ ...formData, nomeGerente: e.target.value })
                  }
                  placeholder="Nome gerente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF do gerente</Label>
                <MaskedInput
                  id="cpf"
                  mask="000.000.000-00"
                  value={formData.cpfGerente}
                  onChange={(value) => setFormData({ ...formData, cpfGerente: value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <MaskedInput
                  id="cnpj"
                  mask="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(value) =>
                    setFormData({ ...formData, cnpj: value })
                  }
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  placeholder="Rua Exemplo, 123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    placeholder="São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <MaskedInput
                  id="telefone"
                  mask="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(value) =>
                    setFormData({ ...formData, telefone: value })
                  }
                  placeholder="(11) 98765-4321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matriz">Matriz</SelectItem>
                    <SelectItem value="Filial">Filial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleCloseDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveLoja}>
                {editingLoja ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">
              Visualizar por setor
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione setor</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tipoLoja.map((lojas) => (
              <DropdownMenuCheckboxItem
                checked={tipoLojaSelecionados.includes(lojas)}
                key={lojas}
                onCheckedChange={(checked) => handleLojaChange(lojas, checked)}
                // Prevent the dropdown menu from closing when the checkbox is clicked
                onSelect={(e) => e.preventDefault()}
              >
                {capitalize(lojas)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-row gap-2 flex-wrap relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ControlePaginacao
        items={filteredLojas}
        renderItem={(loja) => (
          <CardLojas
            key={loja.id}
            loja={loja}
            onEdit={handleEditLoja}
            onDelete={handleDeleteLoja}
          />
        )}
        itemsPerPage={9}
      />
    </div>
  );
}
