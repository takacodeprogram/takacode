import type { Locale } from "../../lib/i18n";
import { getLocale } from "../../lib/i18n";

export interface Step {
  id: string;
  icon: string;
  title: string;
  body: string;
  center?: boolean;
}

export function getSteps(tourKey: string, locale: Locale): Step[] {
  const { t } = getLocale(locale);
  const keys: { id: string; icon: string }[] = [];
  if (tourKey === "parcours") {
    keys.push(
      { id: "welcome", icon: "lucide:map" },
      { id: "ordering", icon: "lucide:route" },
      { id: "cards", icon: "lucide:folder-open" },
      { id: "enrollment", icon: "lucide:play-circle" }
    );
  } else if (tourKey === "detail") {
    keys.push(
      { id: "welcome", icon: "lucide:info" },
      { id: "prereqs", icon: "lucide:git-branch" },
      { id: "curriculum", icon: "lucide:book-open" }
    );
  } else if (tourKey === "lecon") {
    keys.push(
      { id: "welcome", icon: "lucide:book-open-text" },
      { id: "resources", icon: "lucide:book-type" },
      { id: "quiz", icon: "lucide:check-circle" },
      { id: "project", icon: "lucide:folder-code" },
      { id: "nav", icon: "lucide:arrow-left-right" }
    );
  } else if (tourKey === "guide") {
    keys.push(
      { id: "welcome", icon: "lucide:sparkles" },
      { id: "navigate", icon: "lucide:mouse-pointer-click" },
      { id: "done", icon: "lucide:rocket" }
    );
  }
  return keys.map((k) => ({
    id: k.id,
    icon: k.icon,
    title: t(`tour.${tourKey}.${k.id}.title`),
    body: t(`tour.${tourKey}.${k.id}.body`),
    center: true
  }));
}
