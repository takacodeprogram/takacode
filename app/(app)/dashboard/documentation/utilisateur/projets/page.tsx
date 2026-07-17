import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Realiser un micro-projet",
  description: "Guide pour realiser et soumettre un micro-projet sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/projets",
  noIndex: true
});

export default function ProjetsDocPage() {
  return (
    <>
      <PageHeader title="REALISER UN MICRO-PROJET" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Micro-projets : mettre en pratique</h2>
        <p>
          Les micro-projets sont des mises en situation concretes qui te permettent d'appliquer ce que tu as appris.
          Chaque projet est valide selon differents modes selon la lecon.
        </p>

        <h3>Soumettre un projet</h3>
        <ol>
          <li>Après avoir termine une lecon, rends-toi dans la section projet.</li>
          <li>Realise le travail demande (code, design, redaction, etc.).</li>
          <li>Depose le lien vers ton travail (URL de depot, site, ou fichier heberge).</li>
          <li>Soumets ton projet pour evaluation.</li>
        </ol>

        <h3>Modes de validation</h3>
        <ul>
          <li><strong>Automatique :</strong> verification par des criteres predefinis.</li>
          <li><strong>Par l'IA :</strong> analyse et feedback generes automatiquement.</li>
          <li><strong>Par un pair :</strong> un autre apprenant evalue ton travail.</li>
          <li><strong>Par un mentor :</strong> evaluation personnalisee par un encadrant.</li>
        </ul>

        <h3>Apres la soumission</h3>
        <p>
          Tu recois un feedback avec une note et des suggestions d'amelioration.
          Si le projet est valide, tu gagnes des XP et tu debloques la suite du parcours.
          Tu peux toujours retravailler et resoumettre ton projet si necessaire.
        </p>
      </DocContent>
    </>
  );
}

