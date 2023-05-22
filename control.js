'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsContainer = document.querySelector(".actorsContainer");


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  // console.log(movies);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
  "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=")}`;};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieCast = await fetchCast(movie.id);
  const relatedMovies = await fetchSimilarMovies(movie.id);
  const movieTrailer = await fetchVideos(movie.id);
  const director= await fetchDirector(movie.id);
  renderMovie(movieRes,movieCast,relatedMovies,movieTrailer,director);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();};

// This function is to fetch genres.
const fetchGenre = async () => {
  const dropDownContent = document.querySelector(".dropdown-content")
  const url = constructUrl("genre/movie/list");
  const res = await fetch(url);
  const data = await res.json();
  
data.genres.forEach(element => {
  const genreLink = document.createElement("a");
  genreLink.textContent = element.name
  genreLink.classList.add("genre")
  dropDownContent.appendChild(genreLink);

    //Fetching the required genre of movies when its name clicked 
genreLink.addEventListener("click", () => {
  fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${atob(
  "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&with_genres=${element.id}`)
  .then(resp => resp.json())
  .then(data => renderMovies(data.results))})});};
fetchGenre();

// This fetch is to fetch popular movies.
const fetchPopularMovies = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;};
// fetchPopularMovies();


// This function is to fetch Top rated movies.
const fetchTopRated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;};
// fetchTopRated();


// This function is to fetch upcoming movies.
const fetchUpComing = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;};
// fetchUpComing();


// This function is to fetch movie cast.
const fetchCast = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.cast);
  return data.cast;};
// fetchCast();

const fetchDirector = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log (data.crew.find(cast => cast.job=="Director"));
  return data.crew.find( cast => cast.job==="Director");}
// fetchDirector();

// This function is to fetch trailers.
const fetchVideos = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data;};
// fetchVideos();


// This function is to fetch similar movies.
const fetchSimilarMovies = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;};
// fetchSimilarMovies();


// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ""
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute("class","movieDiv");
    movieDiv.innerHTML = `
     <img class="movieImage" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title} poster">`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);});
    CONTAINER.appendChild(movieDiv);})};
                              
// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie,movieCast,relatedMovies,trailer,director) => {
  CONTAINER.innerHTML = `
    <div class="home-row">
    <section class="moviePage">
    <div class="one">
      <div class="col-md-4">
        <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
      </div>
      <div class="col-md-8">
        <p id="movie-title">${movie.title}</p>
        <h3>Release Date:</h3> <p class="info">${movie.release_date}</p>
        <p><h3>Runtime:</h3><p class="info"> ${movie.runtime} Minutes</p></p>
        <h3>Overview:</h3>
        <p class="info">${movie.overview}</p>
        <h3>vote_average:</h3>
        <p class="info">${movie.vote_average}</p>
        <h3>Language:</h3>
        <p class="info">${movie.spoken_languages.map((languge) =>`${languge.english_name}`)}</p>
        <h3>Director:</h3>
        <p class="info">${director.name}</p> 
        </div></div>
        <div class="two">
        <h5>Trailer</h5>
        <div class="trailerVideo"><iframe class="trailerVideo" src="https://www.youtube.com/embed/${trailer.results[0].key}?autoplay=1"></iframe></div></div>
        </section>
        <h5>Actors</h5><div class ="actors" ></div>
        <h5>Similar Movies</h5><div class="relatedMoviesContainer"></div>
        <h5>Production Companies</h5>
        <div class="productionCompanies">${movie.production_companies.map((company)=>`<img id="production" src="${BACKDROP_BASE_URL + company.logo_path}" alt="${company.name}"`)}</div>
        </div></div>`;
    
    renderCast(movieCast);
    renderRelatedMovies(relatedMovies);
};

const renderCast = (movieCast) => {
  const actors = document.querySelector(".actors");
  movieCast.slice(0,5).map ((actor)=> {
    const eachActor = document.createElement("div");
    eachActor.setAttribute("class","eachActor");
    eachActor.innerHTML= `<img class="someImages" src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster" height="200">
    <p class="titles">${actor.name}</p>`
    eachActor.addEventListener("click", (e)=>{
    actorDetails(actor);})
    actors.appendChild(eachActor);});}

