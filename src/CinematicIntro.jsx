import React,{useEffect,useRef,useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import './cinematic-intro.css';

const SEEN_KEY='cmb-marina-intro-v72-count';
const MAX_SHOWS=2;
const onScores=()=>window.location.hash.replace(/^#/, '').split('/')[0]==='scores';

export function CinematicIntro(){
  const [visible,setVisible]=useState(()=>{
    if(onScores() || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
    try{return Number(window.localStorage.getItem(SEEN_KEY)||0)<MAX_SHOWS}catch{return false}
  });
  const completed=useRef(false);
  useEffect(()=>{
    if(!visible)return;
    try{window.localStorage.setItem(SEEN_KEY,String(Math.min(MAX_SHOWS,Number(window.localStorage.getItem(SEEN_KEY)||0)+1)))}catch{}
    // Never play the intro while someone is navigating to the scores tab.
    const cancelForScores=()=>{if(onScores())setVisible(false)};
    window.addEventListener('hashchange',cancelForScores);
    const timer=window.setTimeout(()=>{completed.current=true;setVisible(false)},5250);
    return()=>{window.clearTimeout(timer);window.removeEventListener('hashchange',cancelForScores)};
  },[visible]);
  useEffect(()=>{document.body.classList.toggle('marina-intro-playing',visible);return()=>document.body.classList.remove('marina-intro-playing')},[visible]);
  return <AnimatePresence>{visible&&<motion.div className="marina-intro" aria-label="Enter the Marina cinematic opening" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.38}}>
    <div className="marina-intro-stadium" aria-hidden="true">
      <div className="marina-lights">{Array.from({length:6},(_,i)=><span key={i} className="marina-light" style={{'--index':i}}><i/><b/></span>)}</div>
      <div className="marina-intro-ground"/>
    </div>
    <div className="marina-intro-title"><img src="/assets/crest.webp" alt="Chennai Marina Boys crest"/><span>THE KINGS · CHENNAI MARINA BOYS</span><h1>ENTER THE <em>MARINA.</em></h1><p>THE KINGS OF CHENNAI · UNITED IN AUCKLAND</p></div>
    <button className="marina-intro-skip" type="button" onClick={()=>setVisible(false)}>SKIP INTRO <span aria-hidden="true">↗</span></button>
  </motion.div>}</AnimatePresence>;
}
