'use client';

import './whatsapp.css';
import { ArrowDown, ArrowRight, Check, Globe2, Instagram, Mail, Play, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { ApplyButton } from '@/components/ApplyButton';
import { PlayerCarousel } from '@/components/PlayerCarousel';
import { SiteHeader } from '@/components/SiteHeader';
import { VideoCard } from '@/components/VideoCard';

const heroImage = 'https://images.pexels.com/photos/4122451/pexels-photo-4122451.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const ballImage = 'https://images.pexels.com/photos/12616082/pexels-photo-12616082.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const whatsappMessage = encodeURIComponent("Hello UK & Scandinavia Football Trials Team! ⚽\nI'm interested in your football trial opportunities. Please guide me on how to get started.");
const whatsappUrl = `https://wa.me/18255894437?text=${whatsappMessage}`;

const countries = [
  { name: 'United Kingdom', short: 'Premier League & EFL clubs', flag: '🇬🇧', image: 'https://images.pexels.com/photos/4122451/pexels-photo-4122451.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Norway', short: 'Top division & academy clubs', flag: '🇳🇴', image: 'https://images.pexels.com/photos/17955725/pexels-photo-17955725.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Sweden', short: 'Allsvenskan & youth academies', flag: '🇸🇪', image: 'https://images.pexels.com/photos/17955141/pexels-photo-17955141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Denmark', short: 'Superliga & development clubs', flag: '🇩🇰', image: 'https://images.pexels.com/photos/33827014/pexels-photo-33827014.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

const players = [
  { name: 'GABRIEL', description: 'Young winger involved in a trial opportunity with Aveley FC.', image: 'https://i.ibb.co/8DHHZS76/HERE-WE-LAND-IMMEDIATE-YD8-TRIALS-FOR-PREMIER-LEAGUE-ACADEMY-AT-16-YEARS-OLD-U16-winger-Mus.jpg' },
  { name: 'THEO MARKAS', description: 'A football journey associated with scouting interest involving Bristol City and Bristol Rovers.', image: 'https://i.ibb.co/VYrk4bNJ/success-story-adjin-600x415-1.jpg' },
  { name: 'LEWIS CLARKE-LITTLE', description: 'A journey involving Dagenham & Redbridge and an opportunity associated with Ajax.', image: 'https://i.ibb.co/bMWGb4B7/file-000000002e108210808f0585cf0dcc0e.jpg' },
  { name: "CEADACH O'NEILL", description: 'A young-player spotlight from our wider football community.', image: 'https://i.ibb.co/nsFB2t7d/Young-Gun-Ceadach-O-Neill-Our-Young-Gun-series-spotlights-academy-players-at-Sobha-Realty-Tr.jpg' },
  { name: 'IBRAHIM & HEZE', description: "A story describing two young talents and their reported connection to Chelsea's under-23 setup.", image: 'https://i.ibb.co/3yQCN47S/THE-FUTURE-IS-BLUE-Ibrahim-Rabbajb-Heze-Grimwade-Two-young-talents-Two-exci.webp' },
  { name: 'KENNET EICHHORN', description: 'A story of earlier trials, persistence, and a reported opportunity with Hertha BSC.', image: 'https://i.ibb.co/fYQs54FY/Screenshot-20261008-190613-Chrome.jpg' },
  { name: 'VASILIJE KOSTOV', description: 'Partizan, Red Star Belgrade, and reported interest from clubs across Europe.', image: 'https://i.ibb.co/NnYzTd41/Screenshot-20261008-190720-Chrome.jpg' },
  { name: 'AYONI SANTOS', description: 'A football journey describing Braga, an academy pathway, and Sparta Rotterdam.', image: 'https://i.ibb.co/m5qtCB6s/Screenshot-20261008-190326-Chrome.jpg' },
  { name: 'CALEB YIRENKYI', description: 'A story describing a connection to Coventry City.', image: 'https://i.ibb.co/60yJN6HC/Screenshot-20261008-191618-Chrome.jpg' },
  { name: 'NATHAN DE CAT', description: 'A young player associated with Anderlecht and reported interest from other clubs.', image: 'https://i.ibb.co/tp8D3fSB/Screenshot-20261008-191502-Chrome.jpg' },
];

const faqs = [
  ['Who can apply?', 'Ambitious players can apply from any country. Age, eligibility, availability, and selection requirements vary by opportunity.'],
  ['Which countries do you cover?', 'Our focus is the United Kingdom, Norway, Sweden, and Denmark. Relevant opportunities depend on availability and fit.'],
  ['Does registration guarantee a football trial?', 'No. Registration does not guarantee a trial, club selection, contract, or employment. Each club makes its own decisions.'],
  ['What is the registration fee?', 'Continue to secure checkout to view the registration fee after your application is saved.'],
  ['What happens after payment?', 'Payment is verified before a registration code and next-step guidance are issued. Pending payments are not treated as complete.'],
  ['Do I need a football highlight video?', 'A highlight video is optional, but it can help provide useful context about your playing profile.'],
  ['Can international players apply?', 'Yes. International players are welcome to apply, subject to opportunity requirements and their own travel or eligibility responsibilities.'],
  ['Can players under 18 apply?', 'Yes, with appropriate parent or guardian contact details and consent collected during registration.'],
  ['How do I contact the team?', 'Use the WhatsApp contact option in the contact section for general enquiries. Paid-registration handoffs are available only after verified payment.'],
  ['How is personal information handled?', 'Information is used to process applications, review opportunities, communicate with applicants, and support the registration workflow. See our Privacy Policy for details.'],
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,4,5,.98) 0%, rgba(3,4,5,.72) 45%, rgba(3,4,5,.25) 100%), url(${heroImage})` }}>
        <div className="hero-inner section-shell">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Your talent. A bigger stage.</div>
            <h1>UK &amp; SCANDINAVIA<br /><span>FOOTBALLTRIALS.COM</span></h1>
            <p className="hero-lead">Connecting talented players to football trial opportunities and relevant pathways in the UK and Scandinavia.</p>
            <div className="hero-highlights"><span><Globe2 /> International applications</span><span><Trophy /> Opportunity discovery</span><span><ShieldCheck /> Professional guidance</span></div>
            <div className="hero-actions"><ApplyButton /><a className="watch-link" href="#story-video"><Play size={15} fill="currentColor" /> Watch our story</a></div>
          </div>
          <div className="hero-aside"><span>01</span><div /><small>From talent<br />to opportunity</small></div>
        </div>
        <a href="#story-video" className="scroll-cue" aria-label="Scroll to our story"><ArrowDown size={18} /></a>
      </section>

      <section className="section-shell story-section" id="story-video">

        <div className="journey-column">
          <a className="whatsapp-story-link" href={whatsappUrl} target="_blank" rel="noreferrer">
            <span className="whatsapp-icon"><WhatsAppIcon /></span>
            <span>Ask us on WhatsApp</span>
          </a>
          <div className="journey-panel">
            <div className="journey-play-icon"><Play size={32} fill="currentColor" /></div>
            <h2>OUR JOURNEY.<br /><em>YOUR NEXT CHAPTER.</em></h2>
            <p>Discover the opportunities waiting for ambitious footballers.</p>
            <a className="journey-cta" href="#opportunities">Explore Football Opportunities <ArrowRight size={15} /></a>
          </div>
        </div>
        <div className="story-copy" id="about"><div className="section-kicker">About us</div><h2>WE OPEN DOORS FOR <em>TALENTED FOOTBALLERS</em></h2><p>UK &amp; Scandinavia FootballTrials.com helps ambitious footballers discover relevant trial opportunities and pathways across the UK, Norway, Sweden, and Denmark.</p><div className="feature-list"><span><Trophy /> Player development</span><span><Users /> Trial preparation</span><span><Sparkles /> Opportunity discovery</span><span><Globe2 /> International applications</span></div><ApplyButton label="Learn more about us" variant="outline" /></div>
      </section>

      <section className="country-strip"><div className="section-shell country-strip-inner">{countries.map(country => <a className="country-pill" href={`/register?destination=${encodeURIComponent(country.name)}`} key={country.name}><span className="country-flag">{country.flag}</span><span><b>{country.name}</b><small>{country.short}</small></span><ArrowRight size={15} /></a>)}</div></section>

      <section className="opportunities section-shell" id="opportunities"><div className="section-heading-row"><div><div className="section-kicker">Explore football opportunities</div><h2>CURRENT &amp; UPCOMING <em>PATHWAYS</em></h2></div><a className="text-link" href="#opportunities">View all pathways <ArrowRight size={16} /></a></div><p className="section-intro">Explore destinations where relevant football opportunities may be available. Availability, eligibility, and club decisions always vary.</p><div className="country-grid">{countries.map(country => <Link className="country-card" key={country.name} href={`/register?destination=${encodeURIComponent(country.name)}`} style={{ backgroundImage: `linear-gradient(0deg, rgba(3,4,5,.98), rgba(3,4,5,.05)), url(${country.image})` }}><div className="country-card-content"><span className="country-flag large">{country.flag}</span><h3>{country.name}</h3><p>{country.short}</p><span className="country-card-cta">Explore destination <ArrowRight size={15} /></span></div></Link>)}</div></section>

      <section className="full-bleed-cta" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,4,5,.92), rgba(3,4,5,.45)), url(${ballImage})` }}><div className="section-shell cta-inner"><div><div className="section-kicker">Take the first step</div><h2>READY TO SHOWCASE<br /><em>YOUR TALENT?</em></h2><p>Start your application and tell us where you want your football journey to go next.</p><ApplyButton label="Apply for trials now" /></div><div className="cta-stat"><strong>01</strong><span>Your talent.<br />A bigger stage.</span></div></div></section>

      <section className="stories section-shell" id="stories"><div className="section-kicker">Player story</div><h2>PLAYER STORIES &amp; <em>FOOTBALL JOURNEYS</em></h2><p className="section-intro">Explore real-world football journeys and the opportunities associated with each player story.</p><PlayerCarousel players={players} /></section>

      <section className="testimonials section-shell" id="testimonials"><div className="section-kicker">Player testimonials</div><h2>REAL JOURNEYS.<br /><em>NEW OPPORTUNITIES.</em></h2><p className="section-intro">Watch the supplied player stories and hear the journeys in their own words.</p><div className="videos-grid"><VideoCard title="South Sudan to Denmark" id="lrhrmnC1pH0" /><VideoCard title="Durban to Dubai" id="-HYztHLsD2Q" /><VideoCard title="Ghana to Turkey" id="IHJgaZ-_tlc" /><VideoCard title="South Africa to Spain" id="qyu1RDK2gkM" /><VideoCard title="Two South African players to Spain" id="ShY4LDk2kJ4" /></div><ApplyButton label="Start your own journey" /></section>

      <section className="how-it-works section-shell" id="how-it-works"><div className="section-kicker">The process</div><h2>HOW IT <em>WORKS</em></h2><div className="steps-grid">{[['01','Complete your application','Tell us about your football profile and preferred destinations.'],['02','Complete registration payment','Proceed to the official Selar checkout to view the registration fee.'],['03','Application and payment review','Your application is saved first, and payment is verified securely.'],['04','Receive next-step guidance','Verified applicants receive their registration code and guidance.']].map(([number,title,body]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div><p className="notice"><Check size={16} /> Payment does not guarantee a trial, club acceptance, contract, or professional employment.</p></section>

      <section className="faq-section section-shell" id="faq"><div className="section-heading-row"><div><div className="section-kicker">Questions, answered</div><h2>FREQUENTLY ASKED <em>QUESTIONS</em></h2></div></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="contact-section" id="contact"><div className="section-shell contact-inner"><div><div className="section-kicker">Start a conversation</div><h2>YOUR DREAM<br /><em>STARTS HERE.</em></h2><p>Have a general question about the football pathways we cover? Reach out to the team on WhatsApp.</p></div><div className="contact-actions"><a className="contact-card" href={whatsappUrl} target="_blank" rel="noreferrer"><span className="contact-whatsapp-icon"><WhatsAppIcon /></span><div><small>General enquiries</small><strong>Chat with us on WhatsApp</strong></div><ArrowUpRightIcon /></a><ApplyButton label="Begin registration" /></div></div></section>

      <footer className="footer"><div className="section-shell footer-grid"><div><Link href="/" className="brand"><span className="brand-ball">◉</span><span><b>UK &amp; SCANDINAVIA</b><strong>FOOTBALLTRIALS.COM</strong></span></Link><p>Your talent. A bigger stage. Connecting ambitious players to relevant football pathways.</p></div><div><h3>Explore</h3><a href="#about">About</a><a href="#opportunities">Football trials</a><a href="#stories">Player stories</a><a href="#how-it-works">How it works</a></div><div><h3>Contact</h3><a href="#faq">FAQ</a><a href="#contact">WhatsApp enquiries</a><a href="mailto:enquiries@example.com"><Mail size={14} /> Email placeholder</a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a></div><div><h3>Ready?</h3><p>Take the first step towards a bigger stage.</p><ApplyButton label="Apply for trials" /></div></div><div className="section-shell footer-bottom"><span>© 2026 UK &amp; Scandinavia FootballTrials.com</span><span><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms &amp; conditions</Link></span></div></footer>
      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Ask us on WhatsApp" title="Ask us on WhatsApp"><WhatsAppIcon /><span>WhatsApp</span></a>
    </main>
  );
}

function ArrowUpRightIcon() { return <ArrowRight size={18} />; }

function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3.2A12.7 12.7 0 0 0 5.1 22.4L3.3 28.8l6.6-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.3a10.5 10.5 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.5 10.5 0 1 1 16 26.5Zm5.8-7.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.3-.7.1a8.6 8.6 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.2-.5-.2-.5c-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.5.7.3 1.3.5 1
