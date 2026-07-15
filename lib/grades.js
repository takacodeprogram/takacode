// Grades TakaCode (memes seuils que internal.compute_grade dans 001) + perks.

export const GRADES = [
  { key: "Starter", label: "Starter", min: 0, icon: "lucide:sprout", perk: "Bienvenue ! Tu demarres ton aventure." },
  { key: "Starter+", label: "Starter+", min: 250, icon: "lucide:trending-up", perk: "Tu prends de l'elan, continue." },
  { key: "Builder", label: "Builder", min: 700, icon: "lucide:hammer", perk: "Tu construis pour de vrai. Publie tes projets." },
  { key: "Master", label: "Master", min: 1500, icon: "lucide:crown", perk: "Eligible mentor, mis en avant sur le leaderboard, acces bonus recommande." },
  { key: "Legend", label: "Legend", min: 3000, icon: "lucide:trophy", perk: "Statut ultime : badge Legend et vitrine communaute." }
];

export function getGradeProgress(points) {
  const p = Number.isFinite(Number(points)) ? Math.max(0, Number(points)) : 0;

  let current = GRADES[0];
  let next = null;
  for (let i = 0; i < GRADES.length; i += 1) {
    if (p >= GRADES[i].min) {
      current = GRADES[i];
      next = GRADES[i + 1] || null;
    }
  }

  const percent = next ? Math.min(100, Math.floor(((p - current.min) / (next.min - current.min)) * 100)) : 100;
  const pointsToNext = next ? Math.max(0, next.min - p) : 0;

  return { points: p, current, next, percent, pointsToNext };
}
