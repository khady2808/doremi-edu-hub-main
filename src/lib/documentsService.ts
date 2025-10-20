export interface DocumentItem {
  id: number | string;
  title?: string;
  description?: string;
  type?: string;
  category?: string;
  subject?: string;
  level?: string;
  author?: string;
  uploadDate?: string;
  fileSize?: number;
  downloads?: number;
  views?: number;
  rating?: number;
  isPublic?: boolean;
  isPremium?: boolean;
  tags?: string[];
  thumbnail?: string;
  fileUrl?: string;
  status?: string;
  // Allow backend fields passthrough
  [key: string]: unknown;
}

function getBaseUrl(): string {
  const base = (import.meta as ImportMeta).env?.VITE_API_BASE_URL as string | undefined;
  return base ? base.replace(/\/$/, '') : '';
}

async function httpGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { method: 'GET', signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const documentsService = {
  async list(signal?: AbortSignal): Promise<DocumentItem[]> {
    return httpGet<DocumentItem[]>('/documents', signal);
  },

  async getById(id: number | string, signal?: AbortSignal): Promise<DocumentItem> {
    return httpGet<DocumentItem>(`/documents/${id}`, signal);
  },

  async search(query: string, signal?: AbortSignal): Promise<DocumentItem[]> {
    const params = new URLSearchParams({ q: query });
    // Support either /documents/search?q=... or /documents/search?query=...
    try {
      return httpGet<DocumentItem[]>(`/documents/search?${params.toString()}`, signal);
    } catch (e) {
      const paramsAlt = new URLSearchParams({ query });
      return httpGet<DocumentItem[]>(`/documents/search?${paramsAlt.toString()}`, signal);
    }
  },
};

export default documentsService;


