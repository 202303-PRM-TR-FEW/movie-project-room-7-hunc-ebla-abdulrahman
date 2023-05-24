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
  const movieCast = await fetchCast(movie.id);
  const movieDirector = await fetchDirector(movie.id);
  const relatedMovies = await fetchSimilarMovies(movie.id);
  const movieTrailer = await fetchVideos(movie.id);
  renderMovie(movieRes, movieCast, movieDirector, relatedMovies, movieTrailer);
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
const fetchCast = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`)
  const res = await fetch(url)
  const data = await res.json()
  return data.cast;
};

const fetchDirector = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  return data.crew.find(cast => cast.job === "Director");
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

const fetchActor = async (person_id) => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const fetchGenre = async () => {
  const genreButton = document.querySelector('#dropdown');
  const url = constructUrl(`genre/movie/list`); 
  const res = await fetch(url);
  const data = await res.json();

  data.genres.forEach(element => {
    const genreSelection = document.createElement("a");
    genreSelection.textContent = element.name;
    genreSelection.classList.add("genre")
    genreButton.appendChild(genreSelection);

    genreSelection.addEventListener("click", () => {
      const apiKey = '0c33a84a65c320f35cf04b120b8ab6aa'; // Replace with your actual API key
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${element.id}`)
        .then(resp => resp.json())
        .then(data => renderMovies(data.results))
    })
  })
};
fetchGenre();

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
    <div class="items-center">
        <img id="movie-backdrop" class="w-96 rounded-full border border-gray-300 p-2 cursor-pointer" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
      } poster">
    <h3 class="text-center mt-2 font-bold italic font-serif text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">${movie.title}</h3>
    </div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, movieCast, movieDirector, relatedMovies, movieTrailer) => {
  CONTAINER.innerHTML = `
    <div class="row">
      <divs>
        <img id="movie-backdrop" src="${BACKDROP_BASE_URL + movie.backdrop_path}">
      </div>
      <div class="col-md-8">
        <div class="mb-3">
          <h1 id="movie-title" class="font-bold font-serif">${movie.title}</h1>
        </div>
        <div class="trailerVideo mb-3">
          <iframe class="trailerVideo" src="https://www.youtube.com/embed/${movieTrailer.results[0].key}?autoplay=1"></iframe>
        </div>
        <div class="mb-3 mt-1">       
          <p id="movie-release-date" class="font-serif"><b>Release Date:</b> ${movie.release_date}</p>
          <p id="movie-runtime" class="font-open-sans"><b>Runtime:</b> ${movie.runtime} Minutes</p>
        </div>
        <div class="overview mb-2">
          <h3 class="mb-1 font-bold font-serif">Overview:</h3>
          <p id="movie-overview" class="font-open-sans text-justify">${movie.overview}</p>
        </div>
        <div class="mb-2">
          <h3 class="mb-1 font-bold font-serif">Director:</h3>
          <p id="movie-director" class="font-open-sans">${movieDirector.name}</p>
        </div>
        <div class="mb-2">
          <h3 class="mb-1 font-bold font-serif">Language:</h3>
          <p class="font-open-sans">${movie.spoken_languages.map((languge) => `${languge.english_name}`)}</p>
        </div>
        <div class="mb-2">
          <h3 class="mb-1 font-bold font-serif">Vote Average:</h3>
          <p id="movie-director" class="font-open-sans">${movie.vote_average}</p>
        </div>
        <h3 class="font-bold mt-2 font-serif">Actors:</h3>
        <div class="actors grid grid-cols-5 gap-40 mb-3"></div>
        <ul id="actors" class="list-unstyled"></ul>
        <h3 class="font-bold font-serif">Similar Movies:</h3>
        <div class="similar-movies-container mt-1 mb-2 grid grid-cols-5 gap-40"></div>
        <div class="mt-12 mb-2">
          <h5 class="mt-2 text-center font-serif font-bold">Production Companies</h5>
          <div class="productionCompanies">${movie.production_companies.map((company) => `<img id="production" class="productionImgAnmi" src="${BACKDROP_BASE_URL + company.logo_path}" alt="${company.name}"`)}</div>
        </div>
      </div>
    </div>
  `;
  renderCast(movieCast, movieDirector)
  renderSimilarMovies(relatedMovies)
};

