const API_KEY = "563492ad6f91700001000001ee39bf7723944ecd87c8df3505321ff3";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");

let page = 1;
let fetchLink;
let currentSearch;
let searchValue;

// Event listeners
searchInput.addEventListener("input", updateInput);
more.addEventListener("click", loadMore);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
            <div class="gallery-info">
            <p>${photo.photographer}</p>
            <a href=${photo.src.original}>Download</a>
            </div>
            <img src=${photo.src.large}></img>
            `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  const RANDOM_CURATED_PHOTO_DEFAULT_API_ENDPOINT = `https://api.pexels.com/v1/curated?per_page=15&page=1`;
  fetchLink = RANDOM_CURATED_PHOTO_DEFAULT_API_ENDPOINT;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(query) {
  clearGallery();
  const SEARCH_PHOTO_API_ENDPOINT = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
  fetchLink = SEARCH_PHOTO_API_ENDPOINT;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

function clearGallery() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

curatedPhotos();
