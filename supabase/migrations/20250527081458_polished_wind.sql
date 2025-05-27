/*
  # Fix information settings permissions

  1. Changes
    - Update default information settings
    - Ensure proper JSON structure
*/

UPDATE settings 
SET value = jsonb_build_object(
  'essential_info', jsonb_build_object(
    'items', jsonb_build_array(
      jsonb_build_object(
        'title', 'Date',
        'text', 'Samedi 26 Juillet 2025',
        'icon', 'Calendar'
      ),
      jsonb_build_object(
        'title', 'Horaires',
        'text', 'De 11h00 à 02h30 du matin',
        'icon', 'Clock'
      ),
      jsonb_build_object(
        'title', 'Lieu',
        'text', '2 rue du Bout du Haut, 60380 Lachapelle sous Gerberoy',
        'icon', 'MapPin'
      ),
      jsonb_build_object(
        'title', 'Concerts',
        'text', '5 concerts sur 2 scènes',
        'icon', 'Music'
      ),
      jsonb_build_object(
        'title', 'Bar & Food',
        'text', 'Buvette et restauration sur place',
        'icon', 'Beer'
      ),
      jsonb_build_object(
        'title', 'Village',
        'text', 'Artisans et producteurs locaux',
        'icon', 'ShoppingBag'
      )
    ),
    'camping', jsonb_build_object(
      'enabled', true,
      'title', 'Camping Festival',
      'description', 'Camping gratuit sur place',
      'details', 'Espace aménagé avec sanitaires et point d''eau',
      'image_url', 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg'
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
  'eco_initiatives', jsonb_build_array(
    jsonb_build_object(
      'title', 'Zéro déchet',
      'icon', 'Recycle',
      'items', jsonb_build_array(
        'Gobelets réutilisables consignés',
        'Tri sélectif avec points de collecte dédiés',
        'Vaisselle réutilisable consignée pour la restauration',
        'Sensibilisation au tri avec des bénévoles'
      )
    ),
    jsonb_build_object(
      'title', 'Circuit court & Local',
      'icon', 'Truck',
      'items', jsonb_build_array(
        'Producteurs et artisans locaux',
        'Bières artisanales de la région',
        'Restauration privilégiant les produits de saison',
        'Partenariats avec les commerces locaux'
      )
    ),
    jsonb_build_object(
      'title', 'Initiatives vertes',
      'icon', 'Leaf',
      'items', jsonb_build_array(
        'Scène à vélos alimentée par énergie humaine',
        'Parking vélos sécurisé et gratuit',
        'Toilettes sèches et économie d''eau'
      )
    )
  ),
  'bike_stage', jsonb_build_object(
    'title', 'La Scène à Vélos',
    'description', 'Cette année, la Fête du Bout du Haut innove et s''engage en accueillant la Scène à Vélos ! Bien plus qu''une simple scène, c''est une véritable expérience interactive et respectueuse de l''environnement qui vous attend.',
    'main_image', 'https://www.asca-asso.com/wp-content/uploads/2022/05/la-scene-a-velo-1024x400.png',
    'secondary_image', 'https://www.asca-asso.com/wp-content/uploads/2025/02/SDS96588-1024x683.webp',
    'features', jsonb_build_array('7 vélogénérateurs', '2 panneaux solaires', '100% énergie verte'),
    'participation_title', 'Participez à l''expérience',
    'participation_text', 'Et le plus beau ? Vous, spectateurs et spectatrices de la Fête du Bout du Haut, êtes invité.e.s à devenir acteurs de cette production d''énergie ! Avant les concerts, participez à des actions ludiques de sensibilisation à la maîtrise de l''énergie en pédalant. Et pendant les concerts, continuez à faire vivre la scène par votre énergie collective !'
  )
)
WHERE key = 'information_settings';