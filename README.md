# UK & Scandinavia FootballTrials.com

A premium, mobile-first football trials and player registration website.

## Included

- Cinematic black-and-metallic-gold landing page inspired by the supplied reference.
- Responsive navigation, hero video, country pathways, player stories, testimonials, FAQ, contact section, privacy, and terms pages.
- Shared application buttons that all lead to `/register` with optional destination preselection.
- Registration form with minor-player safeguards, accessible required fields, preserved values on failure, and a server-side save before checkout.
- Selar checkout link: `https://selar.com/04sw231555` (continue to secure checkout to view the registration fee).
- Private Supabase `registrations` and `payment_events` tables with RLS enabled and no public database access.

## Environment

Copy `.env.example` to your deployment environment and provide the server database values. The service-role key must remain server-only. Configure the authenticated Selar webhook secret when the official Selar webhook is available.

## Database

The registration and payment-event schema is applied through the Supabase migration `create_registrations_and_payment_events`. The browser cannot read or update applications directly; the server route saves new applications and keeps payment state pending until a genuine provider verification handler is configured.

## Payment verification

The registration form saves first, then sends the player to Selar. Opening checkout or returning to the website never marks an application as paid. To complete the workflow, connect Selar's authenticated webhook or officially supported verification method to a server-only handler that:

1. Authenticates the provider signature.
2. Deduplicates `provider_event_id` in `payment_events`.
3. Matches the payment to `payment_reference` or application reference.
4. Updates only the matching registration to `payment_status = 'paid'`.
5. Generates a unique year-based registration code once.

Until this is configured, applicants remain in the safe pending state and must not be shown the paid WhatsApp handoff.

## Deploy

This is a Next.js app and can be deployed to a Vercel-compatible host. Add the environment values in the host dashboard, run the production build, and confirm the deployed `/register` flow saves an application before opening Selar.

## Quality checks

Use the included production build and TypeScript check before deployment. For media, the supplied player image URLs and YouTube embeds are referenced directly and use lazy loading where appropriate.
