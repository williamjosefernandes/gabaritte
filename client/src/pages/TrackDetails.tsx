import { useRoute, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  Award,
  Share2,
  Heart,
  Download,
  Shield,
  Code,
  Scale,
  Stethoscope,
  Calculator,
  PenTool,
  Globe,
  Briefcase,
  GraduationCap,
  BookOpen,
  ChevronRight,
  Sparkles,
  Bot,
  UserCircle,
  Layers,
  ListChecks,
  Check,
  ThumbsUp,
  ThumbsDown,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockSubjects, tracks } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const reviewSchema = z.object({
  rating: z.string(),
  comment: z.string().min(10, "O comentário deve ter pelo menos 10 caracteres"),
});

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: {
      name: "Ana Souza",
      avatar: "https://github.com/shadcn.png",
    },
    rating: 5,
    date: "Há 2 dias",
    comment: "Excelente trilha! O conteúdo de Contabilidade foi fundamental para minha aprovação. A estrutura de tópicos é muito bem organizada e me ajudou a não me perder nos estudos.",
    likes: 24,
    liked: false
  },
  {
    id: 2,
    user: {
      name: "Carlos Oliveira",
      avatar: null,
    },
    rating: 4,
    date: "Há 1 semana",
    comment: "Muito bom, mas achei que poderia ter mais questões comentadas de Direito Administrativo. De resto, a organização é impecável.",
    likes: 12,
    liked: true
  },
  {
    id: 3,
    user: {
      name: "Mariana Lima",
      avatar: "https://github.com/shadcn.png",
    },
    rating: 5,
    date: "Há 2 semanas",
    comment: "Simplesmente a melhor trilha que já segui. Consegui fechar o edital em 5 meses seguindo esse cronograma. Recomendo demais!",
    likes: 45,
    liked: false
  }
];

