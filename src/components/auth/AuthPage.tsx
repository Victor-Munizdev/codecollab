import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { User } from '@/types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });
    if (error) {
      let errorMessage = 'Erro ao fazer login: ' + error.message;
      if (error.status === 429 || error.message.includes('rate limit') || error.message.includes('too many requests')) {
        errorMessage = 'Muitas tentativas de login. Por favor, aguarde um momento e tente novamente.';
      }
      alert(errorMessage);
      setLoading(false);
      return;
    }
    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
      };
      onLogin(user);
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Senhas não coincidem');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: { name: registerData.name },
      },
    });
    if (error) {
      let errorMessage = 'Erro ao cadastrar: ' + error.message;
      if (error.status === 429 || error.message.includes('rate limit') || error.message.includes('too many requests')) {
        errorMessage = 'Muitas tentativas de cadastro. Por favor, aguarde um momento e tente novamente.';
      }
      alert(errorMessage);
      setLoading(false);
      return;
    }
    if (data.user) {
      // Garante que o cliente Supabase está usando a sessão mais recente
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Error getting session after signup:', sessionError);
        alert('Erro ao obter sessão após o cadastro.');
        setLoading(false);
        return;
      }

      console.log('Session after signup:', session);

      // --- NEW CODE START ---
      // Insert user data into public.users table
      const { error: insertError } = await supabase
        .from('users')
        .insert(
          {
            id: data.user.id,
            email: data.user.email,
            name: registerData.name, // Use the name from the registration form
          },
        );

      if (insertError) {
        console.error('Error inserting user into public.users:', insertError);
        let errorMessage = 'Erro ao salvar dados do usuário: ' + insertError.message;
        if (insertError.status === 429 || insertError.message.includes('rate limit') || insertError.message.includes('too many requests')) {
          errorMessage = 'Muitas tentativas de salvar dados do usuário. Por favor, aguarde um momento e tente novamente.';
        }
        alert(errorMessage);
        setLoading(false);
        // Optionally, you might want to log out the user from auth.users here
        // if the public.users insertion fails, to keep data consistent.
        await supabase.auth.signOut();
        return;
      }
      // --- NEW CODE END ---

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: registerData.name,
      };
      onLogin(user);
    } else {
      alert('Verifique seu e-mail para confirmar o cadastro.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary">
            <Code className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 data-test-id="main-title" className="text-3xl font-bold text-foreground mb-2">VSCode Multi-Person</h1>
          <p className="text-muted">Editor colaborativo em tempo real</p>
        </div>

        <Card className="bg-card border-card-border shadow-elegant">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center text-foreground">Bem-vindo(a)</CardTitle>
            <CardDescription className="text-center text-muted">
              Faça login para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="bg-background-secondary border-card-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                      <Lock className="w-4 h-4" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="bg-background-secondary border-card-border pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-muted hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Entrando...' : 'ENTRAR'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                      <UserIcon className="w-4 h-4" />
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Digite seu nome"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      className="bg-background-secondary border-card-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center gap-2 text-foreground">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Digite seu email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="bg-background-secondary border-card-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center gap-2 text-foreground">
                      <Lock className="w-4 h-4" />
                      Senha
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Digite uma senha"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="bg-background-secondary border-card-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="flex items-center gap-2 text-foreground">
                      <Lock className="w-4 h-4" />
                      Confirmar senha
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                      className="bg-background-secondary border-card-border"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Criando conta...' : 'CRIAR CONTA'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted mt-6">
          Colabore em tempo real • Edição simultânea • Chat integrado
        </p>
      </div>
    </div>
  );
}