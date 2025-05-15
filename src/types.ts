export interface Concert {
  id: number;
  name: string;
  time: string;
  description: string;
  image?: string;
  stage: string;
  audio_url?: string | null;
  video_url?: string;
}

export interface Activity {
  id: number;
  name: string;
  time: string;
  description: string;
  icon: string;
  image?: string;
}