"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createBookingRequest } from "@/lib/firebase/data";

const requestTypes = ["Food", "Car Wash", "Braai", "Catering / Group", "Private Event", "Other"] as const;
type RequestType = (typeof requestTypes)[number];

function requestedType(value: string | null): RequestType | "" {
  if (value === "food") return "Food";
  if (value === "car-wash") return "Car Wash";
  if (value === "braai") return "Braai";
  if (value === "catering") return "Catering / Group";
  if (value === "private-event") return "Private Event";
  return "";
}

function localDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function firebaseErrorDetails(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const candidate = error as { code?: unknown; message?: unknown };
    const code = typeof candidate.code === "string" ? candidate.code : "unknown";
    const message = typeof candidate.message === "string" ? candidate.message : "Unknown Firebase error";
    return { code, message };
  }
  return { code: "unknown", message: String(error) };
}

export default function BookForm() {
  const searchParams = useSearchParams();
  const initialType = useMemo(() => requestedType(searchParams.get("type")), [searchParams]);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const minDate = localDateValue();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const request = {
      createdAt: new Date().toISOString(),
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      requestType: String(form.get("requestType") ?? "").trim(),
      date: String(form.get("date") ?? "").trim(),
      startTime: String(form.get("startTime") ?? "").trim(),
      details: String(form.get("details") ?? "").trim(),
      notes: String(form.get("notes") ?? "").trim(),
      status: "New" as const,
    };

    if (!request.name || !request.phone || !request.requestType || !request.details) {
      setError("Please complete your name, phone number, request type and what you need.");
      setBusy(false);
      return;
    }
    if (request.date && request.date < minDate) {
      setError("Please choose today or a future date.");
      setBusy(false);
      return;
    }

    try {
      const id = await createBookingRequest(request);
      setReference(id.slice(0, 8).toUpperCase());
      setSubmitted(true);
      event.currentTarget.reset();
    } catch (error) {
      const details = firebaseErrorDetails(error);
      console.error("[Meating Place] booking request failed", { code: details.code, message: details.message, error });
      setError(`We could not record your request right now (${details.code}). Please try again in a moment. If the problem continues, contact THE MEATING PLACE directly.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bookPage">
      <nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />THE MEATING PLACE</Link><Link href="/" className="button buttonLight">Back to site</Link></div></nav>
      <div className="formWrap">
        <div className="sectionHead"><span className="kicker">Plan your visit</span><h1 style={{fontSize:"clamp(2.6rem,6vw,4.5rem)"}}>Tell us what you&apos;re planning.</h1><p>Food, car wash, braai, catering or a private get-together — send the details once and the team can take it from there.</p></div>
        <div className="formCard">
          {submitted ? <div className="confirm"><div className="confirmIcon" aria-hidden="true">🔥</div><h2>Request received</h2><p>Your request is in the Meating Place queue.</p><p><strong>Request #{reference}</strong></p><p>The team can now review what you need and contact you to confirm the details.</p><div className="actions" style={{justifyContent:"center"}}><Link className="button buttonPrimary" href="/">Return to THE MEATING PLACE</Link></div></div> : <form onSubmit={handleSubmit}><div className="formGrid">
            <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
            <div className="field fieldFull"><label htmlFor="email">Email <span style={{fontWeight:400}}>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="requestType">What are you looking for?</label><select id="requestType" name="requestType" required defaultValue={initialType}><option value="" disabled>Select one</option>{requestTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
            <div className="field"><label htmlFor="date">Date <span style={{fontWeight:400}}>(optional)</span></label><input id="date" name="date" type="date" min={minDate} /></div>
            <div className="field"><label htmlFor="startTime">Preferred time <span style={{fontWeight:400}}>(optional)</span></label><input id="startTime" name="startTime" type="time" /></div>
            <div className="field fieldFull"><label htmlFor="details">Tell us what you need</label><textarea id="details" name="details" required placeholder="For example: lunch for 12, a Saturday braai, car wash while I eat, birthday gathering…" /></div>
            <div className="field fieldFull"><label htmlFor="notes">Anything else? <span style={{fontWeight:400}}>(optional)</span></label><textarea id="notes" name="notes" placeholder="Useful details, timing, group size, special requests or questions" /></div>
            <div className="field fieldFull"><button className="button buttonPrimary" type="submit" disabled={busy}>{busy ? "Sending request…" : "Send request"}</button></div>
          </div>{error && <p role="alert" style={{color:"#b42318",lineHeight:1.6}}>{error}</p>}<p style={{color:"var(--muted)",fontSize:".84rem",lineHeight:1.6,marginBottom:0}}>This is a request, not a confirmed booking. The Meating Place team will contact you to confirm availability and details.</p></form>}
        </div>
      </div>
    </main>
  );
}
