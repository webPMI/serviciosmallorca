import { describe, it, expect } from 'vitest';
import {
  getLocaleFromUrl,
  getLangPrefix,
  loadTranslations,
  detectUserLocale,
  LOCALES,
} from '../../src/i18n';

describe('i18n utility module', () => {
  describe('getLocaleFromUrl', () => {
    it('returns "es" by default when no locale in path', () => {
      const url = new URL('https://campfit.app/');
      expect(getLocaleFromUrl(url)).toBe('es');
    });

    it('detects valid locales from URL path', () => {
      expect(getLocaleFromUrl(new URL('https://campfit.app/en'))).toBe('en');
      expect(getLocaleFromUrl(new URL('https://campfit.app/ca/register'))).toBe('ca');
      expect(getLocaleFromUrl(new URL('https://campfit.app/es/login'))).toBe('es');
    });

    it('falls back to "es" for unsupported locale segments', () => {
      const url = new URL('https://campfit.app/fr/dashboard');
      expect(getLocaleFromUrl(url)).toBe('es');
    });
  });

  describe('getLangPrefix', () => {
    it('generates correct language route prefix', () => {
      expect(getLangPrefix('es')).toBe('/es/');
      expect(getLangPrefix('en')).toBe('/en/');
      expect(getLangPrefix('ca')).toBe('/ca/');
    });
  });

  describe('detectUserLocale', () => {
    it('detects locale from cookie first', () => {
      const req = new Request('https://campfit.app/', {
        headers: { cookie: 'locale=en; other=123' },
      });
      expect(detectUserLocale(req)).toBe('en');
    });

    it('detects locale from Accept-Language header if cookie is missing', () => {
      const req = new Request('https://campfit.app/', {
        headers: { 'accept-language': 'ca-ES,ca;q=0.9,es;q=0.8' },
      });
      expect(detectUserLocale(req)).toBe('ca');
    });

    it('defaults to "es" when no header or cookie matches', () => {
      const req = new Request('https://campfit.app/');
      expect(detectUserLocale(req)).toBe('es');
    });
  });

  describe('loadTranslations and locale parity', () => {
    it('loads non-empty translations for all supported locales', async () => {
      for (const locale of LOCALES) {
        const trans = await loadTranslations(locale);
        expect(trans).toBeDefined();
        expect(Object.keys(trans).length).toBeGreaterThan(0);
        expect(trans['site.title']).toBe('WebApp Starter');
      }
    });

    it('ensures key parity between es, en, and ca locale files', async () => {
      const es = await loadTranslations('es');
      const en = await loadTranslations('en');
      const ca = await loadTranslations('ca');

      const esKeys = Object.keys(es).sort();
      const enKeys = Object.keys(en).sort();
      const caKeys = Object.keys(ca).sort();

      expect(enKeys).toEqual(esKeys);
      expect(caKeys).toEqual(esKeys);
    });
  });
});
