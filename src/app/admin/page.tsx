"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminGate from "@/app/admin/admin-gate";
import {
  deleteOfferingRecord,
  getBookingRequests,
  getOfferings,
  getSpecials,
  saveOfferingRecord,
  saveSpecialRecord,
  updateBookingStatus,
  type BookingRequestRecord,
  type OfferingRecord,
  type SpecialRecord,
} from "@/lib/firebase/data";

function AdminDashboard() {
  const [tab, setTab] = useState<"requests" | "offerings" | "specials">("requests");
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]);
  const [offerings, setOfferings] = useState<OfferingRecord[]>([]);
  const [specials, setSpecials] = useState<SpecialRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "upcoming">("all");
  const [draft, setDraft] = useState<OfferingRecord | null>(null);
  const [specialDraft, setSpecialDraft] = useState<SpecialRecord | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getBookingRequests(), getOfferings(), getSpecials()]).then(([requests, menu, offers]) => {
      if (cancelled) return;
      setBookings(requests);
      setOfferings(menu);
      setSpecials(offers);
    }).catch(() => {
      if (!cancelled) setNotice("Operations data could not be loaded. Check Firebase access.");
    });
    return () => { cancelled = true; };
  }, []);

  const counts = useMemo(() => ({
    total: bookings.length,
    new: bookings.filter((item) => item.status === "New").length,
    confirmed: bookings.filter((item) => item.status === "Confirmed").length,
    upcoming: bookings.filter((item) => Boolean(item.date) && String(item.date) >= new Date().toISOString().slice(0, 10) && item.status !== "Cancelled").length,
  }), [bookings]);

  const visible = useMemo(() => {
    const filtered = bookings.filter((item) => filter === "new" ? item.status === "New" : filter === "upcoming" ? Boolean(item.date) && String(item.date) >= new Date().toISOString().slice(0, 10) && item.status !== "Cancelled" : true);
    return [...filtered].sort((a, b) => String(a.date ?? "").localeCompare(String(b.date ?? "")) || b.createdAt.localeCompare(a.createdAt));
  }, [bookings, filter]);

  const current = bookings.find((item) => item.id === selected) ?? null;

  async function changeStatus(id: string, status: BookingRequestRecord["status"]) {
    try {
      await updateBookingStatus(id, status);
      setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      setNotice(`Request marked ${status.toLowerCase()}.`);
    } catch { setNotice("The request status could not be updated."); }
  }

  function startOffering(item?: OfferingRecord) {
    setDraft(item ? { ...item } : { id: crypto.randomUUID(), name: "", category: "Food", detail: "", price: "", active: true });
  }

  async function saveOffering() {
    if (!draft?.name.trim() || !draft.detail.trim()) return;
    try {
      await saveOfferingRecord(draft);
      setOfferings((items) => items.some((item) => item.id === draft.id) ? items.map((item) => item.id === draft.id ? draft : item) : [...items, draft]);
      setDraft(null);
      setNotice("Offering saved.");
    } catch { setNotice("The offering could not be saved."); }
  }

  async function removeOffering(id: string) {
    try {
      await deleteOfferingRecord(id);
      setOfferings((items) => items.filter((item) => item.id !== id));
      setNotice("Offering removed.");
    } catch { setNotice("The offering could not be removed."); }
  }

  async function saveSpecial() {
    if (!specialDraft?.title.trim() || !specialDraft.detail.trim()) return;
    try {
      await saveSpecialRecord(specialDraft);
      setSpecials((items) => items.some((item) => item.id === specialDraft.id) ? items.map((item) => item.id === specialDraft.id ? specialDraft : item) : [...items, specialDraft]);
      setSpecialDraft(null);
      setNotice("Special saved.");
    } catch { setNotice("The special could not be saved."); }
  }

  return <main className="adminPage"><div className="adminShell">
    <header className="adminHeader"><div><span className="kicker">THE MEATING PLACE · Operations</span><h1>Keep the place moving.</h1><p>Requests, offerings and specials in one working queue.</p></div><div className="adminHeaderActions"><Link href="/" className="button buttonLight">View public site</Link><Link href="/book" className="button buttonPrimary">Open request form</Link></div></header>
    <section className="adminStats"><article><span>Total requests</span><strong>{counts.total}</strong></article><article><span>New</span><strong>{counts.new}</strong></article><article><span>Confirmed</span><strong>{counts.confirmed}</strong></article><article><span>Upcoming</span><strong>{counts.upcoming}</strong></article></section>
    <nav className="adminTabs" aria-label="Operations sections"><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Requests</button><button className={tab === "offerings" ? "active" : ""} onClick={() => setTab("offerings")}>Offerings</button><button className={tab === "specials" ? "active" : ""} onClick={() => setTab("specials")}>Specials</button></nav>
    {notice && <div className="adminToast" role="status">{notice}</div>}

    {tab === "requests" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Customer queue</span><h2>Requests</h2></div><span>{bookings.length} total</span></div><div className="adminFilters"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button><button className={filter === "new" ? "active" : ""} onClick={() => setFilter("new")}>New ({counts.new})</button><button className={filter === "upcoming" ? "active" : ""} onClick={() => setFilter("upcoming")}>Upcoming ({counts.upcoming})</button></div>{visible.length === 0 ? <div className="emptyState"><div>📋</div><h3>No requests yet</h3><p>Customer requests will appear here as soon as they are submitted.</p><Link href="/book" className="button buttonPrimary">Open request form</Link></div> : <div className="requestList">{visible.map((item) => <button key={item.id} className={`requestRow ${selected === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}><div><strong>{item.name}</strong><span>{item.requestType}</span></div><div><strong>{item.date || "Flexible"}</strong><span>{item.status}</span></div></button>)}</div>}</div><div className="adminPanel detailPanel">{current ? <><div className="panelHeading"><div><span className="kicker">Request details</span><h2>{current.name}</h2></div><select value={current.status} onChange={(event) => void changeStatus(current.id, event.target.value as BookingRequestRecord["status"])}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div><dl className="detailList"><div><dt>Request</dt><dd>{current.requestType}</dd></div><div><dt>Date / time</dt><dd>{current.date || "Flexible"} · {current.startTime || "Flexible"}</dd></div><div><dt>Details</dt><dd>{current.details}</dd></div><div><dt>Notes</dt><dd>{current.notes || "No additional notes."}</dd></div><div><dt>Phone</dt><dd><a href={`tel:${current.phone}`}>{current.phone}</a></dd></div><div><dt>Email</dt><dd>{current.email || "Not provided"}</dd></div></dl><div className="actions"><a className="button buttonPrimary" href={`https://wa.me/${current.phone.replace(/\D/g, "")}`}>WhatsApp</a><a className="button buttonLight" href={`tel:${current.phone}`}>Call</a></div></> : <div className="emptyState"><div>👈</div><h3>Select a request</h3><p>Open a request to see the full customer brief and move it through the workflow.</p></div>}</div></section>}

    {tab === "offerings" && <section className="adminContent"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">What we offer</span><h2>Offerings</h2><p>Keep the food, wash and braai catalogue ready for the next homepage/content pass.</p></div><button className="button buttonPrimary" onClick={() => startOffering()}>+ Add offering</button></div><div className="equipmentAdminGrid">{offerings.map((item) => <article key={item.id}><div><strong>{item.name}</strong><span>{item.category} · {item.detail}</span></div><b>{item.price || "Ask us"}</b><span>{item.active ? "Live" : "Hidden"}</span><div className="actions"><button className="button buttonLight" onClick={() => void saveOfferingRecord({ ...item, active: !item.active }).then(() => setOfferings((items) => items.map((entry) => entry.id === item.id ? { ...entry, active: !entry.active } : entry)))}>{item.active ? "Hide" : "Show"}</button><button className="button buttonLight" onClick={() => startOffering(item)}>Edit</button><button className="button buttonLight" onClick={() => void removeOffering(item.id)}>Delete</button></div></article>)}</div>{offerings.length === 0 && <div className="emptyState"><div>🍖</div><h3>No offerings yet</h3><p>Add the real menu, wash packages and braai options as the business defines them.</p></div>}</div>{draft && <div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Catalogue</span><h2>{offerings.some((item) => item.id === draft.id) ? "Edit offering" : "Add offering"}</h2></div><button className="button buttonLight" onClick={() => setDraft(null)}>Cancel</button></div><form className="adminForm" onSubmit={(event) => { event.preventDefault(); void saveOffering(); }}><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label><label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as OfferingRecord["category"] })}><option>Food</option><option>Car Wash</option><option>Braai</option><option>Other</option></select></label><label>Description<input value={draft.detail} onChange={(event) => setDraft({ ...draft, detail: event.target.value })} required /></label><label>Price / starting price<input value={draft.price ?? ""} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label><label><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Visible to customers</label><button className="button buttonPrimary" type="submit">Save offering</button></form></div>}</section>}

    {tab === "specials" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Live promotions</span><h2>Specials</h2></div><span>{specials.filter((item) => item.active).length} active</span></div>{specials.length === 0 ? <div className="emptyState"><div>🔥</div><h3>No specials yet</h3><p>Add a real offer when there is something worth putting in front of customers.</p></div> : <div className="specialList">{specials.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.detail}</p></div><div className="actions"><button className="button buttonLight" onClick={() => void saveSpecialRecord({ ...item, active: !item.active }).then(() => setSpecials((items) => items.map((entry) => entry.id === item.id ? { ...entry, active: !entry.active } : entry))}>{item.active ? "Active" : "Hidden"}</button><button className="button buttonLight" onClick={() => setSpecialDraft(item)}>Edit</button></div></article>)}</div>}</div><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Create</span><h2>{specialDraft ? "Edit special" : "Add a special"}</h2></div></div><form className="adminForm" onSubmit={(event) => { event.preventDefault(); void saveSpecial(); }}><label>Title<input value={specialDraft?.title ?? ""} onChange={(event) => setSpecialDraft((current) => ({ id: current?.id ?? crypto.randomUUID(), title: event.target.value, detail: current?.detail ?? "", active: current?.active ?? true }))} placeholder="e.g. Saturday Braai Special" required /></label><label>Detail<textarea value={specialDraft?.detail ?? ""} onChange={(event) => setSpecialDraft((current) => ({ id: current?.id ?? crypto.randomUUID(), title: current?.title ?? "", detail: event.target.value, active: current?.active ?? true }))} required /></label><label>Offer wording<input value={specialDraft?.offer ?? ""} onChange={(event) => setSpecialDraft((current) => ({ id: current?.id ?? crypto.randomUUID(), title: current?.title ?? "", detail: current?.detail ?? "", active: current?.active ?? true, offer: event.target.value }))} /></label><button className="button buttonPrimary" type="submit">Save special</button>{specialDraft && <button className="button buttonLight" type="button" onClick={() => setSpecialDraft(null)}>Clear</button>}</form></div></section>}
  </div></main>;
}

export default function AdminPage() {
  return <AdminGate><AdminDashboard /></AdminGate>;
}
