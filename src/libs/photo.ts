export interface Photo {
  id: number;
  title: string;
  description: string;
  url: string;
  shooting_date: Date;
  create_at: Date;
  updated_at: Date;
}

export type Photos = Photo[];

export interface Album {
  id: number;
  title: string;
  description: string;
  photos: Photo[];
  create_at: Date;
  updated_at: Date;
}

export type Albums = Album[];
