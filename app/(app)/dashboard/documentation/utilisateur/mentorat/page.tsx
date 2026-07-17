import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Travailler avec un mentor",
  description: "Guide pour beneficier d'un accompagnement mentor sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/mentorat",
  noIndex: true
});

export default function MentoratDocPage() {
  return (
    <>
      <PageHeader title="TRAVAILLER AVEC UN MENTOR" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Accompagnement mentor</h2>
        <p>
          Les mentors t'accompagnent dans ton apprentissage. Ils peuvent repondre a tes questions,
          review tes projets et t'aider a progresser plus rapidement.
        </p>

        <h3>Trouver un mentor</h3>
        <ul>
          <li>Consulte la section <strong>Sessions live</strong> pour les creneaux disponibles.</li>
          <li>Rejoins la communauté pour echanger avec les mentors.</li>
          <li>Certains parcours sont encadres par des mentors dedies.</li>
        </ul>

        <h3>Solliciter une revue</h3>
        <p>
          Quand tu soumets un projet, tu peux demander une revue par un mentor.
          Le mentor examine ton travail, te donne un feedback detaille et valide ou non ta soumission.
        </p>

        <h3>Sessions live</h3>
        <p>
          Les sessions live sont des rendez-vous en visio avec un mentor. Elles peuvent etre :
        </p>
        <ul>
          <li><strong>Q&amp;A :</strong> pose toutes tes questions en direct.</li>
          <li><strong>Atelier :</strong> travaille sur un exercice encadre.</li>
          <li><strong>Revue de projet :</strong> presente ton projet et recoit un feedback oral.</li>
        </ul>
      </DocContent>
    </>
  );
}

