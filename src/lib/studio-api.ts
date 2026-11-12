import type {
  Booking,
  BookingInput,
  OwnedStudio,
  Studio,
  StudioCategory,
  StudioInput,
} from "./studios";

const base = "/api/studiospace";

export class StudioApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "StudioApiError";
  }
}

async function request(path: string, options?: RequestInit) {
  const response = await fetch(base + path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new StudioApiError(
      response.status,
      typeof body?.message === "string"
        ? body.message
        : "StudioSpace could not complete your request. Please try again.",
    );
  }
  return response;
}

async function read<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await request(path, options);
  return response.json();
}

function json(method: "POST" | "PATCH", body: StudioInput | Partial<StudioInput> | BookingInput): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function listStudios(
  filters: { category?: StudioCategory; limit?: number } = {},
  signal?: AbortSignal,
) {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.limit !== undefined) query.set("limit", String(filters.limit));
  const search = query.toString();
  return read<Studio[]>(`/studios${search ? `?${search}` : ""}`, { signal });
}

export function getStudio(id: string, signal?: AbortSignal) {
  return read<Studio>(`/studios/${encodeURIComponent(id)}`, { signal });
}

export function listMyStudios(signal?: AbortSignal) {
  return read<OwnedStudio[]>("/studios/mine", { signal });
}

export function createStudio(input: StudioInput) {
  return read<OwnedStudio>("/studios", json("POST", input));
}

export function updateStudio(id: string, input: Partial<StudioInput>) {
  return read<OwnedStudio>(`/studios/${encodeURIComponent(id)}`, json("PATCH", input));
}

export async function deleteStudio(id: string) {
  await request(`/studios/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function listMyBookings(signal?: AbortSignal) {
  return read<Booking[]>("/bookings", { signal });
}

export function createBooking(input: BookingInput) {
  return read<Booking>("/bookings", json("POST", input));
}

export function cancelBooking(id: string) {
  return read<Booking>(`/bookings/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
  });
}
