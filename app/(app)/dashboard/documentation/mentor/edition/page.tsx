import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Editer modules, lecons et ressources",
  description: "Guide mentor pour editer le contenu pedagogique sur TakaCode.",
  path: "/dashboard/documentation/mentor/edition",
  noIndex: true
});

export default function MentorEditionDocPage() {
  return (
    <>
      <PageHeader title="EDITER LE CONTENU" subtitle="Guide mentor" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Editeur de lecons</h2>
        <p>
          Chaque lecon peut etre modifiee via l'interface d'edition. Tu peux y changer :
        </p>
        <ul>
          <li><strong>Titre et description :</strong> le nom de la lecon et son resume.</li>
          <li><strong>Contenu :</strong> le corps de la lecon au format texte.</li>
          <li><strong>Ressources :</strong> ajoute ou retire des liens (label, URL, type).</li>
          <li><strong>Objectifs :</strong> les competences visees par la lecon.</li>
          <li><strong>Mode de validation :</strong> auto, IA, pair ou mentor pour le projet.</li>
        </ul>

        <h3>Ressources</h3>
        <p>
          Chaque lecon peut avoir plusieurs ressources (articles, videos, outils).
          Pour chaque ressource, tu peux definir :
        </p>
        <ul>
          <li>Le label (titre visible)</li>
          <li>L'URL</li>
          <li>Le type (article, video, outil, etc.)</li>
          <li>La raison (pourquoi cette ressource est utile)</li>
          <li>Le commentaire d'utilisation (comment l'exploiter)</li>
        </ul>

        <h3>Ordre des modules et lecons</h3>
        <p>
          Les modules et les lecons sont ordonnes par leur position. Utilise les
          controles de l'interface pour rearranger l'ordre d'apprentissage.
        </p>
      </DocContent>
    </>
  );
}

