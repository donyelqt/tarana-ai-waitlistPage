import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToCsv(data: Record<string, any>[]) {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const csvHeader = headers.join(",") + "\n";

  const csvRows = data
    .map((row) => {
      return headers
        .map((header) => {
          let value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            value = `"${value}"`;
          }
          return value;
        })
        .join(",");
    })
    .join("\n");

  return csvHeader + csvRows;
} 