/*
  # Ajout des paramètres d'information par défaut

  1. Modifications
    - Ajout des paramètres d'information dans la table settings
    - Configuration des valeurs par défaut
*/

INSERT INTO settings (key, value)
VALUES (
  'information_settings',
  jsonb_build_object(
    'essential_info', jsonb_build_object(
      'date', '26 Juillet 2025',
      'time', '11:00 - 02:30',
      'location', jsonb_build_object(
        'address', '2 rue du Bout du Haut',
        'city', 'Lachapelle sous Gerberoy',
        'postal_code', '60380'
      ),
      'parking', 'Parking gratuit à proximité',
      'camping', jsonb_build_object(
        'available', true,
        'description', 'Camping gratuit sur place avec sanitaires et point d''eau'
      )
    ),
    'important_notes', jsonb_build_array(
      'Entrée gratuite pour tous',
      'Restauration locale et buvette sur place',
      'Village associatif et artisanal',
      'Animations pour petits et grands',
      'Zone ombragée et espaces de repos',
      'Accessibilité PMR',
      'Animaux acceptés tenus en laisse',
      'Parking vélos sécurisé'
    ),
    'eco_friendly', jsonb_build_object(
      'zero_waste', jsonb_build_array(
        'Gobelets réutilisables consignés',
        'Tri sélectif avec points de collecte dédiés',
        'Vaisselle réutilisable consignée pour la restauration',
        'Sensibilisation au tri avec des bénévoles'
      ),
      'local_sourcing', jsonb_build_array(
        'Producteurs et artisans locaux',
        'Bières artisanales de la région',
        'Restauration privilégiant les produits de saison',
        'Partenariats avec les commerces locaux'
      ),
      'green_initiatives', jsonb_build_array(
        'Scène à vélos alimentée par énergie humaine',
        'Parking vélos sécurisé et gratuit',
        'Toilettes sèches et économie d''eau'
      )
    ),
    'bike_stage', jsonb_build_object(
      'title', 'La Scène à Vélos',
      'description', 'Cette année, la Fête du Bout du Haut innove et s''engage en accueillant la Scène à Vélos ! Bien plus qu''une simple scène, c''est une véritable expérience interactive et respectueuse de l''environnement qui vous attend.',
      'main_image', 'https://www.asca-asso.com/wp-content/uploads/2022/05/la-scene-a-velo-1024x400.png',
      'secondary_image', 'https://www.asca-asso.com/wp-content/uploads/2025/02/SDS96588-1024x683.webp'
    ),
    'partners', jsonb_build_array()
  )
) ON CONFLICT (key) DO UPDATE 
  SET value = EXCLUDED.value;