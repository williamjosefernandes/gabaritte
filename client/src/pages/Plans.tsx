import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Clock, 
  BookOpen, 
  GraduationCap,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { currentUser } from "@/lib/mockData";

const plans = [
  {
    id: 1,
    name: "Concurso Receita Federal",
    category: "Concurso Público",
    startDate: "01 Jan 2025",
    endDate: "15 Dez 2025",
    routineType: "specific",
    dailyWorkload: "4h",
    progress: 35,
    subjects: 12,
    color: "bg-primary",
    icon: FileText,
    edital: "Edital 2025/01",
    cargo: "Auditor Fiscal"
  },
  {
    id: 2,
    name: "Pós-Graduação em Direito",
    category: "Faculdade",
    startDate: "01 Fev 2025",
    endDate: "30 Jun 2026",
    routineType: "workload",
    dailyWorkload: "2h",
    progress: 60,
    subjects: 5,
    color: "bg-emerald-500",
    icon: GraduationCap
  },
  {
    id: 3,
    name: "Inglês Fluente",
    category: "Idiomas",
    startDate: "01 Mar 2025",
    endDate: "Indefinido",
    routineType: "workload",
    dailyWorkload: "1h",
    progress: 15,
    subjects: 3,
    color: "bg-amber-500",
    icon: BookOpen
  },
];

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

export default function Plans() {
  const [, setLocation] = useLocation();
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleDelete = (id: number) => {
    console.log("Deleting plan", id);
    setPlanToDelete(null);
    // logic to update state would go here
  };

  const handleCreatePlan = () => {
    if (currentUser.plan === 'free' && plans.length >= 2) {
      setShowPremiumModal(true);
    } else {
      setLocation("/plans/new");
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Meus Planos</h2>
          <p className="text-muted-foreground">Gerencie suas metas e acompanhe seu progresso.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4" /> Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div variants={item} key={plan.id}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${plan.color} bg-opacity-10 text-white mb-3`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.color}`}>
                       <plan.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLocation(`/plans/edit/${plan.id}`)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setPlanToDelete(plan.id)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">{plan.category}</Badge>
                    {plan.cargo && (
                       <Badge variant="outline" className="mb-2 text-xs font-normal">{plan.cargo}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.edital && (
                    <p className="text-xs text-muted-foreground">Ref: {plan.edital}</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso Geral</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Término</span>
                    </div>
                    <span className="font-medium text-foreground ml-6">{plan.endDate}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">{plan.routineType === 'specific' ? 'Rotina' : 'Meta Diária'}</span>
                    </div>
                    <span className="font-medium text-foreground ml-6">{plan.dailyWorkload}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={() => setLocation(`/plans/${plan.id}`)}
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        
        <motion.div variants={item}>
          <button 
            className="w-full h-full min-h-[280px] border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
            onClick={handleCreatePlan}
          >
            <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Criar Novo Plano</h3>
              <p className="text-sm">Comece uma nova jornada de estudos</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Premium Upsell Modal */}
      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal}
        title="Limite do Plano Free Atingido"
        description="No plano Free, você pode ter apenas 2 planos ativos. Para criar planos ilimitados e acessar todos os recursos, faça um upgrade."
        features={[
          "Planos e Disciplinas Ilimitadas",
          "Cronograma Inteligente com IA",
          "Acesso a Trilhas Exclusivas"
        ]}
      />

      <AlertDialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o plano e todo o seu histórico de progresso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => planToDelete && handleDelete(planToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </motion.div>
  );
}