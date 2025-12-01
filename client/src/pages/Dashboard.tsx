import { useState } from "react";
import { Clock, Sparkles } from "lucide-react";
import {
  activePlan,
  todaysSchedule,
  stats,
  recentActivity,
  userProfile,
  mockSubjects,
  currentUser
} from "@/lib/mockData";
import { StudySessionDialog } from "@/components/study/StudySessionDialog";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { StatCard } from "@/components/dashboard/StatCard";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { TodaysSchedule } from "@/components/dashboard/TodaysSchedule";
import { ActivePlanProgress } from "@/components/dashboard/ActivePlanProgress";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { AIMentorWidget } from "@/components/dashboard/AIMentorWidget";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";
import { SubjectsBarChart } from "@/components/dashboard/SubjectsBarChart";
import { TimeDistributionChart } from "@/components/dashboard/TimeDistributionChart";
import { Target, BookOpen, TrendingUp, Award } from "lucide-react";

export default function Dashboard() {
  const [isStudySessionOpen, setIsStudySessionOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    subject: { name: string; color?: string };
    topic: { name: string };
    subtopic?: { name: string };
  } | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleStartSession = (task?: any) => {
    const targetTask = task || todaysSchedule.find(t => t.status === 'active') || {
      subject: "Direito Constitucional",
      topic: "Controle de Constitucionalidade",
      type: "theory"
    };

    setActiveSession({
      subject: {
        name: targetTask.subject,
        color: 'bg-blue-500'
      },
      topic: { name: targetTask.topic },
      subtopic: undefined
    });
    setIsStudySessionOpen(true);
  };

  const weeklyData = [
    { day: 'Seg', hours: stats.weeklyHours[0] },
    { day: 'Ter', hours: stats.weeklyHours[1] },
    { day: 'Qua', hours: stats.weeklyHours[2] },
    { day: 'Qui', hours: stats.weeklyHours[3] },
    { day: 'Sex', hours: stats.weeklyHours[4] },
    { day: 'Sáb', hours: stats.weeklyHours[5] },
    { day: 'Dom', hours: stats.weeklyHours[6] }
  ];

  const subjectDistributionData = activePlan.subjects.slice(0, 5).map(subject => ({
    subject: subject.name,
    hours: Math.random() * 20 + 5,
    color: subject.color.replace('bg-', 'hsl(var(--') + '))'
      .replace('blue-500', 'chart-1')
      .replace('indigo-500', 'chart-2')
      .replace('emerald-500', 'chart-3')
      .replace('amber-500', 'chart-4')
      .replace('rose-500', 'chart-5')
  }));

  const timeDistributionData = activePlan.subjects.slice(0, 5).map(subject => ({
    subject: subject.name,
    hours: Math.random() * 10 + 2,
    color: subject.color.replace('bg-', '#')
      .replace('blue-500', '3b82f6')
      .replace('indigo-500', '6366f1')
      .replace('emerald-500', '10b981')
      .replace('amber-500', 'f59e0b')
      .replace('rose-500', 'f43f5e')
  }));

  const totalHoursStudied = stats.weeklyHours.reduce((acc, curr) => acc + curr, 0);
  const avgHoursPerDay = (totalHoursStudied / 7).toFixed(1);

  return (
    <div className="space-y-8 pb-8">
      <WelcomeHero
        userProfile={userProfile}
        stats={stats}
        planName={activePlan.name}
        monthlyProgress={stats.monthlyProgress}
        onStartSession={() => handleStartSession()}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Estudos"
          value={stats.questionsSolved}
          icon={BookOpen}
          trend={{ value: 12, isPositive: true }}
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          label="Tempo Total"
          value={`${totalHoursStudied}h`}
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
          color="bg-emerald-500"
          delay={0.05}
        />
        <StatCard
          label="Sequência Atual"
          value={`${stats.streak} dias`}
          icon={Target}
          trend={{ value: 5, isPositive: true }}
          color="bg-amber-500"
          delay={0.1}
        />
        <StatCard
          label="Desempenho"
          value={`${stats.accuracy}%`}
          icon={Award}
          trend={{ value: 3, isPositive: true }}
          color="bg-purple-500"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TodaysSchedule
            tasks={todaysSchedule}
            subjects={mockSubjects}
            onStartSession={handleStartSession}
          />

          <ActivePlanProgress plan={activePlan} />
        </div>

        <div className="space-y-8">
          <QuickActions />

          <RecentActivityFeed activities={recentActivity} />

          <AIMentorWidget
            isPremium={currentUser.plan === 'premium'}
            onUpgradeClick={() => setShowPremiumModal(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyProgressChart data={weeklyData} />
        </div>
        <div>
          <TimeDistributionChart data={timeDistributionData} />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <SubjectsBarChart data={subjectDistributionData} />
      </div>

      <StudySessionDialog
        open={isStudySessionOpen}
        onOpenChange={setIsStudySessionOpen}
        sessionData={activeSession}
      />

      <PremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
      />
    </div>
  );
}
