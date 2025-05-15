import { supabase } from './supabase';

export async function uploadMedia(file: File, path: string): Promise<string> {
  // Vérifications préliminaires
  if (!file) {
    throw new Error('Aucun fichier sélectionné');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Seules les images sont autorisées');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`La taille du fichier ne doit pas dépasser ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      let errorMessage = 'Erreur lors du téléchargement';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If we can't parse the error JSON, use the default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('URL de fichier manquante dans la réponse');
    }

    return data.url;
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw error instanceof Error ? error : new Error('Erreur lors du téléchargement du fichier');
  }
}