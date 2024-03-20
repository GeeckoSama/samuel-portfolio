import { array, number, object, optional, string } from "valibot";

export interface Photo {
  id: string;
  title: string;
  description: string;
  path: string;
  create_at: number;
  update_at: number;
}

export type Photos = Photo[];

export const PhotoShema = object({
  id: string(),
  title: string(),
  description: string(),
  path: string(),
  create_at: number(),
  update_at: number(),
});

export const PhotosShema = array(PhotoShema);

export interface Album {
  id: string;
  title: string;
  description: string;
  covers?: string[];
  photos?: Photo[];
  nbPhotos?: number;
  localisations: string[];
  create_at: number;
  update_at: number;
}

export type Albums = Album[];

export const AlbumShema = object({
  id: string(),
  title: string(),
  description: string(),
  covers: optional(array(string())),
  photos: optional(PhotosShema),
  nbPhotos: optional(number()),
  localisations: array(string()),
  create_at: number(),
  update_at: number(),
});

export const AlbumsShema = array(AlbumShema);
