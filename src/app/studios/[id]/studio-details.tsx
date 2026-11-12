"use client";

import { Aperture, ArrowLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudio, StudioApiError } from "@/lib/studio-api";
import type { Studio } from "@/lib/studios";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

type DetailState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error"; message: string }
  | { status: "ready"; studio: Studio };

function StudioGallery({ studio }: { studio: Studio }) {
  const photos = [...new Set([studio.image, ...studio.gallery])];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const photo = photos[index];

  function move(step: number) {
    setIndex((current) => (current + step + photos.length) % photos.length);
  }

  return (
    <section className="studio-gallery" aria-label="Studio photo gallery">
      <div className="studio-gallery-photo">
        {failed.includes(photo) ? (
          <Aperture aria-hidden="true" size={48} />
        ) : (
          // Hosts can use any HTTPS image provider.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={`${studio.title}, photo ${index + 1}`}
            onError={() => setFailed((images) => [...images, photo])} />
        )}
      </div>
      {photos.length > 1 && (
        <div className="studio-gallery-controls">
          <button type="button" className="icon-button" aria-label="Previous photo" onClick={() => move(-1)}>
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <span aria-live="polite">{index + 1} of {photos.length}</span>
          <button type="button" className="icon-button" aria-label="Next photo" onClick={() => move(1)}>
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      )}
    </section>
  );
}

export function StudioDetails({ id }: { id: string }) {
  const [state, setState] = useState<DetailState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getStudio(id, controller.signal).then(
      (studio) => {
        if (!controller.signal.aborted) setState({ status: "ready", studio });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof StudioApiError && error.status === 404) {
          setState({ status: "missing" });
          return;
        }
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Could not load this studio.",
        });
      },
    );
    return () => controller.abort();
  }, [id, attempt]);

  return (
    <div className="container studio-detail">
      <Link href="/studios" className="studio-detail-back">
        <ArrowLeft aria-hidden="true" size={16} /> Explore studios
      </Link>
      {state.status === "loading" && (
        <div className="studio-detail-skeleton" role="status" aria-label="Loading studio details" />
      )}
      {state.status === "missing" && (
        <section className="empty-state">
          <h1>Studio unavailable</h1>
          <p>This listing may have been removed.</p>
        </section>
      )}
      {state.status === "error" && (
        <section className="empty-state" role="alert">
          <h1>Could not load this studio</h1>
          <p>{state.message}</p>
          <button type="button" className="button button-outline" onClick={() => {
            setState({ status: "loading" });
            setAttempt((current) => current + 1);
          }}>
            Try again
          </button>
        </section>
      )}
      {state.status === "ready" && <StudioOverview studio={state.studio} />}
    </div>
  );
}

function StudioOverview({ studio }: { studio: Studio }) {
  return (
    <>
      <header className="studio-detail-heading">
        <p>{studio.category}</p>
        <h1>{studio.title}</h1>
        <p className="studio-detail-location">
          <MapPin aria-hidden="true" size={16} /> {studio.location}
        </p>
      </header>
      <StudioGallery studio={studio} />
      <div className="studio-detail-columns">
        <div className="studio-detail-sections">
          <section>
            <h2>About this studio</h2>
            <p className="studio-overview-copy">{studio.description}</p>
          </section>
          <section>
            <h2>Amenities</h2>
            {studio.amenities.length > 0 ? (
              <ul className="studio-amenities">
                {studio.amenities.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
              </ul>
            ) : <p className="muted">The host hasn’t added amenities yet.</p>}
          </section>
          <section>
            <h2>Reviews</h2>
            <p className="muted">{studio.rating > 0
              ? `Average rating ${studio.rating.toFixed(1)} out of 5.`
              : "No reviews yet."}</p>
          </section>
        </div>
        <aside className="panel studio-detail-summary" aria-label="Studio rates and host">
          <p><strong>{dollars.format(studio.hourlyRate)}</strong> / hr</p>
          <dl>
            <div><dt>Security deposit</dt><dd>{dollars.format(studio.securityDeposit)}</dd></div>
            <div><dt>Capacity</dt><dd>{studio.maxCapacity} people</dd></div>
            <div><dt>Hosted by</dt><dd>{studio.ownerName}</dd></div>
          </dl>
        </aside>
      </div>
    </>
  );
}
