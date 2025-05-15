import { Concert, Activity } from './types';
import { Music, Utensils, Beer, BookOpen, Dice1 as Dice, Trophy, MapPin, Tent, FocusIcon as CircusIcon, Users, ShoppingBag } from 'lucide-react';

export const concertData: Concert[] = [
  {
    id: 1,
    name: "MOTOLO",
    time: "22:00",
    description: "Motolo, qui tire son nom de l'expression marquisienne signifiant « faire l'amour », est un groupe d'afro beat-funk né en Thiérache de l'amitié de quatre musiciens soudés sur les bancs de l'école de musique municipale. Depuis leurs premières répétitions au début des années 2000 au Beatnik Chic, la salle mythique d'Hirson, le groupe s'est fait connaître sur de nombreux festivals en région puis dans toute la France. Le répertoire, quasi uniquement instrumental au début, a aujourd'hui évolué vers un afro-beat chanté en créole, cerné d'influences parfois rock, dans une filiation parfaitement assumée avec les Red Hot Chili Peppers.",
    image: "https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/490718492_1218980463563281_2854588355792031626_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=7t7nrjQr03UQ7kNvwHNCH-_&_nc_oc=AdmWsEeUL4hLRolYWdRXqqCZAM-F-xCKTlX94M4sme9NaLozWCzDd3gETSGAbNIZ1KCmngnN_ckpEvxWGZhpFiq0&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=jyxYr7c0Wt6JcvOCz2dWGw&oh=00_AfLBGR0yPL2O7F2JCxyPR1xnrtXSxt8sKZhp9HqNHsZE6w&oe=682917AD",
    stage: "Grande Scène",
    audio_url: null,
    video_url: "https://www.youtube.com/embed/5akvnSXO4wQ"
  },
  {
    id: 2,
    name: "ARBAS",
    time: "20:30",
    description: "Arbas a de cette douce sauvagerie qui jaillit en éclats musicaux aux travers des feuilles de sa forêt. Chez elle, la Femme est si grande que la pluie la touche en premier (« Cheyenne ») et le coeur de la Terre un incendie permanent, bouillon écarlate sous nos pieds (« Magma »). Sa poésie lui a été soufflée dans l'oreille par Nougaro, ses tours et jeux de voix par Camille et la ferveur qui l'anime sur scène par Patti Smith. Seule avec son ukulélé et son looper, ou accompagnée par Matthieu Mancini (clavier/basse) et de Chris Astudillo (batterie/percussions), elle sème sur son passage des chansons teintées de jazz et d'exotisme, de fièvre et de malice. Arbas chante les arbres, la terre et les océans, la Femme, l'ivresse et l'amour. Elle chante et sa chanson est sauvage.",
    image: "https://storage.googleapis.com/lkb-prod-public/coverPicture/3242_coverPicture0_22-08-2022_16:03:27.png",
    stage: "Scène à Vélo",
    audio_url: null,
    video_url: "https://www.youtube.com/embed/-Jt6i24KZpA"
  },
  {
    id: 3,
    name: "Swinggums",
    time: "18:00",
    description: "Jazz manouche débordant d'énergie, Swinggums revisite les standards du genre avec une touche de modernité. Leur virtuosité et leur joie communicative promettent un moment de pure festivité.",
    image: "http://www.image-heberg.fr/files/1747210241578388202.jpg",
    stage: "Scène à Vélo",
    audio_url: "https://ia800300.us.archive.org/26/items/audio-2025-04-28-14-01-03-1/AUDIO-2025-04-28-14-01-03%281%29.m4a",
    video_url: null
  },
  {
    id: 4,
    name: "Herifara",
    time: "16:00",
    description: "Fondé en décembre 2023 à Beauvais, le groupe HeriFara marque la réunion de 3 âmes musicales : Ritchie Razafimanantsoa, Tawfik El Khatyb et Sullivan Venrie. Tawfik et Sullivan pratiquaient déjà de la musique ensemble, notamment de la guitare et du rap. La rencontre avec Ritchie fût déterminante : le jour même, la formation était créée et le nom choisi. Heri Fara est le prénom de l'oncle défunt de Ritchie, qui lui a inculqué la passion de la musique. C'est tout naturellement que son patronyme fut sélectionné comme nom de groupe, en symbole de l'amour de la famille et d'hommage aux personnes chères qui nous quittent toujours trop tôt.",
    image: "http://www.image-heberg.fr/files/17471444531595162131.png",
    stage: "Grande Scène",
    audio_url: "https://ia600706.us.archive.org/17/items/never-comes-heri-fara/Never%20Comes%20-%20Heri%20Fara.mp3",
    video_url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F61563093157088%2Fvideos%2F1722287321875708"
  },
  {
    id: 5,
    name: "Philox",
    time: "14:00",
    description: "Un artiste singulier, de l'enfance bercée par un éclectisme musical à une critique radicale du spectacle. Autodidacte de la guitare, il s'affranchit des circuits traditionnels pour partager sa musique directement, privilégiant l'authenticité et la connexion intime avec son public. Son parcours atypique témoigne d'une quête artistique hors des sentiers battus.",
    image: "http://www.image-heberg.fr/files/17472098721296061223.png",
    stage: "Scène à Vélo",
    audio_url: null,
    video_url: "https://www.youtube.com/embed/1EbzcOcWoog"
  },
  {
    id: 6,
    name: "Anna Rudy & Paul Lazarus",
    time: "00:00 - 02:00",
    description: "Anna Rudy et Paul Lazarus sont un couple de DJs, originaires respectivement de Pologne et de Londres, installés à Beauvais. Passionnés de musique, ils mixent une grande variété de styles (blues, soul, ska, reggae, punk, rock'n'roll, etc.) exclusivement à partir de leur collection de vinyles. Ils ont également animé une émission de radio et se produisent dans divers lieux en Europe. En dehors du DJing, Paul est un artiste aux multiples talents (écrivain, photographe, réalisateur) et Anna est linguiste.",
    image: "https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/399275272_841426904435744_2693429559216938006_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=r8AC-k1wb3oQ7kNvwHsEYX3&_nc_oc=AdkptrZQf8DtlvojCOWGq-gMetdY8uhOCfyw9RXqnCaQQtLJag-3if3ErslqD3WgFwStiFhh-443vKn-jr0wVuPh&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=-XcAwlyFlxTmQdp8Jg_B0A&oh=00_AfLmgpB8EQNkTHcLp1ECCO-Q7Ae838zazzR0uO-mKOtF7Q&oe=682A395A",
    stage: "Hors Scène",
    audio_url: null,
    video_url: "https://www.youtube.com/embed/vtFg8ciwfmE"
  }
];

