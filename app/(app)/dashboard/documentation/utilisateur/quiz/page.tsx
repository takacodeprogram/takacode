import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Passer un quiz",
  description: "Guide pour passer les quiz sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/quiz",
  noIndex: true
});

export default function QuizDocPage() {
  return (
    <>
      <PageHeader title="PASSER UN QUIZ" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Fonctionnement des quiz</h2>
        <p>
          Les quiz valident ta comprehension des lecons. Chaque quiz est compose de plusieurs questions
          a choix multiples. Les choix sont melanges pour chaque utilisateur, ce qui rend chaque tentative unique.
        </p>

        <h3>Déroulement</h3>
        <ol>
          <li>Après une lecon, tu accedes au quiz associé.</li>
          <li>Pour chaque question, selectionne une reponse parmi les choix proposees.</li>
          <li>Valide l'ensemble de tes reponses en cliquant sur <strong>Soumettre</strong>.</li>
          <li>Le résultat s'affiche immédiatement : score, reponses correctes/incorrectes et explications.</li>
        </ol>

        <h3>Conditions de reussite</h3>
        <ul>
          <li>Il faut au moins <strong>70% de bonnes reponses</strong> pour valider le quiz.</li>
          <li>Si tu echoues, tu peux retenter immédiatement.</li>
          <li>Les questions peuvent varier d'une tentative a l'autre (tirage depuis la banque de questions).</li>
          <li>Ton meilleur score est conserve.</li>
        </ul>

        <h3>Types de questions</h3>
        <p>
          Les questions sont classees par difficulte : <strong>fondation</strong>, <strong>standard</strong> et <strong>defi</strong>.
          Elles sont liées a des objectifs pedagogiques precis, ce qui t'aide a identifier les points a retravailler.
        </p>

        <h3>Conseils</h3>
        <ul>
          <li>Lis attentivement l'explication après chaque question, même si tu as juste.</li>
          <li>Si une question te pose problème, consulte la ressource associee dans la lecon.</li>
          <li>Le quiz n'est pas chronometre : prends le temps de reflechir.</li>
        </ul>
      </DocContent>
    </>
  );
}

