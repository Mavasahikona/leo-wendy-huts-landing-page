import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function revealPage(page: Page) {
  for (const section of await page.locator('main section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(160);
  }
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}

test('page loads, imagery resolves and all section links have targets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Leo Wendy Huts | More Room for Life');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Leo Wendy Huts.');
  await revealPage(page);
  const images = await page.locator('img').evaluateAll((elements) => elements.map((image) => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })));
  expect(images.every((image) => image.loaded), JSON.stringify(images)).toBe(true);
  const badAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')!).filter((href) => href.length > 1 && !document.getElementById(href.slice(1))));
  expect(badAnchors).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'artifacts/desktop-hero.png' });
  await page.screenshot({ path: 'artifacts/desktop-full.png', fullPage: true });
});

test('product exploration opens a prefilled quote and closes cleanly', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore our spaces', exact: true }).click();
  await expect(page).toHaveURL(/#spaces$/);
  await page.getByRole('button', { name: 'Explore wendy houses', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Wendy houses' })).toBeVisible();
  await expect(page.getByText('Garden sheds & storage', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: "Let's make it yours" }).click();
  await expect(page.getByRole('dialog', { name: 'Make room for your idea.' })).toBeVisible();
  await expect(page.getByLabel(/What would you like to build/)).toHaveValue('Wendy house');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await expect(page.getByRole('button', { name: 'Explore wendy houses', exact: true })).toBeFocused();
});

test('packages, floor plans and fit-out prices update with keyboard support', async ({ page }) => {
  await page.goto('/');
  const smallTab = page.getByRole('tab', { name: /The Log House/ });
  await smallTab.scrollIntoViewIfNeeded();
  await expect(page.locator('.plan-price strong')).toHaveText('R125,000');
  await smallTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /The Ground House/ })).toBeFocused();
  await expect(page.locator('.plan-price strong')).toHaveText('R185,000');
  await page.getByRole('checkbox', { name: 'Add electrical & plumbing' }).check();
  await expect(page.locator('.plan-price strong')).toHaveText('R235,000');
  await page.getByRole('button', { name: 'Layout', exact: true }).click();
  await expect(page.getByRole('img', { name: /Two-bedroom concept layout/ })).toBeVisible();
  await page.locator('#popular-plans').screenshot({ path: 'artifacts/ground-house-layout.png' });
  await page.getByRole('button', { name: 'Make this one yours' }).click();
  await expect(page.getByLabel(/What would you like to build/)).toHaveValue('Log home');
  await expect(page.getByLabel(/Size or layout/)).toHaveValue('7m x 10m, 2 bedrooms');
  await expect(page.getByLabel(/A little more about your idea/)).toHaveValue(/R235,000/);
  await expect(page.getByLabel(/A little more about your idea/)).toHaveValue(/with the full electrical/);
});

test('quote validates and prepares an accurate WhatsApp and email handoff', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.open = (url?: string | URL) => {
      (window as Window & { capturedChat?: string }).capturedChat = String(url);
      return null;
    };
  });
  await page.locator('.nav-quote').click();
  await page.getByRole('button', { name: 'Continue to WhatsApp' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel(/Your name/).fill('Alex Mokoena');
  await page.getByLabel(/Contact number/).fill('not-a-number');
  await page.getByLabel(/What would you like to build/).selectOption('Log home');
  await page.getByLabel(/Town or city/).fill('Pretoria, Gauteng');
  await page.getByLabel(/Size or layout/).fill('4m x 8m');
  await page.getByLabel(/A little more about your idea/).fill('Please include insulation & a small veranda.');
  await page.getByRole('button', { name: 'Continue to WhatsApp' }).click();
  await expect(page.getByRole('alert')).toContainText('valid contact number');
  await page.getByLabel(/Contact number/).fill('082 123 4567');
  await page.getByRole('dialog').screenshot({ path: 'artifacts/quote-form.png' });
  await page.getByRole('button', { name: 'Continue to WhatsApp' }).click();
  await expect(page.getByRole('heading', { name: /Your idea is ready/ })).toBeVisible();
  const captured = await page.evaluate(() => (window as Window & { capturedChat?: string }).capturedChat!);
  const url = new URL(captured);
  expect(url.origin).toBe('https://wa.me');
  expect(url.pathname).toBe('/27726423964');
  const message = url.searchParams.get('text');
  expect(message).toContain('Alex Mokoena');
  expect(message).toContain('4m x 8m');
  expect(message).toContain('Pretoria, Gauteng');
  expect(message).toContain('insulation & a small veranda');
  await expect(page.getByRole('link', { name: /Prefer email/ })).toHaveAttribute('href', /^mailto:ljwendyhuts@gmail.com\?subject=/);
  await page.getByRole('button', { name: 'Edit my details' }).click();
  await expect(page.getByLabel(/Your name/)).toHaveValue('Alex Mokoena');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(page.locator('.nav-quote')).toBeFocused();
});

