INSERT INTO settings (key, value)
VALUES (
  'hero_settings',
  jsonb_build_object(
    'title', 'Fête du Bout du Haut',
    'subtitle', 'Festival Musical et Culturel',
    'date', '26 Juillet 2025',
    'main_image', 'http://www.image-heberg.fr/files/1747215665990305646.png',
    'poster_image', 'http://www.image-heberg.fr/files/17472124523185540990.jpg',
    'background_color', '#f6d9a0'
  )
) ON CONFLICT (key) DO NOTHING;