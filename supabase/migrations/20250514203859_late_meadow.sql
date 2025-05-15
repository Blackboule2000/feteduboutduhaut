/*
  # Mise à jour des médias du programme

  1. Modifications
    - Ajout des URLs des images, vidéos et fichiers audio pour chaque entrée du programme
    - Configuration des galeries d'images
*/

UPDATE program
SET 
  image_url = 'https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/490718492_1218980463563281_2854588355792031626_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=7t7nrjQr03UQ7kNvwHNCH-_&_nc_oc=AdmWsEeUL4hLRolYWdRXqqCZAM-F-xCKTlX94M4sme9NaLozWCzDd3gETSGAbNIZ1KCmngnN_ckpEvxWGZhpFiq0&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=jyxYr7c0Wt6JcvOCz2dWGw&oh=00_AfLBGR0yPL2O7F2JCxyPR1xnrtXSxt8sKZhp9HqNHsZE6w&oe=682917AD',
  video_url = 'https://www.youtube.com/embed/5akvnSXO4wQ'
WHERE title = 'MOTOLO';

UPDATE program
SET 
  image_url = 'https://storage.googleapis.com/lkb-prod-public/coverPicture/3242_coverPicture0_22-08-2022_16:03:27.png',
  video_url = 'https://www.youtube.com/embed/-Jt6i24KZpA'
WHERE title = 'Arbas';

UPDATE program
SET 
  image_url = 'http://www.image-heberg.fr/files/1747210241578388202.jpg',
  audio_url = 'https://ia800300.us.archive.org/26/items/audio-2025-04-28-14-01-03-1/AUDIO-2025-04-28-14-01-03%281%29.m4a'
WHERE title = 'Swinggums';

UPDATE program
SET 
  image_url = 'http://www.image-heberg.fr/files/17471444531595162131.png',
  audio_url = 'https://ia600706.us.archive.org/17/items/never-comes-heri-fara/Never%20Comes%20-%20Heri%20Fara.mp3',
  video_url = 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F61563093157088%2Fvideos%2F1722287321875708'
WHERE title = 'Herifara';

UPDATE program
SET 
  image_url = 'http://www.image-heberg.fr/files/17472098721296061223.png',
  video_url = 'https://www.youtube.com/embed/1EbzcOcWoog'
WHERE title = 'Philox';

UPDATE program
SET 
  image_url = 'https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/399275272_841426904435744_2693429559216938006_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=r8AC-k1wb3oQ7kNvwHsEYX3&_nc_oc=AdkptrZQf8DtlvojCOWGq-gMetdY8uhOCfyw9RXqnCaQQtLJag-3if3ErslqD3WgFwStiFhh-443vKn-jr0wVuPh&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=-XcAwlyFlxTmQdp8Jg_B0A&oh=00_AfLmgpB8EQNkTHcLp1ECCO-Q7Ae838zazzR0uO-mKOtF7Q&oe=682A395A',
  video_url = 'https://www.youtube.com/embed/vtFg8ciwfmE'
WHERE title = 'Anna Rudy & Paul Lazarus';