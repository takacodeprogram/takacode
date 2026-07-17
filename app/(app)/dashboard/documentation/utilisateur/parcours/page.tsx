import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Suivre un parcours lie a son projet",
  description: "Guide pour suivre les parcours qui t'aident a construire ton projet digital sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/parcours",
  noIndex: true
});

export default function ParcoursDocPage() {
  return (
    <>
      <PageHeader title="SUIVRE UN PARCOURS PROJET" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Les parcours sont au service de ton projet</h2>
        <p>
          Sur TakaCode, chaque parcours est lie a un archetype de projet (site vitrine, SaaS, e-commerce, blog, app mobile, API, etc.).
          Tu ne suis pas un parcours « pour apprendre » : tu le suis <strong>pour construire ton projet</strong>.
        </p>

        <h3>Choisir un parcours</h3>
        <ol>
          <li>Va dans <strong>Mes parcours</strong> depuis le menu.</li>
          <li>Chaque parcours indique le type de projet auquel il est lie.</li>
          <li>Selectionne celui qui correspond a ton projet ou a l'etape que tu veux franchir.</li>
          <li>Le premier module se lance automatiquement.</li>
        </ol>

        <h3>Comment ca marche</h3>
        <p>
          Un parcours est compose de modules, de lecons, de quiz et de micro-projets.
          Chaque element est concu pour produire un livrable concret qui fait avancer ton projet.
        </p>
        <ul>
          <li><strong>Modules :</strong> grandes etapes du projet (conception, developpement, deploiement, marketing).</li>
          <li><strong>Lecons :</strong> actions concretes a realiser (ecrire du code, configurer un outil, rediger une page).</li>
          <li><strong>Quiz :</strong> valider ta comprehension avant de passer a l'etape suivante.</li>
          <li><strong>Ressources :</strong> documentation, outils, exemples pour t'aider.</li>
        </ul>

        <h3>Progression</h3>
        <p>
          Chaque lecon completee, chaque quiz reussi et chaque micro-projet valide te rapporte des XP.
          Accumule assez de points pour monter en grade. Mais le vrai objectif, c'est ton projet en ligne.
        </p>

        <h3>Conseils</h3>
        <ul>
          <li>Commence par creer ou definir ton projet avant de choisir un parcours.</li>
          <li>Ne saute pas les etapes : chaque lecon produit un livrable utile pour la suite.</li>
          <li>Pose tes questions dans la communaute si tu es bloque sur une etape.</li>
          <li>Une fois le parcours termine, pense a la publication et a la monetisation.</li>
        </ul>
      </DocContent>
    </>
  );
}
