import { useState } from 'react';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {signIn, signUp, signInWithGoogle} from '../service/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}


export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        await signIn(data.email, data.password);
      } else {
        if (data.password !== data.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        await signUp(data.email, data.password);
      }

      navigate('/');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Dumbbell className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">IronHub</h1>
          <p className="text-muted-foreground mt-2">
            Sua jornada fitness começa aqui
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-12 h-14 bg-secondary border-0 rounded-xl"
              {...register('email', {
                required: 'Email é obrigatório',
              })}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className="pl-12 pr-12 h-14 bg-secondary border-0 rounded-xl"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter no mínimo 6 caracteres',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmar senha"
                className="pl-12 h-14 bg-secondary border-0 rounded-xl"
                {...register('confirmPassword', {
                  required: 'Confirmação de senha obrigatória',
                  validate: (value) =>
                    value === watch('password') || 'As senhas não coincidem',
                })}
              />
            </div>
          )}

          {errorMessage && isLogin && (
            <p className="text-sm text-red-500">
              Credenciais inválidas. Tente novamente.
            </p>
          )}

          <Button
            variant="gradient"
            size="xl"
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Processando...'
              : isLogin
              ? 'Entrar'
              : 'Criar Conta'}
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold ml-1 hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
