'use client';

import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ApplyButton } from './ApplyButton';

const links = [
  ['About', '#about'],
  ['Football trials', '#opportunities'],
  ['Player stories', '#stories'],
  ['Testimonials', '#testimonials'],
  ['How it works', '#how-it-works'],
  ['FAQ', '#faq'],
  ['Contact', '#contact'],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="UK and Scandinavia Football Trials home" onClick={() => setOpen(false)}>
        <span className="brand-ball">◉</span>
        <span><b>UK &amp; SCANDINAVIA</b><strong>FOOTBALLTRIALS.COM</strong></span>
      </Link>
      <nav className={`desktop-nav ${open ? 'mobile-open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}{label === 'Football trials' && <ChevronDown size={13} />}</a>)}
        <ApplyButton label="Apply for trials" />
      </nav>
      <button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
