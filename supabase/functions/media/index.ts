import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    if (req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const path = formData.get("path") as string;

      // Vérifications
      if (!file || !path) {
        throw new Error("Le fichier et le chemin sont requis");
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error("Seules les images sont autorisées");
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("La taille du fichier ne doit pas dépasser 5MB");
      }

      // Vérifier l'extension du fichier
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error("Format de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP");
      }

      try {
        const buffer = await file.arrayBuffer();
        const { data, error: uploadError } = await supabase.storage
          .from("media")
          .upload(path, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          console.error("Erreur Supabase:", uploadError);
          throw new Error("Erreur lors du téléchargement vers Supabase");
        }

        const { data: publicUrl } = supabase.storage
          .from("media")
          .getPublicUrl(path);

        return new Response(
          JSON.stringify({ url: publicUrl.publicUrl }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (uploadError) {
        console.error("Erreur lors du téléchargement:", uploadError);
        throw new Error("Erreur lors du téléchargement du fichier");
      }
    }

    throw new Error("Méthode non autorisée");
  } catch (error) {
    console.error("Erreur:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Une erreur est survenue lors du téléchargement" 
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});