import {AnimatePresence,motion,useReducedMotion} from 'motion/react';

type Shot={id:number;width:number;height:number;x:number;y:number;zoom:number;label:string};
const shots:Record<number,Shot[]>={
 4:[
  {id:7,width:1161,height:730,x:.5,y:.5,zoom:1,label:'หน้าบล็อกเว็บไซต์ที่บันทึกไว้'},
  {id:7,width:1161,height:730,x:.49,y:.54,zoom:1.6,label:'ข้อความ Dangerous page blocked'},
  {id:6,width:1016,height:666,x:.48,y:.44,zoom:1.35,label:'หน้าต่างยืนยันเมื่อเลือกข้ามการบล็อก'},
 ],
 5:[
  {id:5,width:1218,height:775,x:.5,y:.5,zoom:1,label:'ภาพเหตุการณ์ที่บันทึกไว้'},
  {id:5,width:1218,height:775,x:.82,y:.87,zoom:2.7,label:'ซูมข้อความแจ้งเตือนของ Bitdefender'},
  {id:4,width:765,height:504,x:.5,y:.5,zoom:1,label:'Timeline ระบุ Real-time protection security layer'},
 ],
 6:[
  {id:3,width:759,height:496,x:.5,y:.5,zoom:1,label:'ผล Contextual Scan ก่อนเลือกจัดการ'},
  {id:3,width:759,height:496,x:.49,y:.29,zoom:1.5,label:'Resolved 0 · Unresolved 2'},
  {id:3,width:759,height:496,x:.68,y:.36,zoom:1.45,label:'ยังรอการเลือก Choose action'},
 ],
 7:[
  {id:15,width:1791,height:724,x:.5,y:.5,zoom:1,label:'ภาพระหว่าง Quick Scan ณ เวลา 00:10'},
  {id:2,width:1759,height:655,x:.74,y:.49,zoom:1.8,label:'ผล Quick Scan · 7,740 รายการ · 04:45'},
  {id:2,width:1759,height:655,x:.78,y:.51,zoom:1.9,label:'Resolved 0 · Unresolved 0 ในรอบนี้'},
 ],
 8:[
  {id:14,width:1524,height:608,x:.5,y:.5,zoom:1,label:'ภาพระหว่าง Full Scan ณ เวลา 30:08'},
  {id:12,width:765,height:507,x:.5,y:.5,zoom:1,label:'ผล Full Scan · 7,267,087 รายการ'},
  {id:11,width:962,height:640,x:.5,y:.64,zoom:1.35,label:'Log: ตำแหน่งใน Recycle Bin และ Deleted'},
  {id:12,width:765,height:507,x:.64,y:.69,zoom:1.7,label:'Password protected 358'},
 ],
};
export function ProtectionTheatre({page,beat,open}:{page:number;beat:number;open:(id:number)=>void}){
 const reduced=useReducedMotion();
 const shot=shots[page][beat];
 const frame={width:880,height:370};
 const fit=Math.min(frame.width/shot.width,frame.height/shot.height);
 const width=shot.width*fit,height=shot.height*fit;
 return <div className="protection-theatre">
  <div className="theatre-mode"><span>ภาพหน้าจอจริงจากการทดลอง</span><span className="theatre-state">{shot.zoom>1?'ซูมรายละเอียด':'ภาพรวม'}</span></div>
  <div className="evidence-scene"><div className="evidence-main"><button className="real-canvas" style={{height:frame.height}} aria-label={`เปิดภาพต้นฉบับ: ${shot.label}`} onClick={event=>{event.stopPropagation();open(shot.id)}}>
   <AnimatePresence mode="sync" initial={false}>
    <motion.img key={shot.id} src={`/evidence/${shot.id}.png`} alt={shot.label} style={{width,height,transformOrigin:"50% 50%"}} initial={{opacity:0,x:-width*.5,y:-height*.5,scale:1}} animate={{opacity:1,x:-width*.5+(.5-shot.x)*width*shot.zoom,y:-height*.5+(.5-shot.y)*height*shot.zoom,scale:shot.zoom}} exit={{opacity:0}} transition={{duration:reduced?0:.95,ease:[.16,1,.3,1]}}/>
   </AnimatePresence>
   <span className="real-expand">↗ เปิดภาพเต็ม</span>
  </button></div></div>
  <div className="real-caption"><span className="focus-dot"/><AnimatePresence mode="wait" initial={false}><motion.p key={shot.label} initial={{opacity:0,y:reduced?0:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reduced?0:.18}}>{shot.label}</motion.p></AnimatePresence></div>

 </div>;
}
