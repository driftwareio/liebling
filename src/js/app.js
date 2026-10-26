import $ from 'https://cdn.jsdelivr.net/npm/jquery@4.0.0/+esm';
import Headroom from 'https://cdn.jsdelivr.net/npm/headroom.js@0.12.0/+esm';
import tippy from 'https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/+esm';
import shave from 'https://cdn.jsdelivr.net/npm/shave@5.2.0/dist/shave.mjs';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@14.3.0/swiper-bundle.min.mjs';
import { isRTL, formatDate, isMobile } from './helpers';

$(() => {
  if (isRTL()) {
    $('html')
      .attr('dir', 'rtl')
      .addClass('rtl');
  }

  const $body = $('body');
  const $header = $('.js-header');
  const $announcementBar = $('#announcement-bar-root');
  const $openMenu = $('.js-open-menu');
  const $closeMenu = $('.js-close-menu');
  const $menu = $('.js-menu');
  const $toggleSubmenu = $('.js-toggle-submenu');
  const $submenuOption = $('.js-submenu-option')[0];
  const $submenu = $('.js-submenu');
  const $recentSlider = $('.js-recent-slider');
  const $openSecondaryMenu = $('.js-open-secondary-menu');
  const $openSearch = $('.js-open-search');
  const $closeSearch = $('.js-close-search');
  const $search = $('.js-search');
  const $inputSearch = $('.js-input-search');
  const $searchResults = $('.js-search-results');
  const $searchNoResults = $('.js-no-results');
  const $toggleDarkMode = $('.js-toggle-darkmode');
  const $mainNav = $('.js-main-nav');
  const $mainNavLeft = $('.js-main-nav-left');
  const $newsletterElements = $('.js-newsletter');
  let currentSavedTheme = null;
  try { currentSavedTheme = localStorage.getItem('theme'); } catch {}

  let fuse = null;
  let submenuIsOpen = false;
  let secondaryMenuTippy = null;

  const showSubmenu = () => {
    $header.addClass('submenu-is-active');
    $toggleSubmenu.addClass('active');
    $submenu.removeClass('closed').addClass('opened');
  };

  const hideSubmenu = () => {
    $header.removeClass('submenu-is-active');
    $toggleSubmenu.removeClass('active');
    $submenu.removeClass('opened').addClass('closed');
  };

  const toggleScrollVertical = () => {
    $body.toggleClass('no-scroll-y');
  };

  const tryToRemoveNewsletter = () => {
    if (typeof disableNewsletter !== 'undefined' && disableNewsletter) {
      $newsletterElements.remove();
    }
  };

  const trySearchFeature = () => {
    if (typeof ghostSearchApiKey !== 'undefined' && typeof nativeSearchEnabled === 'undefined') {
      getAllPosts(ghostHost, ghostSearchApiKey).catch(console.error);
    } else {
      $openSearch.css('visibility', 'hidden');
      $closeSearch.remove();
      $search.remove();
    }
  };

  const getAllPosts = async (host, key) => {
    const [{default: GhostContentAPI}, {default: Fuse}] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/@tryghost/content-api@1.12.13/+esm'),
      import('https://cdn.jsdelivr.net/npm/fuse.js@7.5.0/+esm')
    ]);
    const api = new GhostContentAPI({
      url: host,
      key,
      version: 'v5.0'
    });
    const allPosts = [];
    const fuseOptions = {
      shouldSort: true,
      ignoreLocation: true,
      findAllMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
      keys: ['title', 'custom_excerpt', 'tags.name']
    };

    api.posts
      .browse({
        limit: 'all',
        include: 'tags',
        fields: 'id, title, url, published_at, custom_excerpt'
      })
      .then(posts => {
        for (let i = 0, len = posts.length; i < len; i++) {
          allPosts.push(posts[i]);
        }

        fuse = new Fuse(allPosts, fuseOptions);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const toggleDesktopTopbarOverflow = disableOverflow => {
    if (!isMobile()) {
      if (disableOverflow) {
        $mainNav.addClass('toggle-overflow');
        $mainNavLeft.addClass('toggle-overflow');
      } else {
        $mainNav.removeClass('toggle-overflow');
        $mainNavLeft.removeClass('toggle-overflow');
      }
    }
  };

  $openMenu.on('click', () => {
    $header.addClass('mobile-menu-opened');
    $menu.addClass('opened');
    toggleScrollVertical();
  });

  $closeMenu.on('click', () => {
    $header.removeClass('mobile-menu-opened');
    $menu.removeClass('opened');
    toggleScrollVertical();
  });

  $toggleSubmenu.on('click', () => {
    submenuIsOpen = !submenuIsOpen;

    if (submenuIsOpen) {
      showSubmenu();
    } else {
      hideSubmenu();
    }
  });

  $openSearch.on('click', () => {
    $search.addClass('opened');
    setTimeout(() => {
      $inputSearch.trigger('focus');
    }, 400);
    toggleScrollVertical();
  });

  $closeSearch.on('click', () => {
    $inputSearch.trigger('blur');
    $search.removeClass('opened');
    toggleScrollVertical();
  });

  $inputSearch.on('keyup', () => {
    if ($inputSearch.val().length > 0 && fuse) {
      const results = fuse.search($inputSearch.val());
      const bestResults = results.filter(result => {
        if (result.score <= 0.5) {
          return result;
        }
      });

      if (bestResults.length > 0) {
        const results = bestResults.map(({item}) => {
          const article = $('<article>').addClass('m-result');
          const link = $('<a>').addClass('m-result__link').attr('href', item.url);
          link.append($('<h3>').addClass('m-result__title').text(item.title));
          link.append($('<span>').addClass('m-result__date').text(formatDate(item.published_at)));
          return article.append(link)[0];
        });
        $searchNoResults.hide();
        $searchResults.empty().append(results).show();
      } else {
        $searchResults.html('');
        $searchResults.hide();
        $searchNoResults.show();
      }
    } else {
      $searchResults.html('');
      $searchResults.hide();
      $searchNoResults.hide();
    }
  });

  $toggleDarkMode.on('change', () => {
    if ($toggleDarkMode.is(':checked')) {
      $('html').attr('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      $('html').attr('data-theme', 'light');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }

    // Ghost owns the comments iframe; never access its cross-origin document.
  });

  $toggleDarkMode.on('mouseenter', () => {
    toggleDesktopTopbarOverflow(true);
  });

  $toggleDarkMode.on('mouseleave', () => {
    toggleDesktopTopbarOverflow(false);
  });

  $(window).on('click', e => {
    if (submenuIsOpen) {
      if ($submenuOption && !$submenuOption.contains(e.target)) {
        submenuIsOpen = false;
        hideSubmenu();
      }
    }
  });

  $(document).on('keyup', e => {
    if (e.key === 'Escape' && $search.hasClass('opened')) {
      $closeSearch.trigger('click');
    }
  });

  if (currentSavedTheme) {
    if (currentSavedTheme === 'dark') {
      $toggleDarkMode.each(function() {
        $(this).attr('checked', true);
      });
    }
  }

  if ($header.length > 0) {
    const headroom = new Headroom($header[0], {
      tolerance: {
        down: 10,
        up: 20
      },
      offset: 15,
      onUnpin: () => {
        if (!isMobile() && secondaryMenuTippy) {
          const desktopSecondaryMenuTippy = secondaryMenuTippy[0];

          if (
            desktopSecondaryMenuTippy &&
            desktopSecondaryMenuTippy.state.isVisible
          ) {
            desktopSecondaryMenuTippy.hide();
          }
        }
      }
    });
    headroom.init();
  }

  if ($announcementBar.length > 0) {
    $header.addClass('with-announcement-bar');

    setTimeout(() => {
      $header.removeAttr('data-animate');
    }, 500);

    const barMutationObserver = new MutationObserver((e) => {
      if (e[0].addedNodes.length) {
        $announcementBar.detach().prependTo($header);
        const barHeight = $announcementBar.height();
        document.documentElement.style.setProperty('--announcement-bar-height', `${barHeight}px`);
      }

      if (e[0].removedNodes.length) {
        document.documentElement.style.setProperty('--announcement-bar-height', '0px');
      }
    });

    const barResizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const barHeight = entry.contentRect.height;
        document.documentElement.style.setProperty('--announcement-bar-height', `${barHeight}px`);
      })
    });

    barMutationObserver.observe($announcementBar[0], { childList: true });
    barResizeObserver.observe($announcementBar[0]);
  } else {
    setTimeout(() => {
      $header.removeAttr('data-animate');
    }, 500);
  }

  if ($recentSlider.length > 0) {
    const recentSwiper = new Swiper('.js-recent-slider', {
      freeMode: true,
      slidesPerView: 'auto',
      a11y: { enabled: true },
      on: {
        init: function() {
          shave('.js-recent-article-title', 50);
        }
      }
    });
  }

  if ($openSecondaryMenu.length > 0) {
    const template = document.getElementById('secondary-navigation-template');

    secondaryMenuTippy = tippy('.js-open-secondary-menu', {
      appendTo: document.body,
      content: template.innerHTML,
      allowHTML: true,
      arrow: true,
      trigger: 'click',
      interactive: true,
      onShow() {
        toggleDesktopTopbarOverflow(true);
      },
      onHidden() {
        toggleDesktopTopbarOverflow(false);
      }
    });
  }

  tippy('.js-tooltip', { allowHTML: true });

  shave('.js-article-card-title', 100);
  shave('.js-article-card-title-no-image', 250);

  tryToRemoveNewsletter();
  trySearchFeature();
});
