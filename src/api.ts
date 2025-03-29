const API_KEY = "70bd27b483e78304dc732a3fa531b5b0"; //My API data
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetData {
  key: string;
  category: string;
  fetchFn: () => Promise<IGetMoviesResult>;
}

export interface IGetDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  title: string;
  original_title?: string;
  release_date: string;
  runtime: number;
}

export interface ICreditData {
  id: number;
  cast: [
    {
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      profile_path: string;
      character: string;
    }
  ];
  crew: [
    {
      known_for_department: string;
      name: string;
      original_name: string;
      department: string;
      job: string;
      profile_path: string;
    }
  ];
}

export const MovieDataFunc = [
  { key: "nowMovie", category: "Now Playing", fetchFn: getNowPlayingMovies },
  { key: "popMovie", category: "Popular", fetchFn: getPopularMovies },
  { key: "topMovie", category: "Top Rated", fetchFn: getTopRatedMovies },
  { key: "upMovie", category: "Upcoming", fetchFn: getUpcomingMovies },
] as IGetData[];

export function getNowPlayingMovies() {
  console.log(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  console.log(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  console.log(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  console.log(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Detail Movie Infomation
export function getDetailMovie(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

//Credit Actor
export function getCreditInfo(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//TV Query...

export function getOnTheAirTV() {
  console.log(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getAiringTodayTV() {
  console.log(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTV() {
  console.log(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedTV() {
  console.log(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
