import { useState } from "react";
import { 
  Search, 
  HelpCircle, 
  Book, 
  CreditCard, 
  Settings, 
  MessageSquare,
  ChevronRight,
  Clock,
  FileText,
  Target
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const faqCategories = [
  { id: "general", name: "Geral e Gamificação", icon: HelpCircle },
  { id: "plans", name: "Planos e Trilhas", icon: Book },
  { id: "study", name: "Sessão de Estudo", icon: Clock },
  { id: "simulados", name: "Simulados e Resultados", icon: FileText },
  { id: "billing", name: "Assinatura Premium", icon: CreditCard },
  { id: "account", name: "Conta e Suporte", icon: Settings },
];

const faqData = {
  general: [
    {
      question: "O que é o Gabaritte?",
      answer: "O Gabaritte é uma plataforma completa de gestão de estudos para concurseiros e vestibulandos. Oferecemos organização de editais, cronogramas inteligentes, rastreamento de progresso e ferramentas de produtividade."
    },
    {
      question: "Como funciona o sistema de Gamificação (XP e Níveis)?",
      answer: "Para tornar o estudo mais motivador, você ganha XP (Pontos de Experiência) ao concluir tópicos, realizar sessões de estudo e registrar simulados. Conforme acumula XP, você sobe de Nível, desbloqueando novas conquistas e insígnias no seu perfil."
    },
    {
      question: "Posso personalizar a aparência da plataforma?",
      answer: "Sim! Nas configurações, você pode alternar entre temas Claro, Escuro ou seguir o sistema. Também é possível personalizar a cor de destaque de cada disciplina no seu plano de estudos."
    },
    {
      question: "Como edito meu Perfil de Usuário?",
      answer: "Acesse a página de Perfil clicando no seu avatar no menu lateral. Lá você pode alterar seu nome, foto, e visualizar suas estatísticas gerais, nível atual e histórico de conquistas."
    }
  ],
  plans: [
    {
      question: "O que são as 'Trilhas'?",
      answer: "Trilhas são modelos de planos de estudo pré-configurados (templates) criados por nossa equipe ou pela comunidade. Elas já vêm com todas as disciplinas e tópicos de um edital específico (ex: Edital PF Agente), permitindo que você comece a estudar imediatamente sem perder tempo cadastrando matérias."
    },
    {
      question: "Como funciona a hierarquia de Matéria > Tópico > Subtópico?",
      answer: "O Gabaritte permite uma organização profunda. Dentro de cada Disciplina (ex: Direito Constitucional), você cria Tópicos (ex: Direitos Fundamentais) e dentro deles, Subtópicos (ex: Artigo 5º). Isso permite um controle granular do que já foi estudado."
    },
    {
      question: "Posso importar meu edital de uma planilha?",
      answer: "Sim! Na criação de uma disciplina, utilize a função 'Importar CSV'. Você pode colar o texto do edital ou subir um arquivo .csv/.txt com a lista de tópicos, e o sistema criará a estrutura automaticamente para você."
    },
    {
      question: "Como a busca funciona?",
      answer: "A barra de busca global no topo do Dashboard permite encontrar rapidamente qualquer Plano, Disciplina ou Tópico específico dentro da sua conta, facilitando a navegação em editais extensos."
    }
  ],
  study: [
    {
      question: "Qual a diferença entre Cronômetro e Pomodoro?",
      answer: "O Cronômetro é livre: você inicia e para quando quiser, ideal para sessões longas sem interrupção. O Pomodoro segue a técnica de ciclos (padrão de 25min foco + 5min pausa), ideal para manter a concentração e evitar fadiga mental. Ambos registram o tempo líquido estudado."
    },
    {
      question: "O tempo de estudo é salvo automaticamente?",
      answer: "Sim. Ao finalizar uma sessão (seja por cronômetro ou Pomodoro), o tempo é registrado no histórico da disciplina e conta para suas estatísticas semanais e cálculo de progresso."
    },
    {
      question: "Como vejo meu progresso geral?",
      answer: "No Dashboard e na página de Estatísticas, você visualiza gráficos de horas estudadas, tópicos concluídos e a porcentagem geral de cobertura do edital do seu plano ativo."
    }
  ],
  simulados: [
    {
      question: "Como registro um Simulado externo?",
      answer: "Vá até a página 'Simulados' e clique em 'Novo Simulado'. Você pode registrar provas completas ou parciais realizadas fora da plataforma."
    },
    {
      question: "Posso detalhar meus erros e acertos?",
      answer: "Sim! O sistema permite lançar a nota geral ou fazer um 'drill-down' detalhado, informando acertos por Disciplina, Tópico e até Subtópico. Isso gera inteligência para o sistema recomendar revisões específicas onde você é mais fraco."
    },
    {
      question: "Para que servem os gráficos de desempenho?",
      answer: "Na página de Estatísticas (e na versão Premium), os gráficos mostram sua evolução histórica de notas, comparativo de desempenho por matéria e projeção de tempo até cobrir o edital com qualidade."
    }
  ],
  billing: [
    {
      question: "Quais as limitações do Plano Gratuito?",
      answer: "O plano Gratuito permite criar até 1 Plano de Estudos, 2 Disciplinas por plano e registrar até 3 Simulados. O acesso às estatísticas avançadas e Trilhas Premium é bloqueado."
    },
    {
      question: "O que o Plano Premium oferece?",
      answer: "O Premium desbloqueia: Planos e Disciplinas ilimitados, acesso a todas as Trilhas, Importação de CSV ilimitada, Estatísticas Avançadas, Histórico completo e suporte prioritário."
    },
    {
      question: "Como gerencio minha assinatura?",
      answer: "Acesse 'Assinatura' no menu lateral. Lá você pode ver seu plano atual, fazer upgrade, alterar forma de pagamento ou cancelar a renovação a qualquer momento."
    }
  ],
  account: [
    {
      question: "Como funciona o HelpDesk?",
      answer: "O HelpDesk é nosso canal direto de suporte. Você pode abrir chamados (tickets) para relatar bugs, tirar dúvidas técnicas ou sugerir melhorias. Acompanhe o status e as respostas dos nossos atendentes diretamente pela plataforma."
    },
    {
      question: "Esqueci minha senha, e agora?",
      answer: "Na tela de login, use a opção 'Esqueci minha senha' para receber um link de redefinição no seu e-mail cadastrado. Se estiver logado, você pode alterar a senha na página de Configurações."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim. Utilizamos criptografia de ponta a ponta e seguimos rigorosamente a LGPD. Seus dados de estudo e desempenho são privados e não são compartilhados com terceiros."
    }
  ]
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter questions based on search query
  const filteredQuestions = searchQuery 
    ? Object.values(faqData).flat().filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory as keyof typeof faqData];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl font-display font-bold tracking-tight">Central de Ajuda</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Domine todas as funcionalidades do Gabaritte. De cronogramas a simulados, tire suas dúvidas aqui.
        </p>
        
        <div className="relative max-w-lg mx-auto mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 text-base shadow-sm bg-white/50 backdrop-blur-sm" 
            placeholder="Pesquise por 'Simulados', 'CSV', 'Pomodoro'..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Categories */}
        <div className="md:col-span-1 space-y-2">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id && !searchQuery
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
              {activeCategory === category.id && !searchQuery && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
          
          <Card className="mt-6 bg-primary/5 border-primary/10">
            <CardContent className="p-4 space-y-3">
              <div className="p-2 bg-primary/10 rounded-full w-fit">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Precisa de mais ajuda?</h4>
              <p className="text-xs text-muted-foreground">
                Nossa equipe de suporte está pronta para resolver problemas complexos.
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <a href="/helpdesk">Abrir Ticket</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Content */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {searchQuery ? (
                  <>
                    <Search className="w-5 h-5 text-primary" />
                    Resultados da busca
                  </>
                ) : (
                  <>
                    {faqCategories.find(c => c.id === activeCategory)?.icon && (
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        {(() => {
                          const Icon = faqCategories.find(c => c.id === activeCategory)?.icon || HelpCircle;
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </div>
                    )}
                    {faqCategories.find(c => c.id === activeCategory)?.name}
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {searchQuery 
                  ? `Encontramos ${filteredQuestions.length} resultados para "${searchQuery}"`
                  : "Perguntas frequentes sobre este tópico."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-base py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Nenhum resultado encontrado para sua busca.</p>
                  <Button variant="link" onClick={() => setSearchQuery("")}>Ver todas as perguntas</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}