# Dashboard Components Showcase

Visual guide and usage examples for all Dashboard components.

## 📊 StatCard

**Visual**: Compact card with icon, number, label, and trend indicator.

```tsx
import { StatCard } from '@/components/dashboard';
import { BookOpen, Clock, Target, Award } from 'lucide-react';

// Example 1: Total Studies
<StatCard
  label="Total de Estudos"
  value={1250}
  icon={BookOpen}
  trend={{ value: 12, isPositive: true }}
  color="bg-blue-500"
  delay={0}
/>

// Example 2: Total Time
<StatCard
  label="Tempo Total"
  value="18.5h"
  icon={Clock}
  trend={{ value: 8, isPositive: true }}
  color="bg-emerald-500"
  delay={0.05}
/>

// Example 3: Negative Trend
<StatCard
  label="Taxa de Acerto"
  value="72%"
  icon={Target}
  trend={{ value: 5, isPositive: false }}
  color="bg-amber-500"
  delay={0.1}
/>

// Example 4: No Trend
<StatCard
  label="Nível Atual"
  value={12}
  icon={Award}
  color="bg-purple-500"
  delay={0.15}
/>
```

**Props**:
- `label: string` - Card label text
- `value: string | number` - Main display value
- `icon: LucideIcon` - Icon component from lucide-react
- `trend?: { value: number, isPositive: boolean }` - Optional trend indicator
- `color?: string` - Tailwind color class (default: "bg-primary")
- `delay?: number` - Animation delay in seconds

---

## 👋 WelcomeHero

**Visual**: Full-width gradient banner with user info and stats.

```tsx
import { WelcomeHero } from '@/components/dashboard';

<WelcomeHero
  userProfile={{
    name: "Alex Silva",
    email: "alex@example.com",
    avatar: "https://github.com/shadcn.png",
    level: 12,
    xp: 4500,
    nextLevelXp: 5000
  }}
  stats={{
    streak: 14,
    questionsSolved: 1250,
    weeklyHours: [4, 3.5, 5, 4.2, 2, 0, 0],
    monthlyProgress: 42,
    accuracy: 78
  }}
  planName="Concurso Receita Federal"
  monthlyProgress={42}
  onStartSession={() => handleStartSession()}
/>
```

**Props**:
- `userProfile: UserProfile` - User data with name, avatar, level, XP
- `stats: Stats` - User statistics (streak, questions solved)
- `planName: string` - Active plan name
- `monthlyProgress: number` - Progress percentage (0-100)
- `onStartSession: () => void` - Callback for "Continue Studying" button

---

## 📅 TodaysSchedule

**Visual**: List of scheduled tasks with time slots and status indicators.

```tsx
import { TodaysSchedule } from '@/components/dashboard';

<TodaysSchedule
  tasks={[
    {
      id: 1,
      subject: "Direito Constitucional",
      topic: "Direitos Fundamentais",
      duration: "60 min",
      status: "completed",
      time: "08:00 - 09:00"
    },
    {
      id: 2,
      subject: "Contabilidade",
      topic: "Balanço Patrimonial",
      duration: "90 min",
      status: "active",
      time: "09:30 - 11:00"
    },
    {
      id: 3,
      subject: "Português",
      topic: "Crase",
      duration: "45 min",
      status: "pending",
      time: "14:00 - 14:45"
    }
  ]}
  subjects={[
    { id: 1, name: "Direito Constitucional" },
    { id: 2, name: "Português" }
  ]}
  onStartSession={(task) => console.log('Starting', task)}
/>
```

**Props**:
- `tasks: ScheduleTask[]` - Array of scheduled tasks
- `subjects: Array<{ id: number, name: string }>` - Available subjects for new activities
- `onStartSession: (task: ScheduleTask) => void` - Callback when starting a session

---

## 📈 ActivePlanProgress

**Visual**: Overview card and mini-cards showing plan and subject progress.

