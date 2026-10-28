import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,useReducedMotion} from 'framer-motion';
import {ArrowUpRight,ArrowDown,Menu,X,ChevronRight,CalendarDays,MapPin,Trophy,ShieldCheck,Search,SlidersHorizontal,ArrowLeft,ArrowRight,Info} from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {HeroWorld,HistoryWorld} from './World';
import './style.css';

gsap.registerPlugin(ScrollTrigger);
const A='/assets/';

const players=[
  {name:'Aaron Samuel', role:'Captain · Owner Icon', photo:'aaron-captain.webp', number:'C'},
  {name:'Arul Francis', role:'Bowler · Owner Icon', photo:'arul.webp', number:'01'},
  {name:'Chakravarthy Arunachalam', role:'Wicket Keeper · Vice Captain', photo:'chak.webp', number:'07'},
  {name:'Magil', role:'All Rounder', photo:'player-02.webp', number:'17'},
  {name:'Covash', role:'Player', photo:'player-03.webp', number:'24'},
  {name:'Tamil Selvan', role:'All Rounder', photo:'player-05.webp', number:'11'},
  {name:'Kishore', role:'Player', photo:'player-06.webp', number:'15'},
  {name:'Sri Krishna', role:'Tamil Icon', photo:'player-09.webp', number:'25'},
  {name:'Roy', role:'Tamil Icon', photo:'roy.webp', number:'12'},
  {name:'Sandy', role:'All Rounder', photo:'player-12.webp', number:'03'},
  {name:'Shylesh', role:'All Rounder', photo:'player-13.webp', number:'88'},
  {name:'Kriv Kadakia', role:'Non-Tamil Icon', photo:'player-14.webp', number:'11'},
  {name:'Ulaganathan Chinnadurai', role:'Tamil Icon', photo:'player-15.webp', number:'01'},
  {name:'Jarun', role:'Player', photo:'player-08.webp', number:'21'}
];

const fixtures=[
  {date:'Sun 1 Nov 2026', time:'9:30 AM', opponent:'Thiruchendur Thunderbolts', ground:'Keith Hay Park · A4'},
  {date:'Sun 1 Nov 2026', time:'2:30 PM', opponent:'Power Pandy', ground:'Keith Hay Park · 3A'},
  {date:'Sun 8 Nov 2026', time:'9:30 AM', opponent:'Nellai Raging Bulls', ground:'Keith Hay Park · 6A'},
  {date:'Sun 8 Nov 2026', time:'2:30 PM', opponent:'Covai Super Kings', ground:'Keith Hay Park · 5A'},
  {date:'Sun 15 Nov 2026', time:'9:30 AM', opponent:'Trichy Rockfort Cholas', ground:'Keith Hay Park · 6A'},
  {date:'Sun 15 Nov 2026', time:'2:30 PM', opponent:'Dindigul Dragons', ground:'Keith Hay Park · 7A'},
  {date:'Sun 22 Nov 2026', time:'9:30 AM', opponent:'Madurai Maveerarkal', ground:'Keith Hay Park · 7A'},
  {date:'Sun 22 Nov 2026', time:'2:30 PM', opponent:'Salem Defenders', ground:'Keith Hay Park · 4A'},
  {date:'Sun 29 Nov 2026', time:'9:30 AM', opponent:'Ooty Thalaivas', ground:'Keith Hay Park · 5A'}
];

function Crest({size=52,className=''}){return <img className={className} src={A+'crest.webp'} width={size} height={size} alt="Chennai Marina Boys crest"/>}

function useSmoothScroll(reduced){
  useEffect(()=>{
    if(reduced)return;
    const lenis=new Lenis({duration:1.14,smoothWheel:true,wheelMultiplier:.92});
    const tick=t=>lenis.raf(t*1000);
    gsap.ticker.add(tick);
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    return()=>{gsap.ticker.remove(tick);lenis.destroy()};
  },[reduced]);
}

