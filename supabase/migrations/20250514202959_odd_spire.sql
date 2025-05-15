INSERT INTO settings (key, value)
VALUES (
  'customization_settings',
  jsonb_build_object(
    'site_colors', jsonb_build_object(
      'primary', '#ca5231',
      'secondary', '#f6d9a0',
      'accent', '#365d66'
    ),
    'site_fonts', jsonb_build_object(
      'title', 'Swiss 721 Black Extended BT',
      'body', 'Rainy Days'
    ),
    'festival_info', jsonb_build_object(
      'name', 'Fête du Bout du Haut',
      'date', '2025-07-26',
      'location', 'Lachapelle sous Gerberoy'
    ),
    'contact_info', jsonb_build_object(
      'email', 'association.boutduhaut@gmail.com',
      'phone', '+33623456789'
    ),
    'social_media', jsonb_build_object(
      'facebook', 'https://www.facebook.com/AssociationDuBoutDuHaut',
      'instagram', 'https://www.instagram.com/association_du_bout_du_haut'
    )
  )
) ON CONFLICT (key) DO UPDATE 
  SET value = EXCLUDED.value;