import React,{useEffect,useRef} from 'react';
import './hero-sketch.css';

// Aligned gold-sketch and true-colour photo layers. Desktop pointer-only reveal.
export function HeroSketchReveal(){
  const root=useRef(null);
  useEffect(()=>{
    const el=root.current;
    const hero=el?.closest('.hero');
    if(!hero)return;
    const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(!fine.matches||reduced.matches)return;
    let raf=0,xx=-999,yy=-999;
    const update=()=>{raf=0;el.style.setProperty('--reveal-x',`${xx}px`);el.style.setProperty('--reveal-y',`${yy}px`)};
    const move=e=>{
      const r=el.getBoundingClientRect();xx=e.clientX-r.left;yy=e.clientY-r.top;
      el.classList.add('is-active');if(!raf)raf=requestAnimationFrame(update);
    };
    const leave=()=>el.classList.remove('is-active');
    hero.addEventListener('pointermove',move,{passive:true});
    hero.addEventListener('pointerleave',leave);
    return()=>{hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);if(raf)cancelAnimationFrame(raf)};
  },[]);
  return <div className="marina-sketch" ref={root} aria-hidden="true"><div className="marina-sketch__base"/><div className="marina-sketch__colour"/><div className="marina-sketch__shade"/></div>;
}
