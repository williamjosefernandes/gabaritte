import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Upload, Check, ChevronRight, Save, Clock, ArrowLeft, Plus, BookOpen, Trash2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRoute, useLocation } from "wouter";
import { mockSubjects, tracks } from "@/lib/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  category: z.string({
    required_error: "Selecione uma categoria",
  }),
  startDate: z.date({
    required_error: "Selecione a data de início",
  }),
  endDate: z.date({
    required_error: "Selecione a data de término",
  }),
  observations: z.string().optional(),
  
  // Concurso fields
  edital: z.string().optional(),
  cargo: z.string().optional(),
  noSpecificExam: z.boolean().default(false),
  
  // Routine fields
  routineType: z.enum(["specific", "workload"]),
  dailyWorkload: z.string().optional(), // For "workload" type
  // We'll handle specific hours separately in state for complexity reasons in this mock
});

const categories = [
  "Concurso Público",
  "Vestibular",
  "ENEM",
  "Profissão",
  "Certificação",
  "Faculdade",
  "Escola",
  "Idiomas",
  "Outros"
];

const weekDays = [
  "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
];

// Mock existing schedules from other plans
const existingSchedules = {
  "Segunda": [{ start: "18:00", end: "20:00", plan: "Inglês Fluente" }],
  "Quarta": [{ start: "19:00", end: "21:00", plan: "Pós-Graduação" }],
  "Sexta": [{ start: "08:00", end: "10:00", plan: "Academia" }]
};

