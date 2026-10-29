import React,{useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowDown,ArrowUpRight,CalendarDays} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const A='/assets/';
const prefersReduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function StadiumEntrance(){
  const ref=useRef(null);
  useEffect(()=>{
    if(prefersReduced()||!ref.current)return;
    const context=gsap.context(()=>{
      gsap.fromTo('.v7-tunnel-ring',{scale:1.25,opacity:.13},{scale:.55,opacity:.9,ease:'none',stagger:.07,scrollTrigger:{trigger:ref.current,start:'top bottom',end:'bottom top',scrub:1.2}});
      gsap.fromTo('.v7-stadium-copy > *',{y:70,opacity:0},{y:0,opacity:1,stagger:.11,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 70%'}});
      gsap.to('.v7-spotlight',{rotate:22,ease:'none',scrollTrigger:{trigger:ref.current,start:'top bottom',end:'bottom top',scrub:true}});
    },ref);
    return()=>context.revert();
  },[]);
  return <section ref={ref} className="v7-stadium" aria-label="The Kings cinematic stadium entrance">
    <div className="v7-stadium-haze" aria-hidden="true"/>
    <div className="v7-spotlight v7-spotlight-left" aria-hidden="true"/>
    <div className="v7-spotlight v7-spotlight-right" aria-hidden="true"/>
    <div className="v7-tunnel" aria-hidden="true">{[0,1,2,3,4,5].map(i=><span key={i} className="v7-tunnel-ring" style={{'--i':i}}/>)}</div>
    <div className="v7-stadium-copy">
      <span className="v7-kicker">ENTER THE KINGDOM <b>✦</b> CHENNAI MARINA BOYS</span>
      <h2>THIS IS <em>OUR</em><br/>BATTLEGROUND.</h2>
      <p>From Chennai's spirit to Auckland's cricket fields. Every season, every contest, one brotherhood.</p>
      <a href="#legacy" className="v7-inline-link">EXPLORE OUR LEGACY <ArrowUpRight size={18}/></a>
    </div>
    <div className="v7-stage-floor" aria-hidden="true"/>
    <span className="v7-section-index">THE KINGS / CHAPTER ONE</span>
  </section>;
}

export function LegacyHonours(){
  const ref=useRef(null);
  useEffect(()=>{
    if(prefersReduced()||!ref.current)return;
    const ctx=gsap.context(()=>{
      gsap.from('.v7-honours-year',{y:110,opacity:0,rotateX:-22,duration:1.1,stagger:.16,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 72%'}});
      gsap.from('.v7-honours-image',{clipPath:'inset(0 100% 0 0)',duration:1.2,stagger:.17,ease:'power3.inOut',scrollTrigger:{trigger:ref.current,start:'top 65%'}});
    },ref);return()=>ctx.revert();
  },[]);
  return <section className="v7-honours" ref={ref} aria-label="Two-time champions 2021 and 2024">
    <header className="v7-honours-heading"><div><span className="v7-kicker">THE LEGACY CONTINUES</span><h2>TWICE CROWNED.<br/><em>FOREVER KINGS.</em></h2></div><p>2021 AND 2024<br/>TWO TITLES. ONE CREST.</p></header>
    <div className="v7-honours-grid">
      <article className="v7-honours-card"><div className="v7-honours-image"><img loading="lazy" src={A+'champ2021.webp'} alt="Marina Boys 2021 championship team wearing blue"/></div><div className="v7-honours-meta"><span className="v7-honours-year">2021</span><div><strong>FIRST CROWN</strong><span>BLUE. BELIEF. BROTHERHOOD.</span></div></div></article>
      <article className="v7-honours-card"><div className="v7-honours-image"><img loading="lazy" src={A+'champ2024.webp'} alt="Marina Boys 2024 championship team wearing yellow"/></div><div className="v7-honours-meta"><span className="v7-honours-year">2024</span><div><strong>SECOND CROWN</strong><span>GOLD. GRIT. GREATNESS.</span></div></div></article>
    </div>
  </section>;
}

const pad=x=>String(x).padStart(2,'0');
const NZ_TIMEZONE='Pacific/Auckland';
// Scheduled fixtures use Auckland local time. Offset is obtained from Intl,
// including NZ daylight-saving rules, instead of hard-coding GMT+13.
function fixtureInstant(fixture){
  const match=fixture.date.match(/^(?:\w+ )?(\d{1,2}) (\w+) (\d{4})$/);
  const clock=fixture.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if(!match||!clock)return NaN;
  const months={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const month=months[match[2].slice(0,3)];if(month===undefined)return NaN;
  const hour=(Number(clock[1])%12)+(clock[3].toUpperCase()==='PM'?12:0);
  const utc=Date.UTC(Number(match[3]),month,Number(match[1]),hour,Number(clock[2]));
  const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:NZ_TIMEZONE,timeZoneName:'shortOffset',year:'numeric'});
  // Iterate once to correctly resolve offsets close to daylight-saving changes.
  let point=utc;
  for(let i=0;i<2;i++){
    const tz=fmt.formatToParts(new Date(point)).find(x=>x.type==='timeZoneName')?.value||'GMT+0';
    const m=tz.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    const offset=m?(m[1]==='-'?-1:1)*(Number(m[2])*60+Number(m[3]||0)):0;
    point=utc-offset*60000;
  }
  return point;
}
function remaining(timestamp,now){
  const delta=Math.max(0,timestamp-now);
  return {days:Math.floor(delta/86400000),hours:Math.floor(delta%86400000/3600000),minutes:Math.floor(delta%3600000/60000),seconds:Math.floor(delta%60000/1000)};
}
export function MatchdayCountdown({fixtures=[]}){
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[]);
  const next=fixtures.map(data=>({data,time:fixtureInstant(data)})).filter(x=>Number.isFinite(x.time)&&x.time>now).sort((a,b)=>a.time-b.time)[0];
  const countdown=next?remaining(next.time,now):null;
  return <section className="v7-matchday" aria-label="Upcoming match countdown">
    <div className="v7-matchday-light" aria-hidden="true"/>
    <span className="v7-kicker"><CalendarDays size={16}/> NEXT UP / MATCHDAY</span>
    {next?<><h2>THE NEXT <em>BATTLE.</em></h2><div className="v7-versus"><img src={A+'crest.webp'} alt="Chennai Marina Boys"/><div><span>CHENNAI MARINA BOYS</span><strong>VS</strong><span>{next.data.opponent}</span></div></div><div className="v7-countdown" role="timer" aria-label="Time until next match">{[['DAYS',countdown.days],['HOURS',countdown.hours],['MINUTES',countdown.minutes],['SECONDS',countdown.seconds]].map(([label,value])=><div key={label}><strong>{pad(value)}</strong><span>{label}</span></div>)}</div><p>{next.data.date} · {next.data.time} · {next.data.ground}</p></>:<><h2>THE NEXT <em>CHAPTER.</em></h2><p>No future matches are currently listed. Update the fixtures array when the tournament publishes new games.</p><a href="#schedule" className="v7-inline-link">VIEW THE MATCH SCHEDULE <ArrowUpRight size={18}/></a></>}
    <div className="v7-cricclubs"><span className="v7-kicker">OFFICIAL MATCH SCORING</span><p>Follow TNPL NZ fixtures, scorecards and match updates on CricClubs.</p><a className="v7-scores-link" href="https://cricclubs.com/TNPLNZ" target="_blank" rel="noopener noreferrer">OPEN TNPL NZ SCORES <ArrowUpRight size={18}/></a><small>Scores open on CricClubs. Automatic on-site scores are not enabled yet.</small></div>
  </section>;
}

export function CinematicReel(){
 const pictures=[['champ2021.webp','THE FIRST CROWN'],['aaron-captain.webp','THE CAPTAIN'],['champ2024.webp','THE GOLDEN ERA'],['chak.webp','THE BROTHERHOOD'],['baldev-singh-kahlon.webp','THE NEXT CHAPTER']];
 const ref=useRef(null);
 useEffect(()=>{
  if(prefersReduced()||!ref.current)return;
  const ctx=gsap.context(()=>{
   gsap.fromTo('.v7-reel-frame',{y:70,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:ref.current,start:'top 75%'}});
  },ref);return()=>ctx.revert();
 },[]);
 return <section className="v7-reel" ref={ref} aria-label="Cinematic Marina Boys gallery"><div className="v7-reel-heading"><span className="v7-kicker">BEYOND THE BOUNDARY</span><h2>EVERY FRAME.<br/><em>A STORY.</em></h2></div><div className="v7-reel-strip" tabIndex={0} aria-label="Scroll horizontally through gallery">{pictures.map(([file,caption],i)=><figure className="v7-reel-frame" key={file}><img loading="lazy" src={A+file} alt={caption}/><figcaption><small>{pad(i+1)} / 05</small>{caption}</figcaption></figure>)}</div><span className="v7-reel-hint">SCROLL SIDEWAYS TO EXPLORE <ArrowDown size={14}/></span></section>;
}
