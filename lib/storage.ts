import { createClient } from "@/lib/supabase/server";

export async function uploadToSupabase(
  file: File,
  userId: string,
  folder: string = "blueprints"
): Promise<{ url: string; path: string }> {
  const supabase = await createClient();
  
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  // Path should be relative to bucket: {userId}/{fileName}
  // Don't include bucket name in the path since it's specified in .from()
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("blueprints")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("blueprints").getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}


