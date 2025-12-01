import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface WeeklyProgressChartProps {
  data: Array<{ day: string; hours: number }>;
}

export function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground">
            {payload[0].payload.day}
          </p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value}h estudadas
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progresso Semanal
              </CardTitle>
              <CardDescription className="mt-1">
                Horas de estudo nos últimos 7 dias
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  r: 4,
                  strokeDasharray: ""
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