function Header(){
  const [open,setOpen]=useState(false);
  const nav=[['HOME','#home'],['LEGACY','#legacy'],['SCHEDULE','#schedule'],['SQUAD','#squad'],['SHOWCASE','#showcase'],['PARTNERS','#partners']];
  return <header className="nav-header">
    <a className="nav-logo" href="#home"><Crest size={48}/><span>THE KINGS<small>CHENNAI MARINA BOYS</small></span></a>
    <nav className={open?'nav-links open':'nav-links'}>{nav.map(([label,href],i)=><a onClick={()=>setOpen(false)} key={href} href={href}><sup>{String(i+1).padStart(2,'0')}</sup>{label}</a>)}</nav>
    <button className="nav-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'}>{open?<X/>:<Menu/>}</button>
  </header>;
}

function IntroScreen(){
  const [on,setOn]=useState(!sessionStorage.getItem('cmb-v5-seen'));
  useEffect(()=>{
    const id=setTimeout(()=>{setOn(false);sessionStorage.setItem('cmb-v5-seen','1')},1800);
    return()=>clearTimeout(id);
  },[]);
  return <AnimatePresence>{on&&<motion.div className="preloader" exit={{clipPath:'inset(0 0 100% 0)'}} transition={{duration:.9,ease:[.76,0,.24,1]}}>
    <motion.img src={A+'crest.webp'} initial={{scale:.55,opacity:0,rotate:-10}} animate={{scale:1,opacity:1,rotate:0}} transition={{duration:.8}} alt="Marina Boys crest"/>
    <div>ENTER THE MARINA <b>✦</b></div>
    <motion.i initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1.25}}/>
  </motion.div>}</AnimatePresence>;
}

function ReadingProgress(){
  const ref=useRef();
  useEffect(()=>{
    const refresh=()=>{
      const h=document.documentElement;
      const max=h.scrollHeight-window.innerHeight;
      const p=max>0?h.scrollTop/max:0;
      if(ref.current)ref.current.style.transform=`scaleX(${Math.min(1,Math.max(0,p))})`;
    };
    window.addEventListener('scroll',refresh,{passive:true});
    window.addEventListener('resize',refresh);
    refresh();
    return()=>{window.removeEventListener('scroll',refresh);window.removeEventListener('resize',refresh)};
  },[]);
  return <div className="reading-progress" aria-hidden="true"><span ref={ref}/></div>;
}

function Hero({reduced}){
  const section=useRef();
  const progress=useRef(0);
  useEffect(()=>{
    if(!section.current)return;
    const trigger=ScrollTrigger.create({trigger:section.current,start:'top top',end:'bottom top',onUpdate:s=>progress.current=s.progress});
    return()=>trigger.kill();
  },[]);
  return <section className="hero" id="home" ref={section}>
    <div className="hero-noise"/>
    <div className="hero-grid"/>
    <div className="hero-3d">{!reduced?<HeroWorld progressRef={progress}/>:<Crest className="hero-fallback" size={420}/>}</div>
    <div className="hero-gradient"/>
    <div className="hero-content">
      <div className="hero-eyebrow"><i/> TNPL NZ · SEASON 7 <span>AKL / NZ</span></div>
      <div className="hero-headline"><span className="outlined">THE</span><strong>KINGS OF <em>THE MARINA.</em></strong></div>
      <p>A GRAND CINEMATIC HOME FOR CHENNAI MARINA BOYS — MODERN CRICKET, BROTHERHOOD, AND CHAMPIONSHIP AMBITION.</p>
      <div className="hero-actions">
        <a href="#schedule" className="action primary">VIEW SCHEDULE <ArrowUpRight size={18}/></a>
        <a href="#squad" className="action ghost">MEET THE SQUAD <ChevronRight size={18}/></a>
      </div>
    </div>
    <div className="hero-stats">
      <div><strong>2021</strong><span>Championship</span></div>
      <div><strong>2024</strong><span>Championship</span></div>
      <div><strong>2026</strong><span>Season 7 Squad</span></div>
    </div>
    <div className="hero-bottom"><span>SCROLL TO CONTROL THE EXPERIENCE</span><ArrowDown size={19}/><span>01 — 06</span></div>
  </section>;
}

