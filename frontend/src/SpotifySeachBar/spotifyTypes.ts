export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  total_tracks: number;
}

export interface Artist {
  external_urls: ExternalUrls;
  name: string;
}

export interface SpotifySong {
  album: Album;
  artists: Artist[];
  duration_ms: number;
  external_urls: ExternalUrls;
  name: string;
  popularity: number;
  preview_url: string;
  uri: string;
}
