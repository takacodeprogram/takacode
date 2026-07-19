import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Organiser des sessions live",
  description: "Guide administrateur pour organiser des sessions live sur TakaCode.",
  path: "/dashboard/documentation/admin/sessions",
  noIndex: true
});

export default function AdminSessionsDocPage() {
  return (
    <>
      <PageHeader title="SESSIONS LIVE" subtitle="Guide administrateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Sessions live</h2>
        <p>
          Les sessions live sont des rendez-vous en direct avec les apprenants.
          Elles peuvent etre programmees et gerees depuis l'interface d'administration.
        </p>

        <h3>Créer une session</h3>
        <ul>
          <li>Choisis un titre et une description pour la session.</li>
          <li>Definis la date, l'heure et la duree.</li>
          <li>Sélectionne le type : Q&amp;A, atelier, revue de projet.</li>
          <li>Ajoute un lien de visioconference (Zoom, Google Meet, etc.).</li>
        </ul>

        <h3>Gerer les inscriptions</h3>
        <p>
          Les apprenants peuvent s'inscrire aux sessions. Tu vois le nombre de places
          restantes et la liste des inscrits. Tu peux annuler ou reporter une session
          si nécessaire.
        </p>

        <h3>Notifications</h3>
        <p>
          Les inscrits recoivent une notification avant le début de la session.
          Un rappel est envoye automatiquement 24h et 1h avant l'evenement.
        </p>
      </DocContent>
    </>
  );
}

