import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal, 
  Play, 
  RotateCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Layers,
  Filter,
  Plus,
  Pencil,
  Trash2,
  GanttChart,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { activePlan, mockSubjects } from "@/lib/mockData";
import { StudySessionDialog } from "@/components/study/StudySessionDialog";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { currentUser } from "@/lib/mockData";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { Lock } from "lucide-react";

// Weekly Calendar Mock Data
const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const timeSlots = [
  { label: "Manhã", hours: "08:00 - 12:00" },
  { label: "Tarde", hours: "14:00 - 18:00" },
  { label: "Noite", hours: "19:00 - 22:00" }
];

// Initial Schedule State
const initialSchedule = {
  "Seg": {
    "Manhã": { id: 1, subject: "Direito Constitucional", topic: "Direitos Fundamentais", type: "theory", duration: "2h" },
    "Noite": { id: 2, subject: "Português", topic: "Crase", type: "exercise", duration: "1h" }
  },
  "Qua": {
    "Manhã": { id: 3, subject: "Contabilidade", topic: "Balanço Patrimonial", type: "theory", duration: "2h" },
    "Tarde": { id: 4, subject: "Raciocínio Lógico", topic: "Proposições", type: "exercise", duration: "1.5h" }
  },
  "Sex": {
    "Manhã": { id: 5, subject: "Direito Administrativo", topic: "Atos Administrativos", type: "revision", duration: "1h" }
  }
};

