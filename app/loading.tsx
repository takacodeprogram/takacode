import LoaderVisual from "../components/LoaderVisual";

export default function Loading() {
  return (
    <div className="startup-loader startup-loader-static" role="status" aria-live="polite">
      <LoaderVisual />
    </div>
  );
}