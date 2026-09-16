import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type OfferingRecord = {
  id: string;
  name: string;
  category: "Food" | "Car Wash" | "Braai" | "Other";
  detail: string;
  price?: string;
  active: boolean;
  imageUrl?: string;
};

export type SpecialRecord = {
  id: string;
  title: string;
  detail: string;
  active: boolean;
  offer?: string;
  startDate?: string;
  endDate?: string;
};

export type BookingRequestRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  requestType: string;
  date?: string;
  startTime?: string;
  details: string;
  notes: string;
  status: "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";
};

const offeringsCollection = collection(db, "offerings");
const specialCollection = collection(db, "specials");
const bookingCollection = collection(db, "bookingRequests");

export async function getOfferings(): Promise<OfferingRecord[]> {
  const snapshot = await getDocs(offeringsCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<OfferingRecord, "id">) }));
}

export async function saveOfferingRecord(item: OfferingRecord) {
  await setDoc(doc(db, "offerings", item.id), item);
}

export async function deleteOfferingRecord(id: string) {
  await deleteDoc(doc(db, "offerings", id));
}

export async function getSpecials(): Promise<SpecialRecord[]> {
  const snapshot = await getDocs(specialCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<SpecialRecord, "id">) }));
}

export async function saveSpecialRecord(item: SpecialRecord) {
  await setDoc(doc(db, "specials", item.id), item);
}

export async function deleteSpecialRecord(id: string) {
  await deleteDoc(doc(db, "specials", id));
}

export async function createBookingRequest(data: Omit<BookingRequestRecord, "id">) {
  const result = await addDoc(bookingCollection, data);
  return result.id;
}

export async function getBookingRequests(): Promise<BookingRequestRecord[]> {
  const snapshot = await getDocs(bookingCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BookingRequestRecord, "id">) }));
}

export async function updateBookingStatus(id: string, status: BookingRequestRecord["status"]) {
  await updateDoc(doc(db, "bookingRequests", id), { status });
}

export async function clearBookingRequests() {
  const snapshot = await getDocs(bookingCollection);
  for (const item of snapshot.docs) await deleteDoc(item.ref);
}
