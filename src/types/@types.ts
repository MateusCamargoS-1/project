// ListMovies

export interface Genre {
    idGenres: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export interface Movie {
    id: number;
    adult: boolean;
    backdropPath: string;
    belongsToCollection: null | object;
    budget: number;
    genres: Genre[];
    homepage: string;
    idMovieIMdb: number;
    imdbId: string;
    originCountry: string[];
    originalLanguage: string;
    originalTitle: string;
    overview: string;
    popularity: number;
    posterPath: string;
    productionCompanies: ProductionCompany[];
    productionCountries: ProductionCountry[];
    releaseDate: string;
    revenue: number;
    runtime: number;
    spokenLanguages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    voteAverage: number;
    voteCount: number;
    fileName: string;
    filePath: string;
}

// StreamMovies

export interface AudioTrack {
    id: string;
    language: string;
    label: string;
  }
  
  export interface StreamResponse {
    url: string;
    audioTracks: AudioTrack[];
  }