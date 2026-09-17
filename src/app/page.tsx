"use client";

import "./meating.css";
import Link from "next/link";

const asset = (name: string) => `/meatingplace-assets/${encodeURIComponent(name)}`;
const photos = [
  "WhatsApp Image 2026-09-16 at 10.01.24 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.25 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.27 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.29 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.30 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.31 (1).jpeg",
  "WhatsApp Image 2026-09-17 at 01.07.50.jpeg",
  "WhatsApp Image 2026-09-17 at 01.07.52.jpeg",
  "WhatsApp Image 2026-09-17 at 01.07.54.jpeg",
];
const videos = [
  "WhatsApp Video 2026-09-17 at 01.08.58.mp4",
  "WhatsApp Video 2026-09-17 at 01.08.59.mp4",
  "WhatsApp Video 2026-09-17 at 01.09.53.mp4",
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "THE MEATING PLACE",
  description: "Car wash and braai. Good food, good mood.",
  slogan: "LET'S MEAT & EAT",
  url: "https://meating-place.vercel.app",
  servesCuisine: "Braai",
  hasMenu: "https://meating-place.vercel.app/book",
};

export default function Home() {
  return <main className="site meatingSite">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className="meatTopbar"><div className="container meatTopbarInner"><span>THE MEATING PLACE</span><strong>CAR WASH &amp; BRAAI</strong><span>Good food. Good mood.</span></div></div>
    <nav className="nav meatNav"><div className="container navInner"><Link href="/" className="meatLogo" aria-label="THE MEATING PLACE home">THE MEATING PLACE<span>CAR WASH &amp; BRAAI</span></Link><div className="navLinks"><a href="#food">Food</a><a href="#wash">Car Wash</a><a href="#braai">Braai</a><a href="#visit">Find Us</a></div><Link href="/book" className="button meatButton">Make a booking</Link></div></nav>

    <section className="meatHero"><div className="meatHeroImage"><img src={asset(photos[6])} alt="THE MEATING PLACE" fetchPriority="high" /></div><div className="meatHeroOverlay" /><div className="container meatHeroContent"><span className="meatStamp">LET&apos;S MEAT &amp; EAT</span><h1>Pull up.<br /><em>We&apos;ll sort the rest.</em></h1><p>Get the car looking right. Get something good on the grill. Stay for the vibe.</p><div className="heroChoices"><Link href="/book?type=car-wash" className="heroChoice heroChoiceWash"><span aria-hidden="true">🚗</span><strong>Wash my car</strong><small>Book the wash</small></Link><Link href="/book?type=food" className="heroChoice heroChoiceFood"><span aria-hidden="true">🔥</span><strong>Feed me</strong><small>Food &amp; braai</small></Link></div></div></section>

    <section className="meatPromise"><div className="container meatPromiseGrid"><div><span className="meatKicker">One stop. Two reasons to stay.</span><h2>Come for the wash.<br /><em>Stay for the food.</em></h2></div><p>The Meating Place is built around a simple idea: make the stop worth it. Drop the car, grab a plate, catch the fire and enjoy yourself while we handle the rest.</p></div></section>

    <section id="food" className="section meatSection meatFood"><div className="container"><div className="meatSectionHead"><div><span className="meatKicker">Food &amp; Braai</span><h2>Hungry?</h2></div><p>Good food doesn&apos;t need a speech. Come through, see what&apos;s cooking and get a plate.</p></div><div className="foodFeature"><img src={asset(photos[0])} alt="Food at THE MEATING PLACE" loading="lazy" /><div><span className="meatKicker">On the grill</span><h3>Proper food.<br />No fuss.</h3><p>Whether you&apos;re grabbing a quick plate or settling in for a braai, there&apos;s a reason to stay.</p><Link href="/book?type=food" className="button meatButton">Book food</Link></div></div></div></section>

    <section id="wash" className="meatWash"><div className="meatWashImage"><img src={asset(photos[3])} alt="Car wash at THE MEATING PLACE" loading="lazy" /></div><div className="meatWashCopy"><span className="meatKicker">Car Wash</span><h2>Dirty car?<br /><em>Easy.</em></h2><p>Pull in, hand over the keys and make yourself comfortable. Your car gets cleaned while you eat, chill or catch up.</p><Link href="/book?type=car-wash" className="button meatButton">Book the wash</Link></div></section>

    <section id="braai" className="section meatSection meatDark"><div className="container"><div className="meatSectionHead"><div><span className="meatKicker">The vibe</span><h2>Fire. Smoke. Good company.</h2></div><p>The braai is the heartbeat. Come for the food, stay because the atmosphere is doing its thing.</p></div><div className="meatVideoGrid">{videos.map((video) => <video key={video} src={asset(video)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />)}</div></div></section>

    <section className="meatGallery"><div className="container"><div className="galleryLead"><div><span className="meatKicker">Real place. Real people.</span><h2>See what&apos;s happening.</h2></div><Link href="/book" className="button meatButton">Come through</Link></div><div className="galleryStrip">{photos.slice(4).map((photo) => <img key={photo} src={asset(photo)} alt="THE MEATING PLACE" loading="lazy" /></div></div></section>

    <section id="visit" className="meatVisit"><div className="container meatVisitInner"><div><span className="meatKicker">Come through</span><h2>THE MEATING PLACE</h2><p>CAR WASH &amp; BRAAI<br />Good food. Good mood.</p></div><div className="meatVisitCard"><strong>Ready?</strong><p>Book a wash, ask about food or plan a braai. Send us a request and we&apos;ll take it from there.</p><Link href="/book" className="button meatButton">Make a booking</Link></div></div></section>
    <footer className="footer meatFooter"><div className="container"><strong>THE MEATING PLACE</strong><span>LET&apos;S MEAT &amp; EAT · CAR WASH &amp; BRAAI</span></div></footer>
  </main>;
}
