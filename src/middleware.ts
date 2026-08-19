import { defineMiddleware } from "astro/middleware";
import { detectUserLocale, getLangPrefix, LOCALES } from "./i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, cookies, redirect } = context;
  const pathname = url.pathname;

  // Extraer el primer segmento de la URL
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] as string | undefined;

  // Si el primer segmento es un locale conocido, guardamos la cookie y seguimos
  if (firstSegment && LOCALES.includes(firstSegment as any)) {
    cookies.set("locale", firstSegment, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return next();
  }

  // Si estamos en la raíz (sin prefijo de idioma), redirigimos al idioma detectado
  if (pathname === "/" || pathname === "") {
    const detected = detectUserLocale(request);
    const prefix = getLangPrefix(detected);
    return redirect(prefix, 302);
  }

  return next();
});