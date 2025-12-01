import { useState } from "react";
import { 
  Bell, 
  Check, 
  Clock, 
  Star, 
  Shield, 
  Zap, 
  BookOpen, 
  MoreHorizontal,
  Trash2,
  MailOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const initialNotifications = [
  {
    id: 1,
    title: "Meta Diária Atingida!",
    message: "Parabéns! Você completou 4 horas de estudo hoje.",
    time: "2 horas atrás",
    read: false,
    type: "achievement",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    id: 2,
    title: "Lembrete de Revisão",
    message: "Hora de revisar 'Direitos Fundamentais' (Direito Constitucional).",
    time: "4 horas atrás",
    read: false,
    type: "study",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: 3,
    title: "Novo Nível Desbloqueado",
    message: "Você alcançou o Nível 12! Continue assim.",
    time: "Ontem",
    read: true,
    type: "achievement",
    icon: Star,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    id: 4,
    title: "Alerta de Segurança",
    message: "Detectamos um novo login em seu dispositivo.",
    time: "2 dias atrás",
    read: true,
    type: "security",
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    id: 5,
    title: "Atualização do Sistema",
    message: "O Gabaritte foi atualizado com novas funcionalidades de IA.",
    time: "3 dias atrás",
    read: true,
    type: "system",
    icon: Bell,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">Fique por dentro das suas atividades e alertas.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <MailOpen className="w-4 h-4" /> Marcar todas como lidas
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                Todas
                <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-2">
                Não lidas
                {unreadCount > 0 && (
                  <Badge className="ml-1 text-[10px] h-5 px-1.5 bg-primary text-primary-foreground">{unreadCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                      !notification.read ? "bg-primary/5" : ""
                    )}
                  >
                    <div className={cn("p-2 rounded-full mt-1 shrink-0", notification.bg)}>
                      <notification.icon className={cn("w-5 h-5", notification.color)} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={cn("text-sm font-semibold", !notification.read && "text-foreground")}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => markAsRead(notification.id)}
                          title="Marcar como lida"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.read && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <Check className="w-4 h-4 mr-2" /> Marcar como lida
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhuma notificação</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {filter === "unread" 
                    ? "Você leu todas as suas notificações!" 
                    : "Você não tem notificações no momento."}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}