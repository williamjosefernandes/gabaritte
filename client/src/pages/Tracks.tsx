import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  Shield,
  Scale,
  Code,
  GraduationCap,
  Globe,
  Briefcase,
  Stethoscope,
  Calculator,
  PenTool,
  Bot,
  UserCircle,
  Plus,
  Heart,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { tracks, currentUser } from "@/lib/mockData";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { Lock } from "lucide-react";

const categories = [
  "Todas",
  "Concurso Público",
  "Vestibular",
  "ENEM",
  "Idiomas",
  "Certificação",
  "Faculdade",
  "Profissão",
  "Outros"
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

export default function Tracks() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sourceFilter, setSourceFilter] = useState<"all" | "official" | "community" | "saved">("all");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const filteredTracks = tracks.filter(track => {
    const matchesCategory = selectedCategory === "Todas" || track.category === selectedCategory;
    const matchesSource = sourceFilter === "all" || 
                          (sourceFilter === "saved" ? track.saved : track.author.type === sourceFilter);
    return matchesCategory && matchesSource;
  });

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-6 h-6" />
          <span className="text-sm font-semibold uppercase tracking-wider">Gabaritte AI</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight max-w-2xl">
          Trilhas de Aprendizado Inteligentes
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Descubra planos de estudo completos com disciplinas, tópicos e subtópicos, criados pela nossa IA ou pela comunidade de estudantes.
        </p>
        <Button onClick={() => {
          if (currentUser.plan === 'free') {
            setShowPremiumModal(true);
          } else {
            setLocation("/tracks/new");
          }
        }} className="w-fit gap-2 mt-2">
          {currentUser.plan === 'free' ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
          Criar Nova Trilha
        </Button>
      </div>

      {/* Source Toggles */}
      <div className="flex justify-center md:justify-start">
        <div className="bg-muted/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setSourceFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${sourceFilter === "all" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Todas as Trilhas
          </button>
          <button
            onClick={() => setSourceFilter("official")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${sourceFilter === "official" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bot className="w-4 h-4" />
            Gabaritte AI
          </button>
          <button
            onClick={() => setSourceFilter("community")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${sourceFilter === "community" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Users className="w-4 h-4" />
            Comunidade
          </button>
          <button
            onClick={() => setSourceFilter("saved")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${sourceFilter === "saved" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Heart className={`w-4 h-4 ${sourceFilter === "saved" ? "fill-current" : ""}`} />
            Salvas
          </button>
        </div>
      </div>

      <Tabs defaultValue="Todas" className="w-full" onValueChange={setSelectedCategory}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-max md:w-full justify-start md:justify-center h-auto p-1 bg-muted/50 gap-1">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTracks.map((track) => {
              const totalSubjects = track.subjects?.length || 0;
              const totalTopics = track.subjects?.reduce((acc, s) => acc + s.topics.length, 0) || 0;

              return (
                <motion.div 
                  variants={item} 
                  key={track.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/30 group overflow-hidden">
                    <div className={`h-2 w-full ${track.color}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${track.color} bg-opacity-10 text-white`}>
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${track.color}`}>
                              <track.icon className="w-6 h-6" />
                           </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1 border-warning/50 text-warning bg-warning/5">
                          <Star className="w-3 h-3 fill-warning" /> {track.rating}
                        </Badge>
                      </div>
                      
                      {/* Author Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        {track.author.type === "official" ? (
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent gap-1 pl-1.5 pr-2 h-6">
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Sparkles className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-[10px] font-semibold">Gabaritte AI</span>
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={track.author.avatar || ""} />
                              <AvatarFallback className="text-[8px] bg-muted-foreground/20">U</AvatarFallback>
                            </Avatar>
                            <span>{track.author.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] font-normal mb-1 border-primary/20 text-primary bg-primary/5">{track.category}</Badge>
                        <CardTitle className="text-xl">{track.title}</CardTitle>
                        <CardDescription className="font-medium text-foreground/80">{track.role}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6 pt-2">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {track.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {track.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground pt-4 border-t mt-auto">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{track.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{track.users} alunos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{totalSubjects} disciplinas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{totalTopics} tópicos</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 bg-muted/20 mt-auto">
                      <Button 
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-white transition-colors"
                        onClick={() => {
                          // Allow viewing only the first track for free users, or simple tracks
                          if (currentUser.plan === 'free' && track.id !== 1) {
                            setShowPremiumModal(true);
                          } else {
                            setLocation(`/tracks/${track.id}`);
                          }
                        }}
                      >
                        {currentUser.plan === 'free' && track.id !== 1 ? (
                          <>
                            <Lock className="w-4 h-4" /> Bloqueado (Premium)
                          </>
                        ) : (
                          <>
                            Detalhes da Trilha <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          {filteredTracks.length === 0 && (
            <div className="text-center py-16 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
              <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma trilha encontrada</h3>
              <p>Tente mudar os filtros de categoria ou origem.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal}
        title="Acesso a Trilhas Premium"
        description="No plano Free, você tem acesso a apenas uma trilha simples. Desbloqueie todas as trilhas criadas pela IA e pela comunidade."
        features={[
          "Acesso a Todas as Trilhas",
          "Criação de Trilhas Ilimitadas",
          "Trilhas de Especialistas",
          "Download de Materiais"
        ]}
      />
    </motion.div>
  );
}