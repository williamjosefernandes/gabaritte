import { 
  History as HistoryIcon, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Trophy,
  Filter,
  Download,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSubjects, activePlan, currentUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { useState } from "react";
import { Lock } from "lucide-react";

// Generate richer history data based on the app context
const generateHistory = () => [
  { 
    id: 1, 
    type: "study", 
    date: "Hoje", 
    time: "14:30", 
    title: "Estudou Direito Constitucional", 
    detail: "Direitos Fundamentais - Vídeo Aula", 
    duration: "60 min",
    subject: "Direito Constitucional",
    color: "bg-blue-500"
  },
  { 
    id: 2, 
    type: "exercise", 
    date: "Hoje", 
    time: "10:15", 
    title: "Resolveu Questões", 
    detail: "15 questões de Controle de Constitucionalidade", 
    score: "85%",
    subject: "Direito Constitucional",
    color: "bg-blue-500"
  },
  { 
    id: 3, 
    type: "study", 
    date: "Ontem", 
    time: "19:00", 
    title: "Estudou Português", 
    detail: "Revisão de Crase e Acentuação", 
    duration: "45 min",
    subject: "Português",
    color: "bg-amber-500"
  },
  { 
    id: 4, 
    type: "quiz", 
    date: "Ontem", 
    time: "10:00", 
    title: "Simulado Geral #03", 
    detail: "Simulado completo do edital", 
    score: "78%",
    subject: "Geral",
    color: "bg-gray-500"
  },
  { 
    id: 5, 
    type: "plan", 
    date: "25 Nov", 
    time: "09:15", 
    title: `Criou plano '${activePlan.name}'`, 
    detail: `Meta: ${activePlan.dailyGoalHours}h/dia • ${activePlan.subjects.length} disciplinas`, 
    score: null,
    subject: "Sistema",
    color: "bg-primary"
  },
  { 
    id: 6, 
    type: "study", 
    date: "24 Nov", 
    time: "14:00", 
    title: "Estudou Raciocínio Lógico", 
    detail: "Tabela Verdade e Proposições", 
    duration: "90 min",
    subject: "Raciocínio Lógico",
    color: "bg-rose-500"
  },
  {
    id: 7,
    type: "revision",
    date: "23 Nov",
    time: "16:30",
    title: "Revisão Semanal",
    detail: "Revisou 3 tópicos atrasados",
    duration: "30 min",
    subject: "Vários",
    color: "bg-purple-500"
  }
];

const historyData = generateHistory();

export default function History() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const displayedHistory = currentUser.plan === 'free' ? historyData.slice(0, 4) : historyData; // Limit to ~4 items (simulating 7 days or less)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Histórico</h2>
          <p className="text-muted-foreground">Registro completo de suas atividades de estudo.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative flex-1 w-full">
           <Input placeholder="Buscar por tópico, disciplina..." className="pl-10" />
           <HistoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Disciplina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Disciplinas</SelectItem>
            {mockSubjects.map(subject => (
              <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="study">Estudo Teórico</SelectItem>
            <SelectItem value="exercise">Questões</SelectItem>
            <SelectItem value="revision">Revisão</SelectItem>
            <SelectItem value="quiz">Simulados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
        {displayedHistory.map((item, index) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* Icon */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 border-background shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
              item.type === 'study' ? 'bg-blue-100 border-blue-200 text-blue-600' :
              item.type === 'exercise' ? 'bg-green-100 border-green-200 text-green-600' :
              item.type === 'quiz' ? 'bg-amber-100 border-amber-200 text-amber-600' :
              item.type === 'revision' ? 'bg-purple-100 border-purple-200 text-purple-600' :
              'bg-gray-100 border-gray-200 text-gray-600'
            )}>
              {item.type === 'study' && <BookOpen className="w-5 h-5" />}
              {item.type === 'exercise' && <CheckCircle2 className="w-5 h-5" />}
              {item.type === 'quiz' && <Trophy className="w-5 h-5" />}
              {item.type === 'revision' && <HistoryIcon className="w-5 h-5" />}
              {item.type === 'plan' && <FileText className="w-5 h-5" />}
            </div>
            
            {/* Card */}
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-0 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border/60">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-normal h-5">
                      {item.date} • {item.time}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px] h-5", 
                      item.type === 'study' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                      item.type === 'exercise' ? 'text-green-600 border-green-200 bg-green-50' :
                      'text-gray-600'
                    )}>
                      {item.subject}
                    </Badge>
                  </div>
                  {item.score && (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-[10px] h-5">
                      Nota: {item.score}
                    </Badge>
                  )}
                  {item.duration && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {currentUser.plan === 'free' && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
          <div className="p-3 bg-muted rounded-full">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-semibold">Histórico Limitado</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              No plano Free, você vê apenas as atividades recentes. Faça upgrade para acessar seu histórico completo de estudos.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowPremiumModal(true)}>
            Ver Histórico Completo
          </Button>
        </div>
      )}

      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal}
        title="Histórico Completo"
        description="Acesse cada detalhe da sua jornada. O histórico completo permite identificar padrões e melhorar sua constância."
        features={[
          "Histórico Ilimitado",
          "Exportação em PDF",
          "Filtros Avançados",
          "Análise de Constância"
        ]}
      />
    </div>
  );
}
