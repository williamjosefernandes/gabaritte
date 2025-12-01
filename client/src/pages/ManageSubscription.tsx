import { useState } from "react";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Mock Invoice Data
const allInvoices = Array.from({ length: 25 }).map((_, i) => {
  const date = new Date(2025, 0, 20);
  date.setMonth(date.getMonth() - i);
  return {
    id: `INV-${2025001 - i}`,
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    amount: "R$ 29,90",
    status: i === 0 ? "Pendente" : "Pago",
    year: date.getFullYear().toString(),
    items: [
      { description: "Assinatura Premium Mensal", amount: "R$ 29,90" }
    ],
    subtotal: "R$ 29,90",
    tax: "R$ 0,00",
    total: "R$ 29,90"
  };
});

export default function ManageSubscription() {
  const { toast } = useToast();
  
  // Dialog states
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  const [isBillingDetailsOpen, setIsBillingDetailsOpen] = useState(false);
  const [isSavingBilling, setIsSavingBilling] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  
  // Receipt Dialog State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof allInvoices[0] | null>(null);

  // Invoice History State
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceYearFilter, setInvoiceYearFilter] = useState("all");
  const itemsPerPage = 5;

  const filteredInvoices = allInvoices.filter(inv => 
    invoiceYearFilter === "all" ? true : inv.year === invoiceYearFilter
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (invoicePage - 1) * itemsPerPage,
    invoicePage * itemsPerPage
  );

  const handleScrollToHistory = () => {
    const element = document.getElementById('invoice-history');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewReceipt = (invoice: typeof allInvoices[0]) => {
    setSelectedInvoice(invoice);
    setIsReceiptOpen(true);
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Download iniciado",
      description: `O recibo #${selectedInvoice?.id} está sendo baixado.`,
    });
    setIsReceiptOpen(false);
  };

  const handleCancelSubscription = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura não será renovada no próximo ciclo.",
      });
    }, 2000);
  };

  const handleUpdateCard = () => {
    setIsUpdatingCard(true);
    setTimeout(() => {
      setIsUpdatingCard(false);
      setIsUpdateCardOpen(false);
      toast({
        title: "Cartão atualizado",
        description: "Seu novo método de pagamento foi salvo com sucesso.",
      });
    }, 1500);
  };

  const handleSaveBilling = () => {
    setIsSavingBilling(true);
    setTimeout(() => {
      setIsSavingBilling(false);
      setIsBillingDetailsOpen(false);
      toast({
        title: "Dados atualizados",
        description: "Suas informações de faturamento foram salvas.",
      });
    }, 1000);
  };

  const handleChangePlan = () => {
    setIsChangingPlan(true);
    setTimeout(() => {
      setIsChangingPlan(false);
      setIsChangePlanOpen(false);
      toast({
        title: "Plano alterado",
        description: "Sua assinatura foi atualizada com sucesso.",
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Gerenciar Assinatura</h2>
          <p className="text-muted-foreground">Detalhes do seu plano e pagamentos.</p>
        </div>
        <Link href="/settings">
          <Button variant="outline">Voltar para Configurações</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Plano Premium Anual</CardTitle>
                <CardDescription>Ativo desde 20 Jan 2025</CardDescription>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 p-4 bg-background rounded-lg border space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-bold">Próxima Cobrança</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold">20 Jan 2026</span>
                </div>
                <p className="text-xs text-muted-foreground">Valor: R$ 298,80</p>
              </div>
              <div className="flex-1 p-4 bg-background rounded-lg border space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-bold">Método de Pagamento</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Mastercard •••• 4242</span>
                </div>
                <p className="text-xs text-muted-foreground">Expira em 12/28</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Benefícios Ativos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Planos Ilimitados
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Mentor IA
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Cronograma Automático
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Modo Offline
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 py-4">
            <Dialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto hover:bg-transparent">
                  Alterar Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Alterar Plano</DialogTitle>
                  <DialogDescription>Escolha um novo plano para sua assinatura.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <RadioGroup defaultValue="premium-annual">
                    <div className="grid grid-cols-1 gap-4">
                      <Label htmlFor="basic" className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="basic" id="basic" />
                          <div>
                            <div className="font-semibold">Básico</div>
                            <div className="text-sm text-muted-foreground">Recursos limitados</div>
                          </div>
                        </div>
                        <div className="font-semibold">Grátis</div>
                      </Label>
                      
                      <Label htmlFor="premium-annual" className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="premium-annual" id="premium-annual" />
                          <div>
                            <div className="font-semibold">Premium Anual</div>
                            <div className="text-sm text-muted-foreground">Economize 20%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">R$ 24,90/mês</div>
                          <div className="text-xs text-muted-foreground">Cobrado R$ 298,80/ano</div>
                        </div>
                      </Label>

                      <Label htmlFor="premium-monthly" className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="premium-monthly" id="premium-monthly" />
                          <div>
                            <div className="font-semibold">Premium Mensal</div>
                            <div className="text-sm text-muted-foreground">Flexibilidade total</div>
                          </div>
                        </div>
                        <div className="font-semibold">R$ 29,90/mês</div>
                      </Label>

                      <Label htmlFor="elite" className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="elite" id="elite" />
                          <div>
                            <div className="font-semibold">Elite</div>
                            <div className="text-sm text-muted-foreground">Mentoria VIP</div>
                          </div>
                        </div>
                         <div className="text-right">
                          <div className="font-semibold">R$ 89,90/mês</div>
                          <div className="text-xs text-muted-foreground">Cobrado anualmente</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsChangePlanOpen(false)}>Cancelar</Button>
                  <Button onClick={handleChangePlan} disabled={isChangingPlan}>
                    {isChangingPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar Mudança
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={() => setIsUpdateCardOpen(true)}>Atualizar Pagamento</Button>
          </CardFooter>
        </Card>

        {/* Actions Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
            {/* Update Card Dialog */}
            <Dialog open={isUpdateCardOpen} onOpenChange={setIsUpdateCardOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-between h-12 font-normal">
                  Alterar Cartão <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Atualizar Cartão de Crédito</DialogTitle>
                  <DialogDescription>Insira os dados do seu novo cartão.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome no Cartão</Label>
                    <Input id="name" placeholder="Nome como está no cartão" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsUpdateCardOpen(false)}>Cancelar</Button>
                  <Button onClick={handleUpdateCard} disabled={isUpdatingCard}>
                    {isUpdatingCard && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Cartão
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Billing Details Dialog */}
            <Dialog open={isBillingDetailsOpen} onOpenChange={setIsBillingDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-between h-12 font-normal">
                  Dados de Faturamento <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dados de Faturamento</DialogTitle>
                  <DialogDescription>Atualize o endereço para suas faturas.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" defaultValue="Rua das Flores, 123" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" defaultValue="São Paulo" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" defaultValue="SP" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zip">CEP</Label>
                      <Input id="zip" defaultValue="01234-567" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">País</Label>
                      <Input id="country" defaultValue="Brasil" disabled />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsBillingDetailsOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSaveBilling} disabled={isSavingBilling}>
                    {isSavingBilling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Dados
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              variant="ghost" 
              className="w-full justify-between h-12 font-normal"
              onClick={handleScrollToHistory}
            >
              Histórico de Faturas <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full border-destructive/50 text-destructive hover:bg-destructive/10" variant="outline">
                  Cancelar Assinatura
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Cancelar Assinatura?
                  </DialogTitle>
                  <DialogDescription>
                    Ao cancelar, você perderá acesso aos recursos Premium ao final do ciclo atual (20 Jan 2026).
                    Seus dados serão mantidos, mas funcionalidades exclusivas serão bloqueadas.
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-muted p-4 rounded-md text-sm">
                  <p className="font-medium mb-2">O que você vai perder:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Mentor IA ilimitado</li>
                    <li>Cronogramas automáticos</li>
                    <li>Acesso a todas as trilhas</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button variant="ghost">Manter Assinatura</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancelando...
                      </>
                    ) : "Confirmar Cancelamento"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recibo de Pagamento
            </DialogTitle>
            <DialogDescription>
              ID: {selectedInvoice?.id} • {selectedInvoice?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="rounded-lg border p-4 bg-muted/10 space-y-4">
              <div className="flex justify-between text-sm font-medium text-muted-foreground border-b pb-2">
                <span>Descrição</span>
                <span>Valor</span>
              </div>
              {selectedInvoice?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.description}</span>
                  <span>{item.amount}</span>
                </div>
              ))}
              
              <div className="border-t pt-2 mt-4 space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{selectedInvoice?.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Impostos</span>
                  <span>{selectedInvoice?.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total Pago</span>
                  <span className="text-primary">{selectedInvoice?.total}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-medium mb-1">Faturado Para</p>
                <p>João Silva</p>
                <p className="text-muted-foreground">Rua das Flores, 123</p>
                <p className="text-muted-foreground">São Paulo, SP</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground font-medium mb-1">Emitido Por</p>
                <p>Gabaritte EduTech</p>
                <p className="text-muted-foreground">CNPJ 00.000.000/0001-00</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsReceiptOpen(false)}>
              Fechar
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleDownloadReceipt}>
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card id="invoice-history">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>Baixe os recibos dos seus pagamentos anteriores.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={invoiceYearFilter} onValueChange={(v) => { setInvoiceYearFilter(v); setInvoicePage(1); }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm bg-muted/50 border-b">
              <div>Data</div>
              <div>Valor</div>
              <div>Status</div>
              <div className="text-right">Recibo</div>
            </div>
            
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 p-4 text-sm items-center hover:bg-muted/20 transition-colors border-b last:border-0">
                  <div>
                    <div className="font-medium">{invoice.date}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{invoice.id}</div>
                  </div>
                  <div>{invoice.amount}</div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={invoice.status === "Pago" 
                        ? "bg-green-500/10 text-green-600 border-green-200" 
                        : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => handleViewReceipt(invoice)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma fatura encontrada para o período selecionado.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Página {invoicePage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInvoicePage(p => Math.max(1, p - 1))}
                  disabled={invoicePage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInvoicePage(p => Math.min(totalPages, p + 1))}
                  disabled={invoicePage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}