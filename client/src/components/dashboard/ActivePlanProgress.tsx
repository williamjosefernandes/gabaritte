import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import type { ActivePlan } from "@/types/dashboard";

interface ActivePlanProgressProps {
  plan: ActivePlan;
}

export function ActivePlanProgress({ plan }: ActivePlanProgressProps) {
  const daysRemaining = Math.ceil(
    (new Date(plan.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progresso: {plan.name}
        </h3>
        <Link href="/plans">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Gerenciar Planos
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 overflow-hidden bg-gradient-to-b from-card to-primary/5 ring-1 ring-primary/10 transition-transform hover:scale-[1.01]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progresso Geral</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-3xl font-bold text-primary"
                >
                  {plan.progress}%
                </motion.div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1 bg-primary/10 text-primary">
                  <CalendarIcon className="w-3 h-3 mr-1" /> Prazo:{' '}
                  {new Date(plan.deadline).toLocaleDateString('pt-BR')}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Faltam {daysRemaining} dias
                </p>
              </div>
            </div>
            <Progress value={plan.progress} className="h-3" />
          </CardContent>
        </Card>

        {plan.subjects.slice(0, 4).map((subject, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card className="group transition-all cursor-pointer hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-2 h-8 rounded-full ${subject.color}`} />
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {subject.progress}%
                  </span>
                </div>
                <h4 className="font-semibold mb-1 line-clamp-1 text-foreground">
                  {subject.name}
                </h4>
                <Progress value={subject.progress} className="h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
