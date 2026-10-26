import $ from 'https://cdn.jsdelivr.net/npm/jquery@4.0.0/+esm';
import shave from 'https://cdn.jsdelivr.net/npm/shave@5.2.0/dist/shave.mjs';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@14.3.0/swiper-bundle.min.mjs';

$(() => {
  const $featuredSlider = $('.js-featured-slider');

  if ($featuredSlider.length > 0) {
    const numSlides = $featuredSlider.find('.swiper-slide').length;
    const featuredSwiper = new Swiper('.js-featured-slider', {
      navigation: {
        addIcons: false,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      a11y: { enabled: true },
      on: {
        init: function() {
          shave('.js-featured-article-title', 200);
        }
      }
    });

    if (numSlides === 1) {
      $featuredSlider.find('.js-featured-slider-button').remove();
    }
  }

  shave('.js-featured-article-title', 200);
});
