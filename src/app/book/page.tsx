import type { Metadata } from "next";
import { Suspense } from "react";
import BookForm from "./book-form";

export const metadata: Metadata = {
  title: "Make a Booking Request",
  description: "Send THE MEATING PLACE a request for food, car wash, braai, catering or a private event.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <Suspense fallback={<main className="bookPage"><div className="formWrap"><div className="formCard">Loading booking form…</div></div></main>}>
      <BookForm />
    </Suspense>
  );
}
