import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { Activity } from "@/types/dashboard";

interface RecentActivityFeedProps {
  activities: Activity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'study':
        return 'bg-blue-500';
      case 'quiz':
        return 'bg-amber-500';
      case 'plan':
        return 'bg-purple-500';
      case 'achievement':
        return 'bg-emerald-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Atividade Recente</h3>
        <Link href="/history">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className={`p-4 flex gap-4 items-start transition-all hover:bg-muted/50 ${
                index !== activities.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="mt-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 ${getActivityColor(activity.type)}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <div className="flex justify-between items-center mt-1 gap-2">
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                  <div className="flex items-center gap-2">
                    {activity.score && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-2 border-border/60"
                      >
                        {activity.score}
                      </Badge>
                    )}
                    {activity.duration && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 px-2 bg-muted"
                      >
                        {activity.duration}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