export default function NewPlan() {
  const [match, params] = useRoute("/plans/edit/:id");
  const isEditMode = !!match;
  const [location, setLocation] = useLocation();
  
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [routineType, setRoutineType] = useState<"specific" | "workload">("specific");

  // Check for trackId in query params
  const searchParams = new URLSearchParams(window.location.search);
  const trackId = searchParams.get("trackId");

  // Local state for subjects to allow adding new ones
  const [localSubjects, setLocalSubjects] = useState(mockSubjects);

  // Dialog States for creation
  const [isNewSubjectOpen, setIsNewSubjectOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [activeSubjectForAdd, setActiveSubjectForAdd] = useState<number | null>(null);
  const [newTopicName, setNewTopicName] = useState("");

  const [isAddSubtopicOpen, setIsAddSubtopicOpen] = useState(false);
  const [activeTopicForAdd, setActiveTopicForAdd] = useState<{subjectId: number, topicId: number} | null>(null);
  const [newSubtopicName, setNewSubtopicName] = useState("");

  // Selection State
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string, type: 'subject' | 'topic' | 'subtopic', parentIds: string[] = []) => {
    const newSelected = new Set(selectedItems);
    const isSelected = newSelected.has(id);
    
    if (isSelected) {
      newSelected.delete(id);
      // If deselecting a subject, deselect all its children (topics/subtopics)
      if (type === 'subject') {
        const subject = localSubjects.find(s => `subject-${s.id}` === id);
        subject?.topics.forEach(t => {
          newSelected.delete(`topic-${t.id}`);
          t.subtopics.forEach(st => newSelected.delete(`subtopic-${st.id}`));
        });
      }
      // If deselecting a topic, deselect all its subtopics
      if (type === 'topic') {
        const subjectId = parentIds[0]; // "subject-X"
        const subject = localSubjects.find(s => `subject-${s.id}` === subjectId);
        const topic = subject?.topics.find(t => `topic-${t.id}` === id);
        topic?.subtopics.forEach(st => newSelected.delete(`subtopic-${st.id}`));
      }
    } else {
      newSelected.add(id);
      // Auto-select parents
      parentIds.forEach(pid => newSelected.add(pid));
      
      // If selecting a subject, select all its children
      if (type === 'subject') {
        const subject = localSubjects.find(s => `subject-${s.id}` === id);
        subject?.topics.forEach(t => {
          newSelected.add(`topic-${t.id}`);
          t.subtopics.forEach(st => newSelected.add(`subtopic-${st.id}`));
        });
      }
      // If selecting a topic, select all its subtopics
      if (type === 'topic') {
        const subjectId = parentIds[0];
        const subject = localSubjects.find(s => `subject-${s.id}` === subjectId);
        const topic = subject?.topics.find(t => `topic-${t.id}` === id);
        topic?.subtopics.forEach(st => newSelected.add(`subtopic-${st.id}`));
      }
    }
    
    setSelectedItems(newSelected);
  };

  const handleAddNewSubject = () => {
    if (!newSubjectName) return;
    const newSubject = {
      id: Date.now(),
      name: newSubjectName,
      progress: 0,
      color: "bg-blue-500",
      icon: "BookOpen",
      topics: []
    };
    setLocalSubjects([...localSubjects, newSubject]);
    setNewSubjectName("");
    setIsNewSubjectOpen(false);
    // Automatically select the new subject
    toggleSelection(`subject-${newSubject.id}`, 'subject');
  };

  const handleAddNewTopic = () => {
    if (!activeSubjectForAdd || !newTopicName) return;
    
    setLocalSubjects(prev => prev.map(sub => {
      if (sub.id === activeSubjectForAdd) {
        return {
          ...sub,
          topics: [...sub.topics, {
            id: Date.now(),
            name: newTopicName,
            completed: false,
            expanded: true,
            totalTime: "0m",
            subtopics: []
          }]
        };
      }
      return sub;
    }));
    
    setNewTopicName("");
    setIsAddTopicOpen(false);
  };

  const handleAddNewSubtopic = () => {
    if (!activeTopicForAdd || !newSubtopicName) return;
    
    setLocalSubjects(prev => prev.map(sub => {
      if (sub.id === activeTopicForAdd.subjectId) {
        return {
          ...sub,
          topics: sub.topics.map(topic => {
            if (topic.id === activeTopicForAdd.topicId) {
              return {
                ...topic,
                subtopics: [...topic.subtopics, {
                  id: Date.now(),
                  name: newSubtopicName,
                  completed: false,
                  duration: "30m",
                  type: "reading"
                }]
              };
            }
            return topic;
          })
        };
      }
      return sub;
    }));
    
    setNewSubtopicName("");
    setIsAddSubtopicOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      noSpecificExam: false,
      observations: "",
      routineType: "specific",
    },
  });

  // Handle pre-filling from Track
  useEffect(() => {
    if (trackId) {
      const track = tracks.find(t => t.id === parseInt(trackId));
      if (track) {
        form.setValue("name", `Trilha ${track.title}`);
        form.setValue("category", track.category);
        form.setValue("observations", `Plano baseado na trilha: ${track.title}. \n${track.description}`);
        
        // Pre-select subjects from track
        if (track.subjects) {
          const newSelected = new Set<string>();
          track.subjects.forEach(subject => {
            newSelected.add(`subject-${subject.id}`);
            subject.topics.forEach(topic => {
               newSelected.add(`topic-${topic.id}`);
               topic.subtopics.forEach(subtopic => {
                 newSelected.add(`subtopic-${subtopic.id}`);
               });
            });
          });
          setSelectedItems(newSelected);
          
          // Note: In a real app, we might need to merge track.subjects into localSubjects if they differ
          // For this mock, we assume they come from the same source or we'd need to setLocalSubjects(track.subjects)
        }
        
        toast({
          title: "Dados da Trilha Importados",
          description: "Configure as datas e rotina para finalizar seu plano."
        });
      }
    }
  }, [trackId, form, toast]);

  // Mock loading data for Edit Mode
  useEffect(() => {
    if (isEditMode) {
      // Simulate fetching data
      const mockData = {
        name: "Concurso Receita Federal",
        category: "Concurso Público",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-15"),
        routineType: "specific",
        observations: "Focar em Contabilidade e Direito Tributário.",
        edital: "Edital 2025/01",
        cargo: "Auditor Fiscal",
        noSpecificExam: false
      };
      
      // Just setting name for visual feedback in this mockup
      form.setValue("name", mockData.name);
      form.setValue("category", mockData.category);
      form.setValue("startDate", mockData.startDate);
      form.setValue("endDate", mockData.endDate);
      form.setValue("observations", mockData.observations);
      form.setValue("routineType", mockData.routineType as "specific" | "workload");
      setRoutineType(mockData.routineType as "specific" | "workload");
      if (mockData.edital) form.setValue("edital", mockData.edital);
      if (mockData.cargo) form.setValue("cargo", mockData.cargo);
    }
  }, [isEditMode, form]);

  const category = form.watch("category");
  const noSpecificExam = form.watch("noSpecificExam");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: isEditMode ? "Plano atualizado!" : "Plano criado com sucesso!",
      description: isEditMode ? "Suas alterações foram salvas." : "Seu cronograma será reorganizado automaticamente.",
    });
    // Navigate back to plans list
    setTimeout(() => setLocation("/plans"), 1500);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <Button 
          variant="ghost" 
          className="w-fit pl-0 hover:bg-transparent hover:text-primary gap-2 mb-4"
          onClick={() => setLocation("/plans")}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Planos
        </Button>
        <h2 className="text-3xl font-display font-bold tracking-tight text-primary">
          {isEditMode ? "Editar Plano" : "Novo Plano de Estudos"}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode ? "Atualize as informações do seu plano." : "Crie um novo plano para organizar seus objetivos e rotina."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Basic Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Detalhes principais do seu plano.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center justify-center gap-4 mb-6">
                <div className="relative w-full h-48 bg-secondary/30 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                      <div className="p-4 rounded-full bg-background shadow-sm">
                        <Upload className="w-8 h-8" />
                      </div>
                      <span className="font-medium">Clique para enviar imagem de capa</span>
                      <span className="text-xs opacity-70">JPG, PNG ou GIF</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Plano</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Aprovação PF 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Término</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < (form.getValues("startDate") || new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalhes adicionais sobre o plano, metas pessoais, etc." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Concurso Specific Fields */}
          {category === "Concurso Público" && (
            <Card className="animate-in fade-in slide-in-from-top-4 duration-500 border-blue-200 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-400">Detalhes do Concurso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="noSpecificExam"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-background">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Não estou estudando para nenhuma prova específica
                        </FormLabel>
                        <FormDescription>
                          Marque esta opção se você está estudando para a área (ex: Carreiras Policiais) mas sem edital aberto.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {!noSpecificExam && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    <FormField
                      control={form.control}
                      name="edital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link ou Nome do Edital</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Edital PF nº 01/2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo Pretendido</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Agente de Polícia Federal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Selection of Subjects/Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conteúdo do Plano</CardTitle>
                <CardDescription>Selecione as disciplinas e tópicos que farão parte deste plano.</CardDescription>
              </div>
              <Button type="button" size="sm" variant="outline" className="gap-2" onClick={() => setIsNewSubjectOpen(true)}>
                <Plus className="w-4 h-4" /> Nova Disciplina
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg divide-y">
                <Accordion type="multiple" className="w-full">
                  {localSubjects.map((subject) => (
                    <AccordionItem key={subject.id} value={`subject-${subject.id}`} className="border-none">
                      <div className="flex items-center px-4 py-2 hover:bg-muted/50 group">
                        <Checkbox 
                          checked={selectedItems.has(`subject-${subject.id}`)}
                          onCheckedChange={() => toggleSelection(`subject-${subject.id}`, 'subject')}
                          className="mr-4"
                        />
                        <AccordionTrigger className="py-2 hover:no-underline flex-1">
                          <span className="font-medium">{subject.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground font-normal">
                            ({subject.topics.length} tópicos)
                          </span>
                        </AccordionTrigger>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSubjectForAdd(subject.id);
                            setIsAddTopicOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="ml-9 space-y-4 border-l pl-4 pt-2">
                          {subject.topics.map((topic) => (
                            <div key={topic.id} className="space-y-2">
                              <div className="flex items-center gap-2 group">
                                <Checkbox 
                                  checked={selectedItems.has(`topic-${topic.id}`)}
                                  onCheckedChange={() => toggleSelection(`topic-${topic.id}`, 'topic', [`subject-${subject.id}`])}
                                />
                                <span className="text-sm font-medium">{topic.name}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                  onClick={() => {
                                    setActiveTopicForAdd({subjectId: subject.id, topicId: topic.id});
                                    setIsAddSubtopicOpen(true);
                                  }}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {topic.subtopics.map((subtopic) => (
                                  <div key={subtopic.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Checkbox 
                                      checked={selectedItems.has(`subtopic-${subtopic.id}`)}
                                      onCheckedChange={() => toggleSelection(`subtopic-${subtopic.id}`, 'subtopic', [`subject-${subject.id}`, `topic-${topic.id}`])}
                                      className="w-3 h-3"
                                    />
                                    <span>{subtopic.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {subject.topics.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">Nenhum tópico cadastrado.</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {localSubjects.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Nenhuma disciplina cadastrada.</p>
                    <Button variant="link" onClick={() => setIsNewSubjectOpen(true)}>
                      Criar primeira disciplina
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Study Routine Section */}
          <Card>
            <CardHeader>
              <CardTitle>Rotina de Estudo</CardTitle>
              <CardDescription>Defina sua disponibilidade para este plano.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                 <div className="grid grid-cols-2 bg-muted p-1 rounded-lg w-full max-w-md">
                  <button
                    type="button"
                    className={cn(
                      "py-2 text-sm font-medium rounded-md transition-all",
                      routineType === "specific" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setRoutineType("specific")}
                  >
                    Horários Específicos
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "py-2 text-sm font-medium rounded-md transition-all",
                      routineType === "workload" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setRoutineType("workload")}
                  >
                    Carga Horária Diária
                  </button>
                </div>
              </div>

              {routineType === "specific" ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg flex gap-3 text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Conflitos de Horário</p>
                      <p className="opacity-90">Os horários marcados em cinza já estão ocupados por outros planos de estudo.</p>
                    </div>
                  </div>
                  
                  {weekDays.map((day) => {
                    const busySlots = existingSchedules[day as keyof typeof existingSchedules] || [];
                    
                    return (
                      <div key={day} className="grid grid-cols-12 gap-4 items-start border-b pb-4 last:border-0">
                        <div className="col-span-12 md:col-span-2 font-medium text-sm pt-2">{day}</div>
                        <div className="col-span-12 md:col-span-10 space-y-3">
                          {busySlots.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {busySlots.map((slot, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs font-normal bg-muted text-muted-foreground border-dashed border-muted-foreground/30">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {slot.start} - {slot.end} ({slot.plan})
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex gap-2 items-center">
                            <Input type="time" className="w-32" />
                            <span className="text-muted-foreground text-sm">até</span>
                            <Input type="time" className="w-32" />
                            <Button variant="ghost" size="icon" className="ml-auto">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <FormField
                    control={form.control}
                    name="dailyWorkload"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantas horas por dia você vai dedicar a este plano?</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input type="number" placeholder="4" className="w-24" {...field} />
                          </FormControl>
                          <span className="text-muted-foreground">horas/dia</span>
                        </div>
                        <FormDescription>
                          Vamos distribuir o conteúdo automaticamente baseado na sua carga horária.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => setLocation("/plans")}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              {isEditMode ? "Salvar Alterações" : "Criar Plano"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialogs for creating content */}
      <Dialog open={isNewSubjectOpen} onOpenChange={setIsNewSubjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Disciplina</DialogTitle>
            <DialogDescription>Adicione uma nova disciplina para incluir no plano.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Disciplina</Label>
              <Input 
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ex: Direito Constitucional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSubjectOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddNewSubject}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Tópico</DialogTitle>
            <DialogDescription>Adicione um novo tópico à disciplina.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Tópico</Label>
              <Input 
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Ex: Direitos Fundamentais"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTopicOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddNewTopic}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSubtopicOpen} onOpenChange={setIsAddSubtopicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Subtópico</DialogTitle>
            <DialogDescription>Adicione um novo subtópico.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Subtópico</Label>
              <Input 
                value={newSubtopicName}
                onChange={(e) => setNewSubtopicName(e.target.value)}
                placeholder="Ex: Artigo 5º"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubtopicOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddNewSubtopic}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}