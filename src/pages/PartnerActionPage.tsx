import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import "./partner-action.css";
async function request(
  path: string,
  token: string,
  body: unknown = {},
  key?: string,
) {
  const response = await fetch("/api/v1/partner-actions/" + path, {
    method: "POST",
    credentials: "omit",
    cache: "no-store",
    referrerPolicy: "no-referrer",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(body),
  }).catch(() => {
    throw Error("Unable to reach MGTV. Check your connection and try again.");
  });
  const result = await response.json().catch(() => {
    throw Error("MGTV returned an unreadable response. Please try again.");
  });
  if (!response.ok)
    throw Error(result.message ?? "This request could not be completed.");
  return result;
}
const money = (value: number | null) =>
  value == null
    ? "Not agreed"
    : new Intl.NumberFormat("en-JM", {
        style: "currency",
        currency: "JMD",
        currencyDisplay: "code",
      }).format(value / 100);
export default function PartnerActionPage() {
  const [token, setToken] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "",
  );
  const [session, setSession] = useState(""),
    [task, setTask] = useState<any>(null),
    [code, setCode] = useState(""),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [outcome, setOutcome] = useState("acknowledged"),
    [message, setMessage] = useState("");
  const retry = useRef({ body: "", key: crypto.randomUUID() });
  useEffect(() => {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.append(meta);
    const newLink = () => {
      const next = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      if (!next) return;
      setToken(next);
      setSession("");
      setTask(null);
      setSent(false);
      setCode("");
      setMessage("");
      setError("");
      setNotice("");
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname,
      );
    };
    window.addEventListener("hashchange", newLink);
    return () => {
      meta.remove();
      window.removeEventListener("hashchange", newLink);
    };
  }, []);
  useEffect(() => {
    if (!session) return;
    const timeout = window.setTimeout(
      () => {
        setSession("");
        setTask(null);
        setMessage("");
        setNotice(
          "Your private session expired. Verify your email again to continue.",
        );
      },
      15 * 60 * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [session]);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="partner-action">
      <header>
        <BrandLogo className="h-12 w-24" />
        <span>PARTNER WORKSPACE</span>
        <span className="partner-private">◈ Private request</span>
      </header>
      <div className="partner-action-inner">
        <p className="partner-eyebrow">THE NEXT CHAPTER · TOGETHER</p>
        <h1>{task?.title ?? "Your MGTV partnership starts here."}</h1>
        <p className="partner-lead">
          {task?.instructions ??
            "A focused space to review your agreement and share what MGTV needs next."}
        </p>
        <ol className="partner-steps" aria-label="Request progress">
          <li aria-current={!session ? "step" : undefined}>
            <b>01</b> Verify email
          </li>
          <li
            aria-current={
              session && task?.status === "open" ? "step" : undefined
            }
          >
            <b>02</b> Review & respond
          </li>
          <li aria-current={task?.status === "submitted" ? "step" : undefined}>
            <b>03</b> With MGTV
          </li>
        </ol>
        {error && (
          <div role="alert" className="partner-alert">
            {error}
          </div>
        )}
        {notice && (
          <p role="status" className="partner-notice">
            {notice}
          </p>
        )}
        {!token ? (
          <section className="partner-panel">
            <h2>This link is incomplete</h2>
            <p>
              Reopen the full link from your MGTV contact. For privacy, link
              access is cleared from the address bar when this page opens.
            </p>
          </section>
        ) : !session ? (
          <section className="partner-panel partner-verify">
            <span className="partner-seal" aria-hidden="true">
              ✉
            </span>
            <div>
              <h2>Confirm it’s you</h2>
              <p>
                We will send a six-digit code to the contact email MGTV has on
                file. No customer or staff sign-in is needed.
              </p>
              <button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    const r = await request("code", token);
                    setSent(true);
                    setNotice(r.message);
                  })
                }
              >
                {busy
                  ? "Please wait…"
                  : sent
                    ? "Send a new code"
                    : "Send verification code"}
              </button>
              {sent && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run(async () => {
                      const r = await request("verify", token, { code });
                      const t = await request("view", r.sessionToken);
                      setTask(t);
                      setSession(r.sessionToken);
                      setOutcome(
                        t.kind === "information"
                          ? "information_supplied"
                          : "acknowledged",
                      );
                      setCode("");
                      setNotice(
                        "Email verified. This session lasts up to 15 minutes.",
                      );
                    });
                  }}
                >
                  <label>
                    Verification code
                    <input
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </label>
                  <button disabled={busy || code.length !== 6}>
                    Verify & continue
                  </button>
                </form>
              )}
              <small>
                Your code expires after 10 minutes. Contact MGTV if you no
                longer have access to the partnership contact inbox.
              </small>
            </div>
          </section>
        ) : (
          task && (
            <>
              <section className="partner-panel">
                <div className="partner-panel-heading">
                  <span className="partner-seal" aria-hidden="true">
                    ▤
                  </span>
                  <div>
                    <p className="partner-eyebrow">
                      AGREEMENT · VERSION {task.agreementVersion}
                    </p>
                    <h2>{task.agreement.name}</h2>
                    <p>{task.agreement.partnerName}</p>
                  </div>
                </div>
                <div className="partner-facts">
                  <div>
                    <span>Arrangement</span>
                    <strong>
                      {(
                        {
                          partner_pays: "Partner pays MGTV",
                          licensing: "MGTV licenses content",
                          revenue_share: "Revenue sharing",
                          hybrid: "Hybrid arrangement",
                        } as Record<string, string>
                      )[task.agreement.mode] ?? task.agreement.mode}
                    </strong>
                  </div>
                  <div>
                    <span>Partner service total</span>
                    <strong>{money(task.agreement.totalMinor)}</strong>
                  </div>
                  <div>
                    <span>Territories</span>
                    <strong>
                      {task.agreement.territories?.join(", ") || "Not agreed"}
                    </strong>
                  </div>
                </div>
                <div className="partner-facts">
                  <div>
                    <span>License fee payable by MGTV</span>
                    <strong>{money(task.agreement.licenseFeeMinor)}</strong>
                  </div>
                  <div>
                    <span>Partner revenue share</span>
                    <strong>
                      {task.agreement.partnerShareBps == null
                        ? "Not agreed"
                        : task.agreement.partnerShareBps / 100 + "%"}
                    </strong>
                  </div>
                  <div>
                    <span>Tax treatment</span>
                    <strong>
                      {task.agreement.taxTreatment?.replace(/_/g, " ")} ·{" "}
                      {money(task.agreement.taxMinor)}
                    </strong>
                  </div>
                  <div>
                    <span>Starts</span>
                    <strong>
                      {task.agreement.startsAt
                        ? new Date(task.agreement.startsAt).toLocaleString(
                            "en-JM",
                            { timeZone: "America/Jamaica" },
                          )
                        : "Not agreed"}
                    </strong>
                  </div>
                  <div>
                    <span>Ends</span>
                    <strong>
                      {task.agreement.endsAt
                        ? new Date(task.agreement.endsAt).toLocaleString(
                            "en-JM",
                            { timeZone: "America/Jamaica" },
                          )
                        : "Not agreed"}
                    </strong>
                  </div>
                </div>
                {[
                  ["Rights and term", task.agreement.rightsTerms],
                  [
                    "Your responsibilities",
                    task.agreement.partnerResponsibilities,
                  ],
                  [
                    "MGTV responsibilities",
                    task.agreement.mgtvResponsibilities,
                  ],
                  ["Revenue basis", task.agreement.revenueBasis],
                  ["Allowed deductions", task.agreement.deductions],
                  ["Settlement schedule", task.agreement.settlementSchedule],
                ]
                  .filter(([, v]) => !!v)
                  .map(([title, value]) => (
                    <section className="partner-copy" key={title}>
                      <h3>{title}</h3>
                      <p>{value}</p>
                    </section>
                  ))}
                <div className="partner-service-grid">
                  {task.agreement.services?.map((s: any, i: number) => (
                    <article key={i}>
                      <p className="partner-eyebrow">AGREED SERVICE {i + 1}</p>
                      <h3>{s.name}</h3>
                      {s.benefit && <p>{s.benefit}</p>}
                      <p>{s.scope}</p>
                      {s.exclusions && <p>Excludes: {s.exclusions}</p>}
                      <small>
                        {s.quantity}{" "}
                        {s.unit ?? (s.quantity === 1 ? "unit" : "units")} ·{" "}
                        {s.periods} {s.periods === 1 ? "period" : "periods"}
                      </small>
                    </article>
                  ))}
                </div>
                <p className="partner-footnote">
                  This is an agreement review request. It is not a signing
                  ceremony, invoice or payment request.
                </p>
              </section>
              <section className="partner-panel">
                <h2>
                  {task.status === "open"
                    ? "Your response"
                    : "Your response is with MGTV"}
                </h2>
                {task.status === "open" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void run(async () => {
                        const body = { outcome, message };
                        const fingerprint = JSON.stringify(body);
                        if (retry.current.body !== fingerprint)
                          retry.current = {
                            body: fingerprint,
                            key: crypto.randomUUID(),
                          };
                        const result = await request(
                          "respond",
                          session,
                          body,
                          retry.current.key,
                        );
                        setNotice(result.message);
                        setTask({
                          ...task,
                          status: "submitted",
                          response: body,
                        });
                      });
                    }}
                  >
                    {task.kind === "review" && (
                      <label>
                        How would you like to proceed?
                        <select
                          value={outcome}
                          onChange={(e) => setOutcome(e.target.value)}
                        >
                          <option value="acknowledged">
                            I have reviewed these details
                          </option>
                          <option value="changes_requested">
                            I would like changes
                          </option>
                        </select>
                      </label>
                    )}
                    <label>
                      {task.kind === "information"
                        ? "Requested information"
                        : "Your message"}
                      <textarea
                        required
                        minLength={5}
                        maxLength={6000}
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </label>
                    <p className="partner-footnote">
                      Submitting sends your response to staff. It does not sign,
                      pay for or activate this agreement.
                    </p>
                    <button disabled={busy}>
                      {busy ? "Submitting…" : "Send response to MGTV"}
                    </button>
                  </form>
                ) : (
                  <>
                    <p>{task.response?.message}</p>
                    <p>
                      MGTV will review your response and arrange the next step.
                    </p>
                  </>
                )}
              </section>
              <button
                className="partner-secondary"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await request("close", session);
                    setSession("");
                    setTask(null);
                    setCode("");
                    setMessage("");
                    setNotice(
                      "Private view closed. Reopen the original link if you need to verify again.",
                    );
                  })
                }
              >
                Close private view
              </button>
            </>
          )
        )}
        <footer>
          Mining Gold TV · Jamaican roots. Caribbean perspectives.
        </footer>
      </div>
    </main>
  );
}
