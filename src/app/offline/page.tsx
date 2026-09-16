import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="bookPage">
      <nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />THE MEATING PLACE</Link></div></nav>
      <div className="formWrap"><div className="formCard"><div className="confirm"><div className="confirmIcon">📶</div><h1>You&apos;re offline</h1><p>THE MEATING PLACE is still available for pages already saved on this device.</p><p>Reconnect to send a new request or load the latest information.</p><div className="actions" style={{justifyContent:"center"}}><Link className="button buttonPrimary" href="/">Open Meating Place</Link><Link className="button buttonLight" href="/book">Open request</Link></div></div></div></div>
    </main>
  );
}
