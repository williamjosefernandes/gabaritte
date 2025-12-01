# Dashboard Components

This directory contains modular, reusable components for the Gabaritte Dashboard.

## Components Overview

### StatCard
**Purpose**: Displays key metrics with trend indicators and animations.

**Features**:
- Configurable icon, label, and value
- Optional trend indicator (positive/negative percentage)
- Smooth animations with Framer Motion
- Hover effects with lift animation
- Customizable color themes

**Usage**:
```tsx
<StatCard
  label="Total de Estudos"
  value={1250}
  icon={BookOpen}
  trend={{ value: 12, isPositive: true }}
  color="bg-blue-500"
  delay={0}
/>
```

---

### WelcomeHero
**Purpose**: Hero section welcoming the user with personalized information.

**Features**:
- User avatar with level progression
- Monthly progress tracking
- Quick action buttons
- Streak and questions solved stats
- Gradient background with overlay image

**Usage**:
```tsx
<WelcomeHero
  userProfile={userProfile}
  stats={stats}
  planName="Concurso Receita Federal"
  monthlyProgress={42}
  onStartSession={() => handleStartSession()}
/>
```

---

### TodaysSchedule
**Purpose**: Displays and manages today's study schedule.

**Features**:
- Task status indicators (completed, active, pending)
- "Start Session" button for active tasks
- Add extra activity dialog
- Subject and topic selection
- Duration customization

**Usage**:
```tsx
<TodaysSchedule
  tasks={todaysSchedule}
  subjects={mockSubjects}
  onStartSession={handleStartSession}
/>
```

---

### ActivePlanProgress
**Purpose**: Shows progress for the currently active study plan.

**Features**:
- Overall plan progress with percentage
- Days remaining countdown
- Individual subject progress cards
- Deadline tracking
- Hover animations

**Usage**:
```tsx
<ActivePlanProgress plan={activePlan} />
```

---

### QuickActions
**Purpose**: Provides quick navigation shortcuts to key features.

**Features**:
- Grid of action buttons (Novo Plano, Disciplinas, Estatísticas, Conquistas)
- Hover scale animations
- Color-coded icons
- Responsive layout

**Usage**:
```tsx
<QuickActions />
```

---

### RecentActivityFeed
**Purpose**: Displays recent user activities with timestamps.

**Features**:
- Activity type indicators (study, quiz, plan, achievement)
- Color-coded dots for different activity types
- Score and duration badges
- Staggered animations
- Empty state support

**Usage**:
```tsx
<RecentActivityFeed activities={recentActivity} />
```

---

### AIMentorWidget
**Purpose**: AI-powered study recommendations and optimizations.

**Features**:
- Two-step dialog flow (analyzing → results)
- Basic suggestions for free users
- Advanced suggestions for premium users
- Premium upgrade prompt
- Animated brain icon during analysis

**Usage**:
```tsx
<AIMentorWidget
  isPremium={currentUser.plan === 'premium'}
  onUpgradeClick={() => setShowPremiumModal(true)}
/>
```

---

### WeeklyProgressChart
**Purpose**: Line chart showing study hours over the past week.

**Features**:
- 7-day weekly view
- Interactive tooltips
- Smooth line animations
- Responsive design
- Custom styling for light/dark mode

**Usage**:
```tsx
<WeeklyProgressChart
  data={[
    { day: 'Seg', hours: 4 },
    { day: 'Ter', hours: 3.5 },
    // ...
  ]}
/>
```

---

### SubjectsBarChart
**Purpose**: Bar chart displaying time distribution across subjects.

**Features**:
- Color-coded bars per subject
- Interactive tooltips
- Angled x-axis labels for readability
- Hover effects
- Responsive sizing

**Usage**:
```tsx
<SubjectsBarChart
  data={[
    { subject: 'Direito Constitucional', hours: 15, color: '#3b82f6' },
    // ...
  ]}
/>
```

---

### TimeDistributionChart
**Purpose**: Pie chart showing proportional time spent on each subject.

**Features**:
- Percentage labels on each slice
- Custom legend
- Interactive tooltips
- Color-coded subjects
- Responsive layout

**Usage**:
```tsx
<TimeDistributionChart
  data={[
    { subject: 'Português', hours: 12, color: '#f59e0b' },
    // ...
  ]}
/>
```

---

## Design Principles

### Colors
All components use TailwindCSS color tokens for consistency:
- Primary: Blue (`bg-blue-500`, `text-blue-600`)
- Success: Emerald (`bg-emerald-500`)
- Warning: Amber (`bg-amber-500`)
- Error: Red (`bg-red-500`)
- Info: Purple (`bg-purple-500`)

### Animations
All components use Framer Motion with consistent timing:
- Duration: 200-300ms
- Easing: Default spring for interactive elements
- Stagger: 50-100ms between items
- Hover: Scale 1.02-1.05

### Responsive Breakpoints
- Mobile: 320px - 767px (single column)
- Tablet: 768px - 1023px (2 columns)
- Desktop: 1024px+ (3-4 columns)

### Accessibility
- All interactive elements have proper ARIA labels
- Keyboard navigation fully supported
- Color contrast meets WCAG AA standards
- Screen reader friendly

---

## TypeScript Types

All component prop types are defined in `/types/dashboard.ts`:
- `UserProfile`
- `StatCardData`
- `ScheduleTask`
- `ActivePlan`
- `Stats`
- `Activity`
- `ChartDataPoint`
- `WeeklyProgressData`
- `SubjectDistribution`

---

## Dark Mode Support

All components are fully compatible with dark mode:
- Use semantic color tokens (`text-foreground`, `bg-background`)
- Automatic switching via `next-themes`
- Custom dark mode variants where needed
- Charts adapt colors for dark backgrounds

---

## Performance Optimizations

- Components use `React.memo` where appropriate
- Animations respect `prefers-reduced-motion`
- Charts use responsive containers for efficient rendering
- Lazy loading for heavy components (future enhancement)

---

## Future Enhancements

- [ ] Add skeleton loading states
- [ ] Implement data fetching with React Query
- [ ] Add error boundaries
- [ ] Create Storybook stories
- [ ] Add unit tests with Vitest
- [ ] Implement drag-and-drop for schedule reordering
- [ ] Add export functionality for charts
