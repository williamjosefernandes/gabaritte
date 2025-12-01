import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle2, Star } from "lucide-react";
import { useLocation } from "wouter";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  features?: string[];
}

export function PremiumModal({ open, onOpenChange, title, description, features }: PremiumModalProps) {
  const [, setLocation] = useLocation();

  const defaultFeatures = [
    "Acesso Ilimitado a Todos os Recursos",
    "Inteligência Artificial Avançada",
    "Banco de Questões Completo"
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/5">
            <Crown className="w-8 h-8 text-primary fill-primary/20" />
          </div>
          <DialogTitle className="text-2xl text-center font-display">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2 text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-3">
          {displayFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-center gap-3 flex-col sm:flex-row">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">
            Talvez Depois
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0 shadow-lg shadow-primary/20"
            onClick={() => {
              onOpenChange(false);
              setLocation("/subscription");
            }}
          >
            <Star className="w-4 h-4 fill-current" /> Fazer Upgrade Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
