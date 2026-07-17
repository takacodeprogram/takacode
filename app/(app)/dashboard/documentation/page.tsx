import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { buildPageMetadata } from "../../../../lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Documentation",
  description: "Guides utilisateur et mentor pour maitriser TakaCode.",
  path: "/dashboard/documentation",
  noIndex: true
});

const SECTIONS = [
  {
    title: "Guide utilisateur",
    icon: "lucide:graduation-cap",
    description: "Apprends a naviguer sur la plateforme, suivre des parcours, passer des quiz et gerer tes projets.",
    links: [
      { href: "/dashboard/documentation/utilisateur/parcours", label: "Suivre un parcours" },
      { href: "/dashboard/documentation/utilisateur/quiz", label: "Passer un quiz" },
      { href: "/dashboard/documentation/utilisateur/projets", label: "Realiser un micro-projet" },
      { href: "/dashboard/documentation/utilisateur/progression", label: "Comprendre la progression et les points" },
      { href: "/dashboard/documentation/utilisateur/mentorat", label: "Travailler avec un mentor" }
    ]
  },
  {
    title: "Guide mentor",
    icon: "lucide:users",
    description: "Cree et edite du contenu pédagogique, gere les questions et suis la progression des apprenants.",
    links: [
      { href: "/dashboard/documentation/mentor/parcours", label: "Créer et gerer un parcours" },
      { href: "/dashboard/documentation/mentor/edition", label: "Editer modules, lecons et ressources" },
      { href: "/dashboard/documentation/mentor/questions", label: "Gerer la banque de questions" },
      { href: "/dashboard/documentation/mentor/reviews", label: "Reviewer les projets" }
    ]
  },
  {
    title: "Guide administrateur",
    icon: "lucide:shield-check",
    description: "Administre la plateforme, gere les utilisateurs, les roles et la configuration.",
    links: [
      { href: "/dashboard/documentation/admin/roles", label: "Gerer les utilisateurs et roles" },
      { href: "/dashboard/documentation/admin/affiliations", label: "Configurer les affiliations" },
      { href: "/dashboard/documentation/admin/sessions", label: "Organiser des sessions live" }
    ]
  }
];

export default function DocumentationPage() {
  return (
    <>
      <PageHeader title="DOCUMENTATION" subtitle="Tout pour maitriser TakaCode" />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-6">
        Bienvenue dans la documentation. Choisis une section ci-dessous pour commencer.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                <iconify-icon icon={section.icon} style={{ fontSize: "18px", color: "#4F8EF7" }} />
              </div>
              <div>
                <h2 className="text-[14px] text-white font-semibold">{section.title}</h2>
                <p className="font-body-readable text-[11px] text-[#777]">{section.description}</p>
              </div>
            </div>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-[#aaa] hover:text-white hover:bg-white/[0.04] transition-all font-body-readable"
                  >
                    <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "12px", color: "#4F8EF7" }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

