import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GetOptions = { method: "GET" };

type MutationOptions = {
  method: "POST" | "PATCH" | "DELETE";
  body?: string | FormData | Buffer;
};

type Options = GetOptions | Omit<MutationOptions, "credentials">;

type RequestOptions = Options & Omit<RequestInit, "method" | "body">;

export async function request<T>(
  url: string,
  { headers: initialHeaders, ...options }: RequestOptions,
) {
  const headers = {
    "Content-Type": "application/json",
    ...initialHeaders,
  };

  const response = await fetch(url, {
    headers: headers,
    credentials: options.credentials ?? undefined,
    ...options,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json: T = await response.json();

  if (!response.ok) {
    console.error(json);

    return json;
  }

  return json;
}
