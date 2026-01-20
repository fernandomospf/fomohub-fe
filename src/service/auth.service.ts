import { supabase } from '@/lib/supabase';
import { toast } from '@/components/atoms/use-toast';

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: `${firstName} ${lastName}`,
        phone: phoneNumber,
      },
    },
  });

 if (error) {
  if (error.message.includes('already registered')) {
    toast({ 
      title: 'Erro ao cadastrar',
      description: 'Este email já está cadastrado' 
    });
    return;
  }

  throw error;
}}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
