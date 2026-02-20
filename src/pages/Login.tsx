import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Phone, User, Apple } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn, signUp, signInWithGoogle, signInWithApple } from '../service/auth.service';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { useSession } from '@/hooks/useSession';
import Fomo from '../../public/fomo-logo.png';
import Image from 'next/image';
import { toast } from 'sonner';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}


export default function Login() {
  const router = useRouter();
  const { session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
        await signUp(data.email, data.password, data.firstName!, data.lastName!, data.phoneNumber!);
        setIsLogin(true);
        toast.success('Conta criada com sucesso!\n Verifique seu email para confirmar o cadastro.');
        router.push('/login');
      }
      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRememberMeChange = () => {
    const existItem = localStorage.getItem('user_session');
    if (!existItem) {
      localStorage.setItem('user_session', JSON.stringify({
        email: watch('email'),
      }));
    } else {
      localStorage.removeItem('user_session');
    }
  }

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    const savedSession = localStorage.getItem('user_session');

    if (!savedSession) return;

    try {
      const parsed = JSON.parse(savedSession);

      if (parsed?.email) {
        setValue('email', parsed.email);
        setRememberMe(true);
      }
    } catch {
      localStorage.removeItem('user_session');
    }
  }, [setValue]);


  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-4/5 relative bg-muted items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="/login-wallpaper.png" 
          alt="Login Wallpaper" 
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-col items-center justify-center p-6 lg:p-8 relative z-10 w-full lg:w-1/5 shrink-0 mx-auto">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Image src={Fomo} alt="Fomo Logo" className="w-30-30 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">
            Fomo
          </h1>
          <p className="text-muted-foreground mt-2">
            Conecte-se através do movimento.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {
            !isLogin && (
              <div className="grid gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nome"
                    className="pl-12 h-14 bg-secondary border-0 rounded-xl"
                    {...register('firstName', {
                      required: 'Nome é obrigatório',
                    })}
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Sobrenome"
                    className="pl-12 h-14 bg-secondary border-0 rounded-xl"
                    {...register('lastName', {
                      required: 'Sobrenome é obrigatório',
                    })}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="string"
                    placeholder="Celular (apenas números)"
                    className="pl-12 h-14 bg-secondary border-0 rounded-xl"
                    {...register('phoneNumber', {
                      required: 'Celular é obrigatório',
                    })}
                  />
                </div>
              </div>
            )
          }

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
                  value: 8,
                  message: 'Senha deve ter no mínimo 8 caracteres',
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
          {
            !isLogin && (
              <p className="text-xs text-muted-foreground ml-2 text-left">
                * Senha deve ter no mínimo 8 caracteres com letras maiúsculas, minúsculas e números
              </p>
            )
          }
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                className="mt-1 w-4 h-4"
                checked={rememberMe}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRememberMe(checked);

                  if (checked) {
                    localStorage.setItem(
                      'user_session',
                      JSON.stringify({ email: watch('email') })
                    );
                  } else {
                    localStorage.removeItem('user_session');
                  }
                }}
              />
              <label className="text-sm text-muted-foreground">
                Lembrar-me
              </label>
            </div>
            {isLogin && (
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            )}
          </div>


          <Button
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
        {
          isLogin && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou continue com
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full bg-secondary hover:bg-secondary/80 border-0"
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await signInWithGoogle();
                    } catch (err: any) {
                      setErrorMessage(err.message);
                      setLoading(false);
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
                {/* <Button
                  size="xl"
                  variant="outline"
                  className="w-full bg-secondary hover:bg-secondary/80 border-0"
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await signInWithApple();
                    } catch (err: any) {
                      setErrorMessage(err.message);
                      setLoading(false);
                    }
                  }}
                >
                  <Apple className="w-5 h-5 mr-2" />
                  Apple
                </Button> */}
              </div>
            </>)
        }
        </div>
      </div>
    </div>
  );
}
