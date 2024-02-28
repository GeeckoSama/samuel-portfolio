export type Photo = {
  id: number;
  title: string | null;
  description: string | null;
  url: string | null;
  created_at: string;
  updated_at: string | null;
};

export type Photos = Photo[];

export type Video = {
  id: number;
  title: string | null;
  description: string | null;
  url: string | null;
  created_at: string;
  updated_at: string | null;
};

export type Videos = Video[];
