import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Plus,
  Download,
  ChevronDown,
  PlayCircle,
  FileText,
  LayoutList,
  Upload,
  FolderPlus,
  Calculator, 
  Scale, 
  Gavel,
  Globe, 
  FlaskConical, 
  Dna, 
  Landmark, 
  Cpu, 
  Code, 
  PenTool, 
  Music, 
  Palette, 
  Languages, 
  Brain, 
  Briefcase, 
  Coins, 
  Stethoscope, 
  Microscope, 
  GraduationCap, 
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  X,
  Trash2,
  Edit,
  CheckCircle,
  PlusCircle,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { activePlan, mockSubjects } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, parseSyllabusText, parseCSV } from "@/lib/utils";
import { useLocation } from "wouter";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StudySessionDialog } from "@/components/study/StudySessionDialog";

import { Textarea } from "@/components/ui/textarea";

const iconList = [
  { name: "BookOpen", component: BookOpen },
  { name: "Gavel", component: Gavel },
  { name: "Scale", component: Scale },
  { name: "Calculator", component: Calculator },
  { name: "Globe", component: Globe },
  { name: "FlaskConical", component: FlaskConical },
  { name: "Dna", component: Dna },
  { name: "Landmark", component: Landmark },
  { name: "Cpu", component: Cpu },
  { name: "Code", component: Code },
  { name: "PenTool", component: PenTool },
  { name: "Music", component: Music },
  { name: "Palette", component: Palette },
  { name: "Languages", component: Languages },
  { name: "Brain", component: Brain },
  { name: "Briefcase", component: Briefcase },
  { name: "Coins", component: Coins },
  { name: "Stethoscope", component: Stethoscope },
  { name: "Microscope", component: Microscope },
  { name: "Lightbulb", component: Lightbulb },
];

const mockTemplates = [
  { id: 1, name: "Português para Concursos", items: 12, author: "Gabaritte", color: "bg-amber-500", icon: "BookOpen" },
  { id: 2, name: "Informática Básica", items: 8, author: "Gabaritte", color: "bg-blue-500", icon: "Cpu" },
  { id: 3, name: "Raciocínio Lógico", items: 15, author: "Prof. Matheus", color: "bg-purple-500", icon: "Brain" },
  { id: 4, name: "Direito Administrativo", items: 20, author: "Gabaritte", color: "bg-emerald-500", icon: "Gavel" },
];

import { PremiumModal } from "@/components/premium/PremiumModal";
import { currentUser } from "@/lib/mockData";

