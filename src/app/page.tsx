import "./meating.css";

"use client";

import Link from "next/link";

const asset = (name: string) => `/meatingplace-assets/${encodeURIComponent(name)}`;

const photos = [
  "WhatsApp Image 2026-09-16 at 10.01.24 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.24 (2).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.25 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.26 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.27 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 10.01.28.jpeg",
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
  "WhatsApp Video 2026-09-17 at 01.09.54.mp4",
  "WhatsApp Video 2026-09-17 at 01.09.59.mp4",
];

export default function Home() {
  return (
    <main className="site meatingSite">
      <div className="meatTopbar"><div className="container meatTopbarInner"><span>THE MEATING PLACE</span><strong>CAR WASH &amp; BRAAI</strong><span>Good food, good mood.</span></div></div>
      <nav className="nav meatNav"><div className="container navInner"><Link href="/" className="meatLogo"><span>THE</span> MEATING PLACE</Link><div className="navLinks"><a href="#eat">Eat</a><a href="#wash">Car Wash</a><a href="#braai">Braai</a><a href="#gallery">Gallery</a><a href="#visit">Visit</a></div><Link href="/book" className="button meatButton">Book / Request</Link></div></nav>
      <section className="meatHero"><div className="meatHeroImage"><img src={asset(photos[9])} alt="The Meating Place" /></div><div className="meatHeroOverlay" /><div className="container meatHeroContent"><span className="meatStamp">LET&apos;S MEAT &amp; EAT</span><h1>Come hungry.<br />Leave happy.</h1><p>Good food, good mood — with the braai going and the car wash working while you enjoy the place.</p><div className="actions"><a href="#eat" className="button meatButton">See what&apos;s cooking</a><a href="#visit" className="button meatButtonOutline">Find the place</a></div></div></section>
      <section className="meatIntro"><div className="container meatIntroGrid"><div><span className="meatKicker">More than a meal</span><h2>A place to eat, chill, wash &amp; braai.</h2></div><p>THE MEATING PLACE brings the everyday city stop together: proper food, an active car wash and a relaxed braai atmosphere. Pull in, grab a plate, meet people and make yourself comfortable.</p></div></section>
      <section id="eat" className="section meatSection"><div className="container"><div className="meatSectionHead"><span className="meatKicker">Eat</span><h2>Food worth pulling up for.</h2><p>From the grill to the plate, this is about real food served in a real place.</p></div><div className="meatPhotoGrid">{photos.slice(0, 6).map((photo, i) => <figure key={photo} className={i === 0 ? "wide" : ""}><img src={asset(photo)} alt={`The Meating Place food and atmosphere ${i + 1}`} /></figure>)}</div></div></section>
      <section id="wash" className="meatSplit"><div className="meatSplitImage"><img src={asset(photos[6])} alt="Car wash at The Meating Place" /></div><div className="meatSplitCopy"><span className="meatKicker">Car Wash</span><h2>Get clean while you eat.</h2><p>Bring the car, settle in and let the wash happen while you enjoy your food. It&apos;s part of what makes the place what it is.</p><a href="/book" className="button meatButton">Ask about the wash</a></div></section>
      <section id="braai" className="section meatSection meatDark"><div className="container"><div className="meatSectionHead"><span className="meatKicker">Braai</span><h2>Smoke. Fire. Meat. Good company.</h2><p>The braai is at the heart of the experience — the kind of food and atmosphere that makes you want to stay a little longer.</p></div><div className="meatVideoGrid">{videos.slice(0, 3).map((video) => <video key={video} src={asset(video)} autoPlay muted loop playsInline preload="metadata" />)}</div></div></section>
      <section id="gallery" className="section meatSection"><div className="container"><div className="meatSectionHead"><span className="meatKicker">Inside the place</span><h2>Don&apos;t take our word for it.</h2><p>These are moments from the actual Meating Place — food, people, cars and the atmosphere.</p></div><div className="meatMasonry">{photos.slice(6).map((photo) => <img key={photo} src={asset(photo)} alt="The Meating Place" />)}</div></div></section>
      <section id="visit" className="meatVisit"><div className="container meatVisitInner"><div><span className="meatKicker">Come through</span><h2>THE MEATING PLACE</h2><p>CAR WASH &amp; BRAAI<br />Good food, good mood.</p></div><div className="meatVisitCard"><strong>Want to plan something?</strong><p>Send a request for food, braai, catering or the car wash and we&apos;ll take it from there.</p><Link href="/book" className="button meatButton">Make a request</Link></div></div></section>
      <footer className="footer meatFooter"><div className="container"><strong>THE MEATING PLACE</strong><span> · LET&apos;S MEAT &amp; EAT · CAR WASH &amp; BRAAI</span></div></footer>
    </main>
  );
}
