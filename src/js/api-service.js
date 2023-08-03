// import axios from 'axios';

// axios.defaults.headers.common['x-api-key'] =
//   '37124750-bb2205b7594ee961e8dd1b6b7';

const KEY = '37124750-bb2205b7594ee961e8dd1b6b7';
const BASE_URL = `https://pixabay.com/api/?key=${KEY}`;

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchHits() {
    const URL = `${BASE_URL}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return fetch(URL)
      .then(response => response.json())
      .then(({ hits }) => {
        this.incrementPage();
        return hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
