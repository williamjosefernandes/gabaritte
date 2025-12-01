import { useState } from "react";
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Medal, 
  Star, 
  Zap, 
  TrendingUp, 
  BookOpen,
  Clock,
  Share2,
  Edit,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userProfile as initialUserProfile, stats as initialStats, activePlan, recentActivity } from "@/lib/mockData";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Scale, Target } from "lucide-react";

const achievements = [
  { id: 1, name: "Primeiros Passos", description: "Completou 5 dias seguidos de estudo", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: 2, name: "Mestre da Lei", description: "Finalizou o módulo de Direito Constitucional", icon: Scale, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 3, name: "Implacável", description: "30 dias de ofensiva", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: 4, name: "Devorador de Questões", description: "Resolveu 1000 questões", icon: Target, color: "text-red-500", bg: "bg-red-500/10" },
];

export default function Profile() {
  const { toast } = useToast();
  
  // Local state for simulating updates
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [stats, setStats] = useState(initialStats);
  
  const [isEditGamificationOpen, setIsEditGamificationOpen] = useState(false);
  const [gamificationForm, setGamificationForm] = useState({
    level: initialUserProfile.level,
    xp: initialUserProfile.xp,
    streak: initialStats.streak,
    questions: initialStats.questionsSolved
  });

  const handleSaveGamification = () => {
    // Update local state to reflect changes immediately in the UI
    setUserProfile({
      ...userProfile,
      level: parseInt(gamificationForm.level.toString()),
      xp: parseInt(gamificationForm.xp.toString())
    });
    
    setStats({
      ...stats,
      streak: parseInt(gamificationForm.streak.toString()),
      questionsSolved: parseInt(gamificationForm.questions.toString())
    });

    setIsEditGamificationOpen(false);
    
    toast({
      title: "Progresso Atualizado!",
      description: "Seu Nível e Ofensiva foram ajustados com sucesso.",
      action: <Zap className="w-5 h-5 text-yellow-500" />
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="h-32 bg-gradient-to-r from-primary to-primary/60 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none gap-2">
              <Share2 className="w-4 h-4" /> Compartilhar
            </Button>
            
            {/* Edit Gamification Dialog (Hidden feature for "Registrar Nível") */}
            <Dialog open={isEditGamificationOpen} onOpenChange={setIsEditGamificationOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none gap-2">
                  <Trophy className="w-4 h-4" /> Ajustar Nível
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Progresso Manualmente</DialogTitle>
                  <DialogDescription>
                    Ajuste seu Nível, XP e Ofensiva para refletir seu progresso real (Modo de Edição).
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nível do Usuário</Label>
                      <Input 
                        type="number" 
                        value={gamificationForm.level} 
                        onChange={(e) => setGamificationForm({...gamificationForm, level: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>XP Atual</Label>
                      <Input 
                        type="number" 
                        value={gamificationForm.xp} 
                        onChange={(e) => setGamificationForm({...gamificationForm, xp: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dias de Ofensiva (Streak)</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          className="pl-9"
                          value={gamificationForm.streak} 
                          onChange={(e) => setGamificationForm({...gamificationForm, streak: parseInt(e.target.value) || 0})}
                        />
                        <Zap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Questões Resolvidas</Label>
                      <Input 
                        type="number" 
                        value={gamificationForm.questions} 
                        onChange={(e) => setGamificationForm({...gamificationForm, questions: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground flex gap-2 items-start">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-primary" />
                    <p>Alterações manuais impactam o cálculo de próximas conquistas e podem redefinir sua posição no ranking de amigos.</p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditGamificationOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSaveGamification}>Salvar Alterações</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link href="/settings">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none gap-2">
                <Edit className="w-4 h-4" /> Editar Perfil
              </Button>
            </Link>
          </div>
        </div>
        <CardContent className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 mb-6">
            <Avatar className="w-32 h-32 border-4 border-background shadow-md">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 mt-2 md:mt-0 md:mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold font-display">{userProfile.name}</h1>
                <Badge variant="secondary" className="w-fit">Nível {userProfile.level}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> São Paulo, SP</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Membro desde Jan 2024</span>
              </div>
            </div>
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>XP: {userProfile.xp}</span>
                <span className="text-muted-foreground">Próx: {userProfile.nextLevelXp}</span>
              </div>
              <Progress value={(userProfile.xp / userProfile.nextLevelXp) * 100} className="h-2" />
            </div>
          </div>

          <p className="text-muted-foreground max-w-2xl">
            Estudante dedicado focado em concursos da área fiscal e controle. 
            Atualmente se preparando para a Receita Federal. "A disciplina é a mãe do sucesso."
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Clock className="w-6 h-6 text-primary mb-2" />
                <span className="text-2xl font-bold">142h</span>
                <span className="text-xs text-muted-foreground">Horas Totais</span>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/5 border-orange-500/10">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Zap className="w-6 h-6 text-orange-500 mb-2" />
                <span className="text-2xl font-bold">{stats.streak}</span>
                <span className="text-xs text-muted-foreground">Dias Seguidos</span>
              </CardContent>
            </Card>
            <Card className="bg-green-500/5 border-green-500/10">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Target className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{stats.questionsSolved}</span>
                <span className="text-xs text-muted-foreground">Questões</span>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/10">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{stats.accuracy}%</span>
                <span className="text-xs text-muted-foreground">Precisão</span>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Conquistas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className={`p-3 rounded-full ${achievement.bg}`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-sm">Ver todas as conquistas</Button>
            </CardContent>
          </Card>

          {/* Activity Graph (Placeholder for now, could be reused from Stats) */}
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: 52 }).map((_, week) => (
                  <div key={week} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, day) => {
                      const active = Math.random() > 0.6;
                      const intensity = active ? (Math.random() > 0.5 ? "bg-primary" : "bg-primary/40") : "bg-muted";
                      return (
                        <div key={`${week}-${day}`} className={`w-3 h-3 rounded-sm ${intensity}`} title={`Week ${week}, Day ${day}`} />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 justify-end">
                <span>Menos</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted"></div>
                  <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                  <div className="w-3 h-3 rounded-sm bg-primary"></div>
                </div>
                <span>Mais</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Current Plan & Friends */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlan.color} bg-opacity-10 text-primary`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{activePlan.name}</h4>
                    <p className="text-xs text-muted-foreground">{activePlan.type}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span className="font-bold">{activePlan.progress}%</span>
                  </div>
                  <Progress value={activePlan.progress} className="h-2" />
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t">
                <h5 className="text-sm font-medium">Disciplinas em Foco</h5>
                {activePlan.subjects.slice(0, 3).map((subject, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${subject.color}`}></div>
                      <span>{subject.name}</span>
                    </div>
                    <span className="text-muted-foreground">{subject.progress}%</span>
                  </div>
                ))}
              </div>
              <Link href="/schedule">
                <Button className="w-full">Ir para o Cronograma</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amigos e Ranking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-primary w-4">1</div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm">Você</span>
                </div>
                <span className="font-mono font-bold text-sm">{userProfile.xp} XP</span>
              </div>
              {[
                { pos: 2, name: "Ana Clara", xp: 4200, avatar: null },
                { pos: 3, name: "João Pedro", xp: 3950, avatar: null },
                { pos: 4, name: "Mariana S.", xp: 3100, avatar: null },
              ].map((friend, idx) => (
                <div key={idx} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-muted-foreground w-4 text-center">{friend.pos}</div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{friend.name}</span>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">{friend.xp} XP</span>
                </div>
              ))}
              <Button variant="outline" className="w-full text-sm">Convidar Amigos</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}