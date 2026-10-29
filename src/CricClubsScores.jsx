import React,{useEffect,useState} from 'react';
import {ArrowUpRight,RefreshCw} from 'lucide-react';
import './cricclubs.css';
const CLUB=23202;
const TEAM=84;
const LEAGUE=12;
const TEAM_RESULTS=`https://cricclubs.com/TNPLNZ/teamResults.do?teamId=${TEAM}&league=${LEAGUE}&clubId=${CLUB}`;
const TEAM_SCHEDULE=`https://cricclubs.com/TNPLNZ/teamSchedule.do?teamId=${TEAM}&league=${LEAGUE}&clubId=${CLUB}`;
const SCORECARD=id=>`https://cricclubs.com/TNPLNZ/viewScorecard.do?matchId=${id}&clubId=${CLUB}`;
const asText=v=>v==null?'':String(v);
const score=(v,p)=>{const runs=v[`t${p}Total`],wkts=v[`t${p}Wickets`],overs=v[`t${p}Overs`];return {runs:runs==null?'—':`${runs}/${wkts??'0'}`,overs:overs==null?'':`${overs} overs`,name:asText(v[`t${p}Name`]||v[`t${p}TeamName`]||v[`team${p}Name`]||`TEAM ${p}`)};};
function parse(data,matchId){
 if(!data||typeof data!=='object'||!data.values||typeof data.values!=='object')throw Error('No CricClubs score data available');
 const v=data.values;
 const a=score(v,1), b=score(v,2);
 if(a.runs==='—'&&b.runs==='—')throw Error('Match scores not published');
 if(!v.t1Name&&!v.t2Name&&!v.t1TeamName&&!v.t2TeamName)throw Error('Team names not published');
 const ended=['1','true','yes'].includes(asText(v.isMatchEnded).toLowerCase());
 return {a,b,ended,matchId,summary:asText(v.matchResult||v.result||v.matchStatus||v.customTextValue)};
}
export function CricClubsScores(){
 const [config,setConfig]=useState(null);
 const [state,setState]=useState({status:'loading'});
 useEffect(()=>{let alive=true;fetch('/cricclubs-live.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Configuration unavailable');return r.json()}).then(c=>{if(alive)setConfig(c)}).catch(()=>{if(alive)setConfig({})});return()=>{alive=false}},[]);
 useEffect(()=>{
   if(!config)return;
   const matchId=Number(config.matchId);
   if(!Number.isSafeInteger(matchId)||matchId<1){setState({status:'unconfigured'});return;}
   let active=true;
   async function refresh(){
     const root=typeof config.proxyBase==='string'?config.proxyBase.trim().replace(/\/$/,''):'';
     const url=root?`${root}/score?clubId=${CLUB}&matchId=${matchId}`:`https://cricclubs.com/liveScoreOverlayData.do?clubId=${CLUB}&matchId=${matchId}`;
     try{const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('Feed is unavailable');
       const item=parse(await response.json(),matchId);
       if(active)setState({status:'ready',data:item,updated:new Date()});
     }catch(e){if(active)setState(old=>old.status==='ready'?{...old,stale:true}:{status:'unavailable'});}
   }
   refresh();const interval=setInterval(refresh,30000);
   return()=>{active=false;clearInterval(interval)};
 },[config]);
 return <section className="cc-live-score" aria-label="CricClubs official scores">
   <div className="cc-score-header"><div><span className="v7-kicker">CRICCLUBS / TNPL NZ</span><h3>THE LIVE <em>SCOREBOARD.</em></h3></div><span className="cc-feed-state"><RefreshCw size={13}/>{state.status==='ready'?(state.data.ended?'FINAL':state.stale?'LAST REPORTED':'SCORE UPDATE'):'OFFICIAL SCORES'}</span></div>
   {state.status==='ready'?<>
     <div className="cc-teams"><div><strong>{state.data.a.name}</strong><b>{state.data.a.runs}</b><small>{state.data.a.overs}</small></div><span className="cc-versus">VS</span><div><strong>{state.data.b.name}</strong><b>{state.data.b.runs}</b><small>{state.data.b.overs}</small></div></div>
     {state.data.summary&&<p className="cc-match-summary">{state.data.summary}</p>}
     <p className="cc-note">{state.data.ended?'Final score':state.stale?'Feed temporarily unavailable. Showing the last fetched score.':'CricClubs score feed · refreshes every 30 seconds'} · Last fetched {state.updated.toLocaleTimeString()}</p>
     <a href={SCORECARD(state.data.matchId)} target="_blank" rel="noopener noreferrer" className="v7-scores-link">OFFICIAL SCORECARD <ArrowUpRight size={17}/></a>
   </>:<div className="cc-placeholder"><p>{state.status==='unconfigured'?'The Season 7 score feed will appear once an official current match ID is available. No scores are entered on this site.':state.status==='loading'?'Checking official scoring feed…':'The official feed is currently unavailable. View scores directly on CricClubs.'}</p><a href={TEAM_RESULTS} target="_blank" rel="noopener noreferrer" className="v7-scores-link">CHENNAI MARINA BOYS RESULTS <ArrowUpRight size={17}/></a></div>}
   <p className="cc-disclaimer">Season 7 · Team ID 84 · League 12 · Club 23202. <a href={TEAM_SCHEDULE} target="_blank" rel="noopener noreferrer">Official team schedule ↗</a></p><p className="cc-disclaimer">Read-only display. All scores are entered and maintained on CricClubs, not on this website.</p>
 </section>;
}
