import ApiService from './js/api-service';
// notifix
import Notiflix from 'notiflix';

// lightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

const apiService = new ApiService();

// LightBox
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMore);

let isLoading = false;

function onSearchForm(event) {
  event.preventDefault();

  apiService.query = event.currentTarget.elements.searchQuery.value;

  if (apiService.query === '') {
    return Notiflix.Notify.warning('Please enter a search query');
  }

  loadMoreBtn.style.display = 'none';
  showLoader();
  apiService.resetPage();
  clearHitsGallery();

  /////////// API
  apiService.fetchHits().then(hitsPromise => {
    appendHitsMarkup(hitsPromise);
    lightbox.refresh();
    hideLoader();

    if (hitsPromise.totalHits > 0) {
      loadMoreBtn.style.display = 'block';

      Notiflix.Notify.success(
        `Hooray! We found ${hitsPromise.totalHits} images.`
      );
    } else {
      loadMoreBtn.style.display = 'none';

      Notiflix.Report.failure(
        'Oops..',
        'Sorry, there are no images matching your search query. Please try again.',
        'Close'
      );
    }
  });
}

function onLoadMore() {
  if (isLoading) {
    return;
  }

  loadMoreBtn.style.display = 'none';
  showLoader();

  //////// API
  apiService.fetchHits().then(hitsPromise => {
    appendHitsMarkup(hitsPromise);
    lightbox.refresh();
    hideLoader();

    if (hitsPromise.hits.length > 0) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';

      Notiflix.Report.info(
        'Title',
        "We're sorry, but you've reached the end of search results.",
        'Close'
      );
    }
  });
}

function appendHitsMarkup(hitsPromise) {
  const hitsMarkup = hitsPromise.hits
    .map(hit => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;

      return `<div class="photo-card">
                <a class="gallery__link" href="${largeImageURL}">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="560"/>
                </a>

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

function clearHitsGallery() {
  gallery.innerHTML = '';
}

function hideLoader() {
  loader.style.display = 'none';
  isLoading = false;
}

function showLoader() {
  loader.style.display = 'block';
  isLoading = true;
}
