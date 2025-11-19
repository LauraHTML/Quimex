"use client";
import ThemeToggle from "@/components/themeSwitcher";
import { useState } from "react";
import { HeartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Package, DollarSign, Hash, Edit2, Trash2, Beaker } from "lucide-react";

import { cn } from "@/lib/utils";

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

export default function Teste() {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <div className="m-10">
        <ThemeToggle />
        <div className="relative max-w-xs rounded-xl bg-gradient-to-r from-secondary to-accent pt-0 shadow-lg hover:shadow-lg border hover:border-primary transition-all transition-discrete">
          <div className="flex h-70 items-center justify-center">
            <img
              src="/produtos/Ácido_Bórico.png"
              alt="Shoes"
              className="w-80"
            />
          </div>

          <Card className="border-none">
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription className="flex items-center gap-2">
                <div className="flex items-center gap-3 flex-shrink min-w-0 flex-wrap">
                  <div className="p-2.5 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Package className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">nome</CardTitle>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span className="font-mono">QMX-453</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">R$ 20.00</span>
                </div>
                <Badge variant="default">Estoque: 200</Badge>
              </div>
              <div className="flex flex-row justify-between items-center pt-2 border-t">
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all border
              border-border bg-background text-background-foreground hover:bg-background/80`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border border-border bg-primary`}
                  ></span>
                  <span>Ácidos Inorgânicos</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-primary/10"
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
                        <AlertDialogAction>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
        <Card className="border-none">
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription className="flex items-center gap-2">
                <div className="flex items-center gap-3 flex-shrink min-w-0 flex-wrap">
                  <div className="p-2.5 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Package className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">nome</CardTitle>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span className="font-mono">QMX-453</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">R$ 20.00</span>
                </div>
                <Badge variant="default">Estoque: 200</Badge>
              </div>
              <div className="flex flex-row justify-between items-center pt-2 border-t">
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all border
              border-border bg-background text-background-foreground hover:bg-background/80`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border border-border bg-primary`}
                  ></span>
                  <span>Ácidos Inorgânicos</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-primary/10"
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
                        <AlertDialogAction>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
