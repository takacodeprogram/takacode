import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Gerer la banque de questions",
  description: "Guide mentor pour gerer les questions de quiz sur TakaCode.",
  path: "/dashboard/documentation/mentor/questions",
  noIndex: true
});

export default function MentorQuestionsDocPage() {
  return (
    <>
      <PageHeader title="BANQUE DE QUESTIONS" subtitle="Guide mentor" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Banque de questions</h2>
        <p>
          Chaque lecon dispose d'une banque de questions associee. Tu peux ajouter, modifier
          ou supprimer des questions depuis l'editeur de lecon.
        </p>

        <h3>Ajouter une question</h3>
        <ul>
          <li>Definis le <strong>prompt</strong> (8 caracteres minimum).</li>
          <li>Ajoute entre <strong>2 et 6 choix</strong> possibles.</li>
          <li>Indique l'<strong>index de la bonne reponse</strong> (commence a 0).</li>
          <li>Ajoute une <strong>explication</strong> pour justifier la reponse.</li>
          <li>Choisis un <strong>objectif pédagogique</strong> parmi ceux de la lecon.</li>
          <li>Definis la <strong>difficulte</strong> : fondation, standard ou defi.</li>
          <li>Ajoute eventuellement une <strong>URL de ressource</strong> liee.</li>
        </ul>

        <h3>Validateur automatique</h3>
        <p>
          Lors de l'enregistrement, un validateur integre controle :
        </p>
        <ul>
          <li>L'absence de doublons dans les choix</li>
          <li>La presence d'une bonne reponse</li>
          <li>L'equilibre de la distribution des positions de reponses</li>
          <li>La presence d'une explication non vide</li>
        </ul>

        <h3>Equilibrage automatique</h3>
        <p>
          Les positions des bonnes reponses sont automatiquement reparties sur l'ensemble des
          questions pour eviter qu'une position (ex: A) ne soit trop souvent correcte.
        </p>

        <h3>Statuts des questions</h3>
        <ul>
          <li><strong>Brouillon :</strong> en cours de redaction, pas encore utilisable.</li>
          <li><strong>Approuvee :</strong> prete a etre utilisee dans les quiz.</li>
          <li><strong>Archived :</strong> retiree mais conservee pour historique.</li>
        </ul>
      </DocContent>
    </>
  );
}

