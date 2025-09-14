export interface Album {
  albumUrl: string;
  title: string;
  photos: string[];
}

export interface AlbumStatus {
  cacheSize: number;
  albums: {
    title: string;
    albumUrl: string;
    photoCount: number;
  }[];
}

export interface RefreshResponse {
  message: string;
  albumCount: number;
}
