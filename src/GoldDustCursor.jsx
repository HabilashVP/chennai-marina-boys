import React,{useEffect,useRef} from 'react';

// Lightweight, pointer-following gold brush with drifting dust, rendered to
// a single canvas. No new dependencies, observers or audio permissions.
export function GoldDustCursor(){
 const canvasRef=useRef(null);
 useEffect(()=>{
  const fine=window.matchMedia('(pointer: fine)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!fine.matches||reduced.matches||!canvasRef.current)return;
  const canvas=canvasRef.current,ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;
  let width=0,height=0,dpr=1,frame=0,last=performance.now();
  let visible=false,x=-100,y=-100,px=-100,py=-100,particles=[];
  const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,2);width=window.innerWidth;height=window.innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0)};
  const rand=(a,b)=>a+Math.random()*(b-a);
  const move=e=>{
   if(!visible){px=e.clientX;py=e.clientY}visible=true;
   x=e.clientX;y=e.clientY;
   const dx=x-px,dy=y-py,dist=Math.hypot(dx,dy);
   const count=Math.min(7,Math.floor(dist/5));
   for(let i=0;i<count&&particles.length<170;i++){
    const t=Math.random();particles.push({x:px+dx*t+rand(-8,8),y:py+dy*t+rand(-8,8),vx:rand(-1.8,1.8)-dx*.012,vy:rand(-1.6,.8)-dy*.01,r:rand(.55,2.5),life:rand(23,55),max:55,h:rand(38,53)});
   }
   px=x;py=y;
  };
  const enter=()=>{visible=true};const leave=()=>{visible=false};
  const paint=(now)=>{
   frame=requestAnimationFrame(paint);
   if(now-last<16)return;last=now;
   ctx.clearRect(0,0,width,height);
   particles=particles.filter(p=>p.life>0);
   for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy-=.013;p.vx*=.986;p.life--;ctx.beginPath();ctx.fillStyle=`hsla(${p.h},95%,70%,${Math.max(0,p.life/p.max)*.8})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}
   if(!visible)return;
   // Soft paint daub, warm bristles and a short diagonal brush stroke.
   const glow=ctx.createRadialGradient(x,y,0,x,y,24);glow.addColorStop(0,'rgba(255,218,123,.32)');glow.addColorStop(1,'rgba(255,200,70,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,24,0,Math.PI*2);ctx.fill();
   ctx.save();ctx.translate(x,y);ctx.rotate(-.45);ctx.lineCap='round';
   for(let i=0;i<5;i++){ctx.beginPath();ctx.strokeStyle=`rgba(255,${188+i*10},${67+i*18},${.92-i*.12})`;ctx.lineWidth=2.3-i*.28;ctx.moveTo(-7,-4+i*2);ctx.quadraticCurveTo(-1,-6+i*2,8,5+i*.9);ctx.stroke()}
   ctx.restore();
  };
  resize();document.body.classList.add('v7-custom-pointer');
  window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);document.addEventListener('pointerenter',enter);
  frame=requestAnimationFrame(paint);
  const mediaChange=()=>{if(!fine.matches||reduced.matches){canvas.style.display='none';document.body.classList.remove('v7-custom-pointer')}else{canvas.style.display='';document.body.classList.add('v7-custom-pointer')}};
  fine.addEventListener('change',mediaChange);reduced.addEventListener('change',mediaChange);
  return()=>{cancelAnimationFrame(frame);document.body.classList.remove('v7-custom-pointer');window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);document.removeEventListener('pointerenter',enter);fine.removeEventListener('change',mediaChange);reduced.removeEventListener('change',mediaChange)};
 },[]);
 return <canvas ref={canvasRef} className="v7-gold-pointer" aria-hidden="true"/>;
}
