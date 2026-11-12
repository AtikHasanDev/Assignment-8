"use client";

import Link from "next/link";
import { Aperture, ArrowUpRight, MapPin, Star } from "lucide-react";
import { useState } from "react";
import type { Studio } from "@/lib/studios";

const hourlyPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export function StudioCard({ studio }: { studio: Studio }) {
  const [failedImage, setFailedImage] = useState<string>();

  return (
    <article className="studio-card">
      <div className="studio-card-photo">
        {failedImage === studio.image ? (
          <Aperture aria-hidden="true" size={36} />
        ) : (
          // Listing images can come from any HTTPS image host.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={studio.image} alt={studio.title} loading="lazy"
            onError={() => setFailedImage(studio.image)} />
        )}
        <span className="studio-category-badge">{studio.category}</span>
      </div>
      <div className="studio-card-content">
        <div className="studio-card-row">
          <h2>{studio.title}</h2>
          <span className="studio-rating">
            <Star aria-hidden="true" size={14} />
            {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <p className="studio-location">
          <MapPin aria-hidden="true" size={16} /> {studio.location}
        </p>
        <div className="studio-card-row studio-card-bottom">
          <p><strong>{hourlyPrice.format(studio.hourlyRate)}</strong> / hr</p>
          <Link href={`/studios/${studio._id}`} className="button button-outline"
            aria-label={`View details for ${studio.title}`}>
            View details <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