test('FAQs expand, collapse and keep one answer open', async ({ page }) => {
  await page.goto('/');
  const delivery = page.getByRole('button', { name: 'Do you deliver outside Gauteng?' });
  await delivery.click();
  await expect(delivery).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Do you deliver outside Gauteng?' })).toContainText('across South Africa');
  const custom = page.getByRole('button', { name: 'Can I customise my Wendy house or log home?' });
  await custom.click();
  await expect(delivery).toHaveAttribute('aria-expanded', 'false');
  await expect(custom).toHaveAttribute('aria-expanded', 'true');
  await custom.click();
  await expect(custom).toHaveAttribute('aria-expanded', 'false');
});

test('contact routes use the supplied phone, email and address', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: '+27 72 642 3964', exact: true })).toHaveAttribute('href', 'tel:+27726423964');
  await expect(page.getByRole('link', { name: 'ljwendyhuts@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:ljwendyhuts@gmail.com');
  await expect(page.getByRole('link', { name: /342 Broodryk Street/ })).toHaveAttribute('href', /342\+Broodryk\+Street\+Wolmer\+Pretoria/);
  const unsafeLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links.filter((link) => !link.getAttribute('rel')?.includes('noopener')).map((link) => link.getAttribute('href')));
  expect(unsafeLinks).toEqual([]);
});

for (const width of [320, 375, 390, 768, 1024, 1280, 1920]) {
  test(`responsive layout and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await revealPage(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width < 960) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
      await expect(menu).toBeVisible();
      await menu.getByRole('link', { name: 'FAQs' }).click();
      await expect(page).toHaveURL(/#faqs$/);
      await expect(menu).toHaveCount(0);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: 'Get a free quote' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const bounds = await page.getByRole('dialog').boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.width).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: 'Close dialog' }).click();
    } else {
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      if (width === 1280 || width === 1920) {
        await page.setViewportSize({ width, height: width === 1920 ? 1080 : 800 });
        await page.screenshot({ path: `artifacts/hero-${width}.png` });
      }
    }
    if (width === 390) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: 'artifacts/mobile-hero.png' });
      await page.screenshot({ path: 'artifacts/mobile-full.png', fullPage: true });
    }
  });
}

test('page and quote form meet automated WCAG AA checks', async ({ page }) => {
  await page.goto('/');
  await revealPage(page);
  const pageResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(pageResults.violations).toEqual([]);
  await page.locator('.nav-quote').click();
  const dialogResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(dialogResults.violations).toEqual([]);
});

test('keyboard focus stays in dialogs and restores to the trigger', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-quote').click();
  for (let index = 0; index < 15; index++) {
    await page.keyboard.press('Tab');
    expect(await page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('.nav-quote')).toBeFocused();
});

test('mobile menu and product details meet automated WCAG AA checks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await revealPage(page);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  const menuResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(menuResults.violations).toEqual([]);
  await page.getByRole('button', { name: 'Close navigation' }).click();
  await page.getByRole('button', { name: 'Explore custom spaces', exact: true }).click();
  const productResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(productResults.violations).toEqual([]);
});
test('built page is self-contained: images and font load with no external files', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith('data:') && !url.startsWith('blob:')) requests.push(new URL(url).pathname);
  });
  await page.goto('/');
  await revealPage(page);
  const fontReady = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 20px Inter'); });
  expect(fontReady).toBe(true);
  const images = await page.locator('img').evaluateAll((els) => els.map((img) => ({ src: img.getAttribute('src')!.slice(0, 22), ok: (img as HTMLImageElement).naturalWidth > 0 })));
  expect(images.length).toBeGreaterThanOrEqual(6);
  expect(images.every((image) => image.ok && image.src.startsWith('data:image/webp'))).toBe(true);
  expect(requests.filter((path) => path !== '/' && path !== '/index.html')).toEqual([]);
});
