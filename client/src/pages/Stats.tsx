import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { activePlan, currentUser, mockSubjects, stats } from "@/lib/mockData";
import { Target, TrendingUp, Award, Clock, BookOpen, Lock } from "lucide-react";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Generate weekly data based on a realistic study pattern
const weeklyData = [
  { name: 'Seg', hours: 4.5, goal: 4 },
  { name: 'Ter', hours: 3.0, goal: 4 },
  { name: 'Qua', hours: 5.2, goal: 4 },
  { name: 'Qui', hours: 4.8, goal: 4 },
  { name: 'Sex', hours: 2.5, goal: 4 },
  { name: 'Sáb', hours: 6.0, goal: 6 },
  { name: 'Dom', hours: 3.5, goal: 2 },
];

// Transform mockSubjects for Pie Chart
const subjectData = mockSubjects.map(subject => ({
  name: subject.name,
  value: subject.topics.length * 10, // Mock weight based on topics
  color: subject.color.replace('bg-', '').replace('-500', '') // Simplified color mapping
})).concat([
  { name: 'Raciocínio Lógico', value: 20, color: 'rose' },
  { name: 'Informática', value: 15, color: 'slate' },
  { name: 'Administrativo', value: 25, color: 'indigo' }
]);

// Helper for colors since we stored Tailwind classes
const getColorHex = (colorName: string) => {
  const colors: Record<string, string> = {
    'blue': '#3b82f6',
    'amber': '#f59e0b',
    'rose': '#f43f5e',
    'slate': '#64748b',
    'indigo': '#6366f1',
    'emerald': '#10b981',
    'purple': '#8b5cf6',
  };
  return colors[colorName] || '#3b82f6';
};

const progressData = [
  { date: '01/11', score: 65 },
  { date: '05/11', score: 68 },
  { date: '10/11', score: 72 },
  { date: '15/11', score: 70 },
  { date: '20/11', score: 75 },
  { date: '25/11', score: 82 },
];

export default function Stats() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // Calculate totals
  const totalHours = weeklyData.reduce((acc, curr) => acc + curr.hours, 0);
  const totalGoal = weeklyData.reduce((acc, curr) => acc + curr.goal, 0);
  const progressPercentage = Math.round((totalHours / totalGoal) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Estatísticas</h2>
          <p className="text-muted-foreground">Analise seu desempenho no plano <strong>{activePlan.name}</strong>.</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Estudadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground mt-1">
              {progressPercentage}% da meta semanal ({totalGoal}h)
            </p>
            <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questões</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsSolved}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-600">
              <TrendingUp className="w-3 h-3 mr-1" /> +145 essa semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Média geral em simulados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tópicos Concluídos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/86</div>
            <p className="text-xs text-muted-foreground mt-1">
              28% do edital coberto
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 relative overflow-hidden">
          {currentUser.plan === 'free' && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Análise Detalhada de Tempo</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Visualize exatamente como você gasta seu tempo e otimize sua rotina com o Premium.
              </p>
              <Button size="sm" onClick={() => setShowPremiumModal(true)}>
                Desbloquear Estatísticas
              </Button>
            </div>
          )}
          <CardHeader>
            <CardTitle>Tempo de Estudo vs Meta</CardTitle>
            <CardDescription>Comparativo diário da última semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}h`} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="hours" name="Realizado" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="goal" name="Meta" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Disciplina</CardTitle>
            <CardDescription>Foco de estudo nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorHex(entry.color)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {subjectData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(entry.color) }}></div>
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 relative overflow-hidden">
          {currentUser.plan === 'free' && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Evolução de Desempenho</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Acompanhe sua evolução em simulados e receba previsões de aprovação com o Premium.
              </p>
              <Button size="sm" onClick={() => setShowPremiumModal(true)}>
                Desbloquear Gráficos Avançados
              </Button>
            </div>
          )}
          <CardHeader>
            <CardTitle>Evolução de Desempenho</CardTitle>
            <CardDescription>Taxa de acertos em simulados ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[50, 100]}
                    tickFormatter={(value) => `${value}%`} 
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal}
        title="Estatísticas Avançadas"
        description="Desbloqueie insights poderosos sobre seu estudo. Saiba exatamente onde melhorar para ser aprovado mais rápido."
        features={[
          "Comparativo de Tempo vs Meta",
          "Análise de Desempenho por Matéria",
          "Gráfico de Evolução de Notas",
          "Previsão de Aprovação com IA"
        ]}
      />
    </div>
  );
}
