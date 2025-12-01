import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, ArrowLeft, Plus, BookOpen, Sparkles, UserCircle, Lock } from "lucide-react";

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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRoute, useLocation } from "wouter";
import { mockSubjects } from "@/lib/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { parseSyllabusText } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  category: z.string({
    required_error: "Selecione uma categoria",
  }),
  description: z.string().optional(),
  
  // Concurso fields
  edital: z.string().optional(),
  cargo: z.string().optional(),
  noSpecificExam: z.boolean().default(false),
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

export default function NewTrack() {
  const [match] = useRoute("/tracks/edit/:id");
  const isEditMode = !!match;
  const [location, setLocation] = useLocation();
  
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Mock Admin/User Toggle
  const [isAdmin, setIsAdmin] = useState(false);

  // Local state for subjects to allow adding new ones
  const [localSubjects, setLocalSubjects] = useState(mockSubjects);

  // Dialog States for creation
  const [isNewSubjectOpen, setIsNewSubjectOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [importMode, setImportMode] = useState<'manual' | 'text'>('manual');
  const [importText, setImportText] = useState("");
  
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
      if (type === 'subject') {
        const subject = localSubjects.find(s => `subject-${s.id}` === id);
        subject?.topics.forEach(t => {
          newSelected.delete(`topic-${t.id}`);
          t.subtopics.forEach(st => newSelected.delete(`subtopic-${st.id}`));
        });
      }
      if (type === 'topic') {
        const subjectId = parentIds[0];
        const subject = localSubjects.find(s => `subject-${s.id}` === subjectId);
        const topic = subject?.topics.find(t => `topic-${t.id}` === id);
        topic?.subtopics.forEach(st => newSelected.delete(`subtopic-${st.id}`));
      }
    } else {
      newSelected.add(id);
      parentIds.forEach(pid => newSelected.add(pid));
      
      if (type === 'subject') {
        const subject = localSubjects.find(s => `subject-${s.id}` === id);
        subject?.topics.forEach(t => {
          newSelected.add(`topic-${t.id}`);
          t.subtopics.forEach(st => newSelected.add(`subtopic-${st.id}`));
        });
      }
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

    let topics: any[] = [];

    if (importMode === 'text' && importText) {
      const parsedTopics = parseSyllabusText(importText);
      topics = parsedTopics.map((topicName, index) => ({
        id: Date.now() + index + 1,
        name: topicName,
        completed: false,
        expanded: false,
        totalTime: "0m",
        subtopics: []
      }));
    }

    const newSubject = {
      id: Date.now(),
      name: newSubjectName,
      progress: 0,
      color: "bg-blue-500",
      icon: "BookOpen",
      topics: topics
    };
    setLocalSubjects([...localSubjects, newSubject]);
    setNewSubjectName("");
    setImportText("");
    setIsNewSubjectOpen(false);
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
      description: "",
    },
  });

  const category = form.watch("category");
  const noSpecificExam = form.watch("noSpecificExam");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Trilha criada com sucesso!",
      description: `Sua trilha foi publicada como ${isAdmin ? "Gabaritte AI" : "Comunidade"}.`,
    });
    setTimeout(() => setLocation("/tracks"), 1500);
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
             <Button 
              variant="ghost" 
              className="w-fit pl-0 hover:bg-transparent hover:text-primary gap-2 mb-4"
              onClick={() => setLocation("/tracks")}
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para Trilhas
            </Button>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-display font-bold tracking-tight text-primary">
                {isEditMode ? "Editar Trilha" : "Nova Trilha de Aprendizado"}
              </h2>
              {isAdmin ? (
                 <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent gap-1">
                    <Sparkles className="w-3 h-3" /> Gabaritte AI
                 </Badge>
              ) : (
                 <Badge variant="secondary" className="bg-muted text-muted-foreground border-transparent gap-1">
                    <UserCircle className="w-3 h-3" /> Comunidade
                 </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Crie um roteiro de estudos completo para compartilhar com outros estudantes.
            </p>
          </div>

          {/* Toggle for Admin/User Simulation */}
          <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border">
            <Switch id="admin-mode" checked={isAdmin} onCheckedChange={setIsAdmin} />
            <Label htmlFor="admin-mode" className="text-xs font-medium text-muted-foreground cursor-pointer">
              Simular Admin
            </Label>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Basic Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Trilha</CardTitle>
              <CardDescription>Detalhes principais para identificação na plataforma.</CardDescription>
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
                      <FormLabel>Nome da Trilha</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Guia Definitivo OAB 2025" {...field} />
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o objetivo desta trilha, para quem é indicada e o que será aprendido." 
                        className="resize-none min-h-[120px]" 
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
                          Não focado em edital específico
                        </FormLabel>
                        <FormDescription>
                          Marque se esta trilha for de base ou conhecimentos gerais para a área.
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
                          <FormLabel>Edital de Referência</FormLabel>
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
                          <FormLabel>Cargo Foco</FormLabel>
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
                <CardTitle>Conteúdo Programático</CardTitle>
                <CardDescription>Organize as disciplinas e tópicos da trilha.</CardDescription>
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

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => setLocation("/tracks")}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
               {isAdmin ? <Sparkles className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
              {isEditMode ? "Salvar Alterações" : "Publicar Trilha"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialogs for creating content */}
      <Dialog open={isNewSubjectOpen} onOpenChange={setIsNewSubjectOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Disciplina</DialogTitle>
            <DialogDescription>Adicione uma nova disciplina para incluir na trilha.</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="manual" className="w-full" onValueChange={(v) => setImportMode(v as 'manual' | 'text')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="text">Importar do Edital</TabsTrigger>
            </TabsList>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome da Disciplina</Label>
                <Input 
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Ex: Direito Constitucional"
                />
              </div>

              <TabsContent value="text" className="space-y-2 mt-0">
                <Label>Conteúdo (Copie e cole do edital)</Label>
                <Textarea 
                  placeholder="Ex: 1. Compreensão e interpretação de textos. 2. Tipologia textual..."
                  className="h-[150px]"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  O sistema identificará automaticamente os tópicos numerados (1., 2., etc).
                </p>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSubjectOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddNewSubject}>
              {importMode === 'text' ? 'Importar e Criar' : 'Adicionar'}
            </Button>
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