```tsx
import { ActivePlanProgress } from '@/components/dashboard';

<ActivePlanProgress
  plan={{
    id: 1,
    name: "Concurso Receita Federal",
    type: "Concurso",
    deadline: "2025-12-15",
    dailyGoalHours: 4,
    progress: 35,
    color: "bg-blue-600",
    startDate: "2025-01-01",
    endDate: "2025-12-15",
    subjects: [
      { name: "Direito Constitucional", progress: 60, color: "bg-blue-500" },
      { name: "Direito Administrativo", progress: 45, color: "bg-indigo-500" },
      { name: "Contabilidade Geral", progress: 20, color: "bg-emerald-500" },
      { name: "Português", progress: 80, color: "bg-amber-500" }
    ]
  }}
/>
```

**Props**:
- `plan: ActivePlan` - Active study plan with subjects

---

## ⚡ QuickActions

**Visual**: 2x2 grid of icon buttons for quick navigation.

```tsx
import { QuickActions } from '@/components/dashboard';

// No props needed - internally configured
<QuickActions />
```

**Fixed Actions**:
1. Novo Plano → `/plans/new`
2. Disciplinas → `/subjects`
3. Estatísticas → `/stats`
4. Conquistas → `/history`

---

## 📜 RecentActivityFeed

**Visual**: Timeline-style list of recent user activities.

```tsx
import { RecentActivityFeed } from '@/components/dashboard';

<RecentActivityFeed
  activities={[
    {
      id: 1,
      type: "study",
      title: "Estudou Direito Constitucional",
      time: "2 horas atrás",
      duration: "60m"
    },
    {
      id: 2,
      type: "quiz",
      title: "Simulado de Contabilidade",
      time: "Ontem",
      score: "85%"
    },
    {
      id: 3,
      type: "plan",
      title: "Criou plano 'Receita Federal'",
      time: "3 dias atrás"
    },
    {
      id: 4,
      type: "achievement",
      title: "Conquistou 'Sequência de 7 dias'",
      time: "1 semana atrás"
    }
  ]}
/>
```

**Props**:
- `activities: Activity[]` - Array of activities with type, title, time, optional score/duration

**Activity Types**:
- `study` - Blue dot
- `quiz` - Amber dot
- `plan` - Purple dot
- `achievement` - Emerald dot

---

## 🤖 AIMentorWidget

**Visual**: Gradient card that opens AI analysis dialog.

```tsx
import { AIMentorWidget } from '@/components/dashboard';

<AIMentorWidget
  isPremium={false}
  onUpgradeClick={() => setShowPremiumModal(true)}
/>
```

**Props**:
- `isPremium: boolean` - Whether user has premium plan
- `onUpgradeClick: () => void` - Callback for premium upgrade button

**Free Users**: Show 1 basic suggestion + 2 locked advanced suggestions
**Premium Users**: Show all 3 suggestions unlocked

---

## 📊 WeeklyProgressChart

**Visual**: Line chart with 7 data points (Mon-Sun).

```tsx
import { WeeklyProgressChart } from '@/components/dashboard';

<WeeklyProgressChart
  data={[
    { day: 'Seg', hours: 4 },
    { day: 'Ter', hours: 3.5 },
    { day: 'Qua', hours: 5 },
    { day: 'Qui', hours: 4.2 },
    { day: 'Sex', hours: 2 },
    { day: 'Sáb', hours: 0 },
    { day: 'Dom', hours: 0 }
  ]}
/>
```

**Props**:
- `data: WeeklyProgressData[]` - Array of day/hours objects

**Features**:
- Interactive tooltips
- Smooth line with dots
- Responsive height (280px)

---

## 📊 SubjectsBarChart

**Visual**: Vertical bar chart with color-coded subjects.

```tsx
import { SubjectsBarChart } from '@/components/dashboard';

<SubjectsBarChart
  data={[
    { subject: 'Direito Constitucional', hours: 15, color: '#3b82f6' },
    { subject: 'Português', hours: 12, color: '#f59e0b' },
    { subject: 'Contabilidade', hours: 8, color: '#10b981' },
    { subject: 'Raciocínio Lógico', hours: 6, color: '#8b5cf6' },
    { subject: 'Informática', hours: 4, color: '#ec4899' }
  ]}
/>
```

