import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Link } from "wouter";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Play, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScheduleTask } from "@/types/dashboard";

interface TodaysScheduleProps {
  tasks: ScheduleTask[];
  subjects: Array<{ id: number; name: string }>;
  onStartSession: (task: ScheduleTask) => void;
}

export function TodaysSchedule({ tasks, subjects, onStartSession }: TodaysScheduleProps) {
  const { toast } = useToast();
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    subject: "",
    topic: "",
    duration: "30m"
  });

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Cronograma de Hoje
        </h3>
        <Link href="/schedule">
          <Button
            variant="ghost"
            className="text-sm text-primary hover:text-primary/80"
          >
            Ver completo <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card
              className={`border-l-4 transition-all group hover:shadow-md ${
                task.status === 'completed'
                  ? 'border-l-emerald-500 bg-emerald-500/5 opacity-70 hover:opacity-100'
                  : task.status === 'active'
                  ? 'border-l-primary bg-card ring-1 ring-primary/15'
                  : 'border-l-muted bg-card'
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full transition-colors ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-semibold text-foreground ${
                        task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {task.subject}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {task.topic} • {task.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      task.status === 'completed'
                        ? 'secondary'
                        : task.status === 'active'
                        ? 'default'
                        : 'outline'
                    }
                    className="transition-colors"
                  >
                    {task.time}
                  </Badge>
                  {task.status === 'active' && (
                    <Button
                      size="sm"
                      className="gap-2 transition-transform hover:scale-105"
                      onClick={() => onStartSession(task)}
                    >
                      <Play className="w-3 h-3" /> Iniciar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary/50"
            >
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
                  onValueChange={(val) => setNewActivity({ ...newActivity, subject: val })}
                  value={newActivity.subject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
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
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, topic: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duração</Label>
                <Select
                  onValueChange={(val) => setNewActivity({ ...newActivity, duration: val })}
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
              <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddActivity}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.section>
  );
}
