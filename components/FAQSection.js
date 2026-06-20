export default function FAQSection() {
  return (
    <section className="py-28">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="section-label mb-4">FAQ</div>
            <h2 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(32px, 3vw, 48px)", letterSpacing: "-0.02em" }}>
              QUESTIONS
              <br />
              FREQUENTES
            </h2>
            <p className="font-body-readable text-[#666] text-[15px] leading-relaxed">
              Tu as une question ? La reponse est surement ici. Si ce n'est pas le cas, la communaute est la pour t'aider.
            </p>
          </div>

          {/* FAQ list kept static for visual parity */}
          <div className="space-y-0">
            <div className="faq-item py-5">
              <div className="faq-question flex items-center justify-between">
                <span className="font-body-readable text-[14px] text-[#CCC] font-medium">Dois-je savoir coder pour commencer ?</span>
                <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
              </div>
              <p className="font-body-readable text-[13px] text-[#555] mt-3 leading-relaxed hidden">
                Absolument pas. TakaCode est concu pour les debutants complets. Nos parcours commencent depuis zero et l'assistant IA t'accompagne a chaque etape.
              </p>
            </div>

            <div className="faq-item py-5">
              <div className="faq-question flex items-center justify-between">
                <span className="font-body-readable text-[14px] text-[#CCC] font-medium">Puis-je commencer sans experience ?</span>
                <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
              </div>
            </div>

            <div className="faq-item py-5">
              <div className="faq-question flex items-center justify-between">
                <span className="font-body-readable text-[14px] text-[#CCC] font-medium">Comment fonctionnent les parcours ?</span>
                <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
              </div>
            </div>

            <div className="faq-item py-5">
              <div className="faq-question flex items-center justify-between">
                <span className="font-body-readable text-[14px] text-[#CCC] font-medium">Comment se deroulent les sessions live ?</span>
                <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
              </div>
            </div>

            <div className="faq-item py-5">
              <div className="faq-question flex items-center justify-between">
                <span className="font-body-readable text-[14px] text-[#CCC] font-medium">Comment publier mes projets ?</span>
                <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
              </div>
            </div>

            <div className="faq-item py-5" style={{ borderBottom: "none" }}>
              <div className="faq-question flex items-center justify-between">
                <span className="font-body-readable text-[14px] text-[#CCC] font-medium">Puis-je apprendre plusieurs domaines ?</span>
                <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
