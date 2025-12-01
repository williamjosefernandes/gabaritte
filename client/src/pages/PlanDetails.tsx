import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Clock, BookOpen, FileText, GraduationCap, Edit, Trash2 } from "lucide-react";
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
import { useState } from "react";

// Mock data (in a real app this would come from a store or API)
const mockPlan = {
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
  cargo: "Auditor Fiscal",
  observations: "Focar em Contabilidade e Direito Tributário nos primeiros meses."
};

export default function PlanDetails() {
  const [match, params] = useRoute("/plans/:id");
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // In a real app, fetch plan by ID
  const plan = mockPlan; 

  const handleDelete = () => {
    // Mock delete logic
    console.log("Deleting plan", plan.id);
    setLocation("/plans");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          className="w-fit pl-0 hover:bg-transparent hover:text-primary gap-2"
          onClick={() => setLocation("/plans")}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Planos
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${plan.color} bg-opacity-10 text-primary`}>
                <plan.icon className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{plan.category}</Badge>
                  {plan.cargo && <Badge variant="outline">{plan.cargo}</Badge>}
                </div>
                <h1 className="text-3xl font-display font-bold tracking-tight">{plan.name}</h1>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setLocation(`/plans/edit/${plan.id}`)}>
              <Edit className="w-4 h-4" /> Editar
            </Button>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o plano
                    <span className="font-semibold text-foreground"> {plan.name} </span>
                    e todo o seu histórico de progresso.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir Plano
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progresso do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso Geral</span>
                <span className="font-medium">{plan.progress}%</span>
              </div>
              <Progress value={plan.progress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-secondary/30 border text-center">
                <div className="text-2xl font-bold text-primary">{plan.subjects}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Disciplinas</div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border text-center">
                <div className="text-2xl font-bold text-primary">145</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tópicos</div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border text-center">
                <div className="text-2xl font-bold text-primary">32h</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Estudadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Período</p>
                  <p className="text-sm text-muted-foreground">{plan.startDate} - {plan.endDate}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Rotina</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.routineType === 'specific' ? 'Horários Fixos' : 'Meta Diária'} • {plan.dailyWorkload}
                  </p>
                </div>
              </div>

              {plan.edital && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Edital</p>
                    <p className="text-sm text-muted-foreground text-blue-500 hover:underline cursor-pointer">{plan.edital}</p>
                  </div>
                </div>
              )}
            </div>
            
            {plan.observations && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Observações</p>
                <p className="text-sm text-muted-foreground italic">"{plan.observations}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}