import {test, expect} from '../src/node_modules/@playwright/test/index.mjs';
import {readFile} from 'node:fs/promises';
for (const viewport of [{width: 1280, height: 900}, {width: 390, height: 844}]) {
  test(`slider, navigation and post cards at ${viewport.width}px`, async ({page}, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // Local sandbox verification may map exact package versions to temporary test bundles.
    // CI leaves CDN_FIXTURES unset and verifies the actual public CDN imports.
    if (process.env.CDN_FIXTURES) {
      await page.route('https://cdn.jsdelivr.net/npm/**', async route => {
        const manifest = JSON.parse(await readFile(`${process.env.CDN_FIXTURES}/manifest.json`, 'utf8'));
        const file = manifest[route.request().url()];
        if (!file) return route.abort();
        await route.fulfill({body: await readFile(`${process.env.CDN_FIXTURES}/${file}`), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', headers: {'Access-Control-Allow-Origin': '*'}});
      });
    }
    await page.goto('/');
    await page.waitForFunction(() => !!document.querySelector('.js-featured-slider')?.swiper);
    const button = page.locator('.js-featured-slider .swiper-button-next');
    await expect(button.locator('.icon-arrow-right')).toHaveCount(1);
    await expect(button.locator('.swiper-navigation-icon')).toHaveCount(0);
    await expect(button).toHaveCSS('content', 'normal');
    expect(await button.evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
    await button.click();
    await expect.poll(() => page.locator('.js-featured-slider').evaluate(el => el.swiper.activeIndex)).toBe(1);
    if (viewport.width < 768) {
      await page.locator('.js-open-menu').click();
      await expect(page.locator('.js-menu')).toHaveClass(/opened/);
      await page.locator('.js-close-menu').click();
      await expect(page.locator('.js-menu')).not.toHaveClass(/opened/);
    }
    if (viewport.width < 768) await page.locator('.js-open-menu').click();
    await page.locator('.m-toggle-darkmode').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.goto('/post/');
    await page.waitForFunction(() => document.querySelector('.kg-image-card img').classList.contains('js-zoomable'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const link = page.locator('#text-link');
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
    await expect(page.locator('.kg-toggle-card-icon')).not.toHaveClass(/m-button/);
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.locator('.kg-callout-card').hover();
    await expect(page.locator('.kg-callout-card')).toHaveCSS('translate', 'none');
    await expect(page.locator('.js-animation-wrapper')).toHaveCSS('opacity', '1');
    await page.screenshot({path: testInfo.outputPath('post.png'), fullPage: true});
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
