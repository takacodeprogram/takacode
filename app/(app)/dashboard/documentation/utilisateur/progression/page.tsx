import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Comprendre la progression",
  description: "Guide pour comprendre le système de progression, XP et grades sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/progression",
  noIndex: true
});

export default function ProgressionDocPage() {
  return (
    <>
      <PageHeader title="PROGRESSION ET POINTS" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Ta progression reflete l'avancement de ton projet</h2>
        <p>
          Sur TakaCode, les points (XP) et les grades mesurent l'avancement de ton projet, pas seulement
          ton apprentissage. Chaque action qui fait avancer ton projet te rapporte des points.
        </p>

        <h3>Gagner des points</h3>
        <ul>
          <li><strong>Leçon complétée :</strong> chaque leçon qui produit un livrable pour ton projet.</li>
          <li><strong>Quiz réussi :</strong> valide ta comprehension avant de passer a l'etape suivante.</li>
          <li><strong>Micro-projet valide :</strong> une étape de ton projet principal est livree.</li>
          <li><strong>Projet publie :</strong> ton projet est en ligne (gros bonus).</li>
          <li><strong>Premier revenu :</strong> ton projet commence a generer de l'argent (bonus majeur).</li>
        </ul>

        <h3>Grades</h3>
        <p>
          Les grades refletent ta progression dans la construction et la monétisation de tes projets.
        </p>
        <ul>
          <li><strong>Apprenti</strong> — projet crée, premiers livrables</li>
          <li><strong>Compagnon</strong> — projet construit, en cours de déploiement</li>
          <li><strong>Expert</strong> — projet publie et commence a générer</li>
          <li><strong>Maitre</strong> — projet rentable, tu aides les autres</li>
        </ul>

        <h3>Tableau de bord</h3>
        <p>
          Ton dashboard affiche un résumé : projets en cours, prochaine action recommandee,
          points gagnes et classement. Consulte-le pour savoir quoi faire ensuite.
        </p>
      </DocContent>
    </>
  );
}
