import React from 'react';
import {ArrowUpRight,ArrowLeft} from 'lucide-react';
import {CricClubsScores} from './CricClubsScores';
import './scores-page.css';
const RESULTS='https://cricclubs.com/TNPLNZ/teamResults.do?teamId=84&league=12&clubId=23202';
const MATCHES='https://cricclubs.com/TNPLNZ/listMatches.do?clubId=23202';
export function ScoresPage(){return <main id="scores" className="marina-scores-page"><div className="marina-scores-top"><span>TNPL NZ / SEASON 7 / TEAM 84</span><h1>THE <em>SCOREBOARD.</em></h1><p>Official scores are recorded on CricClubs. This website only relays published results when a supported feed and match ID are available.</p><a href="#home" className="marina-scores-back"><ArrowLeft size={16}/> BACK TO HOME</a></div><CricClubsScores/><div className="marina-scores-links"><a href={RESULTS} target="_blank" rel="noopener noreferrer">TEAM RESULTS <ArrowUpRight size={17}/></a><a href={MATCHES} target="_blank" rel="noopener noreferrer">ALL TNPL NZ MATCHES <ArrowUpRight size={17}/></a></div></main>}
