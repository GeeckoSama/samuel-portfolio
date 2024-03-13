export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  preview_url: string;
  youtube_url: string;
  create_at: Date;
  updated_at: Date;
}

export type Videos = Video[];

export interface Project {
  id: number;
  title: string;
  description: string;
  video: Video;
}

export type Projects = Project[];