const renderRelatedMovies = (relatedMovies) => {
  const related = document.querySelector(".relatedMoviesContainer");
  relatedMovies.slice(0,5).map ((movie)=> {
    const eachMovie = document.createElement("div");
    eachMovie.setAttribute("class","eachMovie");
    eachMovie.innerHTML= `<img class="someImages" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" height="200" width="150">
    <p class="titles">${movie.title}</p>`
    related.addEventListener("click", (e)=>{
    movieDetails(movie);})
    related.appendChild(eachMovie);});}


//Actor Section--------------------------------------------------------------
const actorsBtn=document.getElementById("actors")

const actorrun= async () => {
  const actors= await fetchActors();
  // console.log(actors)
  renderActors(actors)}

actorsBtn.addEventListener("click", actorrun)

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  // console.log(actorRes)
  renderActor(actorRes);};

// This function is to fetch actors.
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results[0][3]);
  return data.results;};
// fetchActors()

// This function is to fetch actor.
const fetchActor = async (person_id) => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  return data};
// fetchActor()

//This function is to fetch single actor related movies(known_for)
const actorMovieCredits = async (person_id) => {
  const url = constructUrl(`person/${person_id}/movie_credits`)
  const res = await fetch(url)
  const data = await res.json()
  const dataRes = data['cast']
  const knownFor = document.getElementById("knownFor")
  for (let i = 0; i < 5; i++) {
    let imagePath = "/no_image.jpg";
    if (dataRes[i].backdrop_path !== null) {
      imagePath = BACKDROP_BASE_URL + dataRes[i].backdrop_path;
      const movieCard = document.createElement("div");
      movieCard.innerHTML = `
      <div class="dontKnow">
        <img class="actorRelatedMovies" src="${imagePath}" alt="${dataRes[i].title
        } poster  "></div>
        <p class="titles" id="titles1">${dataRes[i].title}</p>`;
      
      knownFor.appendChild(movieCard);

      movieCard.addEventListener("click", () => {
        movieDetails(dataRes[i]);});}}};


const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  const actorsContainer = document.createElement("div");
  actorsContainer.setAttribute("class","actorsPage");
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.innerHTML = `
      <img class="actorsImages" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${
      actor.name} poster"><div class="actorsCards"><p class="info" id="actorsNames">${actor.name}</p></div>`;

    actorDiv.addEventListener("click", () => {
      actorDetails(actor);});
    
    actorsContainer.appendChild(actorDiv);
    CONTAINER.appendChild(actorsContainer)});};

const renderActor = (actor) => {
  CONTAINER.innerHTML = "";
  CONTAINER.innerHTML = `
    <div class="row">
      <div class="actorDiv">
      <img id="actor-backdrop" src=${
      PROFILE_BASE_URL + actor.profile_path}>
      </div>
      <div class="col-md-8">
      <h5 id="actor-name">${actor.name}</h5>
      <p id="actor-gender"><h3>Gender:</h3><p class="info"> ${actor.gender == 1 ? "famale" : "male"}</p></p>
      <p id="actor-popularity"><h3>Popularity:</h3> <p class="info">${actor.popularity}</p></p>
      <p id="actor-birthday"><h3>Birthday:</h3> <p class="info">${actor.birthday}</p></p>
      <p id="actor-deathday"><h3>Deathday:</h3> <p class="info">${actor.deathday}</p></p>
      <h3>Biography</h3>
      <p class="info" id="biography">${actor.biography}</p></div><div>
      <h3> Related Movies:</h3> 
      <div class="row justify-content-center" id="knownFor"></div></div></div>`;

    if (actor.deathday === null) {
      document.getElementById("actor-deathday").remove() }
      actorMovieCredits(actor.id)};

//------------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", autorun);

// Filter dropdown
const dropDownButtons = document.querySelectorAll(".dropbtn")
const dropDownContent = document.querySelector(".dropdown-content")
const filterDropDown = document.querySelector(".filter-dropdown-content")

