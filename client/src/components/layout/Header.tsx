import { Bell, Search, Menu, BookOpen, FileText, LayoutList, Calculator, Gavel, User, CreditCard, Settings, LogOut } from "lucide-react";
import { userProfile, activePlan } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import { Link } from "wouter";

import { useAuth } from "@/lib/auth";

export function Header() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/landing");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Mock data for search
  const searchItems = [
    // Subjects
    { id: 's1', type: 'subject', name: 'Direito Constitucional', icon: Gavel, path: '/subjects?subjectId=1' },
    { id: 's2', type: 'subject', name: 'Português', icon: BookOpen, path: '/subjects?subjectId=2' },
    { id: 's3', type: 'subject', name: 'Raciocínio Lógico', icon: Calculator, path: '/subjects' },
    { id: 's4', type: 'subject', name: 'Direito Administrativo', icon: Gavel, path: '/subjects' },
    
    // Topics
    { id: 't1', type: 'topic', name: 'Teoria da Constituição', subject: 'Direito Constitucional', icon: LayoutList, path: '/subjects?subjectId=1&topicId=101' },
    { id: 't2', type: 'topic', name: 'Direitos Fundamentais', subject: 'Direito Constitucional', icon: LayoutList, path: '/subjects?subjectId=1&topicId=102' },
    { id: 't3', type: 'topic', name: 'Morfologia', subject: 'Português', icon: LayoutList, path: '/subjects?subjectId=2&topicId=201' },
    { id: 't4', type: 'topic', name: 'Sintaxe', subject: 'Português', icon: LayoutList, path: '/subjects?subjectId=2&topicId=202' },
    
    // Lessons (Subtopics)
    { id: 'l1', type: 'lesson', name: 'Conceito e Classificação', subject: 'Direito Constitucional', icon: FileText, path: '/subjects?subjectId=1&topicId=101&subtopicId=1011' },
    { id: 'l2', type: 'lesson', name: 'Classes de Palavras', subject: 'Português', icon: FileText, path: '/subjects?subjectId=2&topicId=201&subtopicId=2011' },
  ];

  const handleSelect = (path: string) => {
    setOpen(false);
    setLocation(path);
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-white border-r">
            <Sidebar className="w-full h-full border-r-0 bg-white" collapsible={false} />
          </SheetContent>
        </Sheet>
        <span className="font-display font-bold text-lg text-primary">Gabaritte</span>
      </div>

      <div className="hidden md:flex items-center w-96 relative">
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start bg-secondary/50 text-sm text-muted-foreground shadow-none sm:pr-12 hover:bg-secondary/80 border-transparent"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Buscar disciplinas ou tópicos...</span>
          <span className="inline-flex lg:hidden">Buscar...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite para buscar..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Disciplinas">
            {searchItems.filter(i => i.type === 'subject').map(item => (
              <CommandItem key={item.id} onSelect={() => handleSelect(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tópicos">
            {searchItems.filter(i => i.type === 'topic').map(item => (
              <CommandItem key={item.id} onSelect={() => handleSelect(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">em {item.subject}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Aulas">
             {searchItems.filter(i => i.type === 'lesson').map(item => (
              <CommandItem key={item.id} onSelect={() => handleSelect(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">em {item.subject}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="flex items-center gap-4">
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
          </Button>
        </Link>

        <div className="h-8 w-px bg-border mx-1 hidden md:block"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium leading-none">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground mt-1">Nível {userProfile.level}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-primary/10 hover:border-primary/50 transition-all">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/subscription")} className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Assinatura</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