export default function Subjects() {
  const [location, setLocation] = useLocation();
  const [subjects, setSubjects] = useState(mockSubjects);
// ... rest of component
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({ "1-102": true });

  // Handle Deep Linking / Search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('subjectId');
    const topicId = params.get('topicId');
    const subtopicId = params.get('subtopicId');

    if (subjectId && topicId) {
      // Expand the topic
      const key = `${subjectId}-${topicId}`;
      setExpandedTopics(prev => ({
        ...prev,
        [key]: true
      }));

      // Scroll to the topic
      setTimeout(() => {
        const element = document.getElementById(`topic-${topicId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add flash effect
          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
          setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);
        }
      }, 100);
    }

    if (subjectId && topicId && subtopicId) {
      // If subtopic is selected, open the study session directly
      const sId = parseInt(subjectId);
      const tId = parseInt(topicId);
      const stId = parseInt(subtopicId);
      
      const subject = subjects.find(s => s.id === sId);
      const topic = subject?.topics.find(t => t.id === tId);
      const subtopic = topic?.subtopics.find(st => st.id === stId);

      if (subject && topic && subtopic) {
        // Small delay to ensure data is ready/rendering
        setTimeout(() => {
            setActiveSession({ subject, topic, subtopic });
            setIsStudySessionOpen(true);
        }, 300);
      }
    }
  }, [location, subjects]); // Re-run when location changes (search params)

  // Dialog States
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isNewSubjectOpen, setIsNewSubjectOpen] = useState(false);
  const [isImportTemplateOpen, setIsImportTemplateOpen] = useState(false);
  const [isStudySessionOpen, setIsStudySessionOpen] = useState(false);

  // Study Session State
  const [activeSession, setActiveSession] = useState<{
    subject: any,
    topic: any,
    subtopic?: any
  } | null>(null);

  // Add Content State
  const [activeTopicForAdd, setActiveTopicForAdd] = useState<{ subjectId: number, topicId: number } | null>(null);
  const [newContentName, setNewContentName] = useState("");
  const [newContentDuration, setNewContentDuration] = useState("");
  const [newContentType, setNewContentType] = useState("video");

  // Add Topic State
  const [activeSubjectForAdd, setActiveSubjectForAdd] = useState<number | null>(null);
  const [newTopicName, setNewTopicName] = useState("");

  // New Subject State
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState("bg-blue-500");
  const [newSubjectIcon, setNewSubjectIcon] = useState("BookOpen");

  // Import Template State
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [importMode, setImportMode] = useState<'template' | 'text' | 'csv'>('template');
  const [importText, setImportText] = useState("");
  const [importSubjectName, setImportSubjectName] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalType, setPremiumModalType] = useState<'subject' | 'topic' | 'subtopic'>('subject');

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    type: 'subject' | 'topic' | 'subtopic',
    id: number,
    subjectId?: number,
    topicId?: number,
    name: string
  } | null>(null);

  const toggleTopic = (subjectId: number, topicId: number) => {
    const key = `${subjectId}-${topicId}`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-3.5 h-3.5" />;
      case 'reading': return <FileText className="w-3.5 h-3.5" />;
      case 'exercise': return <CheckCircle2 className="w-3.5 h-3.5" />;
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const getIconComponent = (iconName: string) => {
    const icon = iconList.find(i => i.name === iconName);
    return icon ? <icon.component className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />;
  };

  const handleContinue = (e: React.MouseEvent, subjectId: number, topicId: number, subtopicId?: number) => {
    e.stopPropagation();
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    const subtopic = subtopicId ? topic?.subtopics.find(s => s.id === subtopicId) : undefined;

    if (subject && topic) {
      setActiveSession({ subject, topic, subtopic });
      setIsStudySessionOpen(true);
    }
  };

  const handleAddContent = () => {
    if (!activeTopicForAdd || !newContentName) return;

    const { subjectId, topicId } = activeTopicForAdd;

    // Check Free Plan Limits for Subtopics (Limit: 10)
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    
    if (currentUser.plan === 'free' && topic && topic.subtopics.length >= 10) {
      setPremiumModalType('subtopic');
      setShowPremiumModal(true);
      setIsAddContentOpen(false);
      return;
    }

    setSubjects(prevSubjects => prevSubjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id === topicId) {
              return {
                ...topic,
                subtopics: [
                  ...topic.subtopics,
                  {
                    id: Date.now(),
                    name: newContentName,
                    duration: "30m",
                    completed: false,
                    type: "video"
                  }
                ]
              };
            }
            return topic;
          })
        };
      }
      return subject;
    }));

    setNewContentName("");
    setNewContentDuration("");
    setNewContentType("video");
    setIsAddContentOpen(false);
  };

  const handleAddTopic = () => {
    if (activeSubjectForAdd === null || !newTopicName) return;

    // Check Free Plan Limits for Topics (Limit: 10)
    const subject = subjects.find(s => s.id === activeSubjectForAdd);
    if (currentUser.plan === 'free' && subject && subject.topics.length >= 10) {
      setPremiumModalType('topic');
      setShowPremiumModal(true);
      setIsAddTopicOpen(false);
      return;
    }

    setSubjects(prevSubjects => prevSubjects.map(subject => {
      if (subject.id === activeSubjectForAdd) {
        return {
          ...subject,
          topics: [
            ...subject.topics,
            {
              id: Date.now(),
              name: newTopicName,
              completed: false,
              expanded: true,
              totalTime: "0m",
              subtopics: []
            }
          ]
        };
      }
      return subject;
    }));
    
    setNewTopicName("");
    setIsAddTopicOpen(false);
  };

  const handleNewSubject = () => {
    if (!newSubjectName) return;

    // Check Free Plan Limits for Subjects (Limit: 2)
    if (currentUser.plan === 'free' && subjects.length >= 2) {
      setPremiumModalType('subject');
      setShowPremiumModal(true);
      setIsNewSubjectOpen(false);
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: newSubjectName,
      progress: 0,
      color: newSubjectColor,
      icon: newSubjectIcon,
      topics: []
    };

    setSubjects([...subjects, newSubject]);
    setNewSubjectName("");
    setNewSubjectColor("bg-blue-500");
    setNewSubjectIcon("BookOpen");
    setIsNewSubjectOpen(false);
  };

  const handleImportTemplate = async () => {
    // Check Free Plan Limits for Subjects (Limit: 2)
    if (currentUser.plan === 'free' && subjects.length >= 2) {
      setPremiumModalType('subject');
      setShowPremiumModal(true);
      setIsImportTemplateOpen(false);
      return;
    }

    if (importMode === 'csv') {
      if (!csvFile || !importSubjectName) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsedTopics = parseCSV(text);

        if (parsedTopics.length === 0) return;

        const newSubject = {
          id: Date.now(),
          name: importSubjectName,
          progress: 0,
          color: "bg-indigo-500",
          icon: "BookOpen",
          topics: parsedTopics.map((topicName, index) => ({
            id: Date.now() + index + 1,
            name: topicName,
            completed: false,
            expanded: false,
            totalTime: "0m",
            subtopics: []
          }))
        };
        
        setSubjects([...subjects, newSubject]);
        setCsvFile(null);
        setImportSubjectName("");
        setIsImportTemplateOpen(false);
      };
      reader.readAsText(csvFile);
      return;
    }

    if (importMode === 'text') {
      if (!importText || !importSubjectName) return;
      
      const parsedTopics = parseSyllabusText(importText);
      
      if (parsedTopics.length === 0) return;

      const newSubject = {
        id: Date.now(),
        name: importSubjectName,
        progress: 0,
        color: "bg-indigo-500", // Default color for imported
        icon: "BookOpen",
        topics: parsedTopics.map((topicName, index) => ({
          id: Date.now() + index + 1,
          name: topicName,
          completed: false,
          expanded: false,
          totalTime: "0m",
          subtopics: []
        }))
      };
      
      setSubjects([...subjects, newSubject]);
      setImportText("");
      setImportSubjectName("");
      setIsImportTemplateOpen(false);
      return;
    }

    if (!selectedTemplate) return;

    const template = mockTemplates.find(t => t.id.toString() === selectedTemplate);
    if (template) {
      const newSubject = {
        id: Date.now(),
        name: template.name,
        progress: 0,
        color: template.color,
        icon: template.icon,
        topics: [
          {
            id: Date.now() + 1,
            name: "Módulo 1 - Introdução",
            completed: false,
            expanded: true,
            totalTime: "0m",
            subtopics: []
          }
        ]
      };
      setSubjects([...subjects, newSubject]);
    }
    
    setSelectedTemplate("");
    setIsImportTemplateOpen(false);
  };

  const openAddContentDialog = (subjectId: number, topicId: number) => {
    setActiveTopicForAdd({ subjectId, topicId });
    setIsAddContentOpen(true);
  };

  const openAddTopicDialog = (subjectId: number) => {
    setActiveSubjectForAdd(subjectId);
    setIsAddTopicOpen(true);
  };

  // -- Helper Functions for Progress --
  const calculateSubjectProgress = (subject: any) => {
    if (subject.topics.length === 0) return 0;
    
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    
    subject.topics.forEach((topic: any) => {
      if (topic.subtopics.length === 0) {
        // If topic has no subtopics, count the topic itself
        totalSubtopics++;
        if (topic.completed) completedSubtopics++;
      } else {
        // If topic has subtopics, count them
        topic.subtopics.forEach((subtopic: any) => {
          totalSubtopics++;
          if (subtopic.completed) completedSubtopics++;
        });
      }
    });

    if (totalSubtopics === 0) return 0;
    return Math.round((completedSubtopics / totalSubtopics) * 100);
  };

  // -- New Handlers for Options --

  const handleDeleteSubject = (subjectId: number) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
  };

  const handleDeleteTopic = (subjectId: number, topicId: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const updatedTopics = s.topics.filter(t => t.id !== topicId);
        return { ...s, topics: updatedTopics };
      }
      return s;
    }).map(s => ({...s, progress: calculateSubjectProgress(s)})));
  };

  const handleDeleteSubtopic = (subjectId: number, topicId: number, subtopicId: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const updatedTopics = s.topics.map(t => {
            if (t.id === topicId) {
              return { ...t, subtopics: t.subtopics.filter(st => st.id !== subtopicId) };
            }
            return t;
          });
        return { ...s, topics: updatedTopics };
      }
      return s;
    }).map(s => ({...s, progress: calculateSubjectProgress(s)})));
  };

  const handleToggleTopicComplete = (subjectId: number, topicId: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const updatedTopics = s.topics.map(t => {
            if (t.id === topicId) {
              const newCompleted = !t.completed;
              return { 
                ...t, 
                completed: newCompleted,
                subtopics: t.subtopics.map(st => ({...st, completed: newCompleted}))
              };
            }
            return t;
          });
        return { ...s, topics: updatedTopics };
      }
      return s;
    }).map(s => ({...s, progress: calculateSubjectProgress(s)})));
  };

  const handleToggleSubtopicComplete = (subjectId: number, topicId: number, subtopicId: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const updatedTopics = s.topics.map(t => {
            if (t.id === topicId) {
              const updatedSubtopics = t.subtopics.map(st => {
                  if (st.id === subtopicId) {
                    return { ...st, completed: !st.completed };
                  }
                  return st;
                });
              
              // Check if all subtopics are now completed
              const allCompleted = updatedSubtopics.every(st => st.completed);
              
              return {
                ...t,
                subtopics: updatedSubtopics,
                completed: allCompleted
              };
            }
            return t;
          });
        return { ...s, topics: updatedTopics };
      }
      return s;
    }).map(s => ({...s, progress: calculateSubjectProgress(s)})));
  };

  const openEditDialog = (type: 'subject' | 'topic' | 'subtopic', item: any, subjectId?: number, topicId?: number) => {
    setEditingItem({
      type,
      id: item.id,
      name: item.name,
      subjectId,
      topicId
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setSubjects(prev => prev.map(s => {
      // Edit Subject
      if (editingItem.type === 'subject' && s.id === editingItem.id) {
        return { ...s, name: editingItem.name };
      }

      // Edit Topic
      if (editingItem.type === 'topic' && s.id === editingItem.subjectId) {
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id === editingItem.id) {
              return { ...t, name: editingItem.name };
            }
            return t;
          })
        };
      }

      // Edit Subtopic
      if (editingItem.type === 'subtopic' && s.id === editingItem.subjectId) {
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id === editingItem.topicId) {
              return {
                ...t,
                subtopics: t.subtopics.map(st => {
                  if (st.id === editingItem.id) {
                    return { ...st, name: editingItem.name };
                  }
                  return st;
                })
              };
            }
            return t;
          })
        };
      }

      return s;
    }));

    setIsEditOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Disciplinas</h2>
          <p className="text-muted-foreground">Gerencie o conteúdo do plano: <span className="font-semibold text-foreground">{activePlan.name}</span></p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2" onClick={() => setIsImportTemplateOpen(true)}>
            <Download className="w-4 h-4" /> Importar Modelo
          </Button>
          <Button className="gap-2" onClick={() => setIsNewSubjectOpen(true)}>
            <Plus className="w-4 h-4" /> Nova Disciplina
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Disciplinas</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{subjects.length}</h3>
                <span className="text-xs text-muted-foreground">cadastradas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <LayoutList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tópicos</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {subjects.reduce((acc, subject) => acc + subject.topics.length, 0)}
                </h3>
                <span className="text-xs text-muted-foreground">no total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8">
        {subjects.map((subject) => (
          <div key={subject.id} className="space-y-4">
            {/* Subject Header */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${subject.color}`}>
                  {getIconComponent(subject.icon || 'BookOpen')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{subject.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Progress value={subject.progress} className="h-2 w-32 bg-secondary" />
                    <span className="text-sm font-medium text-muted-foreground">{subject.progress}% concluído</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Summary - Removed as requested */}
              <div className="hidden lg:flex items-center gap-3 mr-4">
                {/* Time, Classes and Questions blocks removed */}
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opções da Disciplina</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openAddTopicDialog(subject.id)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tópico
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog('subject', subject)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-3 pl-2 md:pl-6">
              {subject.topics.map((topic) => {
                const isExpanded = expandedTopics[`${subject.id}-${topic.id}`];
                const hasIncomplete = topic.subtopics.some(s => !s.completed);
                
                return (
                  <Card key={topic.id} id={`topic-${topic.id}`} className={cn(
                    "border-muted transition-all duration-200 overflow-hidden",
                    isExpanded ? "border-primary/20 shadow-md bg-card" : "hover:border-primary/20 hover:bg-accent/30 bg-card/50"
                  )}>
                    {/* Topic Header - Clickable */}
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                      onClick={() => toggleTopic(subject.id, topic.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("font-semibold text-base", topic.completed && "text-muted-foreground line-through")}>
                          {topic.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {hasIncomplete && !topic.completed && (
                          <Button 
                            size="sm" 
                            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={(e) => handleContinue(e, subject.id, topic.id)}
                          >
                            Continuar
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              openAddContentDialog(subject.id, topic.id);
                            }}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Subtópico
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog('topic', topic, subject.id);
                            }}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTopicComplete(subject.id, topic.id);
                            }}>
                              <CheckCircle className={cn("mr-2 h-4 w-4", topic.completed ? "text-green-500" : "")} /> 
                              {topic.completed ? "Desmarcar" : "Concluir"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTopic(subject.id, topic.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
                      </div>
                    </div>

                    {/* Subtopics List - Expandable */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4 pt-0">
                            <div className="ml-3 pl-6 border-l-2 border-border/60 space-y-1 relative">
                              {topic.subtopics.length === 0 && (
                                <div className="text-sm text-muted-foreground py-2 italic">
                                  Nenhuma aula cadastrada neste tópico.
                                </div>
                              )}
                              {topic.subtopics.map((subtopic, idx) => (
                                <div 
                                  key={subtopic.id} 
                                  className={cn(
                                    "relative group flex items-center justify-between p-2.5 rounded-lg transition-all",
                                    subtopic.current ? "bg-primary/5 border border-primary/10" : "hover:bg-secondary/50 border border-transparent"
                                  )}
                                >
                                  {/* Timeline Dot */}
                                  <div className={cn(
                                    "absolute -left-[31px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 z-10 bg-background transition-colors",
                                    subtopic.completed ? "border-success bg-success text-success" : 
                                    subtopic.current ? "border-primary bg-primary" : "border-muted-foreground/30"
                                  )}>
                                    {subtopic.completed && <CheckCircle2 className="w-full h-full text-white p-[1px]" />}
                                    {subtopic.current && <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className={cn("text-sm font-medium", 
                                      subtopic.completed ? "text-muted-foreground line-through" : 
                                      subtopic.current ? "text-primary" : "text-foreground"
                                    )}>
                                      {subtopic.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                    {!subtopic.completed && (
                                      <Button 
                                        size="sm" 
                                        className={cn(
                                          "h-7 text-xs",
                                          subtopic.current 
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                            : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                                        )}
                                        onClick={(e) => handleContinue(e, subject.id, topic.id, subtopic.id)}
                                      >
                                        Continuar
                                      </Button>
                                    )}
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <MoreVertical className="w-3.5 h-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditDialog('subtopic', subtopic, subject.id, topic.id)}>
                                          <Edit className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleSubtopicComplete(subject.id, topic.id, subtopic.id)}>
                                          <CheckCircle className={cn("mr-2 h-4 w-4", subtopic.completed ? "text-green-500" : "")} /> 
                                          {subtopic.completed ? "Desmarcar" : "Concluir"}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          className="text-destructive focus:text-destructive"
                                          onClick={() => handleDeleteSubtopic(subject.id, topic.id, subtopic.id)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="ml-9 mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary hover:text-primary hover:bg-primary/5 gap-2 text-xs h-8"
                                onClick={() => openAddContentDialog(subject.id, topic.id)}
                              >
                                <Plus className="w-3.5 h-3.5" /> Adicionar Subtópico
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
              <Button 
                variant="outline" 
                className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 gap-2"
                onClick={() => openAddTopicDialog(subject.id)}
              >
                <Plus className="w-4 h-4" /> Adicionar Novo Tópico
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Content Dialog */}
      <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Subtópico</DialogTitle>
            <DialogDescription>
              Adicione um subtópico ao tópico selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Título
              </Label>
              <Input
                id="name"
                value={newContentName}
                onChange={(e) => setNewContentName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Aula 01 - Introdução"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddContent}>Adicionar Subtópico</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Topic Dialog */}
      <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Tópico</DialogTitle>
            <DialogDescription>
              Crie um novo tópico principal para organizar o conteúdo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic-name" className="text-right">
                Título
              </Label>
              <Input
                id="topic-name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Atos Administrativos"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTopic}>Adicionar Tópico</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Subject Dialog */}
      <Dialog open={isNewSubjectOpen} onOpenChange={setIsNewSubjectOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Nova Disciplina</DialogTitle>
            <DialogDescription>
              Adicione uma nova disciplina ao seu plano de estudos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject-name" className="text-right">
                Nome
              </Label>
              <Input
                id="subject-name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Direito Penal"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Cor
              </Label>
              <Select value={newSubjectColor} onValueChange={setNewSubjectColor}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-500">Azul</SelectItem>
                  <SelectItem value="bg-amber-500">Amarelo</SelectItem>
                  <SelectItem value="bg-green-500">Verde</SelectItem>
                  <SelectItem value="bg-purple-500">Roxo</SelectItem>
                  <SelectItem value="bg-red-500">Vermelho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Ícone</Label>
              <div className="grid grid-cols-5 gap-2 p-4 border rounded-lg bg-secondary/20 max-h-[200px] overflow-y-auto">
                {iconList.map((icon) => (
                  <div
                    key={icon.name}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-primary/10 transition-colors aspect-square",
                      newSubjectIcon === icon.name ? "bg-primary/20 ring-2 ring-primary" : "bg-background"
                    )}
                    onClick={() => setNewSubjectIcon(icon.name)}
                  >
                    <icon.component className={cn("w-5 h-5", newSubjectIcon === icon.name ? "text-primary" : "text-muted-foreground")} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleNewSubject}>Criar Disciplina</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Template Dialog */}
      <Dialog open={isImportTemplateOpen} onOpenChange={setIsImportTemplateOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Importar Disciplina</DialogTitle>
            <DialogDescription>
              Escolha um modelo pronto ou cole o conteúdo do edital.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="template" className="w-full" onValueChange={(v) => setImportMode(v as 'template' | 'text' | 'csv')}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="template">Modelos</TabsTrigger>
              <TabsTrigger value="text">Colar Edital</TabsTrigger>
              <TabsTrigger value="csv">Importar CSV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-4">
              <div className="grid gap-4 py-2">
                {mockTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50",
                      selectedTemplate === template.id.toString() ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
                    )}
                    onClick={() => setSelectedTemplate(template.id.toString())}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-white ${template.color}`}>
                        {getIconComponent(template.icon)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-xs text-muted-foreground">{template.items} tópicos • {template.author}</p>
                      </div>
                    </div>
                    {selectedTemplate === template.id.toString() && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Disciplina</Label>
                <Input 
                  placeholder="Ex: Língua Portuguesa" 
                  value={importSubjectName}
                  onChange={(e) => setImportSubjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo (Copie e cole do edital)</Label>
                <Textarea 
                  placeholder="Ex: 1. Compreensão e interpretação de textos. 2. Tipologia textual..."
                  className="h-[200px]"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  O sistema identificará automaticamente os tópicos numerados (1., 2., etc).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csv" className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Disciplina</Label>
                <Input 
                  placeholder="Ex: Direito Tributário" 
                  value={importSubjectName}
                  onChange={(e) => setImportSubjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Arquivo CSV</Label>
                <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                   <div className="p-4 bg-background rounded-full shadow-sm">
                     <Upload className="w-6 h-6 text-muted-foreground" />
                   </div>
                   <div className="text-center space-y-1">
                     <p className="text-sm font-medium">Clique para selecionar</p>
                     <p className="text-xs text-muted-foreground">Ou arraste e solte seu arquivo aqui</p>
                   </div>
                   <Input 
                    type="file" 
                    accept=".csv,.txt"
                    className="hidden" 
                    id="csv-upload"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                   <Button variant="secondary" size="sm" onClick={() => document.getElementById('csv-upload')?.click()}>
                     Selecionar Arquivo
                   </Button>
                   {csvFile && (
                     <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                       <FileText className="w-4 h-4" />
                       {csvFile.name}
                     </div>
                   )}
                </div>
                <p className="text-xs text-muted-foreground">
                  O arquivo deve conter uma lista de tópicos, um por linha ou separados por vírgula.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportTemplateOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleImportTemplate} 
              disabled={
                importMode === 'template' ? !selectedTemplate : 
                importMode === 'csv' ? (!csvFile || !importSubjectName) :
                (!importText || !importSubjectName)
              }
            >
              Importar {importMode === 'text' ? 'Conteúdo' : importMode === 'csv' ? 'CSV' : 'Modelo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar {editingItem?.type === 'subject' ? 'Disciplina' : editingItem?.type === 'topic' ? 'Tópico' : 'Subtópico'}</DialogTitle>
            <DialogDescription>
              Faça alterações no nome do item selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nome
              </Label>
              <Input
                id="edit-name"
                value={editingItem?.name || ""}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudySessionDialog 
        open={isStudySessionOpen} 
        onOpenChange={setIsStudySessionOpen}
        sessionData={activeSession}
      />

      {/* Premium Upsell Modal */}
      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal}
        title={
          premiumModalType === 'subject' ? 'Limite de Disciplinas Atingido' : 
          premiumModalType === 'topic' ? 'Limite de Tópicos Atingido' :
          'Limite de Subtópicos Atingido'
        }
        description={
          premiumModalType === 'subject' 
            ? "No plano Free, você pode ter apenas 2 disciplinas ativas."
            : premiumModalType === 'topic'
            ? "No plano Free, cada disciplina pode ter apenas 10 tópicos."
            : "No plano Free, cada tópico pode ter apenas 10 subtópicos."
        }
        features={[
          "Planos e Disciplinas Ilimitadas",
          "Tópicos Ilimitados por Matéria",
          "Banco de Questões Completo"
        ]}
      />
    </div>
  );
}