function Marquee(){return <div className="marquee"><div>{Array.from({length:6},(_,i)=><span key={i}>THE KINGS <b>✦</b> CHENNAI MARINA BOYS <b>✦</b> TNPL-NZ SEASON 7 <b>✦</b> </span>)}</div></div>}

function Statement(){
  const root=useRef();
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.from('.statement .line',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:root.current,start:'top 72%'}});
      gsap.from('.statement-copy',{y:20,opacity:0,duration:.9,delay:.2,scrollTrigger:{trigger:root.current,start:'top 72%'}});
    },root);
    return()=>ctx.revert();
  },[]);
  return <section className="statement" ref={root}>
    <div className="tag">001 / THE DNA</div>
    <h2>
      <span className="line">FROM THE STREETS</span>
      <span className="line">OF <em>CHENNAI</em></span>
      <span className="line">TO THE FIELDS</span>
      <span className="line">OF <em>AUCKLAND.</em></span>
    </h2>
    <p className="statement-copy">ONE CREST. ONE BROTHERHOOD. ONE MODERN CRICKET IDENTITY.</p>
  </section>;
}

function Legacy({reduced}){
  const el=useRef();
  const progress=useRef(0);
  const [year,setYear]=useState(2021);
  useEffect(()=>{
    if(!el.current)return;
    const trigger=ScrollTrigger.create({trigger:el.current,start:'top top',end:'bottom bottom',onUpdate:s=>{progress.current=s.progress;setYear(s.progress>.5?2024:2021)}});
    return()=>trigger.kill();
  },[]);
  return <section className="history" id="legacy" ref={el}>
    <div className="history-stick">
      <div className="history-label"><span>002 / THE CHAMPIONSHIP YEARS</span><span>SCROLL TO TRANSFORM THE MEMORY ↘</span></div>
      <div className="history-stage">
        <div className="history-photo">{reduced?<img src={A+(year===2021?'champ2021.webp':'champ2024.webp')} alt={`${year} championship team`}/>:<HistoryWorld progressRef={progress}/>}</div>
        <div className="history-scrim"/>
        <div className="history-copy">
          <div className="tiny">FROM BLUE TO GOLD</div>
          <AnimatePresence mode="wait">
            <motion.div key={year} initial={{y:28,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-28,opacity:0}} transition={{duration:.35}}>
              <div className="history-year">{year}</div>
              <h2>{year===2021?'THE FIRST CROWN.':'THE GOLDEN ERA.'}</h2>
              <p>{year===2021?'The first championship established the identity. Blue jerseys. Big belief.':'The second title amplified the standard. Yellow kit. Same hunger. Bigger aura.'}</p>
            </motion.div>
          </AnimatePresence>
          <div className="year-track"><strong>2021</strong><div><span style={{width:year===2021?'8%':'100%'}}/></div><strong>2024</strong></div>
        </div>
      </div>
      <div className="history-prompt">THE STORY CONTINUES IN 2026 <ArrowDown size={18}/></div>
    </div>
  </section>;
}

