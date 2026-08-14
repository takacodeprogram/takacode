import type { Locale } from "./i18n";
import { localePath } from "./localeHelpers";

interface LocalizedTrack {
  slug: string;
  locale: string;
  counterpartSlug: string;
}

export function localizedTrackPath(track: LocalizedTrack, targetLocale: Locale): string {
  const slug = track.locale === targetLocale ? track.slug : track.counterpartSlug;
  return localePath(slug ? `/tracks/${slug}` : "/tracks", targetLocale);
}
