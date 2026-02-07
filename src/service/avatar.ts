import { supabase } from "@/lib/supabase";

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  const filePath = `users/${userId}/avatar.jpg`;


  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
