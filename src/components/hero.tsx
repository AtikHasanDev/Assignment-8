"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./hero.css";

const slides = [
  {
    title: "Find the space for your next shoot.",
    text: "Book photo studios and film stages by the hour.",
    photo: "1648740678671-c37d78567ea8", // KOBU Agency
  },
  {
    title: "Give your next episode a room of its own.",
    text: "Find podcast rooms with the microphones and lighting you need.",
    photo: "1764664035176-8e92ff4f128e", // Detail .co
  },
  {
    title: "Make your next recording.",
    text: "Explore music suites for vocal sessions, demos, and production.",
    photo: "1634286051376-940ff8525141", // TStudio_lv
  },
];

export function Hero() {
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [active, setActive] = useState(0);

  return (
    <section className="studio-hero" aria-label="Featured studio spaces">
      <h1 className="sr-only">StudioSpace creative studio rentals</h1>
      <Swiper
        modules={[A11y, Keyboard]}
        keyboard={{ enabled: true, onlyInViewport: true }}
        onSwiper={setSwiper}
        onSlideChange={(slider) => setActive(slider.activeIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.photo}>
            <div className="studio-hero-slide" inert={index !== active}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="studio-hero-photo" alt=""
                src={`https://images.unsplash.com/photo-${slide.photo}?auto=format&fit=crop&w=1920&q=85`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"} />
              <div className="studio-hero-copy">
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
                <Link href="/studios" className="button button-primary">
                  Explore studios <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="studio-hero-controls">
        <div className="studio-hero-dots" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button key={slide.photo} type="button" aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => swiper?.slideTo(index)} />
          ))}
        </div>
        <div className="studio-hero-arrows">
          <button className="icon-button" type="button" aria-label="Previous slide"
            disabled={active === 0} onClick={() => swiper?.slidePrev()}>
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <button className="icon-button" type="button" aria-label="Next slide"
            disabled={active === slides.length - 1} onClick={() => swiper?.slideNext()}>
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
