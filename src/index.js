import ApiService from './js/api-service';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiService = new ApiService();

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchForm(event) {
  event.preventDefault();

  apiService.query = event.currentTarget.elements.searchQuery.value;

  if (apiService.query === '') {
    return alert('eee');
  }
  apiService.resetPage();
  apiService.fetchHits().then(hits => {
    clearHitsContainer();
    appendHitsMarkup(hits);
  });
}

function onLoadMore() {
  apiService.fetchHits().then(appendHitsMarkup);
}

function appendHitsMarkup(hits) {
  const hitsMarkup = hits
    .map(hit => {
      const { webformatURL, tags, likes, views, comments, downloads } = hit;

      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="560"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
    
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', hitsMarkup);
}

function clearHitsContainer(params) {
  gallery.innerHTML = '';
}
