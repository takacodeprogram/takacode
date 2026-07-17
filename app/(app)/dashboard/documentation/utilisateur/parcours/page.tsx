import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Suivre un parcours",
  description: "Guide pour suivre un parcours sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/parcours",
  noIndex: true
});

export default function ParcoursDocPage() {
  return (
    <>
      <PageHeader title="SUIVRE UN PARCOURS" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Decouvrir les parcours</h2>
        <p>
          Les parcours sont des sequences pedagogiques composees de modules, de lecons, de quiz et de micro-projets.
          Chaque parcours est concu pour te faire passer de la decouverte a la maitrise d'un sujet.
        </p>

        <h3>Commencer un parcours</h3>
        <ol>
          <li>Rends-toi dans <strong>Mes parcours</strong> depuis le menu de navigation.</li>
          <li>Parcours la liste des formations disponibles et choisis celle qui correspond a ton objectif.</li>
          <li>Clique sur le parcours pour voir son contenu : modules, lecons, ressources et quiz.</li>
          <li>Le premier module se deroule automatiquement. Les modules suivants se decomptent au fur et a mesure.</li>
        </ol>

        <h3>Progression</h3>
        <p>
          Chaque lecon completee, chaque quiz reussi et chaque projet valide te rapporte des points d'experience (XP).
          Accumule assez de points pour monter en grade et debloquer de nouveaux niveaux.
        </p>
        <ul>
          <li><strong>Quiz :</strong> 70% de bonnes reponses requises pour valider. Tu peux retenter si tu echoues.</li>
          <li><strong>Micro-projets :</strong> valides automatiquement, par un pair, un mentor ou l'IA.</li>
          <li><strong>Ressources :</strong> chaque lecon propose des liens pour approfondir.</li>
        </ul>

        <h3>Conseils</h3>
        <ul>
          <li>Consulte les ressources liees a chaque lecon pour approfondir.</li>
          <li>Pose tes questions dans la communaute si tu es bloque.</li>
          <li>Utilise les sessions live pour echanger en direct avec un mentor.</li>
        </ul>
      </DocContent>
    </>
  );
}

