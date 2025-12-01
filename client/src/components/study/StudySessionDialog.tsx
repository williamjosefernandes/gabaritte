import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X, Clock, RotateCcw, Pause, Play } from "lucide-react";
import { useState, useEffect } from "react";

interface StudySessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionData: {
    subject: {
      name: string;
      color?: string;
    };
    topic: {
      name: string;
    };
    subtopic?: {
      name: string;
    };
  } | null;
}

export function StudySessionDialog({ open, onOpenChange, sessionData }: StudySessionDialogProps) {
  const [timerMode, setTimerMode] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [pomodoroInitialTime] = useState(25 * 60); // 25 minutes

  // Reset timer when dialog opens or session changes
  useEffect(() => {
    if (open) {
      setTimerRunning(false);
      setTimerSeconds(timerMode === "pomodoro" ? pomodoroInitialTime : 0);
    }
  }, [open, timerMode, pomodoroInitialTime]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && open) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (timerMode === "pomodoro") {
            return prev > 0 ? prev - 1 : 0;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, open, timerMode]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-screen h-screen border-0 rounded-none flex flex-col p-0 bg-background">
        <div className="flex-1 flex flex-col items-center justify-center relative p-8">
          {/* Close Button - More prominent */}
          <Button 
            variant="ghost" 
            className="absolute top-6 right-6 hover:bg-destructive/10 hover:text-destructive gap-2"
            onClick={() => onOpenChange(false)}
          >
            <span className="hidden sm:inline">Fechar</span>
            <X className="w-6 h-6" />
          </Button>

          {/* Subject Info */}
          <div className="text-center mb-16 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
            {sessionData ? (
              <>
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm mb-6 shadow-sm border transition-colors",
                  sessionData.subject.color ? sessionData.subject.color.replace('bg-', 'bg-').replace('500', '100 text-') + sessionData.subject.color.replace('bg-', '') : "bg-primary/10 text-primary"
                )}>
                  {sessionData.subject.name}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                  {sessionData.subtopic ? sessionData.subtopic.name : sessionData.topic.name}
                </h2>
                {sessionData.subtopic && (
                  <p className="text-xl md:text-2xl text-muted-foreground font-light mt-2">
                    {sessionData.topic.name}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm mb-6 shadow-sm border bg-primary/10 text-primary">
                  Sessão Livre
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                  Foco Total
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-light mt-2">
                  Cronometre seus estudos sem meta definida
                </p>
              </>
            )}
          </div>

          {/* Timer Display & Controls */}
          <div className="flex flex-col items-center mb-16 w-full max-w-md">
            {/* Timer Mode Selection - Better UI */}
            <div className="grid grid-cols-2 bg-muted p-1 rounded-full w-full mb-10 relative">
              <div 
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-full shadow-sm transition-all duration-300 ease-out",
                  timerMode === "pomodoro" ? "left-[calc(50%+2px)]" : "left-1"
                )}
              />
              <button
                className={cn(
                  "relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-full transition-colors duration-200",
                  timerMode === "stopwatch" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                )}
                onClick={() => {
                  setTimerMode("stopwatch");
                  setTimerRunning(false);
                  setTimerSeconds(0);
                }}
              >
                <Clock className="w-4 h-4" /> Cronômetro
              </button>
              <button
                className={cn(
                  "relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-full transition-colors duration-200",
                  timerMode === "pomodoro" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                )}
                onClick={() => {
                  setTimerMode("pomodoro");
                  setTimerRunning(false);
                  setTimerSeconds(pomodoroInitialTime);
                }}
              >
                <RotateCcw className="w-4 h-4" /> Pomodoro
              </button>
            </div>

            {/* Timer Numbers */}
            <div className={cn(
              "text-9xl font-mono font-bold tracking-tighter tabular-nums mb-10 transition-colors duration-500 select-none",
              timerRunning 
                ? (timerMode === "pomodoro" ? "text-orange-500" : "text-blue-500") 
                : "text-foreground"
            )}>
              {formatTime(timerSeconds)}
            </div>
            
            {/* Main Controls */}
            <div className="flex items-center gap-6">
               <Button 
                size="icon" 
                variant="outline" 
                className="h-14 w-14 rounded-full border-2 hover:bg-muted/50"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(timerMode === "pomodoro" ? pomodoroInitialTime : 0);
                }}
                title="Reiniciar"
              >
                <RotateCcw className="w-6 h-6 text-muted-foreground" />
              </Button>

              <Button 
                size="lg" 
                className={cn(
                  "h-24 w-24 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                  timerRunning 
                    ? "bg-amber-500 hover:bg-amber-600 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
              </Button>

              {/* Placeholder for potentially another button (e.g. Save Session) */}
              <div className="w-14" /> 
            </div>
          </div>

          {/* Footer / Status */}
          <div className="absolute bottom-8 text-sm text-muted-foreground animate-pulse">
            {timerRunning ? "Sessão em andamento..." : "Pronto para começar"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}