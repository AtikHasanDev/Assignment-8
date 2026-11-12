"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { createStudio, updateStudio } from "@/lib/studio-api";
import { studioCategories, type OwnedStudio, type StudioInput } from "@/lib/studios";

const amenities = [
  "Wi-Fi", "Parking", "Lighting kit", "Backdrop", "Sound treatment",
  "Microphones", "Changing room", "Accessible entrance",
];
const imageTypes = ["image/jpeg", "image/png", "image/webp"];

async function uploadImage(file: File): Promise<string> {
  if (!imageTypes.includes(file.type) || file.size > 5 * 1024 * 1024)
    throw new Error("Choose a JPG, PNG, or WebP image up to 5 MB.");

  const form = new FormData();
  form.set("image", file);
  const response = await fetch("/api/upload", { method: "POST", body: form });
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.url !== "string")
    throw new Error(
      typeof result?.message === "string" ? result.message : "The image could not be uploaded.",
    );
  return result.url;
}

export function StudioForm({ studio }: { studio?: OwnedStudio }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const amenityOptions = [...new Set([...amenities, ...(studio?.amenities ?? [])])];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();

    setBusy(true);
    setError("");
    try {
      const category = studioCategories.find((item) => item === value("category"));
      if (!category) throw new Error("Choose a studio category.");

      const file = form.get("photo");
      const image = file instanceof File && file.size > 0
        ? await uploadImage(file)
        : value("image");
      if (!URL.canParse(image) || new URL(image).protocol !== "https:")
        throw new Error("Enter an HTTPS image URL or upload a photo.");

      const input: StudioInput = {
        title: value("title"),
        category,
        hourlyRate: Number(value("hourlyRate")),
        securityDeposit: Number(value("securityDeposit")),
        maxCapacity: Number(value("maxCapacity")),
        location: value("location"),
        image,
        amenities: form.getAll("amenities").map(String),
        description: value("description"),
      };

      if (studio) await updateStudio(studio._id, input);
      else await createStudio(input);
      toast.success(studio ? "Studio updated." : "Studio listing created.");
      router.push("/my-listings");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The studio could not be saved.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="form-grid" disabled={busy}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field">
            Studio title
            <input name="title" required maxLength={160} defaultValue={studio?.title} />
          </label>
          <label className="field">
            Category
            <select name="category" required defaultValue={studio?.category ?? ""}>
              <option value="" disabled>Choose a category</option>
              {studioCategories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="field">
            Hourly rate (USD)
            <input name="hourlyRate" type="number" required min="0.01" step="0.01" defaultValue={studio?.hourlyRate} />
          </label>
          <label className="field">
            Security deposit (USD)
            <input name="securityDeposit" type="number" required min="0" step="0.01" defaultValue={studio?.securityDeposit ?? 0} />
          </label>
          <label className="field">
            Maximum capacity
            <input name="maxCapacity" type="number" required min="1" step="1" defaultValue={studio?.maxCapacity} />
          </label>
          <label className="field">
            Location or address
            <input name="location" required maxLength={240} defaultValue={studio?.location} />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field">
            Image URL
            <input name="image" type="url" defaultValue={studio?.image} placeholder="https://" />
          </label>
          <label className="field">
            Or upload an image
            <input name="photo" type="file" accept={imageTypes.join(",")} />
            <span className="muted">JPG, PNG, or WebP up to 5 MB. A file replaces the URL.</span>
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Amenities</legend>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm">
                <input type="checkbox" name="amenities" value={item}
                  defaultChecked={studio?.amenities.includes(item)} />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="field">
          Detailed overview
          <textarea name="description" required minLength={10} maxLength={4000} defaultValue={studio?.description} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field">
            Host name
            <input value={studio?.ownerName ?? session?.user.name ?? ""} readOnly />
          </label>
          <label className="field">
            Host email
            <input value={studio?.ownerEmail ?? session?.user.email ?? ""} readOnly />
          </label>
        </div>
        {error && <p role="alert" className="error-message">{error}</p>}
        <button type="submit" className="button button-primary justify-self-start" disabled={busy}>
          {busy ? "Saving…" : studio ? "Save changes" : "Publish studio"}
        </button>
      </fieldset>
    </form>
  );
}
