import { useState } from "react";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal,
  Paperclip,
  Send,
  LifeBuoy,
  Shield,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";

// Mock Data for Tickets
const initialTickets = [
  {
    id: "TKT-2024-001",
    subject: "Erro ao sincronizar cronograma",
    category: "Bug",
    status: "open",
    priority: "high",
    date: "28 Nov 2025",
    lastUpdate: "2 horas atrás",
    user: "Alex Silva",
    messages: [
      {
        id: 1,
        author: "Alex Silva",
        role: "user",
        content: "Olá, meu cronograma não está atualizando quando marco uma tarefa como concluída no mobile.",
        time: "10:30"
      },
      {
        id: 2,
        author: "Suporte Gabaritte",
        role: "agent",
        content: "Olá Alex! Obrigado por reportar. Você poderia me informar qual o modelo do seu aparelho e a versão do navegador?",
        time: "11:15"
      }
    ]
  },
  {
    id: "TKT-2024-002",
    subject: "Dúvida sobre pagamento anual",
    category: "Financeiro",
    status: "closed",
    priority: "medium",
    date: "25 Nov 2025",
    lastUpdate: "3 dias atrás",
    user: "Alex Silva",
    messages: [
      {
        id: 1,
        author: "Alex Silva",
        role: "user",
        content: "Gostaria de saber se posso parcelar o plano anual no boleto.",
        time: "14:20"
      },
      {
        id: 2,
        author: "Suporte Gabaritte",
        role: "agent",
        content: "Olá Alex! No momento, o parcelamento está disponível apenas para cartão de crédito. No boleto, o pagamento é à vista com 5% de desconto.",
        time: "15:40"
      }
    ]
  },
  {
    id: "TKT-2024-003",
    subject: "Sugestão de nova funcionalidade",
    category: "Feature",
    status: "in_progress",
    priority: "low",
    date: "20 Nov 2025",
    lastUpdate: "1 semana atrás",
    user: "Alex Silva",
    messages: [
      {
        id: 1,
        author: "Alex Silva",
        role: "user",
        content: "Seria ótimo ter um modo escuro no app.",
        time: "09:00"
      },
      {
        id: 2,
        author: "Suporte Gabaritte",
        role: "agent",
        content: "Excelente sugestão, Alex! Já está em nosso roadmap e deve ser lançado na próxima atualização.",
        time: "10:00"
      }
    ]
  },
  // Admin only tickets (simulated from other users)
  {
    id: "TKT-2024-004",
    subject: "Não consigo resetar minha senha",
    category: "Acesso",
    status: "open",
    priority: "high",
    date: "28 Nov 2025",
    lastUpdate: "30 min atrás",
    user: "Maria Souza",
    messages: [
      {
        id: 1,
        author: "Maria Souza",
        role: "user",
        content: "O email de recuperação não chega na minha caixa de entrada.",
        time: "16:00"
      }
    ]
  },
  {
    id: "TKT-2024-005",
    subject: "Cancelamento de conta",
    category: "Financeiro",
    status: "open",
    priority: "medium",
    date: "27 Nov 2025",
    lastUpdate: "1 dia atrás",
    user: "João Pereira",
    messages: [
      {
        id: 1,
        author: "João Pereira",
        role: "user",
        content: "Quero cancelar minha assinatura mas não acho o botão.",
        time: "11:20"
      }
    ]
  }
];

