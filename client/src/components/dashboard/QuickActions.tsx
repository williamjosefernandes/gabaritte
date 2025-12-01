import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Target, BookOpen, BarChart2, Trophy } from "lucide-react";

const quickActions = [
  {
    icon: Target,
    label: "Novo Plano",
    href: "/plans/new",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: BookOpen,
    label: "Disciplinas",
    href: "/subjects",
    color: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: BarChart2,
    label: "Estatísticas",
    href: "/stats",
    color: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: Trophy,
    label: "Conquistas",
    href: "/history",
    color: "text-purple-600 dark:text-purple-400"
  }
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col py-4 gap-2 hover:bg-muted/60 transition-all border-border/60"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-xs font-medium text-foreground">
                    {action.label}
                  </span>
                </Button>
              </motion.div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
