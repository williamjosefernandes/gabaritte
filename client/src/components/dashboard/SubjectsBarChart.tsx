import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart2 } from "lucide-react";

interface SubjectsBarChartProps {
  data: Array<{ subject: string; hours: number; color: string }>;
}

export function SubjectsBarChart({ data }: SubjectsBarChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground">
            {payload[0].payload.subject}
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
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Disciplinas Estudadas
              </CardTitle>
              <CardDescription className="mt-1">
                Distribuição de tempo por matéria
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="subject"
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dy={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="hours"
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
