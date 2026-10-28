import React,{useState,useEffect} from 'react';
import{createRoot}from'react-dom/client';
import{motion,AnimatePresence,MotionConfig}from'motion/react';
import slides from './content.json';
import './style.css';
import './composition.css';
import {lastBeat} from './story';
import {Compositions} from './Compositions';
import {SummitWorld,ChapterBadge,DeckProgress} from './SummitWorld';
function App(){
const [page,setPage]=useState(0),[beat,setBeat]=useState(0),[panel,setPanel]=useState(''),[seconds,setSeconds]=useState(0),[running,run]=useState(false);
const [selectedImage,setSelectedImage]=useState(1);
const openImage=(id:number)=>{setSelectedImage(id);setPanel('image')};
useEffect(()=>{const fit=()=>document.documentElement.style.setProperty('--stage-scale',String(Math.min(window.innerWidth/1600,(window.innerHeight-64)/900)));fit();window.addEventListener('resize',fit);return()=>window.removeEventListener('resize',fit)},[]);
const s=slides[page];const next=()=>{if(beat<lastBeat[page])setBeat(beat+1);else if(page<13){setPage(page+1);setBeat(0)}};
useEffect(()=>{const f=(e:KeyboardEvent)=>{if(e.key==='Escape')setPanel('');if(panel)return;if(e.target instanceof HTMLElement&&e.target.closest('button,input,textarea,select'))return;if(['ArrowRight',' '].includes(e.key)){e.preventDefault();next()}if(e.key==='ArrowLeft'){if(beat>0)setBeat(beat-1);else if(page>0){setPage(page-1);setBeat(lastBeat[page-1])}}if(e.key==='r'){setBeat(0)}if(e.key==='n')setPanel('notes');if(e.key==='m')setPanel('menu');if(e.key==='f')document.documentElement.requestFullscreen();};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[page,beat,panel]);
useEffect(()=>{if(!running)return;const id=setInterval(()=>setSeconds(v=>v+1),1000);return()=>clearInterval(id)},[running]);
return <MotionConfig reducedMotion="user"><main><div className="stage"><SummitWorld page={page}/><header><ChapterBadge page={page}/></header><AnimatePresence mode="wait"><motion.article data-page={page} data-beat={beat} key={page} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.35}} onClick={next}><Compositions page={page} beat={beat} open={openImage}/><div className="story-cue" role="status" aria-label={`จังหวะ ${beat+1} จาก ${lastBeat[page]+1} · เหลือ ${lastBeat[page]-beat} กดในหน้านี้`}><div className="story-dots">{Array.from({length:lastBeat[page]+1},(_,i)=><i key={i} className={i===beat?'current':i<beat?'past':''}/>)}</div></div></motion.article></AnimatePresence><DeckProgress page={page}/></div><nav><button onClick={()=>run(!running)}>{running?'Ⅱ':'▶'} {Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}</button><button onClick={()=>{run(false);setSeconds(0)}}>↺</button><span>← ย้อนจังหวะ · Space เล่าต่อ · R เริ่มหน้านี้ใหม่</span><button onClick={()=>setPanel('notes')}>บทพูด N</button><button onClick={()=>document.documentElement.requestFullscreen()}>เต็มจอ F</button><button onClick={()=>setPanel('menu')}>{page<14?page+1:`A${page-13}`} / 14 + 2</button></nav>{panel&&<div className="overlay" onClick={()=>setPanel('')}><div className={'dialog '+(panel==='image'?'large':'')} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setPanel('')}>ปิด ×</button>{panel==='image'?<><img src={`/evidence/${selectedImage}.png`} alt="ภาพหลักฐานต้นฉบับ"/><p className="image-caption">{s.evidence.find(item=>item.id===selectedImage)?.label} · ภาพต้นฉบับจากผู้จัดทำ</p></>:panel==='notes'?<><h2>{s.title}</h2><p>{page<14?`งบเวลา ${s.time} วินาที · เนื้อหาทดลอง 11:30 + แนะนำผู้จัดทำ 0:15 + เผื่อ 0:15 · ต้องซ้อมเพื่อยืนยันเวลา`:'ภาคผนวก · ไม่รวมในบทพูดหลัก'}</p><div className="notes">{s.notes}</div><section className="source-details"><h3>หลักฐานและที่มา</h3><p>{s.sourceDocument}<br/>{s.source}</p><p className="refs-path">{s.sourcePath}</p><ul>{s.evidence.map(item=><li key={item.id}><button onClick={()=>openImage(item.id)}>{item.label} · เปิดภาพ</button><small>public{item.path}<br/>ต้นฉบับ: {item.originalFilename}</small></li>)}</ul><a href="/evidence/registry.json" target="_blank" rel="noreferrer">ทะเบียนรูปตาม brief และไฟล์แนบล่าสุด</a></section></>:<><h2>หน้าหลัก / ภาคผนวก</h2>{slides.map((x,i)=><button className="menu-item" key={i} onClick={()=>{setPage(i);setBeat(0);setPanel('');if(document.activeElement instanceof HTMLElement)document.activeElement.blur()}}>{i<14?i+1:`A${i-13}`} · {x.title}</button>)}</>}</div></div>}</main></MotionConfig>}
createRoot(document.getElementById('root')!).render(<App/>);


import './story.css';

import './appendix.css';

import './theatre.css';

import './summit.css';
import './reference.css';
