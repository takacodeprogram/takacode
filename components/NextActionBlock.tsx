import Link from "next/link";

interface NextActionProject {
  id: string;
  title: string;
  status: string;
  repoUrl: string;
  liveUrl: string;
}

interface NextActionBlockProps {
  project: NextActionProject | null;
  hasEnrollment: boolean;
  hasOnboarding: boolean;
}

function iconify(icon: string) {
  return <iconify-icon icon={icon} style={{ fontSize: "14px" }} />;
}

export default function NextActionBlock({ project, hasEnrollment, hasOnboarding }: NextActionBlockProps) {
  if (!hasOnboarding) {
    return (
      <ActionCard
        icon="lucide:compass"
        accent="#22D3EE"
        title="Termine ton onboarding"
        description="Réponds a quelques questions pour qu'on personnalise ton expérience."
        href="/onboarding"
        label="Continuer l'onboarding"
      />
    );
  }

  if (!hasEnrollment && !project) {
    return (
      <ActionCard
        icon="lucide:map"
        accent="#4F8EF7"
        title="Choisis ton premier parcours"
        description="Sélectionne un parcours adapte a ton objectif pour commencer à construire."
        href="/parcours"
        label="Voir les parcours"
      />
    );
  }

  if (!project) {
    return (
      <ActionCard
        icon="lucide:folder-code"
        accent="#9B6DFF"
        title="Cree ton projet principal"
        description="Définit le projet que tu veux construire. Il servira de fil rouge a tes parcours."
        href="/dashboard/projets/nouveau"
        label="Créer mon projet"
      />
    );
  }

  if (project.status === "idea") {
    return (
      <ActionCard
        icon="lucide:pencil-line"
        accent="#F59E0B"
        title="Finalise les details de ton projet"
        description="Ajoute une description, un statut et une deadline pour lancer ton projet."
        href={`/dashboard/projets/${project.id}`}
        label="Éditer mon projet"
      />
    );
  }

  if (!project.repoUrl) {
    return (
      <ActionCard
        icon="lucide:github"
        accent="#22D3EE"
        title="Connecte ton depot GitHub"
        description="Héberge ton code sur GitHub pour le déployer facilement et suivre les versions."
        href={`/dashboard/projets/${project.id}`}
        label="Ajouter le dépôt"
      />
    );
  }

  if (!project.liveUrl) {
    return (
      <ActionCard
        icon="lucide:rocket"
        accent="#10B981"
        title="Deploie ton projet en ligne"
        description="Publie ton projet avec Vercel ou Netlify pour le rendre accessible au monde entier."
        href={`/dashboard/projets/${project.id}`}
        label="Déployer mon projet"
      />
    );
  }

  return (
    <ActionCard
      icon="lucide:share-2"
      accent="#38BDF8"
      title="Partage ton projet"
      description="Ton projet est en ligne ! Montre-le a la communauté et ajoute-le a ton portfolio."
      href={`/dashboard/projets/${project.id}`}
      label="Partager mon projet"
    />
  );
}

function ActionCard({
  icon: iconName,
  accent,
  title,
  description,
  href,
  label
}: {
  icon: string;
  accent: string;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(145deg, ${accent}12, rgba(255,255,255,0.02))`
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl border inline-flex items-center justify-center"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}1f`
          }}
        >
          {iconify(iconName)}
        </div>
        <div>
          <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Prochaine action</div>
          <h3 className="font-venite-italic text-[14px] text-white leading-tight">{title}</h3>
        </div>
      </div>
      <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[12px] font-semibold px-4 py-2.5 rounded-xl border transition-all"
        style={{
          borderColor: `${accent}55`,
          background: `${accent}1f`,
          color: "#ffffff"
        }}
      >
        {label}
        <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
      </Link>
    </div>
  );
}