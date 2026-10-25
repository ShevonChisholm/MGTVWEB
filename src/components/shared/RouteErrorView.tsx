import { isRouteErrorResponse, useRouteError } from "react-router";
export default function RouteErrorView() {
  const error = useRouteError(),
    missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="min-h-screen bg-bg-base px-6 py-24 text-text-primary">
      <div className="mx-auto max-w-2xl">
        <a className="font-display text-3xl text-gold" href="/">
          MGTV
        </a>
        <h1 className="mt-8 font-display text-5xl">
          {missing ? "That story isn’t here" : "This view couldn’t open"}
        </h1>
        <p role="alert" className="mt-5 leading-relaxed text-text-secondary">
          {missing
            ? "The page may have moved or is no longer available."
            : "Please try loading the page again. Any unsaved edits on this page may be lost."}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            className="min-h-11 rounded-lg bg-gold px-6 font-semibold text-black"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <a className="min-h-11 px-4 py-3 text-gold" href="/">
            Back to MGTV
          </a>
        </div>
      </div>
    </main>
  );
}
