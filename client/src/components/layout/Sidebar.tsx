import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Target, 
  BarChart2, 
  History, 
  Settings, 
  HelpCircle, 
  LifeBuoy,
  LogOut,
  Sparkles,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import logo from "@assets/logo.png";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Target, label: "Planos", href: "/plans" },
  { icon: Sparkles, label: "Trilhas IA", href: "/tracks" },
  { icon: BookOpen, label: "Disciplinas", href: "/subjects" },
  { icon: Calendar, label: "Cronograma", href: "/schedule" },
  { icon: FileCheck, label: "Simulados", href: "/simulados" },
  { icon: BarChart2, label: "Estatísticas", href: "/stats" },
  { icon: History, label: "Histórico", href: "/history" },
];

const supportItems = [
  { icon: HelpCircle, label: "FAQ", href: "/faq" },
  { icon: LifeBuoy, label: "HelpDesk", href: "/helpdesk" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

import { useAuth } from "@/lib/auth";

interface SidebarProps {
  className?: string;
  collapsible?: boolean;
}

export function Sidebar({ className, collapsible = true }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/landing");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavItem = ({ item, collapsed }: { item: any, collapsed: boolean }) => {
    const isActive = location === item.href;
    
    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative hover:-translate-y-0.5",
          isActive
            ? "bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary ring-1 ring-primary/30"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {collapsed && isActive && (
          <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <aside className={cn(
      "flex flex-col bg-gradient-to-b from-card to-background border-r border-border/60 h-screen sticky top-0 transition-all duration-300 ease-in-out", 
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <div className={cn(
        "p-6 flex items-center gap-3 relative",
        isCollapsed && "p-4 justify-center"
      )}>
        <img src={logo} alt="Gabaritte Logo" className="w-8 h-8 object-contain flex-shrink-0" />
        {!isCollapsed && (
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight truncate animate-in fade-in duration-200">
            Gabaritte
          </h1>
        )}
        
        {collapsible && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-3 top-7 h-6 w-6 rounded-full border bg-background/80 shadow-sm hover:bg-accent hidden md:flex items-center justify-center z-50",
              isCollapsed && "-right-3"
            )}
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-6 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="space-y-1">
          {!isCollapsed ? (
            <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 truncate animate-in fade-in">
              Menu Principal
            </p>
          ) : (
            <div className="h-4 mb-2" /> // Spacer
          )}
          {menuItems.map((item) => (
            <NavItem key={item.href} item={item} collapsed={isCollapsed} />
          ))}
        </div>

        {!isCollapsed && <Separator className="mx-4" />}

        <div className="space-y-1">
          {!isCollapsed ? (
            <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 truncate animate-in fade-in">
              Suporte
            </p>
          ) : (
            <div className="h-4 mb-2" /> // Spacer
          )}
          {supportItems.map((item) => (
            <NavItem key={item.href} item={item} collapsed={isCollapsed} />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <div className="bg-gradient-to-b from-primary/10 via-purple-600/10 to-transparent rounded-lg p-4 mb-4 border border-primary/10 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-sm font-semibold text-primary mb-1 truncate">Plano Premium</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">Acesso ilimitado a todas as trilhas.</p>
            <Link href="/subscription">
              <Button size="sm" className="w-full text-xs font-medium">
                Fazer Upgrade
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mb-4 flex justify-center">
             <Link href="/subscription">
              <Button size="icon" variant="ghost" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                <Crown className="w-5 h-5" />
              </Button>
             </Link>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Sair</span>}
        </button>
      </div>
    </aside>
  );
}
