import { array, number, object, string } from "valibot";

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

export const VideoShema = object({
  id: string(),
  title: string(),
  description: string(),
  credits: array(string()),
  localisations: array(string()),
  production_date: number(),
  cover: string(),
  path: string(),
  svg_path: string(),
  youtube_url: string(),
  create_at: number(),
  update_at: number(),
});

export const VideosShema = array(VideoShema);
