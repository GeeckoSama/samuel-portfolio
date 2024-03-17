export interface Video {
  id: string;
  title: string;
  description: string;
  credits: string[];
  localisations?: string[];
  production_date: number;
  cover: string;
  path: string;
  svg_path: string;
  youtube_url: string;
  create_at: number;
  update_at: number;
}

export type Videos = Video[];