export default function TrackDetails() {
  const [match, params] = useRoute("/tracks/:id");
  const [location, setLocation] = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Simulates if user has started this track
  const [reviews, setReviews] = useState(mockReviews);
  
  const id = params?.id ? parseInt(params.id) : 1;
  const track = tracks.find(t => t.id === id) || tracks[0]; 

  const TrackIcon = track.icon;

  useEffect(() => {
    // Check if user has "started" this track (simulated via localStorage)
    const started = localStorage.getItem(`track_started_${id}`);
    if (started) {
      setHasStarted(true);
    }
  }, [id]);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "5",
      comment: "",
    },
  });

  // Calculate summary stats
  const totalSubjects = track.subjects?.length || 0;
  const totalTopics = track.subjects?.reduce((acc, s) => acc + s.topics.length, 0) || 0;
  const totalSubtopics = track.subjects?.reduce((acc, s) => acc + s.topics.reduce((tAcc, t) => tAcc + t.subtopics.length, 0), 0) || 0;

  // Calculate total hours from subtopics (mock logic for duration strings like "90m", "2h")
  const totalMinutes = track.subjects?.reduce((acc, s) => {
    return acc + s.topics.reduce((tAcc, t) => {
      return tAcc + t.subtopics.reduce((stAcc, st) => {
        const duration = st.duration || "0m";
        let minutes = 0;
        if (duration.includes("h")) {
            const parts = duration.split("h");
            minutes += parseInt(parts[0]) * 60;
            if (parts[1] && parts[1].includes("m")) {
                minutes += parseInt(parts[1].replace("m", ""));
            }
        } else if (duration.includes("m")) {
            minutes += parseInt(duration.replace("m", ""));
        }
        return stAcc + minutes;
      }, 0);
    }, 0);
  }, 0) || 0;
  
  const totalHours = Math.floor(totalMinutes / 60);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Trilha salva nos seus favoritos!", {
        description: "Você pode acessá-la na sua área de estudos."
      });
    } else {
      toast.info("Trilha removida dos favoritos.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado!", {
      description: "Compartilhe essa trilha com seus amigos."
    });
  };

  const handleStartTrack = () => {
    // Mark as started in localStorage for simulation
    localStorage.setItem(`track_started_${id}`, "true");
    
    toast.success("Iniciando criação do plano", {
      description: `Utilizando a estrutura da trilha: ${track.title}`
    });
    
    // Navigate to NewPlan with trackId param
    // Note: wouter doesn't support query params in setLocation directly in a structured way, but string works
    setLocation(`/plans/new?trackId=${track.id}`);
  };

  const handleDownload = () => {
    setIsDownloadOpen(true);
  };

  const handleDownloadConfirm = (format: string) => {
    setIsDownloadOpen(false);
    toast.success(`Download iniciado (${format})`, {
      description: "O arquivo será salvo no seu dispositivo em instantes."
    });
  };

  const onSubmitReview = (values: z.infer<typeof reviewSchema>) => {
    const newReview = {
      id: Date.now(),
      user: {
        name: "Você",
        avatar: "https://github.com/shadcn.png",
      },
      rating: parseInt(values.rating),
      date: "Agora mesmo",
      comment: values.comment,
      likes: 0,
      liked: false
    };
    
    setReviews([newReview, ...reviews]);
    
    toast.success("Avaliação enviada!", {
      description: "Obrigado por compartilhar sua opinião."
    });
    setIsReviewOpen(false);
    form.reset();
  };

  const toggleLikeReview = (reviewId: number) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          likes: review.liked ? review.likes - 1 : review.likes + 1,
          liked: !review.liked
        };
      }
      return review;
    }));
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      {/* Navigation */}
      <Button 
        variant="ghost" 
        className="pl-0 hover:bg-transparent hover:text-primary gap-2"
        onClick={() => setLocation("/tracks")}
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para Trilhas
      </Button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-sm py-1 px-3 border-primary/20 text-primary bg-primary/5">
                {track.category}
              </Badge>
              
              {/* Author Badge */}
              {track.author.type === "official" ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent gap-1.5 pl-1.5 pr-3 h-7">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold">Gabaritte AI</span>
                </Badge>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-transparent">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={track.author.avatar || ""} />
                    <AvatarFallback className="text-[9px] bg-muted-foreground/20">U</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{track.author.name}</span>
                </div>
              )}

              <Badge variant="secondary" className="text-sm py-1 px-3 ml-auto md:ml-0">
                {track.tags[0]}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              {track.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {track.longDescription || track.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-full">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{track.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-full">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{track.subjects ? track.subjects.length : 0} Disciplinas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{track.users} Alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-full">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                </div>
                <span className="font-medium">{track.rating} (520 avaliações)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
             <Button 
               size="lg" 
               className="text-base px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex-1 sm:flex-none"
               onClick={handleStartTrack}
             >
               Começar Trilha Agora
               <PlayCircle className="w-5 h-5 ml-2" />
             </Button>
             <Button 
               size="lg" 
               variant="outline" 
               className="text-base h-12 flex-1 sm:flex-none"
               onClick={handleDownload}
             >
               Baixar Cronograma
               <Download className="w-5 h-5 ml-2" />
             </Button>
             
             <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Baixar Cronograma</DialogTitle>
                    <DialogDescription>
                      Escolha o formato para exportar o cronograma desta trilha.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 py-4">
                    <Button variant="outline" className="justify-start h-16 px-4 hover:bg-primary/5 border-muted hover:border-primary/30 transition-all" onClick={() => handleDownloadConfirm("PDF")}>
                      <div className="p-2 bg-red-100 rounded-lg mr-4">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Documento PDF</div>
                        <div className="text-xs text-muted-foreground">Ideal para impressão e leitura offline</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-16 px-4 hover:bg-primary/5 border-muted hover:border-primary/30 transition-all" onClick={() => handleDownloadConfirm("Excel")}>
                      <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                        <Calculator className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Planilha Excel</div>
                        <div className="text-xs text-muted-foreground">Para edição e personalização avançada</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-16 px-4 hover:bg-primary/5 border-muted hover:border-primary/30 transition-all" onClick={() => handleDownloadConfirm("iCal")}>
                      <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Calendário (iCal)</div>
                        <div className="text-xs text-muted-foreground">Sincronize com Google Calendar/Outlook</div>
                      </div>
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="ghost" onClick={() => setIsDownloadOpen(false)}>
                      Cancelar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 border-muted overflow-hidden shadow-lg">
            <div className={`h-32 ${track.color} relative`}>
              <div className="absolute -bottom-8 left-6 p-4 bg-background rounded-2xl shadow-sm border">
                <TrackIcon className={`w-8 h-8 ${track.color.replace("bg-", "text-")}`} />
              </div>
            </div>
            <CardHeader className="pt-12 pb-4">
              <CardTitle>Resumo da Trilha</CardTitle>
              <CardDescription>Estrutura e conteúdo incluído</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
                    <div className="flex items-center gap-2 text-primary mb-1">
                       <BookOpen className="w-4 h-4" />
                       <span className="font-semibold text-lg">{totalSubjects}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Disciplinas</p>
                 </div>
                 <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
                    <div className="flex items-center gap-2 text-primary mb-1">
                       <Layers className="w-4 h-4" />
                       <span className="font-semibold text-lg">{totalTopics}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Tópicos</p>
                 </div>
                 <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
                    <div className="flex items-center gap-2 text-primary mb-1">
                       <ListChecks className="w-4 h-4" />
                       <span className="font-semibold text-lg">{totalSubtopics}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Subtópicos</p>
                 </div>
                 <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
                    <div className="flex items-center gap-2 text-primary mb-1">
                       <Clock className="w-4 h-4" />
                       <span className="font-semibold text-lg">{totalHours}h</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Conteúdo</p>
                 </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span>Progresso Médio</span>
                   <span className="text-primary">45% em 2 meses</span>
                 </div>
                 <Progress value={45} className="h-2" />
                 <p className="text-xs text-muted-foreground">Alunos dedicam ~3h por dia</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={isSaved ? "secondary" : "outline"} 
                  className={`w-full ${isSaved ? "text-red-500 bg-red-50 hover:bg-red-100 border-red-200" : ""}`} 
                  size="sm"
                  onClick={handleSave}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} /> 
                  {isSaved ? "Salvo" : "Salvar"}
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="content" className="mt-12">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 border-b rounded-none bg-transparent space-x-6">
          <TabsTrigger 
            value="content" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
          >
            Conteúdo Programático
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
          >
            Avaliações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-bold">Disciplinas e Tópicos</h3>
             <span className="text-muted-foreground text-sm">
               {track.subjects ? track.subjects.length : 0} disciplinas • {track.subjects ? track.subjects.reduce((acc, s) => acc + s.topics.length, 0) : 0} tópicos
             </span>
          </div>
          
          <div className="space-y-4">
            {track.subjects && track.subjects.length > 0 ? (
              track.subjects.map((subject) => (
                <Card key={subject.id} className="overflow-hidden border-muted">
                  <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${subject.color} bg-opacity-10`}>
                         <BookOpen className={`w-5 h-5 ${subject.color.replace("bg-", "text-")}`} />
                      </div>
                      <h4 className="font-semibold text-lg">{subject.name}</h4>
                    </div>
                    <Badge variant="secondary" className="w-fit">{subject.topics.length} Tópicos</Badge>
                  </div>
                  
                  <Accordion type="multiple" className="w-full px-6">
                    {subject.topics.map((topic) => (
                      <AccordionItem key={topic.id} value={`topic-${topic.id}`} className="border-b last:border-0">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <span className="font-medium text-base">{topic.name}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-normal ml-2">
                              {topic.subtopics.length} subtópicos
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <div className="space-y-2 pl-4 border-l-2 border-muted ml-2">
                            {topic.subtopics.map((subtopic) => (
                              <div key={subtopic.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{subtopic.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                                    {subtopic.type === 'video' ? 'Videoaula' : subtopic.type === 'reading' ? 'Leitura' : 'Exercício'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground font-medium w-12 text-right">{subtopic.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                <p>Conteúdo programático indisponível para visualização.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {hasStarted ? (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    Avalie esta Trilha
                  </h3>
                  <p className="text-sm text-muted-foreground">Sua opinião ajuda outros estudantes a escolherem o melhor caminho.</p>
                </div>
                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                  <DialogTrigger asChild>
                    <Button>Escrever Avaliação</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Avaliar {track.title}</DialogTitle>
                      <DialogDescription>Compartilhe sua experiência com outros estudantes.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nota</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button 
                              key={rating} 
                              variant="outline" 
                              className={`w-10 h-10 p-0 hover:bg-warning/10 hover:text-warning hover:border-warning ${form.getValues("rating") === rating.toString() ? "bg-warning/10 text-warning border-warning" : ""}`}
                              onClick={() => form.setValue("rating", rating.toString())}
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Seu Comentário</Label>
                        <Textarea 
                          placeholder="O que você achou do conteúdo e estrutura?" 
                          value={form.watch("comment")}
                          onChange={(e) => form.setValue("comment", e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={form.handleSubmit(onSubmitReview)}>Enviar Avaliação</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                <div className="p-3 bg-muted rounded-full">
                  <Star className="w-6 h-6 text-muted-foreground opacity-50" />
                </div>
                <h3 className="font-medium">Avalie esta trilha</h3>
                <p className="text-sm text-muted-foreground max-w-xs">Inicie esta trilha para compartilhar sua experiência com a comunidade.</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-bold">O que dizem os alunos</h3>
               <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{track.rating}</span>
                  <div className="space-y-1">
                    <div className="flex text-warning">
                      {[1,2,3,4,5].map(i => (
                         <Star key={i} className={`w-3 h-3 ${i <= Math.round(track.rating) ? "fill-current" : "text-muted fill-muted"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Baseado em 520 avaliações</p>
                  </div>
               </div>
            </div>

            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="border-muted bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar || ""} />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{review.user.name}</h4>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex text-warning">
                            {[1,2,3,4,5].map(i => (
                               <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-current" : "text-muted/30 fill-muted/30"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 px-2 gap-1.5 text-xs hover:bg-transparent ${review.liked ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => toggleLikeReview(review.id)}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${review.liked ? "fill-current" : ""}`} />
                            {review.likes > 0 && <span>{review.likes}</span>}
                            <span className="sr-only">Curtir</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent">
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span className="sr-only">Descurtir</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}