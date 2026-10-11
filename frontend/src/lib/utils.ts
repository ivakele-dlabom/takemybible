import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE";

export async function fetchData<T>(
    url: string,
    method: HttpMethod = "GET",
    body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`${method} ${url} failed: ${response.status} ${response.statusText}`);
  }

  // No content (e.g. 204 or HEAD), so there's nothing to parse
  if (response.status === 204 || method === "HEAD") {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return "";

  let result = "";
  for (const [value, symbol] of ROMAN_MAP) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

