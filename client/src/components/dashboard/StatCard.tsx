import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "bg-primary",
  delay = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-3 rounded-xl",
              color.replace('bg-', 'bg-') + '/10'
            )}>
              <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
            </div>

            {trend && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(trend.value)}%
              </motion.div>
            )}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.1 }}
              className="text-3xl font-bold text-foreground mb-1"
            >
              {value}
            </motion.div>
            <p className="text-sm text-muted-foreground font-medium">
              {label}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
