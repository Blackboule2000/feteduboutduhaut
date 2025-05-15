/*
  # Ajout des données des activités

  1. Contenu
    - Ajout des activités existantes
    - Configuration des icônes et descriptions
    - Ajout des URLs des images
*/

INSERT INTO activities (name, time, description, icon, image_url, order_index)
VALUES
  (
    'Village Local',
    '11:00 - 20:00',
    'Découvrez les talents de notre territoire : artisans, producteurs et associations locales vous présentent leur savoir-faire et leurs créations uniques.',
    'Users',
    'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
    1
  ),
  (
    'Camping Festival',
    'Du 26 au 27 juillet',
    'Profitez du camping gratuit pour vivre pleinement l''expérience du festival. Espace aménagé avec sanitaires et point d''eau.',
    'Tent',
    'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg',
    2
  ),
  (
    'Food Village',
    '11:00 - 02:00',
    'Une sélection de food-trucks et restaurateurs locaux pour régaler vos papilles. Cuisine locale, bio et options végétariennes disponibles.',
    'Utensils',
    'https://images.pexels.com/photos/2608512/pexels-photo-2608512.jpeg',
    3
  ),
  (
    'Bar & Buvette',
    '11:00 - 02:00',
    'Rafraîchissements, bières locales et cocktails servis dans des gobelets réutilisables. Un espace convivial pour se désaltérer.',
    'Beer',
    'https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg',
    4
  ),
  (
    'Marché Artisanal',
    '11:00 - 20:00',
    'Bijoux, céramiques, textiles... Découvrez les créations uniques de nos artisans locaux dans une ambiance chaleureuse et festive.',
    'ShoppingBag',
    'https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg',
    5
  ),
  (
    'Initiation au Cirque',
    '13:00 - 18:00',
    'Mélie Malice vous initie aux arts du cirque : jonglage, équilibre, acrobaties... Une expérience ludique pour petits et grands !',
    'CircusIcon',
    'https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/462504621_1071331628335287_2041364644335749792_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Zhr-bZIsviQQ7kNvwHqSPp2&_nc_oc=AdmzksD2-34gVqhqhZt_ZzdOPJbTjanATLMFE_e3UuPp8immKzP8Lpwbm9HOIjtz_CbN775ub76WbKrqQTiJvizq&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=8zXt9s2ZNOu1mLf9an3zhQ&oh=00_AfIUYF51ULrTWoTYqCxTJL_jfYwYnXSWPV-4u0RYBopYqQ&oe=682A4EE9',
    6
  ),
  (
    'Balade Contée',
    '14:00 et 16:30',
    'Partez à la découverte des légendes locales lors d''une promenade enchantée. Une pause poétique au cœur de la nature.',
    'BookOpen',
    'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
    7
  ),
  (
    'Association Correlation',
    '11:00 - 19:00',
    'Rencontrez Michel Méline et l''équipe de Correlation. Découvrez leurs actions pour la protection de l''environnement et participez à des animations nature ludiques et pédagogiques.',
    'Users',
    'https://www.jagispourlanature.org/sites/default/files/structures/logos/correlation.jpg',
    8
  );