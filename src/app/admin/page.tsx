"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminGate from "@/app/admin/admin-gate";
import { deleteOfferingRecord, getBookingRequests, getOfferings, getSpecials, saveOfferingRecord, saveSpecialRecord, updateBookingStatus, type BookingRequestRecord, type OfferingRecord, type SpecialRecord } from "@/lib/firebase/data";

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
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getBookingRequests(), getOfferings(), getSpecials()]).then(([requests, menu, offers]) => {
      if (cancelled) return;
      setBookings(requests);
      setOfferings(menu);
      setSpecials(offers);
    }).catch(() => {
      if (!cancelled) setNotice("Operations data could not be loaded. Check Firebase access.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const counts = useMemo(() => ({
    total: bookings.length,
    new: bookings.filter((item) => item.status === "New").length,
    confirmed: bookings.filter((item) => item.status === "Confirmed").length,
    upcoming: bookings.filter((item) => Boolean(item.date) && String(item.date) >= today && item.status !== "Cancelled").length,
  }), [bookings, today]);

  const visible = useMemo(() => {
    const filtered = bookings.filter((item) => filter === "new"
      ? item.status === "New"
      : filter === "upcoming"
        ? Boolean(item.date) && String(item.date) >= today && item.status !== "Cancelled"
        : true);
    return [...filtered].sort((a, b) => {
      const aDate = String(a.date ?? "");
      const bDate = String(b.date ?? "");
      if (filter === "upcoming") return aDate.localeCompare(bDate) || b.createdAt.localeCompare(a.createdAt);
      return b.createdAt.localeCompare(a.createdAt) || bDate.localeCompare(aDate);
    });
  }, [bookings, filter, today]);

  const current = bookings.find((item) => item.id === selected) ?? null;

  async function changeStatus(id: string, status: BookingRequestRecord["status"]) {
    setBusyAction(`status:${id}`);
    try {
      await updateBookingStatus(id, status);
      setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      setNotice(`Request marked ${status.toLowerCase()}.`);
    } catch {
      setNotice("The request status could not be updated. Please try again.");
    } finally {
      setBusyAction("");
    }
  }

  function startOffering(item?: OfferingRecord) {
    setDraft(item ? { ...item } : { id: crypto.randomUUID(), name: "", category: "Food", detail: "", price: "", active: true });
  }

  async function saveOffering() {
    if (!draft?.name.trim() || !draft.detail.trim()) return;
    const item = draft;
    setBusyAction(`offering:${item.id}`);
    try {
      await saveOfferingRecord(item);
      setOfferings((items) => items.some((entry) => entry.id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [...items, item]);
      setDraft(null);
      setNotice("Offering saved.");
    } catch {
      setNotice("The offering could not be saved. Please try again.");
    } finally {
      setBusyAction("");
    }
  }

  async function toggleOffering(item: OfferingRecord) {
    const next = { ...item, active: !item.active };
    setBusyAction(`offering:${item.id}`);
    try {
      await saveOfferingRecord(next);
      setOfferings((items) => items.map((entry) => entry.id === item.id ? next : entry));
      setNotice(`${item.name} is now ${next.active ? "visible" : "hidden"}.`);
    } catch {
      setNotice("The offering visibility could not be changed.");
    } finally {
      setBusyAction("");
    }
  }

  async function removeOffering(id: string) {
    setBusyAction(`delete:${id}`);
    try {
      await deleteOfferingRecord(id);
      setOfferings((items) => items.filter((item) => item.id !== id));
      setNotice("Offering removed.");
    } catch {
      setNotice("The offering could not be removed.");
    } finally {
      setBusyAction("");
    }
  }

  async function saveSpecial() {
    if (!specialDraft?.title.trim() || !specialDraft.detail.trim()) return;
    const item = specialDraft;
    setBusyAction(`special:${item.id}`);
    try {
      await saveSpecialRecord(item);
      setSpecials((items) => items.some((entry) => entry.id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [...items, item]);
      setSpecialDraft(null);
      setNotice("Special saved.");
    } catch {
      setNotice("The special could not be saved. Please try again.");
    } finally {
      setBusyAction("");
    }
  }

  async function toggleSpecial(item: SpecialRecord) {
    const next = { ...item, active: !item.active };
    setBusyAction(`special:${item.id}`);
    try {
      await saveSpecialRecord(next);
      setSpecials((items) => items.map((entry) => entry.id === item.id ? next : entry));
      setNotice(`${item.title} is now ${next.active ? "active" : "hidden"}.`);
    } catch {
      setNotice("The special visibility could not be changed.");
    } finally {
      setBusyAction("");
    }
  }

  return <main className="adminPage"><div className="adminShell">
    <header className="adminHeader"><div><span className="kicker">THE MEATING PLACE · Operations</span><h1>Keep the place moving.</h1><p>Requests, offerings and specials in one working queue.</p></div><div className="adminHeaderActions"><Link href="/" className="button buttonLight">View public site</Link><Link href="/book" className="button buttonPrimary">Open request form</Link></div></header>
    <section className="adminStats"><article><span>Total requests</span><strong>{loading ? "—" : counts.total}</strong></article><article><span>New</span><strong>{loading ? "—" : counts.new}</strong></article><article><span>Confirmed</span><strong>{loading ? "—" : counts.confirmed}</strong></article><article><span>Upcoming</span><strong>{loading ? "—" : counts.upcoming}</strong></article></section>
    <nav className="adminTabs" aria-label="Operations sections"><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Requests</button><button className={tab === "offerings" ? "active" : ""} onClick={() => setTab("offerings")}>Offerings</button><button className={tab === "specials" ? "active" : ""} onClick={() => setTab("specials")}>Specials</button></nav>
    {notice && <div className="adminToast" role="status">{notice}</div>}
    {tab === "requests" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Customer queue</span><h2>Requests</h2></div><span>{loading ? "Loading…" : `${bookings.length} total`}</span></div><div className="adminFilters"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button><button className={filter === "new" ? "active" : ""} onClick={() => setFilter("new")}>New ({counts.new})</button><button className={filter === "upcoming" ? "active" : ""} onClick={() => setFilter("upcoming")}>Upcoming ({counts.upcoming})</button></div>{loading ? <div className="emptyState"><div>⏳</div><h3>Loading requests</h3><p>Opening the customer queue…</p></div> : visible.length === 0 ? <div className="emptyState"><div>📋</div><h3>No requests here</h3><p>{filter === "all" ? "Customer requests will appear here as soon as they are submitted." : "Nothing matches this filter right now."}</p>{filter !== "all" && <button className="button buttonLight" onClick={() => setFilter("all")}>Show all requests</button>}</div> : <div className="requestList">{visible.map((item) => <button key={item.id} className={`requestRow ${selected === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}><div><strong>{item.name}</strong><span>{item.requestType}</span></div><div><strong>{item.date || "Flexible"}</strong><span>{item.status}</span></div></button>)}</div>}</div><div className="adminPanel detailPanel">{current ? <><div className="panelHeading"><div><span className="kicker">Request details</span><h2>{current.name}</h2></div><select disabled={busyAction === `status:${current.id}`} value={current.status} onChange={(event) => void changeStatus(current.id, event.target.value as BookingRequestRecord["status"])}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div><dl className="detailList"><div><dt>Request</dt><dd>{current.requestType}</dd></div><div><dt>Date / time</dt><dd>{current.date || "Flexible"} · {current.startTime || "Flexible"}</dd></div><div><dt>Details</dt><dd>{current.details}</dd></div><div><dt>Notes</dt><dd>{current.notes || "No additional notes."}</dd></div><div><dt>Phone</dt><dd><a href={`tel:${current.phone}`}>{current.phone}</a></dd></div><div><dt>Email</dt><dd>{current.email || "Not provided"}</dd></div></dl><div className="actions"><a className="button buttonPrimary" href={`https://wa.me/${current.phone.replace(/\D/g, "")}`}>WhatsApp</a><a className="button buttonLight" href={`tel:${current.phone}`}>Call</a></div></> : <div className="emptyState"><div>👈</div><h3>Select a request</h3><p>Open a request to see the full customer brief and move it through the workflow.</p></div>}</div></section>}
    {tab === "offerings" && <section className="adminContent"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">What we offer</span><h2>Offerings</h2><p>Keep the food, wash and braai catalogue ready for customers.</p></div><button className="button buttonPrimary" disabled={Boolean(busyAction)} onClick={() => startOffering()}>+ Add offering</button></div>{loading ? <div className="emptyState"><div>⏳</div><h3>Loading offerings</h3><p>Opening the catalogue…</p></div> : <div className="equipmentAdminGrid">{offerings.map((item) => { const busy = busyAction === `offering:${item.id}` || busyAction === `delete:${item.id}`; return <article key={item.id}><div><strong>{item.name}</strong><span>{item.category} · {item.detail}</span></div><b>{item.price || "Ask us"}</b><span>{item.active ? "Live" : "Hidden"}</span><div className="actions"><button className="button buttonLight" disabled={busy || Boolean(busyAction)} onClick={() => void toggleOffering(item)}>{busy ? "Saving…" : item.active ? "Hide" : "Show"}</button><button className="button buttonLight" disabled={Boolean(busyAction)} onClick={() => startOffering(item)}>Edit</button><button className="button buttonLight" disabled={busy || Boolean(busyAction)} onClick={() => void removeOffering(item.id)}>Delete</button></div></article>; })}</div>}{!loading && offerings.length === 0 && <div className="emptyState"><div>🍖</div><h3>No offerings yet</h3><p>Add the real menu, wash packages and braai options as the business defines them.</p></div>}</div>{draft && <div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Catalogue</span><h2>{offerings.some((item) => item.id === draft.id) ? "Edit offering" : "Add offering"}</h2></div><button className="button buttonLight" disabled={Boolean(busyAction)} onClick={() => setDraft(null)}>Cancel</button></div><form className="adminForm" onSubmit={(event) => { event.preventDefault(); void saveOffering(); }}><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label><label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as OfferingRecord["category"] })}><option>Food</option><option>Car Wash</option><option>Braai</option><option>Other</option></select></label><label>Description<input value={draft.detail} onChange={(event) => setDraft({ ...draft, detail: event.target.value })} required /></label><label>Price / starting price<input value={draft.price ?? ""} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label><label><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Visible to customers</label><button className="button buttonPrimary" type="submit" disabled={Boolean(busyAction)}>{busyAction ? "Saving…" : "Save offering"}</button></form></div>}</section>}
    {tab === "specials" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Live promotions</span><h2>Specials</h2></div><span>{loading ? "Loading…" : `${specials.filter((item) => item.active).length} active`}</span></div>{loading ? <div className="emptyState"><div>⏳</div><h3>Loading specials</h3><p>Opening promotions…</p></div> : specials.length === 0 ? <div className="emptyState"><div>🔥</div><h3>No specials yet</h3><p>Add a real offer when there is something worth putting in front of customers.</p></div> : <div className="specialList">{specials.map((item) => { const busy = busyAction === `special:${item.id}`; return <article key={item.id}><div><strong>{item.title}</strong><p>{item.detail}</p></div><div className="actions"><button className="button buttonLight" disabled={busy || Boolean(busyAction)} onClick={() => void toggleSpecial(item)}>{busy ? "Saving…" : item.active ? "Active" : "Hidden"}</button><button className="button buttonLight" disabled={Boolean(busyAction)} onClick={() => setSpecialDraft(item)}>Edit</button></div></article>; })}</div>}</div><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Create</span><h2>{specialDraft ? "Edit special" : "Add a special"}</h2></div></div><form className="adminForm" onSubmit={(event) => { event.preventDefault(); void saveSpecial(); }}><label>Title<input value={specialDraft?.title ?? ""} onChange={(event) => setSpecialDraft((current) => ({ id: current?.id ?? crypto.randomUUID(), title: event.target.value, detail: current?.detail ?? "", active: current?.active ?? true }))} placeholder="e.g. Saturday Braai Special" required /></label><label>Detail<textarea value={specialDraft?.detail ?? ""} onChange={(event) => setSpecialDraft((current) => ({ id: current?.id ?? crypto.randomUUID(), title: current?.title ?? "", detail: event.target.value, active: current?.active ?? true }))} required /></label><label>Offer wording<input value={specialDraft?.offer ?? ""} onChange={(event) => setSpecialDraft((current) => ({ id: current?.id ?? crypto.randomUUID(), title: current?.title ?? "", detail: current?.detail ?? "", active: current?.active ?? true, offer: event.target.value }))} /></label><button className="button buttonPrimary" type="submit" disabled={Boolean(busyAction)}>{busyAction ? "Saving…" : "Save special"}</button>{specialDraft && <button className="button buttonLight" type="button" disabled={Boolean(busyAction)} onClick={() => setSpecialDraft(null)}>Clear</button>}</form></div></section>}
  </div></main>;
}

export default function AdminPage() { return <AdminGate><AdminDashboard /></AdminGate>; }
