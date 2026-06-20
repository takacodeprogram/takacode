import logoLight2 from "../assets/logos-light-png/logo-light-2.png";
import LoaderVisual from "../components/LoaderVisual";

export default function Loading() {
  return (
    <div className="startup-loader startup-loader-static" role="status" aria-live="polite">
      <LoaderVisual logoSrc={logoLight2.src} />
    </div>
  );
}