import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Comprendre la progression",
  description: "Guide pour comprendre le systeme de progression, XP et grades sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/progression",
  noIndex: true
});

export default function ProgressionDocPage() {
  return (
    <>
      <PageHeader title="PROGRESSION ET POINTS" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Systeme de progression</h2>
        <p>
          TakaCode utilise un systeme de points (XP) et de grades pour suivre ta progression.
          Chaque action d'apprentissage te rapporte des points qui s'accumulent au fil du temps.
        </p>

        <h3>Gagner des points</h3>
        <ul>
          <li><strong>Quiz reussi :</strong> des XP attribues selon le score et la difficulte.</li>
          <li><strong>Projet valide :</strong> des XP selon la complexite du projet et le mode de validation.</li>
          <li><strong>Lecon completee :</strong> des XP de base pour chaque lecon terminee.</li>
        </ul>

        <h3>Grades</h3>
        <p>
          En accumulant suffisamment de points, tu changes de grade. Chaque grade debloque de nouvelles
          possibilites sur la plateforme. Ton grade actuel est affiche sur ton profil et dans le classement.
        </p>
        <ul>
          <li><strong>Apprenti</strong> — niveau depart</li>
          <li><strong>Compagnon</strong> — apres les premiers parcours</li>
          <li><strong>Expert</strong> — maitrise avancee</li>
          <li><strong>Maitre</strong> — le plus haut grade</li>
        </ul>

        <h3>Tableau de bord</h3>
        <p>
          Ton dashboard affiche un resume de ta progression : parcours en cours, derniers quiz,
          projets recents et statistiques. Consulte-le regulierement pour suivre ton avancee.
        </p>
      </DocContent>
    </>
  );
}

