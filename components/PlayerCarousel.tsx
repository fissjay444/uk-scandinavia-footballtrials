'use client';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type PlayerStory = { name: string; description: string; image: string };

type PlayerCarouselProps = { players: PlayerStory[] };

export function PlayerCarousel({ players }: PlayerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused || players.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % players.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, players.length]);

  function move(direction: number) {
    setActiveIndex((current) => (current + direction + players.length) % players.length);
  }

  return (
    <div className="player-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; setPaused(true); }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX ?? null; if (touchStart.current !== null && end !== null && Math.abs(end - touchStart.current) > 45) move(end < touchStart.current ? 1 : -1); touchStart.current = null; }}>
      <div className="player-carousel-toolbar"><span>{String(activeIndex + 1).padStart(2, '0')} / {String(players.length).padStart(2, '0')}</span><div><button type="button" aria-label="Previous player story" onClick={() => move(-1)}><ChevronLeft size={18} /></button><button type="button" aria-label={paused ? 'Resume player stories' : 'Pause player stories'} onClick={() => setPaused((current) => !current)}>{paused ? <Play size={15} /> : <Pause size={15} />}</button><button type="button" aria-label="Next player story" onClick={() => move(1)}><ChevronRight size={18} /></button></div></div>
      <div className="player-carousel-viewport"><div className="player-carousel-track" style={{ transform: `translateX(calc(-${activeIndex} * (var(--player-card-width) + var(--player-card-gap))))` }}>{players.map((player) => <article className="player-slide" key={player.name}><img src={player.image} alt={`${player.name} football story`} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><div className="player-slide-overlay"><span>Player story</span><h3>{player.name}</h3><p>{player.description}</p></div></article>)}</div></div>
      <div className="player-carousel-dots" aria-label="Player story navigation">{players.map((player, index) => <button key={player.name} type="button" className={index === activeIndex ? 'active' : ''} aria-label={`Show ${player.name}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => { setActiveIndex(index); setPaused(true); }} />)}</div>
    </div>
  );
}