export default function HelpDesk() {
  const { toast } = useToast();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<typeof initialTickets[0] | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
    priority: "medium"
  });

  // Filter tickets based on mode
  const visibleTickets = isAdminMode 
    ? tickets 
    : tickets.filter(t => t.user === "Alex Silva");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "closed": return "bg-gray-500/10 text-gray-600 border-gray-200";
      case "in_progress": return "bg-amber-500/10 text-amber-600 border-amber-200";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Aberto";
      case "closed": return "Fechado";
      case "in_progress": return "Em Andamento";
      default: return status;
    }
  };

  const handleCreateTicket = () => {
    const newTicket = {
      id: `TKT-2025-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: formData.subject,
      category: formData.category,
      status: "open",
      priority: formData.priority,
      date: "Hoje",
      lastUpdate: "Agora",
      user: "Alex Silva",
      messages: [
        {
          id: 1,
          author: "Alex Silva",
          role: "user",
          content: formData.description,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    
    setTickets([newTicket, ...tickets]);
    setIsNewTicketOpen(false);
    setFormData({ subject: "", category: "", description: "", priority: "medium" });
    setSelectedTicket(newTicket);
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;

    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          id: selectedTicket.messages.length + 1,
          author: isAdminMode ? "Suporte Gabaritte" : "Alex Silva",
          role: isAdminMode ? "agent" : "user",
          content: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      lastUpdate: "Agora"
    };

    const updatedTickets = tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t);
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
    setNewMessage("");
  };

  const handleChangeStatus = (newStatus: string) => {
    if (!selectedTicket) return;
    
    const updatedTicket = {
      ...selectedTicket,
      status: newStatus,
      lastUpdate: "Agora"
    };

    const updatedTickets = tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t);
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
    
    toast({
      title: "Status Atualizado",
      description: `O chamado foi marcado como ${getStatusLabel(newStatus)}.`,
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-bold tracking-tight">HelpDesk</h2>
            <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg border">
              <Switch 
                id="admin-mode" 
                checked={isAdminMode}
                onCheckedChange={setIsAdminMode}
              />
              <Label htmlFor="admin-mode" className="text-xs font-medium cursor-pointer flex items-center gap-1.5 px-2">
                {isAdminMode ? <Shield className="w-3 h-3 text-primary" /> : <User className="w-3 h-3" />}
                {isAdminMode ? "Admin View" : "User View"}
              </Label>
            </div>
          </div>
          <p className="text-muted-foreground">
            {isAdminMode 
              ? "Painel administrativo de suporte ao cliente." 
              : "Gerencie seus chamados e tire dúvidas com nosso suporte."}
          </p>
        </div>
        
        {!isAdminMode && (
          <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Abrir Novo Chamado</DialogTitle>
                <DialogDescription>
                  Descreva seu problema detalhadamente para que possamos ajudar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">Assunto</label>
                  <Input 
                    id="subject" 
                    placeholder="Resumo do problema..." 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData({...formData, category: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bug">Erro Técnico</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Duvida">Dúvida Geral</SelectItem>
                        <SelectItem value="Feature">Sugestão</SelectItem>
                        <SelectItem value="Acesso">Acesso / Login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Prioridade</label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(val) => setFormData({...formData, priority: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                  <Textarea 
                    id="description" 
                    placeholder="Conte mais detalhes..." 
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateTicket} disabled={!formData.subject || !formData.description || !formData.category}>
                  Enviar Chamado
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Ticket List Sidebar */}
        <Card className="lg:col-span-4 flex flex-col h-full overflow-hidden border-muted shadow-sm">
          <div className="p-4 border-b bg-muted/20 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar chamados..." 
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-muted whitespace-nowrap">Todos</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted whitespace-nowrap">Abertos</Badge>
              {isAdminMode && <Badge variant="outline" className="cursor-pointer hover:bg-muted whitespace-nowrap">Meus Atendimentos</Badge>}
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {visibleTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                    selectedTicket?.id === ticket.id ? "bg-muted/50 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                    <span className="text-xs text-muted-foreground">{ticket.lastUpdate}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{ticket.subject}</h4>
                  {isAdminMode && (
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <User className="w-3 h-3" /> {ticket.user}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 rounded-md", getStatusColor(ticket.status))}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 rounded-md">
                      {ticket.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Ticket Detail View */}
        <Card className="lg:col-span-8 flex flex-col h-full overflow-hidden border-muted shadow-sm">
          {selectedTicket ? (
            <>
              <div className="p-6 border-b bg-muted/10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                    <Badge variant="outline" className={cn("font-medium", getStatusColor(selectedTicket.status))}>
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <LifeBuoy className="w-4 h-4" /> {selectedTicket.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {selectedTicket.date}
                    </span>
                    {isAdminMode && (
                      <span className="flex items-center gap-1 text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                        <User className="w-3 h-3" /> {selectedTicket.user}
                      </span>
                    )}
                  </div>
                </div>
                
                {isAdminMode && (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Status <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangeStatus("open")}>
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Aberto
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeStatus("in_progress")}>
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Em Andamento
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeStatus("closed")}>
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" /> Fechado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex gap-4 max-w-[80%]",
                        (msg.role === "user" && !isAdminMode) || (msg.role === "agent" && isAdminMode) 
                          ? "ml-auto flex-row-reverse" 
                          : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        (msg.role === "user" && !isAdminMode) || (msg.role === "agent" && isAdminMode)
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {msg.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className={cn(
                        "p-4 rounded-lg text-sm",
                        (msg.role === "user" && !isAdminMode) || (msg.role === "agent" && isAdminMode)
                          ? "bg-primary/10 text-foreground rounded-tr-none" 
                          : "bg-muted text-foreground rounded-tl-none"
                      )}>
                        <div className="flex justify-between items-center mb-1 gap-4">
                          <span className="font-semibold text-xs">{msg.author}</span>
                          <span className="text-[10px] opacity-70">{msg.time}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-background">
                {selectedTicket.status === 'closed' && !isAdminMode ? (
                  <div className="text-center p-4 bg-muted/20 rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Este chamado foi encerrado. <Button variant="link" className="h-auto p-0">Reabrir chamado</Button>
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input 
                      placeholder={isAdminMode ? "Responder como suporte..." : "Digite sua mensagem..."}
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado selecionado</h3>
              <p className="max-w-xs mx-auto text-sm">Selecione um chamado da lista ao lado para ver os detalhes ou inicie um novo atendimento.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}