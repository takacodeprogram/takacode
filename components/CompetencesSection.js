export default function CompetencesSection() {
  return (
    <section className="py-28 overflow-hidden" id="competences">
      <div className="max-w-[1320px] mx-auto px-8 mb-14">
        <div className="section-label mb-4">POSSIBILITES</div>
        <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
          CE QUE TU PEUX CREER
        </h2>
      </div>

      {/* Infinite scrolling tags row */}
      <div className="scroll-container overflow-hidden mb-4">
        <div className="scroll-track">
          <div className="flex gap-3">
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:globe" /> Sites web</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:layout-dashboard" /> Applications web</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:zap" /> Automatisations</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:bot" /> Agents IA</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:wallet" /> Web3 et blockchain</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:box" /> 3D immersif</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:music" /> Musique</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:mic" /> Podcasts</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:youtube" /> Chaines YouTube</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:video" /> Videos avec IA</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:bar-chart-3" /> Analyse de donnees</span>
          </div>
          <div className="flex gap-3 ml-3" aria-hidden="true">
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:globe" /> Sites web</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:layout-dashboard" /> Applications web</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:zap" /> Automatisations</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:bot" /> Agents IA</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:wallet" /> Web3 et blockchain</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:box" /> 3D immersif</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:music" /> Musique</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:mic" /> Podcasts</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:youtube" /> Chaines YouTube</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:video" /> Videos avec IA</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:bar-chart-3" /> Analyse de donnees</span>
          </div>
        </div>
      </div>

      {/* Reverse direction row for depth */}
      <div className="scroll-container overflow-hidden">
        <div className="scroll-track" style={{ animationDirection: "reverse", animationDuration: "25s" }}>
          <div className="flex gap-3">
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:pie-chart" /> Tableaux de bord</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:wallet" /> Web3 et blockchain</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:box" /> 3D et experiences immersives</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:package" /> Produits numeriques</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:trending-up" /> Business digitaux</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:wrench" /> Outils SaaS</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:message-square" /> Chatbots</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:smartphone" /> Applications mobiles</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:cpu" /> IA generative</span>
          </div>
          <div className="flex gap-3 ml-3" aria-hidden="true">
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:pie-chart" /> Tableaux de bord</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:wallet" /> Web3 et blockchain</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:box" /> 3D et experiences immersives</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:package" /> Produits numeriques</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:trending-up" /> Business digitaux</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:wrench" /> Outils SaaS</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:message-square" /> Chatbots</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:smartphone" /> Applications mobiles</span>
            <span className="community-tag flex items-center gap-2"><iconify-icon icon="lucide:cpu" /> IA generative</span>
          </div>
        </div>
      </div>
    </section>
  );
}