**Props**:
- `data: SubjectDistribution[]` - Array of subject/hours/color objects

**Features**:
- Rounded bar tops
- Angled labels
- Custom colors per subject

---

## 🥧 TimeDistributionChart

**Visual**: Pie chart with percentage labels on slices.

```tsx
import { TimeDistributionChart } from '@/components/dashboard';

<TimeDistributionChart
  data={[
    { subject: 'Direito Constitucional', hours: 10, color: '#3b82f6' },
    { subject: 'Português', hours: 8, color: '#f59e0b' },
    { subject: 'Contabilidade', hours: 6, color: '#10b981' },
    { subject: 'Raciocínio Lógico', hours: 4, color: '#8b5cf6' },
    { subject: 'Informática', hours: 2, color: '#ec4899' }
  ]}
/>
```

**Props**:
- `data: SubjectDistribution[]` - Array of subject/hours/color objects

**Features**:
- Percentage labels inside slices
- Custom legend at bottom
- Responsive sizing

---

## 🎨 Color Palette Reference

```tsx
// Primary Colors
"bg-blue-500"     // #3b82f6 - Primary actions, charts
"bg-emerald-500"  // #10b981 - Success, completed
"bg-amber-500"    // #f59e0b - Warning, pending
"bg-red-500"      // #ef4444 - Error, danger
"bg-purple-500"   // #a855f7 - Info, premium
"bg-indigo-500"   // #6366f1 - Alternative blue

// Semantic Colors
"text-foreground"       // Adapts to theme
"text-muted-foreground" // Secondary text
"bg-background"         // Page background
"bg-card"              // Card background
"border-border"        // Border color
```

---

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints used:
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Small desktops
xl: 1280px  // Large desktops

// Example usage:
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

---

## ⚡ Animation Delays

Stagger animations for smooth sequential loading:

```tsx
// StatCards (0.05s intervals)
<StatCard delay={0} />     // First card
<StatCard delay={0.05} />  // Second card
<StatCard delay={0.1} />   // Third card
<StatCard delay={0.15} />  // Fourth card

// Sections (0.1s intervals)
<WelcomeHero />           // delay: 0
<TodaysSchedule />        // delay: 0.1
<ActivePlanProgress />    // delay: 0.2
<QuickActions />          // delay: 0.5
<RecentActivityFeed />    // delay: 0.6
<AIMentorWidget />        // delay: 0.7
```

---

## 🔧 Common Patterns

### Full Dashboard Layout

```tsx
export default function Dashboard() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <WelcomeHero {...} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard {...} />
        <StatCard {...} />
        <StatCard {...} />
        <StatCard {...} />
      </div>

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TodaysSchedule {...} />
          <ActivePlanProgress {...} />
        </div>
        <div className="space-y-8">
          <QuickActions />
          <RecentActivityFeed {...} />
          <AIMentorWidget {...} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyProgressChart {...} />
        </div>
        <div>
          <TimeDistributionChart {...} />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <SubjectsBarChart {...} />
      </div>
    </div>
  );
}
```

### Loading State Pattern

```tsx
// For each component, add loading state
{isLoading ? (
  <Card className="animate-pulse">
    <CardContent className="h-32 bg-muted" />
  </Card>
) : (
  <StatCard {...} />
)}
```

### Error State Pattern

```tsx
// For each component, add error handling
{error ? (
  <Card>
    <CardContent className="text-destructive">
      Erro ao carregar dados
    </CardContent>
  </Card>
) : (
  <StatCard {...} />
)}
```

---

## 📚 Import Examples

```tsx
// Individual imports
import { StatCard } from '@/components/dashboard/StatCard';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';

// Barrel imports (recommended)
import {
  StatCard,
  WelcomeHero,
  TodaysSchedule,
  ActivePlanProgress,
  QuickActions,
  RecentActivityFeed,
  AIMentorWidget,
  WeeklyProgressChart,
  SubjectsBarChart,
  TimeDistributionChart
} from '@/components/dashboard';

// Type imports
import type {
  UserProfile,
  Stats,
  ScheduleTask,
  ActivePlan,
  Activity
} from '@/types/dashboard';
```
