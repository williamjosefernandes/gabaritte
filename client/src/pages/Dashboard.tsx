import { useState } from "react";
import { 
  Play, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  MoreVertical,
  TrendingUp,
  ArrowRight,
  Zap,
  Trophy,
  Target,
  BookOpen,
  Activity,
  Plus,
  Sparkles,
  Loader2,
  BrainCircuit,
  Lightbulb,
  ArrowUpRight
} from "lucide-react";
import { activePlan, todaysSchedule, stats, recentActivity, userProfile, mockSubjects, currentUser } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import heroBg from "@assets/hero-bg.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { StudySessionDialog } from "@/components/study/StudySessionDialog";
import { useToast } from "@/hooks/use-toast";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const { toast } = useToast();
  const [isStudySessionOpen, setIsStudySessionOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    subject: { name: string; color?: string };
    topic: { name: string };
    subtopic?: { name: string };
  } | null>(null);

  // Add Activity State
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ subject: "", topic: "", duration: "30m" });

  // AI Mentor State
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiStep, setAiStep] = useState<'analyzing' | 'result'>('analyzing');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleStartSession = (task?: any) => {
    // If no task provided, pick the first active one or a default
    const targetTask = task || todaysSchedule.find(t => t.status === 'active') || {
      subject: "Direito Constitucional",
      topic: "Controle de Constitucionalidade",
      type: "theory"
    };

    setActiveSession({
      subject: { 
        name: targetTask.subject, 
        color: 'bg-blue-500' // Mock color logic
      },
      topic: { name: targetTask.topic },
      subtopic: undefined
    });
    setIsStudySessionOpen(true);
  };

  const handleAddActivity = () => {
    if (!newActivity.subject || !newActivity.topic) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a disciplina e o tópico.",
        variant: "destructive"
      });
      return;
    }

    setIsAddActivityOpen(false);
    toast({
      title: "Atividade adicionada",
      description: `${newActivity.subject} - ${newActivity.topic} foi agendado para hoje.`,
    });
    setNewActivity({ subject: "", topic: "", duration: "30m" });
  };

  const handleOpenAiMentor = () => {
    if (currentUser.plan === 'free') {
      // Show upsell for full AI features, or allow basic?
      // Requirement says "Sugestões da IA (Nível básico)". 
      // I'll let them open it but maybe show a "Basic Mode" badge inside, or restrict some options.
      // For now, I'll just let it open but maybe add a premium block inside the result.
    }
    setIsAiDialogOpen(true);
    setAiStep('analyzing');
    
    // Simulate AI analysis time
    setTimeout(() => {
      setAiStep('result');
    }, 3000);
  };

  const handleApplyAiChanges = () => {
    setIsAiDialogOpen(false);
    toast({
      title: "Rotina Otimizada",
      description: "As sugestões do Mentor IA foram aplicadas ao seu cronograma.",
      action: <Sparkles className="w-5 h-5 text-yellow-400" />
    });
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Hero */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
                <Link href="/profile">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 cursor-pointer hover:border-white/60 transition-colors">
                      <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div>
                    <Link href="/profile" className="hover:underline decoration-white/50">
                      <h2 className="text-3xl md:text-4xl font-display font-bold">
                      Olá, {userProfile.name.split(' ')[0]}! 👋
                      </h2>
                    </Link>
                    <div className="text-sm text-primary-foreground/80 flex items-center gap-2">
                        <span>Nível {userProfile.level}</span>
                        <div className="w-24 h-1.5 bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${(userProfile.xp / userProfile.nextLevelXp) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="text-primary-foreground/90 text-lg">
              Você já completou <span className="font-bold">{stats.monthlyProgress}%</span> da sua meta mensal. 
              Continue focado no plano <strong>{activePlan.name}</strong>!
            </p>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="secondary" 
                className="gap-2 font-semibold transition-transform hover:scale-[1.02]"
                onClick={() => handleStartSession()}
              >
                <Play className="w-4 h-4 fill-current" />
                Continuar Estudando
              </Button>
              <Link href="/schedule">
                <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10">
                    Ver Cronograma
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Overview Cards */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[140px] text-center transform transition-transform hover:scale-[1.03]">
                <div className="flex justify-center mb-2">
                <div className="p-2 bg-yellow-400/20 rounded-full">
                    <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                </div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-xs text-white/80 font-medium">Dias de ofensiva</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[140px] text-center transform transition-transform hover:scale-[1.03]">
                <div className="flex justify-center mb-2">
                <div className="p-2 bg-emerald-400/20 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                </div>
                <div className="text-2xl font-bold">{stats.questionsSolved}</div>
                <div className="text-xs text-white/80 font-medium">Questões</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Schedule & Active Plan */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Schedule */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Cronograma de Hoje
              </h3>
              <Link href="/schedule">
                <Button variant="ghost" className="text-sm text-primary hover:text-primary/80">Ver completo <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </div>
            
            <div className="grid gap-4">
              {todaysSchedule.map((task) => (
                <Card key={task.id} className={`border-l-4 transition-all group hover:-translate-y-0.5 ${task.status === 'completed' ? 'border-l-emerald-500 bg-emerald-500/5 opacity-70 hover:opacity-100' : task.status === 'active' ? 'border-l-primary bg-card ring-1 ring-primary/15' : 'border-l-muted bg-card'}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full transition-colors ${task.status === 'completed' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                        {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.subject}</h4>
                        <p className="text-sm text-muted-foreground">{task.topic} • {task.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={task.status === 'completed' ? 'secondary' : task.status === 'active' ? 'default' : 'outline'} className="transition-colors">
                        {task.time}
                      </Badge>
                      {task.status === 'active' && (
                        <Button 
                          size="sm" 
                          className="gap-2 transition-transform hover:scale-[1.03]"
                          onClick={() => handleStartSession(task)}
                        >
                          <Play className="w-3 h-3" /> Iniciar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary/50">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar atividade extra
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Atividade Extra</DialogTitle>
                    <DialogDescription>
                      Insira uma atividade de estudo não planejada para hoje.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Disciplina</Label>
                      <Select 
                        onValueChange={(val) => setNewActivity({...newActivity, subject: val})}
                        value={newActivity.subject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSubjects.map(s => (
                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="topic">Tópico</Label>
                      <Input 
                        id="topic" 
                        placeholder="Ex: Resolução de Questões" 
                        value={newActivity.topic}
                        onChange={(e) => setNewActivity({...newActivity, topic: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duração</Label>
                      <Select 
                        onValueChange={(val) => setNewActivity({...newActivity, duration: val})}
                        value={newActivity.duration}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30m">30 minutos</SelectItem>
                          <SelectItem value="1h">1 hora</SelectItem>
                          <SelectItem value="1.5h">1 hora e 30 min</SelectItem>
                          <SelectItem value="2h">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddActivity}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </motion.section>

          {/* Active Plan Progress */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progresso: {activePlan.name}
              </h3>
              <Link href="/plans">
                <Button variant="ghost" size="sm">Gerenciar Planos</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="md:col-span-2 overflow-hidden bg-gradient-to-b from-card to-primary/5 ring-1 ring-primary/10 transition-transform hover:scale-[1.01]">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Progresso Geral</p>
                                <div className="text-3xl font-bold text-primary">{activePlan.progress}%</div>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary" className="mb-1 bg-primary/10 text-primary">
                                    <CalendarIcon className="w-3 h-3 mr-1" /> Prazo: {new Date(activePlan.deadline).toLocaleDateString('pt-BR')}
                                </Badge>
                                <p className="text-xs text-muted-foreground">Faltam 18 dias</p>
                            </div>
                        </div>
                        <Progress value={activePlan.progress} className="h-3" />
                    </CardContent>
                </Card>

                {activePlan.subjects.slice(0, 4).map((subject, index) => (
                    <Card key={index} className="group transition-all cursor-pointer hover:-translate-y-0.5">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-2 h-8 rounded-full ${subject.color}`}></div>
                                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">{subject.progress}%</span>
                            </div>
                            <h4 className="font-semibold mb-1 line-clamp-1">{subject.name}</h4>
                            <Progress value={subject.progress} className="h-1.5" />
                        </CardContent>
                    </Card>
                ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <motion.section variants={item}>
             <Card className="bg-card border-border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Acesso Rápido</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                    <Link href="/plans/new">
                        <Button variant="outline" className="w-full h-auto flex-col py-3 gap-2 hover:bg-muted/60 transition-transform hover:scale-[1.02]">
                            <Target className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium">Novo Plano</span>
                        </Button>
                    </Link>
                    <Link href="/subjects">
                        <Button variant="outline" className="w-full h-auto flex-col py-3 gap-2 hover:bg-muted/60 transition-transform hover:scale-[1.02]">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium">Disciplinas</span>
                        </Button>
                    </Link>
                    <Link href="/stats">
                        <Button variant="outline" className="w-full h-auto flex-col py-3 gap-2 hover:bg-muted/60 transition-transform hover:scale-[1.02]">
                            <Activity className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium">Estatísticas</span>
                        </Button>
                    </Link>
                    <Link href="/history">
                        <Button variant="outline" className="w-full h-auto flex-col py-3 gap-2 hover:bg-muted/60 transition-transform hover:scale-[1.02]">
                            <Trophy className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium">Conquistas</span>
                        </Button>
                    </Link>
                </CardContent>
             </Card>
          </motion.section>

          {/* Recent Activity */}
          <motion.section variants={item}>
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Atividade Recente</h3>
                <Link href="/history">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowRight className="w-4 h-4" /></Button>
                </Link>
             </div>
             <Card className="overflow-hidden">
               <CardContent className="p-0">
                 {recentActivity.map((activity, index) => (
                   <div key={activity.id} className={`p-4 flex gap-4 items-start transition-all ${index !== recentActivity.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 hover:-translate-y-0.5`}>
                     <div className="mt-1">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${activity.type === 'study' ? 'bg-primary' : activity.type === 'quiz' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                     </div>
                     <div className="flex-1">
                       <p className="text-sm font-medium">{activity.title}</p>
                       <div className="flex justify-between items-center mt-1">
                         <span className="text-xs text-muted-foreground">{activity.time}</span>
                         <div className="flex items-center gap-2">
                           {activity.score && <Badge variant="outline" className="text-[10px] h-5">{activity.score}</Badge>}
                           {activity.duration && <Badge variant="secondary" className="text-[10px] h-5">{activity.duration}</Badge>}
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
          </motion.section>

          {/* Upgrade CTA */}
          <motion.section variants={item}>
            <Card 
              className="bg-gradient-to-br from-primary to-purple-700 text-white border-none overflow-hidden relative shadow-xl group cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={handleOpenAiMentor}
            >
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl transition-all group-hover:bg-white/20"></div>
               <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transition-all group-hover:bg-white/20"></div>
               
               <CardHeader className="relative z-10">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    IA Mentor ✨
                 </CardTitle>
                 <CardDescription className="text-white/80">
                    Receba recomendações personalizadas baseadas no seu desempenho.
                 </CardDescription>
               </CardHeader>
               <CardContent className="relative z-10 pt-0">
                 <Button 
                  className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                 >
                   Ativar Mentoria IA
                 </Button>
               </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>

      <StudySessionDialog 
        open={isStudySessionOpen} 
        onOpenChange={setIsStudySessionOpen} 
        sessionData={activeSession} 
      />

      {/* AI Mentor Dialog */}
      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="sm:max-w-md">
           <AnimatePresence mode="wait">
             {aiStep === 'analyzing' ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-10 text-center space-y-6"
                >
                   <div className="relative">
                     <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                     <BrainCircuit className="w-16 h-16 text-primary animate-pulse relative z-10" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-xl font-bold">Analisando seu Desempenho...</h3>
                     <p className="text-muted-foreground max-w-xs mx-auto">
                       A IA está verificando seus pontos fracos em Direito Constitucional e otimizando seu tempo de revisão.
                     </p>
                   </div>
                   <div className="w-full max-w-xs space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processando dados</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-1.5 w-full" />
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 py-2"
                >
                   <DialogHeader>
                     <DialogTitle className="flex items-center gap-2 text-xl">
                       <Sparkles className="w-5 h-5 text-yellow-500" /> 
                       Sugestões do Mentor IA
                     </DialogTitle>
                     <DialogDescription>
                       Encontramos 3 oportunidades de melhoria para sua rotina de hoje.
                     </DialogDescription>
                   </DialogHeader>

                   <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg flex gap-3">
                         <div className="mt-0.5 p-1.5 bg-blue-100 dark:bg-blue-800 rounded-full h-fit">
                           <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                         </div>
                         <div>
                           <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Reforço em Constitucional</h4>
                           <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">Adicionado 30min de teoria focada em "Direitos Sociais" devido aos erros recentes.</p>
                         </div>
                      </div>

                      {currentUser.plan === 'free' ? (
                        <div className="relative overflow-hidden rounded-lg border border-dashed bg-muted/30 p-4">
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px] z-10">
                             <Lock className="w-5 h-5 text-muted-foreground mb-2" />
                             <p className="text-xs font-medium text-muted-foreground mb-2 text-center">Sugestões Avançadas Bloqueadas</p>
                             <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowPremiumModal(true)}>
                               Premium
                             </Button>
                          </div>
                          <div className="flex gap-3 opacity-40">
                             <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-800 rounded-full h-fit">
                               <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                             </div>
                             <div>
                               <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Revisão Espaçada</h4>
                               <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Movido "Português: Crase" para amanhã para otimizar a curva de esquecimento.</p>
                             </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-lg flex gap-3">
                             <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-800 rounded-full h-fit">
                               <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                             </div>
                             <div>
                               <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Revisão Espaçada</h4>
                               <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Movido "Português: Crase" para amanhã para otimizar a curva de esquecimento.</p>
                             </div>
                          </div>

                          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-lg flex gap-3">
                             <div className="mt-0.5 p-1.5 bg-green-100 dark:bg-green-800 rounded-full h-fit">
                               <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-300" />
                             </div>
                             <div>
                               <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">Meta de Questões Aumentada</h4>
                               <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">Sugerimos aumentar sua meta diária para 25 questões hoje.</p>
                             </div>
                          </div>
                        </>
                      )}
                   </div>

                    <DialogFooter>
                     <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>Ignorar</Button>
                     <Button onClick={handleApplyAiChanges} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                       <Sparkles className="w-4 h-4" /> Aplicar {currentUser.plan === 'free' ? 'Básico' : 'Otimizações'}
                     </Button>
                   </DialogFooter>
                </motion.div>
             )}
           </AnimatePresence>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
