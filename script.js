'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieCast=await fetchCast(movie.id);
  const movieDirector = await fetchDirector(movie.id);
  const relatedMovies = await fetchSimilarMovies(movie.id);
  const movieTrailer = await fetchVideos(movie.id);
  renderMovie(movieRes,movieCast,movieDirector,relatedMovies, movieTrailer);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};
const fetchCast=async(movie_id)=>{
  const url=constructUrl(`movie/${movie_id}/credits`)
  const res=await fetch(url)
  const data=await res.json()
  return data.cast;
};

const fetchDirector = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  return data.crew.find( cast => cast.job==="Director");
};

const fetchSimilarMovies = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};

const fetchVideos = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
    <div class="items-center">
        <img id="movie-backdrop" class="w-96 rounded-full border border-gray-300 p-4" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
    <h3>${movie.title}</h3>
    </div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};
// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie,movieCast,movieDirector,relatedMovies,movieTrailer) => {
    CONTAINER.innerHTML = `
    <div class="row">
      <divs>
        <img id="movie-backdrop" src="${BACKDROP_BASE_URL + movie.backdrop_path}">
      </div>
      <div class="col-md-8">
      <h5>Trailer</h5>
      <div class="trailerVideo">
        <iframe class="trailerVideo" src="https://www.youtube.com/embed/${movieTrailer.results[0].key}?autoplay=1"></iframe>
      </div>
        <div class="mb-3">
          <h1 id="movie-title">${movie.title}</h1>
        </div>
        <div class="mb-3 mt-1">       
          <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
          <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
        </div>
        <div class="overview mb-2">
          <h3 class="mb-1 font-bold">Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
        <div class="mb-2">
          <h3 class="mb-1 font-bold">Director:</h3>
          <p id="movie-director">${movieDirector.name}</p>
        </div>
        <div class="mb-2">
          <h3 class="mb-1 font-bold">Language:</h3>
          <p>${movie.spoken_languages.map((languge) =>`${languge.english_name}`)}</p>
        </div>
        <div class="mb-2">
          <h3 class="mb-1 font-bold">Vote Average:</h3>
          <p id="movie-director">${movie.vote_average}</p>
        </div>
        <h3 class="font-bold mt-2">Actors:</h3>
        <div class="actors grid grid-cols-5 gap-10 mb-3"></div>
        <ul id="actors" class="list-unstyled"></ul>
        <h3>Similar Movies:</h3>
        <div class="similar-movies-container mt-1 mb-2"></div>
        <div class="mt-1 mb-2">
          <h5>Production Companies</h5>
          <div class="productionCompanies">${movie.production_companies.map((company)=>`<img id="production" src="${BACKDROP_BASE_URL + company.logo_path}" alt="${company.name}"`)}</div>
        </div>
      </div>
    </div>
  `;
  renderCast(movieCast,movieDirector)
  renderSimilarMovies(relatedMovies)
};

//Actor's pictures
const renderCast=(movieCast)=>{
  const actors=document.querySelector(".actors")
  movieCast.slice(0,5).map((actor)=>{
    const eachActor=document.createElement("div")
    eachActor.setAttribute("class","eachActor")
    eachActor.innerHTML=`<img class="someImages" src="${BACKDROP_BASE_URL+actor.profile_path}">`
    eachActor.addEventListener("click",(e)=>{
      actorDetails(actor);
    })
    actors.appendChild(eachActor)
  })
}

const renderSimilarMovies=(relatedMovies)=>{
  const similarMovies=document.querySelector(".similar-movies-container")
  relatedMovies.slice(0,5).map((simMovie)=>{
    const eachSimMovie=document.createElement("div")
    eachSimMovie.setAttribute("class","eachSimMovie")
    eachSimMovie.innerHTML=`<img class="eachSimilarMovie"  src="${BACKDROP_BASE_URL + simMovie.backdrop_path}" alt="${simMovie.title} poster" height="200" width="150"">`
    eachSimMovie.addEventListener("click",(e)=>{
      actorDetails(simMovie);
    })
    similarMovies.appendChild(eachSimMovie);
  })
};

document.addEventListener("DOMContentLoaded", autorun);