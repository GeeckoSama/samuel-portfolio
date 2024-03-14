export interface Photo {
  id: string;
  title: string;
  description: string;
  path: string;
  create_at: number;
  update_at: number;
}

export type Photos = Photo[];

export interface Album {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
  create_at: number;
  update_at: number;
}

export type Albums = Album[];
