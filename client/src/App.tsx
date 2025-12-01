import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Plans from "@/pages/Plans";
import NewPlan from "@/pages/NewPlan";
import PlanDetails from "@/pages/PlanDetails";
import Subjects from "@/pages/Subjects";
import Schedule from "@/pages/Schedule";
import Stats from "@/pages/Stats";
import History from "@/pages/History";
import Simulados from "@/pages/Simulados";
import FAQ from "@/pages/FAQ";
import HelpDesk from "@/pages/HelpDesk";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import Notifications from "@/pages/Notifications";
import Auth from "@/pages/Auth";
import LandingPage from "@/pages/LandingPage";
import ManageSubscription from "@/pages/ManageSubscription";
import Tracks from "@/pages/Tracks";
import TrackDetails from "@/pages/TrackDetails";
import NewTrack from "@/pages/NewTrack";
import NotFound from "@/pages/not-found";

import { useAuth, AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { useLocation } from "wouter";
import { useEffect } from "react";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    // If not authenticated, redirect to Landing Page immediately
    // But render nothing to avoid flash
    useEffect(() => {
      setLocation("/landing");
    }, []);
    return null;
  }

  return <Component {...rest} />;
}

function PublicRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    useEffect(() => {
      setLocation("/");
    }, []);
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/landing">
        <PublicRoute component={LandingPage} />
      </Route>
      <Route path="/auth">
        <PublicRoute component={Auth} />
      </Route>
      
      {/* Protected Routes */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/">
               <PrivateRoute component={Dashboard} />
            </Route>
            <Route path="/plans">
               <PrivateRoute component={Plans} />
            </Route>
            <Route path="/plans/new">
               <PrivateRoute component={NewPlan} />
            </Route>
            <Route path="/plans/:id">
               <PrivateRoute component={PlanDetails} />
            </Route>
            <Route path="/plans/edit/:id">
               <PrivateRoute component={NewPlan} />
            </Route>
            <Route path="/tracks">
               <PrivateRoute component={Tracks} />
            </Route>
            <Route path="/tracks/new">
               <PrivateRoute component={NewTrack} />
            </Route>
            <Route path="/tracks/:id">
               <PrivateRoute component={TrackDetails} />
            </Route>
            <Route path="/subjects">
               <PrivateRoute component={Subjects} />
            </Route>
            <Route path="/schedule">
               <PrivateRoute component={Schedule} />
            </Route>
            <Route path="/simulados">
               <PrivateRoute component={Simulados} />
            </Route>
            <Route path="/stats">
               <PrivateRoute component={Stats} />
            </Route>
            <Route path="/history">
               <PrivateRoute component={History} />
            </Route>
            <Route path="/faq">
               <PrivateRoute component={FAQ} />
            </Route>
            <Route path="/helpdesk">
               <PrivateRoute component={HelpDesk} />
            </Route>
            <Route path="/settings">
               <PrivateRoute component={Settings} />
            </Route>
            <Route path="/profile">
               <PrivateRoute component={Profile} />
            </Route>
            <Route path="/subscription">
               <PrivateRoute component={Subscription} />
            </Route>
            <Route path="/subscription/manage">
               <PrivateRoute component={ManageSubscription} />
            </Route>
            <Route path="/notifications">
               <PrivateRoute component={Notifications} />
            </Route>
            
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gabaritte-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