// Timeline Mock Data
const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
const weekDaysTimeline = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function Schedule() {
  const [schedule, setSchedule] = useState<any>(initialSchedule);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar");
  const [timelineScale, setTimelineScale] = useState<"year" | "month" | "week">("year");
  
  // Study Session State
  const [isStudySessionOpen, setIsStudySessionOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    subject: { name: string; color?: string };
    topic: { name: string };
    subtopic?: { name: string };
  } | null>(null);

  // Add/Edit Task Dialog State
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedSlot, setSelectedSlot] = useState<{day: string, time: string} | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    type: "theory",
    duration: "1h",
    topic: ""
  });

  // Task Details Popover State
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleStartSession = (task: any) => {
    setActiveSession({
      subject: { 
        name: task.subject, 
        color: task.type === 'theory' ? 'bg-blue-500' : task.type === 'exercise' ? 'bg-green-500' : task.type === 'revision' ? 'bg-amber-500' : 'bg-red-500' 
      },
      topic: { name: task.topic },
      subtopic: undefined
    });
    setIsStudySessionOpen(true);
    setIsDetailsOpen(false);
  };

  const handleSlotClick = (day: string, time: string) => {
    const existingTask = schedule[day]?.[time];
    if (existingTask) {
      // Open Details Popover instead of starting immediately
      // Note: In a real app, we'd position this better or use a modal
      setSelectedTask({...existingTask, day, time});
      setIsDetailsOpen(true);
    } else {
      // Open Add Dialog
      setDialogMode("add");
      setSelectedSlot({ day, time });
      setFormData({ subject: "", type: "theory", duration: "1h", topic: "" });
      setIsTaskDialogOpen(true);
    }
  };

  const handleSaveTask = () => {
    if (!selectedSlot || !formData.subject) return;
    
    const subject = mockSubjects.find(s => s.name === formData.subject);
    const topicName = formData.topic || (subject ? subject.topics[0]?.name : "Geral");

    const newTask = {
      id: dialogMode === 'edit' ? selectedTask.id : Date.now(),
      subject: formData.subject,
      topic: topicName,
      type: formData.type,
      duration: formData.duration
    };

    setSchedule({
      ...schedule,
      [selectedSlot.day]: {
        ...schedule[selectedSlot.day],
        [selectedSlot.time]: newTask
      }
    });
    
    setIsTaskDialogOpen(false);
    setIsDetailsOpen(false);
  };

  const handleEditTask = () => {
    if (!selectedTask) return;
    setDialogMode("edit");
    setSelectedSlot({ day: selectedTask.day, time: selectedTask.time });
    setFormData({
      subject: selectedTask.subject,
      type: selectedTask.type,
      duration: selectedTask.duration,
      topic: selectedTask.topic
    });
    setIsDetailsOpen(false);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    const newSchedule = { ...schedule };
    if (newSchedule[selectedTask.day]) {
      delete newSchedule[selectedTask.day][selectedTask.time];
    }
    setSchedule(newSchedule);
    setIsDetailsOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "theory": return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
      case "exercise": return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
      case "revision": return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Cronograma</h2>
          <p className="text-muted-foreground">Gerencie sua rotina e visualize seu progresso.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center overflow-x-auto pb-2 sm:pb-0">
          {viewMode === "calendar" && (
            <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border shrink-0">
              <Button variant="ghost" size="icon" onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 7);
                setSelectedDate(newDate);
              }}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 font-medium min-w-[120px] sm:min-w-[140px] justify-center text-sm hover:bg-background h-8">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="capitalize">
                      {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="icon" onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 7);
                setSelectedDate(newDate);
              }}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2 shrink-0">
            <div className="bg-muted/30 p-1 rounded-lg border flex gap-1 mr-2">
              <Button 
                variant={viewMode === "calendar" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("calendar")}
                className="gap-2 text-xs h-8"
              >
                <CalendarIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Semanal</span>
              </Button>
              <Button 
                variant={viewMode === "timeline" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => {
                  if (currentUser.plan === 'free') {
                    setShowPremiumModal(true);
                  } else {
                    setViewMode("timeline");
                  }
                }}
                className="gap-2 text-xs h-8"
              >
                {currentUser.plan === 'free' && <Lock className="w-3 h-3 text-muted-foreground" />}
                <GanttChart className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Linha do Tempo</span>
              </Button>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="shrink-0"
              onClick={() => setSchedule(initialSchedule)}
              title="Resetar"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => {
               setDialogMode("add");
               // Default to Monday Morning if adding globally
               setSelectedSlot({ day: "Seg", time: "Manhã" });
               setFormData({ subject: "", type: "theory", duration: "1h", topic: "" });
               setIsTaskDialogOpen(true);
            }}>
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Adicionar</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Sidebar */}
          <Card className="lg:col-span-1 flex flex-col h-[300px] lg:h-full overflow-hidden border-muted shadow-sm order-last lg:order-first">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Conteúdos
              </CardTitle>
            </CardHeader>
            <Tabs defaultValue="plans" className="flex-1 flex flex-col min-h-0">
              <div className="px-4 pt-4">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="plans">Planos</TabsTrigger>
                  <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="plans" className="flex-1 overflow-hidden p-0 mt-2">
                <ScrollArea className="h-full px-4 pb-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${activePlan.color || 'bg-primary'} bg-opacity-10 text-primary`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{activePlan.name}</h4>
                          <p className="text-xs text-muted-foreground">{activePlan.type}</p>
                        </div>
                      </div>
                      <Progress value={activePlan.progress} className="h-1.5 mb-2" />
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{activePlan.subjects.length} disciplinas</span>
                        <span>{activePlan.dailyGoalHours}h/dia</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="subjects" className="flex-1 overflow-hidden p-0 mt-2">
                <div className="px-4 mb-2">
                  <div className="relative">
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      className="w-full bg-secondary/50 rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30"
                      placeholder="Filtrar disciplinas..."
                    />
                  </div>
                </div>
                <ScrollArea className="h-full px-4 pb-4">
                  <div className="space-y-2">
                    {mockSubjects.map((subject) => (
                      <div 
                        key={subject.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => {
                           setDialogMode("add");
                           setSelectedSlot({ day: "Seg", time: "Manhã" }); // Default slot
                           setFormData({ subject: subject.name, type: "theory", duration: "1h", topic: subject.topics[0]?.name || "" });
                           setIsTaskDialogOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${subject.color}`}></div>
                          <div>
                            <h4 className="font-medium text-sm">{subject.name}</h4>
                            <p className="text-xs text-muted-foreground">{subject.topics.length} tópicos restantes</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Calendar Grid */}
          <div className="lg:col-span-3 h-full overflow-hidden flex flex-col bg-background rounded-xl border shadow-sm relative">
            <ScrollArea className="h-full w-full" type="scroll">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 border-b bg-muted/20 sticky top-0 z-10">
                  <div className="p-4 border-r font-medium text-sm text-muted-foreground flex items-center justify-center bg-muted/20">
                    Horário
                  </div>
                  {weekDays.map((day) => (
                    <div key={day} className="p-3 text-center border-r last:border-r-0 bg-muted/20">
                      <span className="block text-sm font-semibold text-foreground">{day}</span>
                      <span className={`text-xs ${day === "Seg" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        {day === "Seg" ? "28" : day === "Ter" ? "29" : day === "Qua" ? "30" : day === "Qui" ? "31" : "01"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-rows-3 divide-y">
                  {timeSlots.map((slot) => (
                    <div key={slot.label} className="grid grid-cols-8 min-h-[140px]">
                      <div className="border-r p-4 flex flex-col items-center justify-center bg-muted/5 text-center sticky left-0">
                        <span className="font-semibold text-sm">{slot.label}</span>
                        <span className="text-xs text-muted-foreground mt-1">{slot.hours}</span>
                      </div>

                      {weekDays.map((day) => {
                        const task = schedule[day]?.[slot.label];
                        return (
                          <div 
                            key={`${day}-${slot.label}`} 
                            className="border-r last:border-r-0 p-2 relative group transition-colors hover:bg-muted/30"
                            onClick={() => handleSlotClick(day, slot.label)}
                          >
                            {task ? (
                              <div className={cn(
                                "h-full w-full rounded-lg p-2 flex flex-col gap-1 border cursor-pointer hover:shadow-md transition-all",
                                getTypeColor(task.type)
                              )}>
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">{task.subject.substring(0, 3)}</span>
                                  <MoreHorizontal className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="font-semibold text-xs line-clamp-2 leading-tight">
                                  {task.subject}
                                </p>
                                <p className="text-[10px] opacity-80 line-clamp-1">
                                  {task.topic}
                                </p>
                                <div className="mt-auto pt-1 flex items-center justify-between">
                                  <span className="text-[10px] flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {task.duration}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="h-full bg-background rounded-xl border shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-500">
          {/* Timeline Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm gap-4 sm:gap-0">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2">
                    <Filter className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Disciplinas</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Simulados</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Revisões</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
              <div className="flex items-center bg-muted/50 p-1 rounded-md border w-full sm:w-auto justify-between sm:justify-start">
                 <Button 
                   variant={timelineScale === 'year' ? "secondary" : "ghost"} 
                   size="sm" 
                   onClick={() => setTimelineScale('year')}
                   className="h-6 text-xs px-3 shadow-sm flex-1 sm:flex-none"
                 >
                   Ano
                 </Button>
                 <Button 
                   variant={timelineScale === 'month' ? "secondary" : "ghost"} 
                   size="sm" 
                   onClick={() => setTimelineScale('month')}
                   className="h-6 text-xs px-3 shadow-sm flex-1 sm:flex-none"
                 >
                   Mês
                 </Button>
                 <Button 
                   variant={timelineScale === 'week' ? "secondary" : "ghost"} 
                   size="sm" 
                   onClick={() => setTimelineScale('week')}
                   className="h-6 text-xs px-3 shadow-sm flex-1 sm:flex-none"
                 >
                   Semana
                 </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs sm:text-sm">Planejado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs sm:text-sm">Concluído</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs sm:text-sm">Revisão</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="min-w-[800px] h-full flex flex-col">
              {/* Timeline Header */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[280px_1fr] border-b bg-muted/30 h-14 shadow-sm z-10 sticky top-0">
                <div className="p-4 px-4 md:px-6 flex items-center font-semibold text-sm text-muted-foreground border-r bg-background/50 backdrop-blur-sm">
                  Conteúdo <span className="hidden md:inline">& Metas</span>
                </div>
                <div className="relative overflow-hidden bg-background/50 backdrop-blur-sm">
                   <div 
                      className={cn(
                        "grid w-full text-center h-full", 
                        timelineScale === 'year' ? "grid-cols-12" : 
                        timelineScale === 'month' ? "grid-cols-[repeat(30,minmax(0,1fr))]" : 
                        "grid-cols-7"
                      )}
                   >
                      {timelineScale === 'year' && months.map((month, idx) => (
                        <div key={idx} className="text-xs font-medium text-muted-foreground border-r last:border-r-0 h-full flex flex-col items-center justify-center group hover:bg-muted/20 transition-colors cursor-pointer">
                          <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors">{month}</span>
                          <span className="text-[10px] opacity-50 hidden md:block">2025</span>
                        </div>
                      ))}
                      {timelineScale === 'month' && daysInMonth.map((day, idx) => (
                        <div key={idx} className="text-xs font-medium text-muted-foreground border-r last:border-r-0 h-full flex flex-col items-center justify-center group hover:bg-muted/20 transition-colors cursor-pointer">
                          <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors">{day}</span>
                        </div>
                      ))}
                      {timelineScale === 'week' && weekDaysTimeline.map((day, idx) => (
                        <div key={idx} className="text-xs font-medium text-muted-foreground border-r last:border-r-0 h-full flex flex-col items-center justify-center group hover:bg-muted/20 transition-colors cursor-pointer">
                          <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors">{day}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Timeline Body */}
              <div className="flex-1 relative pb-20 min-h-[500px]">
                
                {/* Grid Background */}
                <div className="absolute inset-0 grid grid-cols-[140px_1fr] md:grid-cols-[280px_1fr] pointer-events-none h-full">
                  <div className="border-r bg-background/30"></div>
                  <div 
                    className={cn(
                      "grid h-full",
                      timelineScale === 'year' ? "grid-cols-12" : 
                      timelineScale === 'month' ? "grid-cols-[repeat(30,minmax(0,1fr))]" : 
                      "grid-cols-7"
                    )}
                  >
                    {timelineScale === 'year' && months.map((_, idx) => (
                       <div key={idx} className="border-r border-dashed border-slate-200 dark:border-slate-800 h-full"></div>
                    ))}
                    {timelineScale === 'month' && daysInMonth.map((_, idx) => (
                       <div key={idx} className="border-r border-dashed border-slate-200 dark:border-slate-800 h-full"></div>
                    ))}
                    {timelineScale === 'week' && weekDaysTimeline.map((_, idx) => (
                       <div key={idx} className="border-r border-dashed border-slate-200 dark:border-slate-800 h-full"></div>
                    ))}
                  </div>
                </div>

                {/* Active Plan Group */}
                <div className="relative z-20 mt-6 mb-2">
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[280px_1fr] group">
                     {/* Left Panel */}
                    <div className="p-2 md:p-3 md:px-6 border-r flex flex-col justify-center sticky left-0 bg-background/95 backdrop-blur-sm border-y border-l-4 border-l-blue-500 shadow-sm my-2 mx-2 rounded-r-lg rounded-l-sm">
                       <div className="flex items-center justify-between mb-1">
                         <div className="flex items-center gap-2">
                           <Badge variant="secondary" className="rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 text-[10px] md:text-xs">
                             <span className="md:hidden">Plano</span>
                             <span className="hidden md:inline">Plano Ativo</span>
                           </Badge>
                         </div>
                         <MoreHorizontal className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                       </div>
                       <span className="font-bold text-sm md:text-base text-foreground mt-1 truncate">{activePlan.name}</span>
                       <div className="flex items-center gap-4 mt-3">
                          <div className="hidden md:flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {String.fromCharCode(64+i)}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">12 disc.</span>
                       </div>
                    </div>

                    {/* Timeline Bar Area */}
                    <div className="relative h-32 py-4 px-2 flex items-center">
                      
                      {/* Main Bar */}
                      <div 
                        className="relative h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center px-1 text-white overflow-visible cursor-pointer group/bar hover:scale-[1.002] transition-transform"
                        style={{ left: "0%", width: "95%" }}
                      >
                        {/* Progress Fill */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
                        
                        <div className="absolute -top-8 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm opacity-0 group-hover/bar:opacity-100 transition-opacity translate-y-2 group-hover/bar:translate-y-0 duration-200 hidden md:block">
                          Início: 01 Jan
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-blue-600"></div>
                        </div>

                        <div className="absolute -top-8 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm opacity-0 group-hover/bar:opacity-100 transition-opacity translate-y-2 group-hover/bar:translate-y-0 duration-200 hidden md:block">
                          Fim: 15 Dez
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-indigo-600"></div>
                        </div>

                        <div className="flex items-center w-full px-4 z-10 justify-between">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md hidden md:block">
                               <Layers className="w-4 h-4 text-white" />
                             </div>
                             <div className="flex flex-col">
                               <span className="font-bold text-xs md:text-sm leading-none mb-0.5 truncate max-w-[100px] md:max-w-none">{activePlan.name}</span>
                               <span className="text-[10px] opacity-80 font-medium hidden md:inline">Geral</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="flex flex-col items-end">
                                <span className="text-xs font-bold">35%</span>
                                <span className="text-[10px] opacity-80 hidden md:inline">Concluído</span>
                             </div>
                             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                <Play className="w-3 h-3 md:w-4 md:h-4 fill-white" />
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Milestones - Hidden on small screens if needed or scaled */}
                      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[25%] w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-md z-20 items-center justify-center hover:scale-110 transition-transform cursor-pointer group/milestone" title="Simulado 1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-background border px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/milestone:opacity-100 transition-opacity z-50 pointer-events-none">
                           <p className="font-bold">1º Simulado Geral</p>
                           <p className="text-muted-foreground text-[10px]">15 Março</p>
                        </div>
                      </div>

                       <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[50%] w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-md z-20 items-center justify-center hover:scale-110 transition-transform cursor-pointer group/milestone" title="Revisão Semestral">
                        <RotateCcw className="w-3 h-3 text-amber-500" />
                         <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-background border px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/milestone:opacity-100 transition-opacity z-50 pointer-events-none">
                           <p className="font-bold">Revisão Semestral</p>
                           <p className="text-muted-foreground text-[10px]">01 Julho</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Subjects Group */}
                <div className="mt-8">
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[280px_1fr] mb-2 sticky top-0 z-20">
                    <div className="px-4 md:px-6 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-background/95 backdrop-blur-sm border-y flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="truncate">Disciplinas</span>
                    </div>
                    <div className="border-y bg-muted/10"></div>
                  </div>

                  {mockSubjects.map((subject, idx) => (
                    <div key={subject.id} className="group mb-1">
                       <div className="grid grid-cols-[140px_1fr] md:grid-cols-[280px_1fr] hover:bg-muted/5 transition-colors">
                          {/* Subject Info */}
                          <div className="p-2 md:p-3 md:px-6 border-r flex items-center justify-between sticky left-0 z-10 bg-background/80 backdrop-blur-sm group-hover:bg-background transition-colors border-l-2 border-l-transparent group-hover:border-l-primary">
                             <div className="flex items-center gap-3 overflow-hidden">
                               <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg ${subject.color} flex items-center justify-center shadow-sm text-white font-bold text-[10px] md:text-xs shrink-0`}>
                                 {subject.name.substring(0, 2).toUpperCase()}
                               </div>
                               <div className="flex flex-col min-w-0">
                                 <span className="text-xs md:text-sm font-medium text-foreground/90 truncate">{subject.name}</span>
                                 <span className="text-[10px] text-muted-foreground hidden md:inline">{subject.topics.length} tópicos</span>
                               </div>
                             </div>
                             <div className="flex flex-col items-end hidden md:flex">
                               <span className="text-xs font-bold">{subject.progress}%</span>
                             </div>
                          </div>

                          {/* Subject Timeline Bar */}
                          <div className="relative h-14 py-3 px-2">
                             <div 
                                className={cn(
                                  "relative h-full rounded-md flex items-center px-3 text-[10px] text-white overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer opacity-90 hover:opacity-100",
                                  subject.color
                                )}
                                style={{ 
                                  left: `${idx * 5}%`, 
                                  width: `${30 + (idx * 5)}%` 
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                                <span className="z-10 font-medium truncate w-full pr-8">{subject.name}</span>
                                
                                {/* Mini Progress Bar inside */}
                                <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
                                  <div className="h-full bg-white/50" style={{ width: `${subject.progress}%` }}></div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
                
                {/* Add New Button at Bottom */}
                 <div className="grid grid-cols-[140px_1fr] md:grid-cols-[280px_1fr] mt-4">
                   <div className="px-4 md:px-6">
                     <Button variant="outline" className="w-full border-dashed border-2 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-xs md:text-sm" onClick={() => {
                       setDialogMode("add");
                       setSelectedSlot({ day: "Seg", time: "Manhã" });
                       setFormData({ subject: "", type: "theory", duration: "1h", topic: "" });
                       setIsTaskDialogOpen(true);
                     }}>
                       <Plus className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Adicionar Nova Linha</span>
                       <span className="md:hidden">Add</span>
                     </Button>
                   </div>
                 </div>

              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      <StudySessionDialog 
        open={isStudySessionOpen} 
        onOpenChange={setIsStudySessionOpen} 
        sessionData={activeSession} 
      />

      {/* Task Actions Dialog (View Details) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Estudo</DialogTitle>
            <DialogDescription>
              Gerenciar atividade agendada para {selectedTask?.day} - {selectedTask?.time}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                <div className={cn("w-2 h-12 rounded-full", getTypeColor(selectedTask.type).split(' ')[0])}></div>
                <div>
                  <h4 className="font-semibold">{selectedTask.subject}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTask.topic}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedTask.duration} de duração</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="capitalize">{selectedTask.type === 'theory' ? 'Teoria' : selectedTask.type === 'exercise' ? 'Exercício' : 'Revisão'}</Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="destructive" size="icon" onClick={handleDeleteTask}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleEditTask}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => handleStartSession(selectedTask)} className="gap-2">
              <Play className="w-4 h-4" /> Iniciar Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Agendar Estudo' : 'Editar Estudo'}</DialogTitle>
            <DialogDescription>
              {selectedSlot && `${dialogMode === 'add' ? 'Adicionar' : 'Alterar'} conteúdo para ${selectedSlot.day} - ${selectedSlot.time}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select 
                value={formData.subject} 
                onValueChange={(val) => setFormData({...formData, subject: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tópico (Opcional)</Label>
              <Input 
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                placeholder="Ex: Direitos Fundamentais"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({...formData, type: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Teoria</SelectItem>
                    <SelectItem value="exercise">Exercícios</SelectItem>
                    <SelectItem value="revision">Revisão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duração Estimada</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(val) => setFormData({...formData, duration: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30 min</SelectItem>
                    <SelectItem value="45m">45 min</SelectItem>
                    <SelectItem value="1h">1 hora</SelectItem>
                    <SelectItem value="1.5h">1h 30m</SelectItem>
                    <SelectItem value="2h">2 horas</SelectItem>
                    <SelectItem value="3h">3 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTask} disabled={!formData.subject}>
              {dialogMode === 'add' ? 'Agendar' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Premium Upsell Modal */}
      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal}
        title="Cronograma Inteligente"
        description="A Linha do Tempo interativa e o Cronograma Automático são recursos exclusivos do Premium."
        features={[
          "Cronograma Automático com IA",
          "Reajuste Dinâmico de Metas",
          "Visão de Longo Prazo (Timeline)",
          "Sincronização com Google Agenda"
        ]}
      />
    </div>
  );
}