const API_KEY = "70bd27b483e78304dc732a3fa531b5b0"; //My API data
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMedia {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

export interface IGetMediaResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMedia[];
  total_pages: number;
  total_results: number;
}

export interface IGetData {
  key: string;
  category: string;
  fetchFn: (keyword: string) => Promise<IGetMediaResult>;
}

export interface IGetDetailData {
  key: string;
  fetchFn: (id: string) => Promise<IGetDetail>;
}

export interface IGetCreditData {
  key: string;
  fetchFn: (id: string) => Promise<ICreditData>;
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
  title?: string; //Movie
  name?: string; //TV
  original_title?: string; //Movie
  original_name?: string; //TV
  release_date?: string; //Movie
  first_air_date?: string; //TV
  runtime: number;
  seasons?: IGetTVSeason[]; // TV Only
}

interface IGetTVSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
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

//Movie Query...

export const MovieDataFunc = [
  { key: "nowMovie", category: "Now Playing", fetchFn: getNowPlayingMovies },
  { key: "popMovie", category: "Popular", fetchFn: getPopularMovies },
  { key: "topMovie", category: "Top Rated", fetchFn: getTopRatedMovies },
  { key: "upMovie", category: "Upcoming", fetchFn: getUpcomingMovies },
] as IGetData[];

//TV Query...

export const TVDataFunc = [
  { key: "onairTV", category: "On the Air TV", fetchFn: getOnTheAirTV },
  { key: "popTV", category: "Popular TV", fetchFn: getPopularTV },
  { key: "topTV", category: "Top Rated TV", fetchFn: getTopRatedTV },
  { key: "arirangTV", category: "Arirang TV", fetchFn: getAiringTodayTV },
] as IGetData[];

//Search Query...
export const SearchDataFunc = [
  {
    key: "searchMovie",
    category: "Movies searched by  ",
    fetchFn: getSearchKeywordMovie,
  }, //Movie
  {
    key: "searchTV",
    category: "TV shows searched by  ",
    fetchFn: getSearchKeywordTV,
  }, //TV
] as IGetData[];

//Detail Query...
export const DetailDataFunc = [
  { key: "movieDetail", fetchFn: getDetailMovie }, //Movie
  { key: "tvDetail", fetchFn: getDetailTV }, //TV
] as IGetDetailData[];

//Credit Query...
export const CreditDataFunc = [
  { key: "movieCredit", fetchFn: getCreditInfo }, //Movie
  { key: "tvDetail", fetchFn: getCreditTVInfo }, //TV
] as IGetCreditData[];

export function isMovie(media: IMedia) {
  return "title" in media;
}

function getNowPlayingMovies(dummy: string) {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getPopularMovies(dummy: string) {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getTopRatedMovies(dummy: string) {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getUpcomingMovies(dummy: string) {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Detail Movie Infomation
function getDetailMovie(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

//Credit Actor
function getCreditInfo(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getOnTheAirTV(dummy: string) {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getAiringTodayTV(dummy: string) {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getPopularTV(dummy: string) {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

function getTopRatedTV(dummy: string) {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Detail Movie Infomation
function getDetailTV(id: string) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

//Credit Actor
function getCreditTVInfo(id: string) {
  return fetch(`${BASE_PATH}/tv/${id}/credits?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Search Movie
function getSearchKeywordMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${keyword}&api_key=${API_KEY}`
  ).then((response) => response.json());
}

//Search TV
function getSearchKeywordTV(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?query=${keyword}&api_key=${API_KEY}`
  ).then((response) => response.json());
}

//https://api.themoviedb.org/3/search/tv?query=white&api_key=70bd27b483e78304dc732a3fa531b5b0
