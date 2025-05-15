export async function uploadMedia(file: File, path: string): Promise<string> {
  // Vérifications préliminaires
  if (!file) {
    throw new Error('Aucun fichier sélectionné');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Seules les images sont autorisées');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('La taille du fichier ne doit pas dépasser 5MB');
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors du téléchargement');
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('URL de fichier manquante dans la réponse');
    }

    return data.url;
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur lors du téléchargement du fichier');
  }
}