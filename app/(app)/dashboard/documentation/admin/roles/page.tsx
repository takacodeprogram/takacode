import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Gerer les utilisateurs et roles",
  description: "Guide administrateur pour gérer les utilisateurs et rôles sur TakaCode.",
  path: "/dashboard/documentation/admin/roles",
  noIndex: true
});

export default function AdminRolesDocPage() {
  return (
    <>
      <PageHeader title="GERER LES UTILISATEURS" subtitle="Guide administrateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Roles utilisateur</h2>
        <p>
          La plateforme définit plusieurs rôles avec des permissions croissantes :
        </p>
        <ul>
          <li><strong>user :</strong> apprenant standard, accès aux parcours et quiz.</li>
          <li><strong>mentor :</strong> peut créer des parcours, éditer du contenu et reviewer les projets.</li>
          <li><strong>admin :</strong> accès complèt à toutes les fonctionnalites et à l'administration.</li>
        </ul>

        <h3>Gerer les roles</h3>
        <p>
          Depuis la section <strong>Utilisateurs</strong> du panneau d'administration,
          tu peux voir la liste de tous les utilisateurs et modifier leur rôle.
        </p>
        <ul>
          <li>Recherche un utilisateur par nom ou email.</li>
          <li>Consulte son role actuel, sa date d'inscription et ses statistiques.</li>
          <li>Change son rôle si nécessaire (ex: promouvoir un utilisateur en mentor).</li>
        </ul>

        <h3>Sécurité</h3>
        <p>
          Les mots de passe doivent comporter au moins 8 caractères avec minuscules,
          majuscules, chiffres et symboles. La protection contre les mots de passe
          compromis est activee en production.
        </p>
      </DocContent>
    </>
  );
}

