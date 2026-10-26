import $ from 'https://cdn.jsdelivr.net/npm/jquery@4.0.0/+esm';
import mediumZoom from 'https://cdn.jsdelivr.net/npm/medium-zoom@1.1.2/+esm';
import fitvids from 'https://cdn.jsdelivr.net/npm/fitvids@2.1.1/+esm';
import shave from 'https://cdn.jsdelivr.net/npm/shave@5.2.0/dist/shave.mjs';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@14.3.0/swiper-bundle.min.mjs';
import {
  isMobile,
  adjustImageGallery,
  managePostImages,
  makeImagesZoomable
} from './helpers';

let $animationWrapper = null;
let $progressCircle = null;
let lastScrollingY = window.pageYOffset;
let lastWindowHeight = 0;
let lastDocumentHeight = 0;
let circumference = 0;
let isTicking = false;

const onScrolling = () => {
  lastScrollingY = window.pageYOffset;
  requestTicking();
};

const adjustShare = (timeout) => {
  if (!isMobile('1023px')) {
    $('body').removeClass('share-menu-displayed');
  } else {
    $('body').addClass('share-menu-displayed');
    setTimeout(() => {
      $animationWrapper.removeAttr('data-animate');
    }, timeout);
  }
};

const onResizing = () => {
  setHeights();
  adjustShare(100);

  setTimeout(() => {
    setCircleStyles();
    requestTicking();
  }, 200);
};

const requestTicking = () => {
  if (!isTicking) {
    requestAnimationFrame(updating);
  }

  isTicking = true;
};

const updating = () => {
  const progressMax = lastDocumentHeight - lastWindowHeight;
  const percent = Math.ceil((lastScrollingY / progressMax) * 100);

  if (percent <= 100) {
    setProgress(percent);
  }

  isTicking = false;
};

const setHeights = () => {
  lastWindowHeight = window.innerHeight;
  lastDocumentHeight = $(document).height();
};

const setCircleStyles = () => {
  const svgWidth = $progressCircle.parent().width();
  const radiusCircle = svgWidth / 2;
  const borderWidth = isMobile() ? 2 : 3;

  $progressCircle.parent().attr('viewBox', `0 0 ${svgWidth} ${svgWidth}`);
  $progressCircle.attr('stroke-width', borderWidth);
  $progressCircle.attr('r', radiusCircle - (borderWidth - 1));
  $progressCircle.attr('cx', radiusCircle);
  $progressCircle.attr('cy', radiusCircle);

  circumference = radiusCircle * 2 * Math.PI;

  $progressCircle[0].style.strokeDasharray = `${circumference} ${circumference}`;
  $progressCircle[0].style.strokeDashoffset = circumference;
};

const setProgress = percent => {
  if (percent <= 100) {
    const offset = circumference - (percent / 100) * circumference;
    $progressCircle[0].style.strokeDashoffset = offset;
  }
};

const prepareProgressCircle = () => {
  $progressCircle = $('.js-progress');

  setHeights();
  setCircleStyles();
  updating();

  setTimeout(() => {
    $progressCircle.parent().css('opacity', 1);
  }, 300);
};

$(() => {
  $animationWrapper = $('.js-animation-wrapper');
  const $scrollButton = $('.js-scrolltop');
  const $recommendedSlider = $('.js-recommended-slider');

  fitvids('.js-post-content');

  adjustImageGallery();
  adjustShare(1000);

  if ($recommendedSlider.length > 0) {
    const recommendedSwiper = new Swiper('.js-recommended-slider', {
      navigation: {
        addIcons: false,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      slidesPerView: 1,
      allowTouchMove: true,
      loop: false,
      a11y: { enabled: true },
      breakpoints: {
        720: {
          slidesPerView: 2,
          allowTouchMove: true,
          loop: false
        },
        1024: {
          slidesPerView: 3,
          allowTouchMove: false,
          loop: false
        }
      },
      on: {
        init: function() {
          shave('.js-article-card-title', 100);
          shave('.js-article-card-title-no-image', 250);
        }
      }
    });
  }

  shave('.js-article-card-title', 100);
  shave('.js-article-card-title-no-image', 250);

  $scrollButton.on('click', () => {
    $('html, body').animate(
      {
        scrollTop: 0
      },
      500
    );
  });

  managePostImages($);
  makeImagesZoomable($, mediumZoom);

  window.addEventListener('scroll', onScrolling, { passive: true });
  window.addEventListener('resize', onResizing, { passive: true });
});

$(window).on('load', () => {
  prepareProgressCircle();
});
