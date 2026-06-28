import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export function getAssetUrl(path?: string): string {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;

  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
}

