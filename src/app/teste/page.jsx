// app/cadastro/page.tsx (App Router)
// ou pages/cadastro.tsx (Pages Router)
'use client';

import { useState } from 'react';
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CadastroPage() {
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');

  const handleSubmit = () => {
    console.log({
      cpf, // valor limpo: "12345678900"
      telefone, // valor limpo: "11987654321"
      cep // valor limpo: "12345678"
    });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastro</h1>
      
      <div className="space-y-4">
        {/* CPF */}
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <MaskedInput
            id="cpf"
            mask="000.000.000-00"
            value={cpf}
            onChange={setCpf}
            placeholder="000.000.000-00"
          />
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <MaskedInput
            id="telefone"
            mask="(00) 00000-0000"
            value={telefone}
            onChange={setTelefone}
            placeholder="(11) 98765-4321"
          />
        </div>

        {/* CEP */}
        <div>
          <Label htmlFor="cep">CEP</Label>
          <MaskedInput
            id="cep"
            mask="00000-000"
            value={cep}
            onChange={setCep}
            placeholder="00000-000"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Enviar
        </Button>
      </div>
    </div>
  );
}