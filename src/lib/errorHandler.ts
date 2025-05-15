export const handleSupabaseError = (error: any) => {
  console.error('Erreur Supabase:', error);
  
  if (error.code === 'PGRST116') {
    return 'Données non trouvées';
  }
  
  if (error.code === 'auth/invalid-credential') {
    return 'Identifiants invalides';
  }
  
  if (error.message.includes('network')) {
    return 'Erreur de connexion au serveur';
  }
  
  return 'Une erreur est survenue, veuillez réessayer';
};

export const isNetworkError = (error: any) => {
  return error.message.includes('network') || 
         error.message.includes('Failed to fetch') ||
         error.code === 'ECONNREFUSED';
};