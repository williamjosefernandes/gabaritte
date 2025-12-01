import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Zap,
  Sparkles,
  BrainCircuit,
  TrendingUp,
  Lightbulb,
  ArrowUpRight,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIMentorWidgetProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export function AIMentorWidget({ isPremium, onUpgradeClick }: AIMentorWidgetProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiStep, setAiStep] = useState<'analyzing' | 'result'>('analyzing');

  const handleOpenAiMentor = () => {
    setIsDialogOpen(true);
    setAiStep('analyzing');

    setTimeout(() => {
      setAiStep('result');
    }, 3000);
  };

  const handleApplyAiChanges = () => {
    setIsDialogOpen(false);
    toast({
      title: "Rotina Otimizada",
      description: "As sugestões do Mentor IA foram aplicadas ao seu cronograma.",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card
          className="bg-gradient-to-br from-primary to-purple-700 text-white border-none overflow-hidden relative shadow-xl group cursor-pointer"
          onClick={handleOpenAiMentor}
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl transition-all group-hover:bg-white/20" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transition-all group-hover:bg-white/20" />

          <CardHeader className="relative z-10">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              IA Mentor ✨
            </CardTitle>
            <CardDescription className="text-white/80">
              Receba recomendações personalizadas baseadas no seu desempenho.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-0">
            <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
              Ativar Mentoria IA
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <AnimatePresence mode="wait">
            {aiStep === 'analyzing' ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-10 text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <BrainCircuit className="w-16 h-16 text-primary animate-pulse relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    Analisando seu Desempenho...
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    A IA está verificando seus pontos fracos e otimizando seu tempo de
                    revisão.
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processando dados</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-1.5 w-full" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-2"
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Sugestões do Mentor IA
                  </DialogTitle>
                  <DialogDescription>
                    Encontramos 3 oportunidades de melhoria para sua rotina de hoje.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg flex gap-3">
                    <div className="mt-0.5 p-1.5 bg-blue-100 dark:bg-blue-800 rounded-full h-fit">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                        Reforço em Constitucional
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                        Adicionado 30min de teoria focada em "Direitos Sociais" devido aos
                        erros recentes.
                      </p>
                    </div>
                  </div>

                  {!isPremium ? (
                    <div className="relative overflow-hidden rounded-lg border border-dashed bg-muted/30 p-4">
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px] z-10">
                        <Lock className="w-5 h-5 text-muted-foreground mb-2" />
                        <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                          Sugestões Avançadas Bloqueadas
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={onUpgradeClick}
                        >
                          Premium
                        </Button>
                      </div>
                      <div className="flex gap-3 opacity-40">
                        <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-800 rounded-full h-fit">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                            Revisão Espaçada
                          </h4>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                            Movido "Português: Crase" para amanhã para otimizar a curva de
                            esquecimento.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-lg flex gap-3">
                        <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-800 rounded-full h-fit">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                            Revisão Espaçada
                          </h4>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                            Movido "Português: Crase" para amanhã para otimizar a curva de
                            esquecimento.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-lg flex gap-3">
                        <div className="mt-0.5 p-1.5 bg-green-100 dark:bg-green-800 rounded-full h-fit">
                          <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">
                            Meta de Questões Aumentada
                          </h4>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                            Sugerimos aumentar sua meta diária para 25 questões hoje.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Ignorar
                  </Button>
                  <Button
                    onClick={handleApplyAiChanges}
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Sparkles className="w-4 h-4" /> Aplicar{' '}
                    {!isPremium ? 'Básico' : 'Otimizações'}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
