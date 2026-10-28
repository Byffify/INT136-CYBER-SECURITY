import {useEffect} from 'react';
import {motion} from 'motion/react';
declare global {interface Window {STAGE:{init:()=>void;set:(silk:string,cubes:string)=>void;destroy:()=>void}}}
const chapters=[['01','กรณีศึกษา'],['01','ขอบเขต'],['01','ชั้นการป้องกัน'],['01','วิธีทดลอง'],['02','Web Protection'],['02','Real-time'],['02','Contextual'],['03','Quick Scan'],['03','Full Scan'],['03','ทรัพยากร'],['04','วิเคราะห์ผล'],['04','ข้อเสนอแนะ'],['04','บทสรุป'],['05','สมาชิก'],['A1','หลักฐานเพิ่มเติม'],['A2','อ้างอิง']];
const presets=[['cover','cover'],['right','tr'],['low','top'],['left','bl'],['right','tr'],['left','br'],['deep','corners'],['low','tr'],['left','bl'],['deep','top'],['center','corners'],['left','bl'],['hot','corners'],['deep','none'],['deep','none'],['deep','none']];
export function SummitWorld({page}:{page:number}){
 useEffect(()=>{window.STAGE.init();return()=>window.STAGE.destroy()},[]);
 useEffect(()=>{const [silk,cubes]=presets[page];window.STAGE.set(silk,page===0?cubes:'none')},[page]);
 return <div id="stagebg" data-cover={page===0} aria-hidden="true"><svg width="0" height="0" style={{position:'absolute'}}><defs><filter id="reference-red" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0 .20 .40 .60 .80 1 1 1"/><feFuncG type="table" tableValues="0 .005 .01 .02 .04 .08 .30 1"/><feFuncB type="table" tableValues="0 .008 .015 .03 .05 .10 .35 1"/></feComponentTransfer></filter></defs></svg><div className="vig"/></div>;
}
export function ChapterBadge({page}:{page:number}){const [number,title]=chapters[page];return <div className="chapter-badge"><b>{number}</b><span>{title}</span></div>}
export function DeckProgress({page}:{page:number}){return <><div className="stage-signature"><b className="logo">B</b><strong>Bitdefender</strong><i/><span>Total Security</span></div><div className="stage-counter"><b>{page<14?String(page+1).padStart(2,'0'):`A${page-13}`}</b> / {page<14?'14':'02'}</div><div className="deck-progress" aria-hidden="true"><motion.i animate={{width:`${page<14?(page+1)/14*100:100}%`}} transition={{duration:.5}}/></div></>}
