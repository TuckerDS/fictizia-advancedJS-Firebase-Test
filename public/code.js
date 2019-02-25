// Initialize Firebase
let config = {
  apiKey: "AIzaSyDve5CqhzSSjZGNDEu83Vqs1kaMPXqc0dM",
  authDomain: "fictizia-js.firebaseapp.com",
  databaseURL: "https://fictizia-js.firebaseio.com",
  projectId: "fictizia-js",
  storageBucket: "fictizia-js.appspot.com",
  messagingSenderId: "343110934942"
};
firebase.initializeApp(config);

// Get a reference to the database service
let database = firebase.database();
let films 

window.onload = () => {
  getOMDBData()
  readData('favs', '').then(data => { console.log("favs", data) })
  listenerFavsData()
};

listenerFavsData = () => {
  let listener = firebase.database().ref('favs');
  listener.on('value', data => {
    let value = data.val()
    let filmList = { "Search": [] }
    if (value != null) Object.keys(value).forEach(e => filmList.Search.push(value[e]))
    renderFilms(filmList, 'favGrid')
  });
}

readData = (node,id) => firebase.database().ref(`/${node}/${id}`).once('value').then(data=> data.val());

writeData = (node, id, data) => { firebase.database().ref(`/${node}/${id}`).set(data); }

getOMDBData = () => {
  fetch('http://www.omdbapi.com/?s=ter*&apikey=e8502eac')
    .then(response =>response.json())
    .then(jsonFilms =>{
      films = jsonFilms
      renderFilms(films, 'omdbgrid');
    });
}

addEvents = gridID => {
  let container = document.getElementById(gridID)
  let rows = Array.from(container.querySelectorAll(".cell"))
  if (gridID == 'omdbgrid') rows.forEach(e => e.addEventListener('click', (e) => clickOMDB(e)))
  else rows.forEach(e => e.addEventListener('click', (e) => clickFAVS(e)))
}

clickFAVS = e => writeData("favs", e.currentTarget.id, null)

clickOMDB = e => {
  const id = e.currentTarget.id
  const film = films.Search.find(e => e.imdbID == id )
  writeData("favs", id, film)
}

renderFilms = (films, gridID) => {
  let container = document.getElementById(gridID)
  container.innerHTML = ''
  for (i = 0; i < films.Search.length; i++) {
    container.innerHTML += `
    <div class="cell" id="${films.Search[i].imdbID}">
      <div class="header"><span>${films.Search[i].Title} (${films.Search[i].Year})</span></div>
      <div class="image"><img src="${films.Search[i].Poster}"></div>
    </div>`
  }
  addEvents(gridID)
}