import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Phone, MapPin, Trash2, Edit2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

export function CardLojas({ loja, onEdit, onDelete }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      loja.tipo === "Matriz"
                        ? "bg-purple-500/10 group-hover:bg-purple-500/20"
                        : "bg-primary/10 group-hover:bg-primary/20"
                    }`}
                  >
                    <Building2 className={`h-5 w-5 ${loja.tipo === "Matriz" ? "text-purple-500" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">{loja.nome}</CardTitle>
                      <Badge variant={loja.tipo === "Matriz" ? "default" : "secondary"} className="text-xs">
                        {loja.tipo}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(loja)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {loja.tipo !== "Matriz" && (
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
                        <AlertDialogAction onClick={() => onDelete(loja.id)}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
  );
}