export const activityData: Activity[] = [
  {
    id: 1,
    name: "Village Local",
    time: "11:00 - 20:00",
    description: "Découvrez les talents de notre territoire : artisans, producteurs et associations locales vous présentent leur savoir-faire et leurs créations uniques.",
    icon: "Users",
    image: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg"
  },
  {
    id: 2,
    name: "Camping Festival",
    time: "Du 26 au 27 juillet",
    description: "Profitez du camping gratuit pour vivre pleinement l'expérience du festival. Espace aménagé avec sanitaires et point d'eau.",
    icon: "Tent",
    image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg"
  },
  {
    id: 3,
    name: "Food Village",
    time: "11:00 - 02:00",
    description: "Une sélection de food-trucks et restaurateurs locaux pour régaler vos papilles. Cuisine locale, bio et options végétariennes disponibles.",
    icon: "Utensils",
    image: "https://images.pexels.com/photos/2608512/pexels-photo-2608512.jpeg"
  },
  {
    id: 4,
    name: "Bar & Buvette",
    time: "11:00 - 02:00",
    description: "Rafraîchissements, bières locales et cocktails servis dans des gobelets réutilisables. Un espace convivial pour se désaltérer.",
    icon: "Beer",
    image: "https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg"
  },
  {
    id: 5,
    name: "Marché Artisanal",
    time: "11:00 - 20:00",
    description: "Bijoux, céramiques, textiles... Découvrez les créations uniques de nos artisans locaux dans une ambiance chaleureuse et festive.",
    icon: "ShoppingBag",
    image: "https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg"
  },
  {
    id: 6,
    name: "Initiation au Cirque",
    time: "13:00 - 18:00",
    description: "Mélie Malice vous initie aux arts du cirque : jonglage, équilibre, acrobaties... Une expérience ludique pour petits et grands !",
    icon: "CircusIcon",
    image: "https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/462504621_1071331628335287_2041364644335749792_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Zhr-bZIsviQQ7kNvwHqSPp2&_nc_oc=AdmzksD2-34gVqhqhZt_ZzdOPJbTjanATLMFE_e3UuPp8immKzP8Lpwbm9HOIjtz_CbN775ub76WbKrqQTiJvizq&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=8zXt9s2ZNOu1mLf9an3zhQ&oh=00_AfIUYF51ULrTWoTYqCxTJL_jfYwYnXSWPV-4u0RYBopYqQ&oe=682A4EE9"
  },
  {
    id: 7,
    name: "Balade Contée",
    time: "14:00 et 16:30",
    description: "Partez à la découverte des légendes locales lors d'une promenade enchantée. Une pause poétique au cœur de la nature.",
    icon: "BookOpen",
    image: "https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg"
  },
  {
    id: 8,
    name: "Association Correlation",
    time: "11:00 - 19:00",
    description: "Rencontrez Michel Méline et l'équipe de Correlation. Découvrez leurs actions pour la protection de l'environnement et participez à des animations nature ludiques et pédagogiques.",
    icon: "Users",
    image: "https://www.jagispourlanature.org/sites/default/files/structures/logos/correlation.jpg"
  }
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Music": return Music;
    case "Utensils": return Utensils;
    case "Beer": return Beer;
    case "BookOpen": return BookOpen;
    case "Dice": return Dice;
    case "Trophy": return Trophy;
    case "MapPin": return MapPin;
    case "Tent": return Tent;
    case "CircusIcon": return CircusIcon;
    case "Users": return Users;
    case "ShoppingBag": return ShoppingBag;
    default: return Dice;
  }
};