# THE MEATING PLACE — Agent Operating Contract

## Product
THE MEATING PLACE — CAR WASH & BRAAI is a real customer-facing business product, not a demo or QA application.

Brand:
- THE MEATING PLACE
- CAR WASH & BRAAI
- GOOD FOOD, GOOD MOOD.
- LET'S MEAT & EAT.

The product should help the business turn website visitors into organized customer requests while giving the owner/team a practical operational surface for managing those requests.

The website must remain relevant to the actual business. Do not add generic SaaS features, invented services, fabricated promotions, fake testimonials, fake availability, or technology-led features that do not help the business sell, serve, or operate.

## Roles
- Product owner / final reviewer: user
- Technical navigator + implementation: ChatGPT through repository tooling
- GitHub is the source of truth
- No Codex dependency for this project

## Workflow
START → BUILD → VERIFY → CHECKPOINT → CONTINUE/RECOVER.

Golden rule: **Unexpected result = STOP → inspect reality → then act.**

Do not blindly patch production. Inspect the current repository, Firebase project, deployed state, and relevant business workflow before changing code.

## Business relevance rule
Every new feature, page, piece of copy, or data model must help at least one of these:
1. Explain what THE MEATING PLACE actually offers.
2. Let customers request a real service: car wash, food/braai, catering/group service, private event, or another confirmed business service.
3. Help the owner/team receive, understand, follow up on, or manage a request.
4. Present real current offers, services, media, or operating information.
5. Reduce repetitive manual work without pretending an action happened when it did not.

If it does none of these, it is probably out of scope.

## Public customer experience
The public website is conversion-first. It should clearly communicate the real THE MEATING PLACE brand, services, current real offers, customer-facing media, booking/request CTA, and direct contact options.

The booking flow is a **request**, not an instant confirmed booking. Customers must not be required to create a Firebase account merely to submit a request.

Customer-facing copy must use business language, not internal terms such as Firebase, Firestore, QA, seed data, auth state, development mode, or browser storage.

## Booking workflow
Customer → structured request form → Firestore `bookingRequests` → owner/team review → follow-up → operational status.

Current request categories include Food, Car Wash, Braai, Catering / Group, Private Event, and Other.

Collect only information genuinely useful for handling the request. Optional fields should not unnecessarily block submission.

A successful request must produce an honest acknowledgement and usable request reference. Never claim a booking is confirmed unless the business has actually confirmed it.

If Firebase fails, show a truthful failure state. Never silently discard a request or pretend it was received.

## Owner/admin operations
`/admin` is the real THE MEATING PLACE Operations surface.

It should support the actual workflow:
- incoming booking/customer requests
- complete request details at a glance
- requests needing attention
- customer contact details/actions
- request status management
- current offerings/services
- specials/promotions
- homepage/customer-facing media where supported
- later: upcoming events, catering/group work, operational scheduling, customer history, and reporting where useful

Do not build an abstract CRM or ERP. Keep admin functionality tied to how THE MEATING PLACE actually operates.

Baseline request statuses may be: New → Contacted → Confirmed → Completed / Cancelled.

Do not mark a request confirmed merely because a customer submitted it.

## Firebase
The project uses the **Meating Place Firebase project**:

`meating-place-34321`

Never use Avram, Translend, AdminHub, or another project's Firebase credentials, identifiers, rules, or data here.

The repository `.firebaserc` targets `meating-place-34321`.

Browser Firebase configuration is environment-driven through `NEXT_PUBLIC_FIREBASE_*` variables. Never hard-code secrets or commit `.env.local`.

## Firestore collections
Current production-relevant collections include:
- `admins`
- `bookingRequests`
- `offerings`
- `specials`
- `homeMedia`

These are shared business data. Do not create duplicate browser-only sources of truth for owner-managed data.

## Firestore authorization
Customer booking creation is intentionally public because customers do not need Firebase Auth to request a booking.

Intended rule boundary:
- `bookingRequests`: public `create`; private read/update/delete for authorized admins
- `admins`: role records provisioned outside the client application
- `offerings`: public read; admin-managed writes
- `specials`: public read when active/published; admin-managed writes
- `homeMedia`: public read when active/published; admin-managed writes
- private operational/customer data: authorized admin access only

Admin authorization uses Firebase Authentication plus an `admins/{uid}` Firestore document.

The owner admin document uses the authenticated Firebase Auth UID as its document ID and contains `role: "owner"`. Staff may use `role: "staff"`. Never add self-service admin signup.