//Actor's pictures
const renderCast = (movieCast) => {
  const actors = document.querySelector(".actors")
  movieCast.slice(0, 5).map((actor) => {
    const eachActor = document.createElement("div")
    eachActor.setAttribute("class", "eachActor")
    eachActor.innerHTML = `<img class="someImages" src="${BACKDROP_BASE_URL + actor.profile_path}">`
    eachActor.addEventListener("click", (e) => {
      actorDetails(actor);
    })
    actors.appendChild(eachActor)
  })
}

const renderSimilarMovies = (relatedMovies) => {
  const similarMovies = document.querySelector(".similar-movies-container")
  relatedMovies.slice(0, 5).map((simMovie) => {
    const eachSimMovie = document.createElement("div")
    eachSimMovie.setAttribute("class", "eachSimMovie")
    eachSimMovie.innerHTML = `<img class="eachSimilarMovie"  src="${BACKDROP_BASE_URL + simMovie.backdrop_path}" alt="${simMovie.title} poster" height="200" width="150"">`
    eachSimMovie.addEventListener("click", (e) => {
      actorDetails(simMovie);
    })
    similarMovies.appendChild(eachSimMovie);
  })
};

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  // console.log(actorRes)
  renderActor(actorRes);
};


const renderActor = (actor) => {
  CONTAINER.innerHTML = "";
  CONTAINER.innerHTML = `
      <div class="row ">
        <div class="actorDiv grid-cols-2 ">
          <div class="grid grid-cols-2">
          <div>
          <img id="actor-backdrop" class="actorProfilePic" src=${PROFILE_BASE_URL + actor.profile_path}>
          </div>
          <div>
          <h5 id="actor-name" class="mt-3 mb-1 font-bold">${actor.name}</h5>
            <p id="actor-gender"><h3 class="mt-1 mb-2 font-bold">Gender: ${actor.gender == 1 ? "famale" : "male"}</h3> </p>
            <p id="actor-popularity"><h3 class="font-bold mt-1 mb-1">Popularity:</h3> <p class="info">${actor.popularity}</p></p>
            <p id="actor-birthday"><h3 class="font-bold mt-1 mb-1">Birthday:</h3> <p class="info">${actor.birthday}</p></p>
            <p id="actor-deathday"><h3 class="font-bold mt-1 mb-1">Deathday:</h3> <p class="info">${actor.deathday}</p></p>
          </div>
          </div>
          <div class="col-md-8">
            <div class="actorPageBiography mt-3 mb-3">
              <h3 class="font-bold mt-1 mb-1">Biography</h3>
              <p class="info text-justify" id="biography">${actor.biography}</p>
            </div>
            <h3 class="mb-2 font-bold"> Related Movies:</h3> 
            <div class="row grid grid-cols-4 gap-5 relatedMovAnim" id="knownFor"></div>
        </div>
      </div>`;

  if (actor.deathday === null) {
    document.getElementById("actor-deathday").remove()
  }
  actorMovieCredits(actor.id)
};

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
        <img class="actorRelatedMovies eachSimilarMovie" src="${imagePath}" alt="${dataRes[i].title
        } poster  "></div>
        <p class="titles" id="titles1">${dataRes[i].title}</p>`;

      knownFor.appendChild(movieCard);

      movieCard.addEventListener("click", () => {
        movieDetails(dataRes[i]);
      });
    }
  }
};

const actorsBtn = document.getElementById("actorsBtn")

const actorrun = async () => {
  const actors = await fetchActors();
  // console.log(actors)
  renderActors(actors)
}

actorsBtn.addEventListener("click", actorrun);

const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  const actorsContainer = document.createElement("div");
  actorsContainer.setAttribute("class", "actorsPage");
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.innerHTML = `
      <img class="actorsImages rounded-md cursor-pointer" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.name} poster"><div class="actorsCards"><p class="info text-center mt-2" id="actorsNames">${actor.name}</p></div>`;
    actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });

    actorsContainer.appendChild(actorDiv);
    CONTAINER.appendChild(actorsContainer)
  });
};

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results[0][3]);
  return data.results;
};

const dropDownButtons = document.querySelectorAll("#dropdownBtn");
const dropDownContent = document.querySelectorAll("#dropdown")
dropDownButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    if (e.target.textContent === "Genre ") {
      dropDownContent.classList.toggle("show")
    } else if (e.target.textContent === "Filter ") {
      filterDropDown.classList.toggle("show")
    }
  })
});

document.addEventListener("DOMContentLoaded", autorun);