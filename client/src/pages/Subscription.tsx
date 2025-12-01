import { useState } from "react";
import { Check, X, Zap, Star, Shield, Crown, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Subscription() {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
      toast({
        title: "Processando pagamento...",
        description: "Aguarde enquanto confirmamos sua assinatura.",
      });
    }, 1500);
  };

  const plans = [
    {
      name: "Free",
      description: "Feito para quem está começando sua jornada de estudos.",
      price: { monthly: 0, annual: 0 },
      features: [
        "Até 2 disciplinas ativas",
        "Cada disciplina com até 10 tópicos",
        "1 trilha de estudo simples",
        "Cronograma manual",
        "Estatísticas básicas",
        "Histórico de 7 dias",
        "FAQ e HelpDesk (Base de Conhecimento)",
        "Sugestões da IA (Básico)"
      ],
      limitations: [
        "Sem cronograma automático",
        "Sem IA Adaptativa",
        "Sem simulados automáticos",
        "Sem exportação de PDFs"
      ],
      cta: "Plano Atual",
      current: true,
      highlight: false,
      objective: "Permitir que você conheça o sistema e veja valor real."
    },
    {
      name: "Premium",
      description: "Para quem quer estudar de forma inteligente e controle total.",
      price: { monthly: 29.90, annual: 19.90 },
      features: [
        "Disciplinas e tópicos ilimitados",
        "Cronograma automático e inteligente",
        "IA Adaptativa e Preditiva",
        "Histórico completo e estatísticas",
        "Simulados automáticos",
        "Comparativos de desempenho",
        "Exportação de relatórios e PDFs",
        "Acesso prioritário ao HelpDesk",
        "Sincronização entre dispositivos"
      ],
      limitations: [],
      cta: "Assinar Premium",
      current: false,
      highlight: true,
      badge: "Recomendado",
      objective: "Experiência profissional com foco em aprovação máxima."
    }
  ];

  const faqs = [
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim! Você pode cancelar sua assinatura a qualquer momento nas configurações da conta. O acesso permanecerá ativo até o fim do período pago."
    },
    {
      question: "O que acontece com meus dados se eu voltar para o Free?",
      answer: "Seus dados serão mantidos, mas você perderá acesso a funcionalidades exclusivas do Premium. Se tiver mais de 2 disciplinas, as excedentes serão pausadas."
    },
    {
      question: "Existe desconto para estudantes?",
      answer: "O plano Premium Anual já inclui um desconto significativo em relação ao mensal (de R$ 29,90 por R$ 19,90/mês)."
    },
    {
      question: "Como funciona a garantia de 7 dias?",
      answer: "Se você não gostar do Gabaritte Premium nos primeiros 7 dias, devolvemos 100% do seu dinheiro. Sem perguntas."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl text-center">Assinatura Confirmada!</DialogTitle>
            <DialogDescription className="text-center">
              Parabéns! Agora você é um membro <strong>{selectedPlan}</strong>.
              Aproveite todos os recursos exclusivos para acelerar sua aprovação.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button className="w-full sm:w-auto" onClick={() => setShowSuccessModal(false)}>
              Começar a Usar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
          Invista na sua <span className="text-primary">Aprovação</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para o seu momento de preparação.
        </p>
        
        <div className="flex justify-center mt-8">
          <div className="bg-muted p-1 rounded-lg flex items-center relative">
            <button 
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${billingCycle === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${billingCycle === "annual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Anual <span className="text-green-600 text-xs ml-1 font-bold">-33%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative border-2 flex flex-col ${plan.highlight ? "border-primary shadow-xl scale-105 z-10 bg-primary/5" : "border-border"}`}
          >
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary">{plan.badge}</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="h-10">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">R$</span>
                <span className="text-5xl font-bold tracking-tight">
                  {billingCycle === "annual" 
                    ? plan.price.annual.toFixed(2).replace('.', ',') 
                    : plan.price.monthly.toFixed(2).replace('.', ',')
                  }
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              {billingCycle === "annual" && plan.price.annual > 0 && (
                <p className="text-xs text-muted-foreground -mt-4">
                  Faturado R$ {(plan.price.annual * 12).toFixed(2).replace('.', ',')} anualmente
                </p>
              )}

              <div className="text-xs font-medium text-muted-foreground bg-muted/50 p-2 rounded-md border border-dashed">
                🎯 {plan.objective}
              </div>

              <Separator />

              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground opacity-70">
                    <X className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.highlight ? "default" : plan.current ? "outline" : "secondary"}
                disabled={plan.current || (isProcessing && selectedPlan === plan.name)}
                size="lg"
                onClick={() => !plan.current && handleSubscribe(plan.name)}
              >
                {isProcessing && selectedPlan === plan.name ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                  </>
                ) : (
                  plan.current ? "Seu Plano Atual" : plan.cta
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="py-12 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8">Comparativo de Recursos</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium text-muted-foreground w-1/2">Recurso</th>
                <th className="py-4 px-4 font-medium text-center w-1/4">Free</th>
                <th className="py-4 px-4 font-bold text-center text-primary w-1/4 bg-primary/5 rounded-t-lg">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: "Disciplinas Ativas", free: "Até 2", premium: "Ilimitadas" },
                { name: "Tópicos por Disciplina", free: "Até 10", premium: "Ilimitados" },
                { name: "Trilhas de Estudo", free: "1 Simples", premium: "Ilimitadas" },
                { name: "Cronograma", free: "Manual", premium: "Automático Inteligente" },
                { name: "IA Educacional", free: "Básica", premium: "Adaptativa e Preditiva" },
                { name: "Histórico", free: "7 dias", premium: "Completo" },
                { name: "Simulados Automáticos", free: false, premium: true },
                { name: "Comparativos de Desempenho", free: false, premium: true },
                { name: "Exportação de Relatórios", free: false, premium: true },
                { name: "Suporte", free: "Base de Conhecimento", premium: "HelpDesk Humano Prioritário" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{row.name}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">
                    {typeof row.free === 'boolean' ? (row.free ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/50" />) : row.free}
                  </td>
                  <td className="py-4 px-4 text-center font-medium bg-primary/5">
                    {typeof row.premium === 'boolean' ? (row.premium ? <Check className="w-5 h-5 mx-auto text-primary" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/50" />) : row.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-8 border-y bg-muted/30 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-semibold">Compra Segura</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Star className="w-8 h-8 text-primary" />
          <span className="font-semibold">4.9/5 na App Store</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Zap className="w-8 h-8 text-primary" />
          <span className="font-semibold">Acesso Imediato</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Crown className="w-8 h-8 text-primary" />
          <span className="font-semibold">7 Dias de Garantia</span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto py-8">
        <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6" /> Perguntas Frequentes
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Final CTA */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">Pronto para ser aprovado?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Junte-se a mais de 10.000 estudantes que já estão transformando seus estudos com o Gabaritte.
          </p>
          <Button size="lg" variant="secondary" className="mt-4 font-bold text-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}