## Current Firebase admin setup
The Meating Place Firebase project currently has the owner admin document with `role: "owner"`.

This is Firebase-side configuration, not application code. Do not add code to recreate it.

The Firestore rules have been placed in the correct **Meating Place** Firebase project. An earlier permission-denied investigation was caused by rules being edited in a different Firebase project. Always verify the active project ID before changing Firebase rules or data.

## Security requirements
- Customers may create booking requests without signing in.
- Customers must not read, update, or delete booking requests.
- Customers must not write admin role records.
- Customers must not write offerings, specials, or homepage media.
- Admin/staff access requires Firebase Authentication plus a matching `admins/{uid}` role record.
- Never expose private customer/admin data publicly.
- Never weaken Firestore rules merely to make a UI error disappear.
- Test allowed and denied paths before declaring security work complete.

## Data integrity
Historical requests must remain understandable even if offerings, prices, or promotions later change.

When appropriate, store snapshots of customer-facing service/offer information used at request time rather than relying only on mutable current data.

Do not fabricate prices, discounts, capacity, availability, opening hours, event packages, testimonials, or guarantees.

## Content relevance
Represent the real business rather than generic restaurant/car-wash assumptions.

Before adding or changing services, prices, specials, business claims, testimonials, photos/videos, opening hours, contact details, event capabilities, or booking requirements, use information supplied by the business/project as the source of truth. If something is unknown, leave it configurable or ask for the real value rather than inventing one.

The homepage should remain conversion-first. Do not replace useful business messaging with excessive technical explanation or generic template content.

## Media
Customer-facing images/videos should use Firebase Storage when managed through the application, with metadata in Firestore. Do not store large media blobs directly in Firestore. Admin media controls must use the same authenticated admin authorization model.

## PWA
Maintain a truthful installable/offline experience where supported. Never tell a customer or owner that a booking, upload, notification, payment, or other remote action completed when it has not actually synchronized or been confirmed.

Firebase Storage uploads require connectivity unless a real supported mechanism exists; never fake offline uploads.

## Analytics
The project uses Vercel Analytics and Speed Insights. Analytics should measure real product usage and must not be claimed as live until the deployed production integration is verified.

Prefer useful business questions: are visitors reaching booking, which request categories are used, are requests successfully submitted, and are people returning?

## Current technical state
- Next.js 15.5.15
- React 19
- Firebase client + Admin SDK dependencies
- Firestore shared booking data store
- Vercel deployment platform
- Firebase project: `meating-place-34321`
- Production target: `meating-place.vercel.app`

The previous customer booking `permission-denied` was traced to Firestore rules being edited in the wrong Firebase project. The correct Meating Place project now has the intended rules, and the owner admin document is provisioned correctly.

Do not add an unnecessary authentication dependency to customer booking. The intended architecture is public booking creation with authenticated private administration.

## CI / build discipline
Quality checks should include:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

If a build fails because Firebase environment variables are absent from CI, fix the environment/configuration path rather than hard-coding credentials into source code.

Never commit Firebase secrets or `.env.local`.

## Scope discipline
Do not add unrelated fleet/logistics features, payroll, generic ERP/accounting systems, fake payment integrations, fake WhatsApp/SMS/email delivery, unnecessary customer account registration, unrelated AI features, fabricated business claims, or technology features merely because they are possible.

Future customer history, event management, invoicing, payment tracking, loyalty, referrals, notifications, and reporting are acceptable only when they clearly support the actual Meating Place workflow and are backed by real data/integrations.

## Repository boundaries
Other projects may be used as technical reference only where genuinely useful. Do not modify another repository while working here.

Do not import another project's Firebase IDs, credentials, domain terminology, customer data, or business assumptions.

No Avram, Translend, AdminHub, or unrelated project terminology may remain in active Meating Place UI, metadata, routes, navigation, or customer-facing error messages.

## Final review standard
Before calling a feature complete, verify:
1. It is relevant to THE MEATING PLACE's actual business.
2. The public customer experience is understandable without technical knowledge.
3. The owner/admin workflow is practical.
4. Firebase uses the intended project and authorization boundary.
5. Errors are truthful.
6. No fabricated business data was introduced.
7. TypeScript, lint, and build checks are addressed where applicable.
8. The deployed result matches the intended production workflow.

The goal is not to build the most complicated system. The goal is to build a useful digital operating surface that helps THE MEATING PLACE get customers, capture complete requests, and run the business with less repetitive manual work.
