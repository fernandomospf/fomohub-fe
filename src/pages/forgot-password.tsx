import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../service/auth.service';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import Fomo from '../../public/fomo-logo.png';
import Image from 'next/image';
import { toast } from 'sonner';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await resetPassword(data.email);
      toast.success('Email de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.');
      router.push('/login');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Image src={Fomo} alt="Fomo Logo" className="w-30-30 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">
              Recuperar Senha
            </h1>
            <p className="text-muted-foreground mt-2">
              Digite seu email e enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email cadastrado"
                className="pl-12 h-14 bg-secondary border-0 rounded-xl"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            <Button
              size="xl"
              className="w-full mt-6"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Email'}
            </Button>
            <Button
              size="xl"
              className="w-full mt-6"
              type="button"
              variant="outline"
              onClick={() => router.push('/login')}
            >
              Voltar para o login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
