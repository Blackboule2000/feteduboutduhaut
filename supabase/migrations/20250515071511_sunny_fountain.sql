/*
  # Update header settings with new logo

  1. Changes
    - Update logo URL to use new image
    - Ensure header settings are properly configured
*/

INSERT INTO settings (key, value)
VALUES (
  'header_settings',
  jsonb_build_object(
    'logo', jsonb_build_object(
      'image_url', 'https://i.ibb.co/652PBzS/logo-f-te-du-bout-du-haut-2.png',
      'alt_text', 'Logo Fête du Bout du Haut',
      'link_url', '/'
    ),
    'title', jsonb_build_object(
      'text', 'FÊTE DU BOUT DU HAUT',
      'font_family', 'Swiss 721 Black Extended BT',
      'color', '#ca5231'
    ),
    'navigation', jsonb_build_array(
      jsonb_build_object(
        'text', 'ACCUEIL',
        'link', '#accueil',
        'icon', null
      ),
      jsonb_build_object(
        'text', 'ACTUALITÉS',
        'link', '#actualités',
        'icon', null
      ),
      jsonb_build_object(
        'text', 'PROGRAMME',
        'link', '#programme',
        'icon', null
      ),
      jsonb_build_object(
        'text', 'ACTIVITÉS',
        'link', '#activites',
        'icon', null
      ),
      jsonb_build_object(
        'text', 'INFORMATIONS',
        'link', '#infos',
        'icon', null
      ),
      jsonb_build_object(
        'text', 'CONTACT',
        'link', '#contact',
        'icon', null
      )
    ),
    'decorative_elements', jsonb_build_object(
      'show_birds', true,
      'show_windmill', true,
      'bird_image_url', 'http://www.image-heberg.fr/files/17472137482209719273.png',
      'windmill_image_url', 'https://i.ibb.co/SwjYfyNK/olienne.png'
    ),
    'styles', jsonb_build_object(
      'background_color', '#f6d9a0',
      'text_color', '#ca5231',
      'hover_color', '#365d66',
      'shadow_enabled', true,
      'sticky_enabled', true
    )
  )
) ON CONFLICT (key) DO UPDATE 
  SET value = EXCLUDED.value;