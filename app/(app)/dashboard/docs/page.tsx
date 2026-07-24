import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { getLocale } from "../../../../lib/i18n";
import { getServerLocale } from "../../../../lib/serverLocale";
import { buildPageMetadata } from "../../../../lib/seo";
import { localePath } from "../../../../lib/localeHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocs.title"),
    description: t("dashboardDocs.info"),
    path: "/dashboard/docs",
    noIndex: true
  });
}

export default async function DocumentationPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const SECTIONS = [
    {
      title: t("dashboardDocs.userGuide"),
      icon: "lucide:rocket",
      description: t("dashboardDocs.userDesc"),
      links: [
        { href: "/dashboard/docs/user/projects", label: t("dashboardDocs.linkProjects") },
        { href: "/dashboard/docs/user/tracks", label: t("dashboardDocs.linkTracks") },
        { href: "/dashboard/docs/user/quiz", label: t("dashboardDocs.linkQuiz") },
        { href: "/dashboard/docs/user/progress", label: t("dashboardDocs.linkProgress") },
        { href: "/dashboard/docs/user/mentoring", label: t("dashboardDocs.linkMentoring") }
      ]
    },
    {
      title: t("dashboardDocs.mentorGuide"),
      icon: "lucide:users",
      description: t("dashboardDocs.mentorDesc"),
      links: [
        { href: "/dashboard/docs/mentor/tracks", label: t("dashboardDocs.linkMentorTracks") },
        { href: "/dashboard/docs/mentor/editing", label: t("dashboardDocs.linkMentorEditing") },
        { href: "/dashboard/docs/mentor/questions", label: t("dashboardDocs.linkMentorQuestions") },
        { href: "/dashboard/docs/mentor/reviews", label: t("dashboardDocs.linkMentorReviews") }
      ]
    },
    {
      title: t("dashboardDocs.adminGuide"),
      icon: "lucide:shield-check",
      description: t("dashboardDocs.adminDesc"),
      links: [
        { href: "/dashboard/docs/admin/roles", label: t("dashboardDocs.linkAdminRoles") },
        { href: "/dashboard/docs/admin/affiliates", label: t("dashboardDocs.linkAdminAffiliates") },
        { href: "/dashboard/docs/admin/sessions", label: t("dashboardDocs.linkAdminSessions") }
      ]
    }
  ];

  return (
    <>
      <PageHeader title={t("dashboardDocs.title")} subtitle={t("dashboardDocs.subtitle")} />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-6">
        {t("dashboardDocs.info")}
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
                    href={localePath(link.href, locale)}
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
