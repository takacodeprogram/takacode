import LoaderVisual from "./LoaderVisual";

export default function RouteLoading() {
  return (
    <div className="startup-loader startup-loader-static flex items-center justify-center" role="status" aria-live="polite" aria-label="Loading">
      <LoaderVisual />
    </div>
  );
}
