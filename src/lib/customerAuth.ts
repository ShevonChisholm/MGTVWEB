import { useEffect, useState } from "react";
import { useLocation } from "react-router";
export const connectedAuth = import.meta.env.VITE_API_MODE === "connected";
let csrf = "";
export class CustomerAuthError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function customerApi(
  path: string,
  method = "GET",
  body?: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<any> {
  const headers: Record<string, string> = { ...extraHeaders };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") headers["X-CSRF-Token"] = csrf;
  const response = await fetch("/api/v1/customer" + path, {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => {
    throw new CustomerAuthError(
      0,
      "Unable to reach MGTV. Check your connection and try again.",
    );
  });
  let unreadable = false;
  const result =
    response.status === 204
      ? null
      : await response.json().catch(() => {
          unreadable = true;
          return {
            message: "MGTV returned an unreadable response. Please try again.",
          };
        });
  if (!response.ok) {
    if (
      response.status === 401 &&
      ["SESSION_REQUIRED", "SESSION_EXPIRED"].includes(result?.code)
    )
      csrf = "";
    throw new CustomerAuthError(
      response.status,
      result?.message ?? "The request failed.",
    );
  }
  if (unreadable) throw new CustomerAuthError(502, result.message);
  if (result?.csrfToken) csrf = result.csrfToken;
  return result;
}
export function authChanged() {
  window.dispatchEvent(new Event("mgtv-customer-auth"));
}
export function useCustomerSession() {
  const [session, setSession] = useState<any>(null),
    [loading, setLoading] = useState(connectedAuth),
    [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => {
    if (!connectedAuth) return;
    let active = true;
    let generation = 0;
    const refresh = () => {
      const requestGeneration = ++generation;
      void customerApi("/session")
        .then((result) => {
          if (active && requestGeneration === generation) {
            setSession(result);
            setError("");
          }
        })
        .catch((e) => {
          if (active && requestGeneration === generation) {
            if (e instanceof CustomerAuthError && e.status === 401) {
              setSession(null);
              setError("");
            } else
              setError(
                e instanceof Error
                  ? e.message
                  : "Your session could not be checked.",
              );
          }
        })
        .finally(() => {
          if (active && requestGeneration === generation) setLoading(false);
        });
    };
    refresh();
    window.addEventListener("mgtv-customer-auth", refresh);
    return () => {
      active = false;
      window.removeEventListener("mgtv-customer-auth", refresh);
    };
  }, [location.pathname]);
  return { session, loading, error };
}
