/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { buttonVariants } from "./ui/button";
import "swiper/css";
import "./hero.css";
const slides = [
  {
    title: (
      <>
        The library
        <br />
        never closes.
      </>
    ),
    text: "For the stories you can’t put down. Discover, borrow, and return — whenever the moment strikes.",
    label: "Your digital reading space",
    covers: ["last-garden", "art-of-almost", "quiet-hour"],
  },
  {
    title: (
      <>
        A new chapter.
        <br />A different world.
      </>
    ),
    text: "From quiet escapes to big ideas, there’s a story here for every kind of curious mind.",
    label: "Find your next favourite",
    covers: ["under-the-sun", "wild-places", "slow-mornings"],
  },
  {
    title: (
      <>
        Good stories
        <br />
        are better shared.
      </>
    ),
    text: "Make room on your shelf. Add a book you love and let someone else discover its magic.",
    label: "A library built together",
    covers: ["quiet-hour", "last-garden", "under-the-sun"],
  },
];
export function Hero() {
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [active, setActive] = useState(0);
  return (
    <section className="hero" aria-label="Featured stories">
      <Swiper
        modules={[A11y, Keyboard]}
        keyboard={{ enabled: true, onlyInViewport: true }}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActive(s.activeIndex)}
      >
        <>
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide">
                <div className="hero-copy">
                  <p className="eyebrow">BookNook / {slide.label}</p>
                  <h1>{slide.title}</h1>
                  <p className="hero-description">{slide.text}</p>
                  <Link href="/books" className={buttonVariants()}>
                    Browse books <ArrowUpRight size={16} />
                  </Link>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="hero-orbit" />
                  <div className="cover-stack">
                    {slide.covers.map((cover, i) => (
                      <img
                        key={cover}
                        className={`stack-book stack-book-${i}`}
                        src={`/covers/${cover}.svg`}
                        alt=""
                      />
                    ))}
                  </div>
                  <span className="issue-label">Issue 0{index + 1} / 03</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </>
      </Swiper>
      <div className="hero-controls">
        <div className="slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={active === i ? "true" : undefined}
              onClick={() => swiper?.slideTo(i)}
            />
          ))}
        </div>
        <span>Slide 0{active + 1} / Featured stories</span>
        <div className="slide-arrows">
          <button
            aria-label="Previous slide"
            disabled={active === 0}
            onClick={() => swiper?.slidePrev()}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            aria-label="Next slide"
            disabled={active === 2}
            onClick={() => swiper?.slideNext()}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
