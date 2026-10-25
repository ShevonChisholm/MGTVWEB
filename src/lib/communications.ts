export async function communications(
  path: string,
  body: unknown,
  key?: string,
) {
  const response = await fetch("/api/v1/catalog/" + path, {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok)
    throw Error(
      data.message ?? "Unable to complete this request. Please try again.",
    );
  return data;
}
