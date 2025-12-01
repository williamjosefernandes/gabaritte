import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import logo from "@assets/logo.png";

import { useAuth } from "@/lib/auth";

export default function Auth() {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
      login({ email, name: "Usuário" });
      setLocation("/");
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao Gabaritte.",
      });
      login({ email, name });
      setLocation("/");
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
      setMode("login");
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-col justify-between bg-primary/5 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="Gabaritte Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-display font-bold text-primary tracking-tight">Gabaritte</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold leading-tight">
              A sua aprovação <br />
              <span className="text-primary">começa aqui.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              Junte-se a milhares de estudantes que estão transformando sua rotina de estudos com inteligência e organização.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
          <div className="bg-background/60 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
            <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">Organização Total</h3>
            <p className="text-sm text-muted-foreground">Cronogramas automáticos baseados no seu tempo disponível.</p>
          </div>
          <div className="bg-background/60 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-4">AI</div>
            <h3 className="font-semibold mb-2">Mentor IA</h3>
            <p className="text-sm text-muted-foreground">Feedback personalizado e recomendações de estudo em tempo real.</p>
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground mt-12">
          © 2025 Gabaritte. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          
          {/* LOGIN FORM */}
          {mode === "login" && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
                <p className="text-muted-foreground">Entre com suas credenciais para acessar sua conta.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button 
                      variant="link" 
                      className="px-0 font-normal h-auto text-xs" 
                      onClick={() => setMode("forgot-password")}
                      type="button"
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-9 pr-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled={isLoading}>
                  Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                  Facebook
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-primary" 
                  onClick={() => setMode("register")}
                >
                  Cadastre-se gratuitamente
                </Button>
              </p>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Crie sua conta</h2>
                <p className="text-muted-foreground">Comece sua jornada rumo à aprovação hoje mesmo.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-name" 
                      placeholder="Seu nome" 
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-9 pr-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirm-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-9"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-primary" 
                  onClick={() => setMode("login")}
                >
                  Faça login
                </Button>
              </p>
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === "forgot-password" && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Recuperar senha</h2>
                <p className="text-muted-foreground">Digite seu e-mail e enviaremos as instruções para redefinir sua senha.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">E-mail cadastrado</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reset-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </form>

              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-sm text-muted-foreground gap-2" 
                  onClick={() => setMode("login")}
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar para o login
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}