function Schedule(){
  const [query,setQuery]=useState('');
  const [date,setDate]=useState('all');
  const dates=[...new Set(fixtures.map(x=>x.date))];
  const visible=fixtures.filter(x=>(date==='all'||x.date===date)&&`${x.opponent} ${x.ground} ${x.date}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="schedule-section" id="schedule">
    <div className="section-header compact"><div><div className="tag">003 / TNPL-NZ SEASON 7</div><h2>THE <em>SCHEDULE.</em></h2></div><p>Explore the fixture list by matchday or opponent. Dates and grounds are based on the uploaded schedule screenshot; confirm with the tournament before travelling.</p></div>
    <div className="fixture-toolbar">
      <label className="fixture-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find an opponent or ground" aria-label="Search fixtures"/></label>
      <label className="fixture-select"><SlidersHorizontal size={17}/><select value={date} onChange={e=>setDate(e.target.value)} aria-label="Filter matchday"><option value="all">All matchdays</option>{dates.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      <div className="fixture-count">{visible.length} / {fixtures.length} MATCHES</div>
    </div>
    <div className="schedule-grid">
      {visible.map((game,idx)=><article className="fixture-card reveal-card" key={`${game.date}-${game.opponent}`}>
        <div className="fixture-date"><span>{game.date.split(' ')[1]}</span><small>{game.date.replace(/^[A-Za-z]+\s/,'')}</small></div>
        <div className="fixture-main"><div className="fixture-meta"><CalendarDays size={16}/> TNPL-NZ Season 7</div><div className="fixture-teams"><Crest size={54}/><strong>Chennai Marina Boys</strong><b>VS</b><span>{game.opponent}</span></div><div className="fixture-info"><span><MapPin size={14}/>{game.ground}</span><span><CalendarDays size={14}/>{game.time}</span></div></div>
      </article>)}
      {!visible.length&&<div className="fixture-empty"><Search size={26}/><h3>NO MATCHES FOUND</h3><p>Try another opponent, ground or matchday.</p><button onClick={()=>{setQuery('');setDate('all')}}>CLEAR FILTERS</button></div>}
    </div>
  </section>;
}

function Squad(){
  const [selected,setSelected]=useState(null);
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const shown=players.filter(p=>p.name.toLowerCase().includes(query.trim().toLowerCase())&&(category==='all'||p.role.toLowerCase().includes(category)));
  useEffect(()=>{
    if(!selected)return;
    const key=e=>{if(e.key==='Escape')setSelected(null);if(e.key==='ArrowRight')setSelected(players[(players.indexOf(selected)+1)%players.length]);if(e.key==='ArrowLeft')setSelected(players[(players.indexOf(selected)+players.length-1)%players.length]);};
    window.addEventListener('keydown',key);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',key);document.body.style.overflow=old};
  },[selected]);
  return <section id="squad" className="squad-section">
    <div className="section-header"><div><div className="tag">004 / 2026 LINEUP</div><h2>MEET THE <em>SQUAD.</em></h2></div><p>Browse the player reveals, select a card for a full-screen profile, and move between teammates with the arrow keys.</p></div>
    <div className="squad-toolbar"><label className="fixture-search"><Search size={18}/><input aria-label="Search players" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search players"/></label><div className="role-filters">{[['all','All players'],['icon','Icons'],['all rounder','All rounders'],['bowler','Bowlers']].map(([v,label])=><button key={v} className={category===v?'active':''} onClick={()=>setCategory(v)}>{label}</button>)}</div></div>
    <div className="squad-grid">{shown.map((p,idx)=><button type="button" key={p.name} className="player-card reveal-card" onClick={()=>setSelected(p)} aria-label={`View ${p.name} profile`}><div className="player-image-wrap"><img src={A+p.photo} loading="lazy" alt={`${p.name} jersey presentation`}/><div className="player-badge">#{p.number}</div><div className="player-shine"/></div><div className="player-body"><div className="player-topline"><span>{String(players.indexOf(p)+1).padStart(2,'0')}</span><ArrowUpRight size={17}/></div><h3>{p.name}</h3><p>{p.role}</p><span className="player-view">VIEW PROFILE <ArrowUpRight size={14}/></span></div></button>)}</div>
    {!shown.length&&<p className="squad-empty">No matching players. Try a different search.</p>}
    <AnimatePresence>{selected&&<motion.div className="profile-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)} role="presentation"><motion.div className="profile-modal" role="dialog" aria-modal="true" aria-label={`${selected.name} player profile`} initial={{y:75,opacity:0,scale:.97}} animate={{y:0,opacity:1,scale:1}} exit={{y:45,opacity:0,scale:.98}} transition={{type:'spring',damping:29,stiffness:245}} onClick={e=>e.stopPropagation()}><div className="profile-photo"><img src={A+selected.photo} alt={`${selected.name} player presentation`}/></div><div className="profile-content"><button className="profile-close" onClick={()=>setSelected(null)} aria-label="Close player profile"><X/></button><span className="tag">CHENNAI MARINA BOYS / PLAYER PROFILE</span><span className="profile-number">{selected.number}</span><h2>{selected.name}</h2><p className="profile-role">{selected.role}</p><div className="profile-divider"/><p className="profile-note">A member of the Chennai Marina Boys squad. Additional verified career statistics and biography can be added when available.</p><div className="profile-navigation"><button onClick={()=>setSelected(players[(players.indexOf(selected)+players.length-1)%players.length])}><ArrowLeft/> PREVIOUS</button><button onClick={()=>setSelected(players[(players.indexOf(selected)+1)%players.length])}>NEXT <ArrowRight/></button></div></div></motion.div></motion.div>}</AnimatePresence>
  </section>;
}

function Showcase(){
  const images=['champ2021.webp','champ2024.webp','sug.webp','arul.webp','chak.webp','roy.webp','player-09.webp','player-15.webp'];
  return <section className="gallery-section" id="showcase">
    <div className="section-header compact invert">
      <div>
        <div className="tag">005 / BEHIND THE CREST</div>
        <h2>THE <em>SHOWCASE.</em></h2>
      </div>
      <p>Championship heritage, season visuals, and player reveal moments — all wrapped in a premium gallery treatment.</p>
    </div>
    <div className="gallery-grid">
      {images.map((file,i)=><figure key={file} className={i<2?'wide':''}>
        <img src={A+file} loading="lazy" alt={`Chennai Marina Boys showcase ${i+1}`}/>
        <figcaption><span>{String(i+1).padStart(2,'0')} / MARINA BOYS</span><ArrowUpRight size={17}/></figcaption>
      </figure>)}
    </div>
  </section>;
}

function Sponsors(){
  return <section className="sponsor-section" id="partners">
    <div className="section-header invert compact">
      <div>
        <div className="tag">006 / THE PEOPLE BEHIND US</div>
        <h2>POWERED BY <em>PARTNERS.</em></h2>
      </div>
      <p>Presented with a darker luxury aesthetic to keep the club brand and sponsor identities elegant and consistent.</p>
    </div>
    <div className="partner-grid">
      <div className="partner-card dark"><img src={A+'legendary.webp'} alt="Legendary Mortgages and Insurances"/><span>LEGENDARY MORTGAGES & INSURANCES</span></div>
      <div className="partner-card light"><img src={A+'sockmakers.webp'} alt="Sockmakers"/><span>SOCKMAKERS</span></div>
      <div className="partner-card dark sponsor-photo"><img src={A+'sug-sponsor.webp'} alt="SUG presenting the Chennai Marina Boys jersey"/><span>SUG · TEAM SPONSOR</span></div>
    </div>
  </section>;
}

function Footer(){
  return <footer className="footer">
    <div className="tag">THE STORY CONTINUES</div>
    <h2>LONG LIVE<br/><em>THE KINGS.</em></h2>
    <div className="footer-row"><Crest size={64}/><span>CHENNAI MARINA BOYS · TNPL-NZ SEASON 7</span><div className="footer-social"><a href="https://www.facebook.com/chennaimarinaboys" target="_blank" rel="noopener noreferrer" aria-label="Chennai Marina Boys on Facebook">FACEBOOK ↗</a><a href="https://www.instagram.com/chennaimarina_boys/" target="_blank" rel="noopener noreferrer" aria-label="Chennai Marina Boys on Instagram">INSTAGRAM ↗</a></div><a href="#home">BACK TO TOP ↑</a></div>
  </footer>;
}

function RevealManager(){
  useEffect(()=>{
    if(!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px 60px 0px'});
    const observed=document.querySelectorAll('.reveal-card,.gallery-grid figure,.partner-card');observed.forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[]);
  return null;
}

function App(){
  const reduced=useReducedMotion();
  useSmoothScroll(reduced);
  return <>
    <RevealManager/><ReadingProgress/>
    <IntroScreen/>
    <Header/>
    <main>
      <Hero reduced={reduced}/>
      <Marquee/>
      <Statement/>
      <Legacy reduced={reduced}/>
      <Schedule/>
      <Squad/>
      <Showcase/>
      <Sponsors/>
    </main>
    <Footer/>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
