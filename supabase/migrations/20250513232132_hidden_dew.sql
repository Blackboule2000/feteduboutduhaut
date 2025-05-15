/*
  # Ajout de l'URL audio pour Herifara

  1. Modifications
    - Mise à jour des données des concerts avec l'URL audio pour Herifara
*/

INSERT INTO concerts (name, time, description, image_url, audio_url, stage, order_index)
VALUES
  (
    'MOTOLO',
    '22:00',
    'Groupe de rock alternatif originaire de Beauvais, MOTOLO vous embarque dans un voyage musical intense. Leur son puissant et leurs compositions originales créent une ambiance électrique qui ne laisse personne indifférent.',
    'https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/490718492_1218980463563281_2854588355792031626_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=7t7nrjQr03UQ7kNvwHNCH-_&_nc_oc=AdmWsEeUL4hLRolYWdRXqqCZAM-F-xCKTlX94M4sme9NaLozWCzDd3gETSGAbNIZ1KCmngnN_ckpEvxWGZhpFiq0&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=jyxYr7c0Wt6JcvOCz2dWGw&oh=00_AfLBGR0yPL2O7F2JCxyPR1xnrtXSxt8sKZhp9HqNHsZE6w&oe=682917AD',
    null,
    'Grande Scène',
    1
  ),
  (
    'Arbas',
    '20:30',
    'Véritable révélation de la scène folk française, Arbas mêle avec brio les sonorités traditionnelles aux arrangements contemporains. Leur musique évoque les grands espaces et raconte des histoires qui touchent au cœur.',
    'https://storage.googleapis.com/lkb-prod-public/coverPicture/3242_coverPicture0_22-08-2022_16:03:27.png',
    null,
    'Scène à Vélo',
    2
  ),
  (
    'Swinggums',
    '18:00',
    'Collectif jazz manouche débordant d''énergie, Swinggums revisite les standards du genre avec une touche de modernité. Leur virtuosité et leur joie communicative promettent un moment de pure festivité.',
    'http://www.image-heberg.fr/files/17471452584279924519.jpg',
    null,
    'Scène à Vélo',
    3
  ),
  (
    'Herifara',
    '16:00',
    'Groupe de musique traditionnelle malgache, Herifara nous fait voyager à travers les rythmes et mélodies de l''océan Indien. Un métissage musical unique qui invite à la danse et au partage.',
    'http://www.image-heberg.fr/files/17471447402961035699.png',
    'https://uploadnow.io/files/42JFzk6',
    'Grande Scène',
    4
  ),
  (
    'Philox',
    '14:00',
    'Artiste engagé et innovant, Philox propose un concert écologique unique sur une scène alimentée par des vélos. Un spectacle participatif qui allie musique et conscience environnementale.',
    'https://scontent.fcdg3-1.fna.fbcdn.net/v/t1.6435-9/139507339_3685754844840743_9206725310760043167_n.jpg',
    null,
    'Scène à Vélo',
    5
  ),
  (
    'Anna Rudy & Paul Lazarus',
    '00:00',
    'Duo de DJs talentueux de la scène électronique, Anna Rudy & Paul Lazarus fusionnent leurs univers musicaux pour créer des sets envoûtants. House, techno et sonorités organiques se mêlent pour une fin de soirée explosive.',
    'https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/399275272_841426904435744_2693429559216938006_n.jpg',
    null,
    'Hors Scène',
    6
  );