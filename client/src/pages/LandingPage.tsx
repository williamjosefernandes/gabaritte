import { Link, useLocation } from "wouter";
import { 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  BarChart2, 
  BookOpen, 
  Users,
  Menu,
  X,
  Check,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@assets/logo.png";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

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
      cta: "Começar Grátis",
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
      cta: "Quero ser Premium",
      highlight: true,
      badge: "Recomendado",
      objective: "Experiência profissional com foco em aprovação máxima."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-in fade-in duration-500">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-6xl mx-auto items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-primary cursor-pointer select-none" onClick={() => setLocation("/")}>
            <img src={logo} alt="Gabaritte" className="w-8 h-8 object-contain" />
            <span className="tracking-tight">Gabaritte</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="transition-all duration-200 hover:text-primary">Funcionalidades</a>
            <a href="#testimonials" className="transition-all duration-200 hover:text-primary">Depoimentos</a>
            <a href="#pricing" className="transition-all duration-200 hover:text-primary">Preços</a>
            <Link href="/auth">
              <Button variant="ghost" className="text-primary hover:text-primary/80 transition-transform hover:translate-y-0.5">Entrar</Button>
            </Link>
            <Link href="/auth">
              <Button className="transition-transform hover:translate-y-0.5">Começar Agora</Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 bg-background/95 space-y-4">
            <a href="#features" className="block py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
            <a href="#testimonials" className="block py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Depoimentos</a>
            <a href="#pricing" className="block py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Preços</a>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth">
                <Button variant="outline" className="w-full justify-center">Entrar</Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full justify-center">Começar Agora</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-purple-500/10 to-transparent -z-10"></div>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] bg-primary/15 -z-10"></div>
          
          <div className="container max-w-6xl mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/15 mb-6">
              <Zap className="w-3 h-3 mr-1" />
              Novo: Mentor IA disponível
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-6">
              A sua aprovação <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                planejada com inteligência
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Organize seus estudos, acompanhe seu progresso e receba recomendações personalizadas para passar no concurso dos seus sonhos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base gap-2 transition-transform hover:scale-[1.02]">
                  Criar Conta Grátis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base transition-all hover:bg-muted/60">
                  Conhecer Recursos
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground opacity-80">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5" /> <span>Segurança Total</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5" /> <span>+10k Alunos</span></div>
              <div className="flex items-center gap-2"><Star className="w-5 h-5" /> <span>4.9/5 Avaliação</span></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Tudo que você precisa para passar</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                O Gabaritte combina metodologia comprovada com tecnologia de ponta para otimizar seu tempo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Planos Personalizados",
                  desc: "Crie cronogramas adaptáveis que se ajustam à sua rotina e objetivos específicos."
                },
                {
                  icon: BarChart2,
                  title: "Estatísticas Avançadas",
                  desc: "Visualize seu desempenho com gráficos detalhados e identifique pontos de melhoria."
                },
                {
                  icon: Zap,
                  title: "Mentor IA",
                  desc: "Receba feedback instantâneo e sugestões de estudo baseadas no seu progresso."
                },
                {
                  icon: CheckCircle,
                  title: "Ciclos de Estudo",
                  desc: "Metodologia de ciclos automáticos para garantir que você revise todo o conteúdo."
                },
                {
                  icon: Users,
                  title: "Comunidade",
                  desc: "Compartilhe trilhas, tire dúvidas e estude com outros concurseiros focados."
                },
                {
                  icon: Shield,
                  title: "Banco de Questões",
                  desc: "Milhares de questões comentadas para você treinar e fixar o conteúdo."
                }
              ].map((feature, i) => (
                <div key={i} className="group bg-background p-6 rounded-xl border transition-all duration-200 hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-105 bg-gradient-to-br from-primary/15 to-purple-600/15">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section id="testimonials" className="py-20">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Aprovados que confiam no Gabaritte
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  "O Gabaritte foi fundamental para minha aprovação na Receita Federal. A organização automática do cronograma me salvou horas de planejamento."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full overflow-hidden">
                    <img src="https://github.com/shadcn.png" alt="User" loading="lazy" />
                  </div>
                  <div>
                    <p className="font-bold">Ana Silva</p>
                    <p className="text-sm text-muted-foreground">Auditora Fiscal - RFB</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 p-8 rounded-2xl border">
                <div className="grid gap-4">
                  <div className="bg-background p-4 rounded-lg flex items-center gap-4 border">
                    <div className="bg-primary/10 p-2 rounded-full text-primary"><CheckCircle className="w-5 h-5" /></div>
                    <div>
                      <p className="font-bold text-sm">Aprovado em 1º Lugar</p>
                      <p className="text-xs text-muted-foreground">TJ-SP Escrevente</p>
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg flex items-center gap-4 ml-8 border">
                    <div className="bg-primary/10 p-2 rounded-full text-primary"><CheckCircle className="w-5 h-5" /></div>
                    <div>
                      <p className="font-bold text-sm">Nomeado em 6 meses</p>
                      <p className="text-xs text-muted-foreground">Polícia Federal</p>
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg flex items-center gap-4 border">
                    <div className="bg-primary/10 p-2 rounded-full text-primary"><CheckCircle className="w-5 h-5" /></div>
                    <div>
                      <p className="font-bold text-sm">Evoluiu 40% nas notas</p>
                      <p className="text-xs text-muted-foreground">Em apenas 30 dias</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                Invista na sua <span className="text-primary">Aprovação</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Escolha o plano ideal para o seu momento de preparação.
              </p>
              
              <div className="flex justify-center mt-8">
                <div className="bg-muted p-1 rounded-lg flex items-center relative border">
                  <button 
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${billingCycle === "monthly" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Mensal
                  </button>
                  <button 
                    onClick={() => setBillingCycle("annual")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${billingCycle === "annual" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Anual <span className="text-muted-foreground text-xs ml-1 font-bold">-33%</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative border flex flex-col h-full transition-transform ${plan.highlight ? "border-primary bg-gradient-to-b from-primary/5 to-transparent ring-1 ring-primary/30" : "border-border bg-background"}`}
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
                    <div className="flex items-baseline gap-2">
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
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
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
                    <Link href="/auth" className="w-full">
                      <Button 
                        className="w-full transition-transform hover:scale-[1.01]" 
                        variant={plan.highlight ? "default" : "secondary"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
               <p className="text-muted-foreground mb-4">Dúvidas sobre os planos?</p>
               <Link href="/auth">
                 <Button variant="link" className="text-primary">Consulte nosso FAQ ou fale com o suporte &rarr;</Button>
               </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Comece sua jornada agora mesmo
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Junte-se gratuitamente e tenha acesso às ferramentas básicas para organizar seus estudos. Sem cartão de crédito.
            </p>
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold transition-transform hover:scale-[1.02]">
                Criar Conta Gratuita
              </Button>
            </Link>
            <p className="mt-4 text-sm opacity-70">Disponível para Web, iOS e Android</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 py-12 border-t">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
                <img src={logo} alt="Gabaritte" className="w-6 h-6 object-contain" />
                <span>Gabaritte</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A plataforma inteligente para concurseiros de alta performance.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-primary">Preços</a></li>
                <li><a href="#testimonials" className="hover:text-primary">Depoimentos</a></li>
                <li><a href="#" className="hover:text-primary">Download App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Carreiras</a></li>
                <li><a href="#" className="hover:text-primary">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Gabaritte Tecnologia Educacional. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