filterDropDown.childNodes.forEach(link => {
  link.addEventListener("click", () => {
    if (link.textContent === "Up coming") {
      fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=")}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    } else if (link.textContent === "Popular") {
      fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=")}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    } else if (link.textContent === "Now playing") {
      fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=")}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    } else if (link.textContent === "Top rated") {
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=")}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))}})})

// Dropdown clicks
dropDownButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    if (e.target.textContent === "Genre ") {
      dropDownContent.classList.toggle("show")
    } else if (e.target.textContent === "Filter ") {
      filterDropDown.classList.toggle("show")}})})

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    if (dropDownContent.classList.contains('show')) {
      dropDownContent.classList.remove('show');
    } else if (filterDropDown.classList.contains('show')) {
      filterDropDown.classList.remove('show');}}}

// Actors fetch and listening
const actorLink = document.querySelector(".actor-link");


//Shortcut for moving the cursor to the search box
const searchInput = document.getElementById("search-input");

let isKeyPressed = { 
  'a': false, // ASCII code for 'a'
  'q': false, // ASCII code for 'k'
   // ... Other key codes you want to track
};

document.onkeydown = (e) => {
  isKeyPressed[e.key] = true; 
  if (e.ctrlKey && isKeyPressed["q"]) {
    searchInput.focus();}};

document.onkeyup = (e) => {
  isKeyPressed[e.key] = false;};

searchInput.addEventListener("input", (e) => {
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=542003918769df50083a13c415bbc602&language=en-US&query=${e.target.value}&page=1&include_adult=false`)
  .then(resp => resp.json())
  .then(data => { 
    console.log(e.target.value)
    data.results.forEach(result => {
    if (result.media_type === "movie") {
    renderMovies(data.results)}})})})

    searchInput.addEventListener("input", (e) => {
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=542003918769df50083a13c415bbc602&language=en-US&query=${e.target.value}&page=1&include_adult=false`)
      .then(resp => resp.json())
      .then(data => { 
        //console.log(data.results)
        data.results.forEach(result => {
          if (result.media_type === "movie") {
            renderMovies(data.results)
          }
        })  
        //actorsContainer.innerHTML = "";
        data.results.forEach(result => {
          if (result.media_type === "person") {
            console.log(result.name)
            const singleActor = document.createElement("div")
            singleActor.setAttribute("class","actorsContainers");
            const actorDiv = document.createElement("div");
            actorDiv.innerHTML = `
            <img  src="${PROFILE_BASE_URL + result.profile_path}" alt="${result.name} poster">
            <h3>${result.name}</h3>`;
    
            actorDiv.addEventListener("click", () => {
                actorDetails(actor);
            });
        
           singleActor.appendChild(actorDiv);
           actorsContainer.appendChild(singleActor);
          }
        })
      })
    })

const button = document.querySelector('.trailer');
button.addEventListener('click', (e) => {
  window.open('https://www.youtube.com/watch?v=umIeYcQLABg', '_blank');});


const home = document.querySelector('.home')
home.addEventListener('click', () => {
  window.location.reload()})

searchInput.addEventListener("input", (e) => {
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=542003918769df50083a13c415bbc602&language=en-US&query=${e.target.value}&page=1&include_adult=false`)
  .then(resp => resp.json())
  .then(data => { 
    //console.log(data.results)
    data.results.forEach(result => {
      if (result.media_type === "movie") {
        renderMovies(data.results)
      }
    })  
    //actorsContainer.innerHTML = "";
    data.results.forEach(result => {
      if (result.media_type === "person") {
        console.log(result.name)
        const singleActor = document.createElement("div")
        singleActor.setAttribute("class","actorsContainers");
        const actorDiv = document.createElement("div");
        actorDiv.innerHTML = `
        <img src="${PROFILE_BASE_URL + result.profile_path}" alt="${result.name} poster">
        <h3>${result.name}</h3>`;

        actorDiv.addEventListener("click", () => {
            actorDetails(actor);
        });
    
       singleActor.appendChild(actorDiv);
       actorsContainer.appendChild(singleActor);
      }
    })
  })
})

const aboutPage = () => {
  CONTAINER.innerHTML=`
  <div class="aboutContainer">
  <p class="aboutText">"We're just trying to survive"</p>
  <p class="aboutText2"> -Menar Nelson</p>
  <p class= "imageContainer"><img class="aboutImage" src="./macarena-skeleton.gif"></p>
  
  </div>
  
  
  `
}

const aboutBtn = document.querySelector(".aboutBtn");
aboutBtn.addEventListener("click", () => {
  CONTAINER.innerHTML = "";
  aboutPage();
});