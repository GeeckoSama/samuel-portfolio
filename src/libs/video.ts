export interface Video {
  id: string;
  title: string;
  description: string;
  path: string;
  youtube_url: string;
  create_at: number;
  update_at: number;
}

export type Videos = Video[];

export interface Project {
  id: string;
  title: string;
  description: string;
  video: Video;
}

export type Projects = Project[];
