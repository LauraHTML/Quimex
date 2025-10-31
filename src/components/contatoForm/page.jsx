"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../components/ui/field";

export default function ContatoForm(){

    async function handleSubmit(event) {
        event.preventDefault();
  
        const formData = new FormData(event.target)
  
        const response = await fetch('/api/contact', {
            method: 'post',
            body: formData,
           });
      };

    return(
        <>
        <div className="flex flex-col gap-3 w-full md:w-1/3">
          <h2 className="text-primary font-bold">Entre em Contato</h2>
            <p>
              Estamos ansiosos para ouvir você e explorar novas oportunidades de
              parceria.
            </p>
            <div>
              <h4 className="text-primary font-bold">Email:</h4>
              <p>Email@gmail?.com</p>
            </div>
            <div>
              <h4 className="text-primary font-bold">Telefone:</h4>
            <p>+1 2345-5643</p>
            </div>           
            <small>Disponível para contato de <span className="font-bold text-secondary"> Segunda a Sexta, 9h - 17h (BRT)</span></small>
        </div> 
        <div className="flex flex-row px-4 pb-10 w-full md:w-1/2 bg-accent rounded-lg ">
              <FieldGroup>
                <FieldSet>
                  <FieldLegend></FieldLegend>
                  <FieldDescription></FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                        Nome completo
                      </FieldLabel>
                      <Input id="" className="bg-background" placeholder="Seu nome" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                        Email
                      </FieldLabel>
                      <Input
                        id="email"
                        className="bg-background"
                        placeholder="seu.email@exemplo.com"
                        required
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-optional-comments">
                        Mensagem
                      </FieldLabel>
                      <Textarea
                        id="mensagem"
                        placeholder="Sua mensagem..."
                        className="resize-none md:resize-y bg-background"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field orientation="responsive">
                  <Button type="submit">Enviar <ArrowRight /></Button>
                </Field>
              </FieldGroup>
        </div>
        </>
    )
}