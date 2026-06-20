import FooterSection from "./FooterSection";
import Navbar from "./Navbar";

const flowTypographyOverrides = `
/*
  Flow export typography bridge:
  - force all titles to VALORAX
  - force subtitles/labels to VENITE italic
*/
body {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  height: auto !important;
}

.flow-brand-scope h1,
.flow-brand-scope h2,
.flow-brand-scope h3,
.flow-brand-scope h4,
.flow-brand-scope h5,
.flow-brand-scope h6 {
  font-family: 'VALORAX', 'Poppins', sans-serif !important;
  font-style: normal !important;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.flow-brand-scope .font-valorax {
  font-family: 'VALORAX', 'Poppins', sans-serif !important;
  font-style: normal !important;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.flow-brand-scope .section-label,
.flow-brand-scope .font-venite,
.flow-brand-scope .font-venite-italic {
  font-family: 'VENITE', 'Poppins', sans-serif !important;
  font-style: italic !important;
  text-transform: uppercase;
}
`;

function stripFlowChrome(html) {
  let next = html;

  next = next.replace(
    /(?:<!--[\s\S]*?NAV(?:IGATION)?[\s\S]*?-->\s*)?(?:<!--\s*component:\s*Navigation[\s\S]*?-->\s*)?(?:<div[^>]*v-scope[^>]*>\s*)?<nav[\s\S]*?<\/nav>\s*(?:<\/div>\s*)?(?:<!--\s*\/component:\s*Navigation[\s\S]*?-->\s*)?/i,
    ""
  );

  next = next.replace(
    /\s*<hr[^>]*class="section-divider"[^>]*>\s*(?:<!--[\s\S]*?FOOTER[\s\S]*?-->\s*)?(?:<!--\s*component:\s*Footer[\s\S]*?-->\s*)?(?:<div[^>]*v-scope[^>]*>\s*)?<footer[\s\S]*?<\/footer>\s*(?:<\/div>\s*)?(?:<!--\s*\/component:\s*Footer[\s\S]*?-->\s*)?/i,
    ""
  );

  next = next.replace(/<nav[\s\S]*?<\/nav>/i, "");
  next = next.replace(/<footer[\s\S]*?<\/footer>/i, "");
  next = next.replace(/<div[^>]*v-scope[^>]*>\s*<\/div>/gi, "");
  next = next.replace(/<!--[\s\S]*?(NAVIGATION|FOOTER)[\s\S]*?-->/gi, "");

  return next.trim();
}

function hasFlowTopOffset(html) {
  return /pt-\[64px\]|margin-top:\s*64px|calc\(\s*100vh\s*-\s*64px\s*\)/i.test(html);
}

export default function FlowHtmlPage({ styles, bodyHtml }) {
  const cleanedBodyHtml = stripFlowChrome(bodyHtml);
  const needsTopOffset = !hasFlowTopOffset(cleanedBodyHtml);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      {styles.map((css, index) => (
        <style key={`flow-style-${index}`} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: flowTypographyOverrides }} />
      <main className={needsTopOffset ? "pt-[64px]" : undefined}>
        <div className="flow-brand-scope" dangerouslySetInnerHTML={{ __html: cleanedBodyHtml }} />
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}