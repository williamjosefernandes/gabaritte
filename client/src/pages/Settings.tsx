import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Moon, 
  Sun, 
  Smartphone, 
  LogOut,
  Mail,
  Lock,
  Upload,
  Check,
  AlertTriangle,
  Loader2,
  Download,
  BarChart2,
  Trophy,
  Users,
  Zap,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { userProfile } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Link } from "wouter";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Loading States
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    bio: "Estudante focado em concursos da área fiscal.",
    phone: "(11) 99999-9999"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [notifications, setNotifications] = useState({
    emailSummary: true,
    pushReminders: true,
    marketing: false,
    securityAlerts: true,
    achievements: true,
    social: true
  });

  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar);

  // Handlers
  const handleSaveProfile = () => {
    setIsProfileSaving(true);
    setTimeout(() => {
      setIsProfileSaving(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    }, 1000);
  };

  const handleUploadAvatar = () => {
    setIsUploadingAvatar(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploadingAvatar(false);
      // Just a mock change for visual feedback
      setAvatarUrl("https://github.com/shadcn.png"); 
      toast({
        title: "Foto atualizada",
        description: "Sua nova foto de perfil foi enviada.",
      });
    }, 1500);
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para alterar a senha.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive"
      });
      return;
    }

    setIsPasswordSaving(true);
    setTimeout(() => {
      setIsPasswordSaving(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com segurança.",
      });
    }, 1500);
  };

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true);
    setTimeout(() => {
      setIsDeletingAccount(false);
      toast({
        title: "Solicitação enviada",
        description: "Um e-mail de confirmação foi enviado para você.",
      });
    }, 2000);
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Preferências salvas",
      description: "Suas configurações de notificação foram atualizadas.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie suas preferências de conta e aplicativo.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="flex overflow-auto pb-2">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Perfil</TabsTrigger>
            <TabsTrigger value="account" className="gap-2"><Shield className="w-4 h-4" /> Conta & Segurança</TabsTrigger>
            <TabsTrigger value="billing" className="gap-2"><CreditCard className="w-4 h-4" /> Assinatura</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notificações</TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize sua foto e detalhes pessoais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-24 h-24 border-4 border-muted">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleUploadAvatar}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} 
                    Alterar Foto
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / Objetivo</Label>
                      <Input 
                        id="bio" 
                        value={profileData.bio} 
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button onClick={handleSaveProfile} disabled={isProfileSaving}>
                {isProfileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProfileSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ACCOUNT TAB */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie sua senha e métodos de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleChangePassword}
                  disabled={isPasswordSaving}
                >
                  {isPasswordSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Tema</CardTitle>
              <CardDescription>Personalize a aparência da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div 
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => setTheme("light")}
                >
                  <div className={cn(
                    "w-full aspect-video rounded-lg border-2 p-2 flex items-center justify-center transition-all",
                    theme === "light" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 bg-background"
                  )}>
                    <Sun className={cn("w-6 h-6", theme === "light" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className={cn("text-sm font-medium", theme === "light" ? "text-primary" : "text-muted-foreground")}>Claro</span>
                </div>
                
                <div 
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => setTheme("dark")}
                >
                  <div className={cn(
                    "w-full aspect-video rounded-lg border-2 p-2 flex items-center justify-center transition-all",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 bg-slate-950"
                  )}>
                    <Moon className={cn("w-6 h-6", theme === "dark" ? "text-primary" : "text-white")} />
                  </div>
                  <span className={cn("text-sm font-medium", theme === "dark" ? "text-primary" : "text-muted-foreground")}>Escuro</span>
                </div>

                <div 
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => setTheme("system")}
                >
                  <div className={cn(
                    "w-full aspect-video rounded-lg border-2 p-2 flex items-center justify-center transition-all",
                    theme === "system" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 bg-gradient-to-br from-white to-slate-900"
                  )}>
                    <Smartphone className={cn("w-6 h-6", theme === "system" ? "text-primary" : "text-foreground")} />
                  </div>
                  <span className={cn("text-sm font-medium", theme === "system" ? "text-primary" : "text-muted-foreground")}>Sistema</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis relacionadas à sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">Excluir Conta</p>
                <p className="text-sm text-muted-foreground">Todos os seus dados serão apagados permanentemente.</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Excluir Conta</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Tem certeza absoluta?
                    </DialogTitle>
                    <DialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirmar Exclusão
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900 to-violet-900 text-white border-none">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">Plano Premium</Badge>
                  <span className="text-sm text-indigo-200">Renova em 20/12/2025</span>
                </div>
                <h3 className="text-2xl font-bold">Acesso Ilimitado</h3>
                <p className="text-indigo-100 max-w-md">
                  Você tem acesso a todas as trilhas, simulados ilimitados e o Mentor IA.
                </p>
              </div>
              <Link href="/subscription/manage">
                <Button variant="secondary" className="whitespace-nowrap">Gerenciar Assinatura</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Veja suas faturas recentes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Mensalidade Premium</p>
                        <p className="text-xs text-muted-foreground">20 {['Nov', 'Out', 'Set'][i-1]} 2025</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ 49,90</p>
                      <Button variant="link" className="h-auto p-0 text-xs flex items-center gap-1">
                        <Download className="w-3 h-3" /> Baixar PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Preferências de E-mail
              </CardTitle>
              <CardDescription>Escolha quais e-mails você deseja receber.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-full hidden sm:block">
                    <BarChart2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base cursor-pointer" htmlFor="emailSummary">Resumo Semanal</Label>
                    <p className="text-sm text-muted-foreground">Receba um resumo do seu progresso toda segunda-feira.</p>
                  </div>
                </div>
                <Switch 
                  id="emailSummary"
                  checked={notifications.emailSummary}
                  onCheckedChange={(checked) => handleNotificationChange('emailSummary', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-purple-500/10 rounded-full hidden sm:block">
                    <Megaphone className="w-5 h-5 text-purple-500" />
                   </div>
                  <div className="space-y-0.5">
                    <Label className="text-base cursor-pointer" htmlFor="marketing">Novidades e Marketing</Label>
                    <p className="text-sm text-muted-foreground">Fique por dentro de novas features e promoções.</p>
                  </div>
                </div>
                <Switch 
                  id="marketing"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/10 rounded-full hidden sm:block">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base cursor-pointer" htmlFor="securityAlerts">Alertas de Segurança</Label>
                    <p className="text-sm text-muted-foreground">Notificações sobre acessos suspeitos e mudanças de senha.</p>
                  </div>
                </div>
                <Switch 
                  id="securityAlerts"
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Notificações Push
              </CardTitle>
              <CardDescription>Configure os alertas no seu navegador/celular.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-500/10 rounded-full hidden sm:block">
                    <Zap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base cursor-pointer" htmlFor="pushReminders">Lembretes de Estudo</Label>
                    <p className="text-sm text-muted-foreground">Seja notificado quando for hora de estudar conforme seu cronograma.</p>
                  </div>
                </div>
                <Switch 
                  id="pushReminders"
                  checked={notifications.pushReminders}
                  onCheckedChange={(checked) => handleNotificationChange('pushReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-500/10 rounded-full hidden sm:block">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base cursor-pointer" htmlFor="achievements">Conquistas e Níveis</Label>
                    <p className="text-sm text-muted-foreground">Avise-me quando eu desbloquear novas conquistas ou subir de nível.</p>
                  </div>
                </div>
                <Switch 
                  id="achievements"
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => handleNotificationChange('achievements', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10 rounded-full hidden sm:block">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base cursor-pointer" htmlFor="social">Interação Social</Label>
                    <p className="text-sm text-muted-foreground">Novos seguidores e atualizações de ranking de amigos.</p>
                  </div>
                </div>
                <Switch 
                  id="social"
                  checked={notifications.social}
                  onCheckedChange={(checked) => handleNotificationChange('social', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}