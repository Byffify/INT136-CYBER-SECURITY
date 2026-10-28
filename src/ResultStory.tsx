import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {ProtectionTheatre} from './ProtectionTheatre';
const scenes=[
 {title:'Web Protection',file:'secure.eicar.org / eicar.com',action:'เปิด URL ของไฟล์ทดสอบ',question:'ไฟล์จะเข้าถึงเครื่องได้ไหม?',outcome:'บล็อกก่อนเข้าถึงไฟล์',metric:'4 รูปแบบ',detail:'รายงานระบุผลครบ 4 รูปแบบ',caption:'Dangerous page blocked for your protection · eicar.com · eicar.com.txt · eicar_com.zip · eicarcom2.zip',limit:'ภาพแนบแสดงตัวอย่าง eicar.com และหน้าต่างยืนยันข้ามการบล็อก'},
 {title:'Real-time Protection',file:'eicar.com',action:'บันทึกและเข้าถึงไฟล์',question:'เมื่อไฟล์อยู่บนเครื่องแล้วล่ะ?',outcome:'ตรวจจับ → กักกัน',metric:'Quarantine',detail:'ข้อความแจ้งว่าย้าย eicar.com ไปกักกัน',caption:'Timeline ระบุ Real-time protection security layer',limit:'SmartScreen เป็นส่วนของ Windows · Alternative outcome ไม่ใช่ผลเสียที่เกิดจริง'},
 {title:'Contextual Scan',file:'eicar.com + eicarcom2.zip (ตามรายงาน)',action:'เลือกไฟล์และสั่งตรวจ',question:'ถ้าเราเลือกไฟล์มาตรวจเอง?',outcome:'ตรวจพบไฟล์ทดสอบ',metric:'2',detail:'Unresolved issues · ยังไม่ได้จัดการ',caption:'EICAR-Test-File (not a virus) · Resolved 0 (จัดการแล้ว 0)',limit:'ภาพนี้ยังรอผู้ใช้เลือกจัดการ · ผลหลังจัดการ 2/2 อ้างตามรายงาน'},
 {title:'Quick Scan',file:'Quick Scan',action:'สแกนตามขอบเขตที่โปรแกรมกำหนด',question:'การสแกนรอบนี้บอกอะไร?',outcome:'7,740 รายการที่สแกน',metric:'04:45',detail:'นาที : วินาที',caption:'ไม่พบรายการในรอบนี้',limit:'ผลนี้ไม่ยืนยันว่าทุกไฟล์ปลอดภัย และยังใช้จัดอันดับเทียบ Full Scan ไม่ได้'},
 {title:'Full System Scan',file:'Full System Scan',action:'ตรวจตามขอบเขต Full System Scan',question:'เมื่อสแกนในขอบเขตที่กว้างขึ้น?',outcome:'7,267,087 รายการที่สแกน',metric:'1:22:11',detail:'ชั่วโมง : นาที : วินาที',caption:'Resolved 2 (จัดการแล้ว) · Unresolved 0 (ยังไม่ได้จัดการ)',limit:'Password protected 358 คือรายการมีรหัสผ่านที่รายงานระบุว่าตรวจไม่ได้ ไม่ใช่จำนวนภัยคุกคาม'}
];
export function ResultStory({page,beat,open}:{page:number;beat:number;open:(id:number)=>void}){
 const data=scenes[page-4];const reduced=useReducedMotion();
 const headline=beat===0?data.question:page===4&&beat===2?'ผู้ใช้ยังเลือกข้ามคำเตือนได้':page===5&&beat===2?'Timeline ระบุชั้น Real-time':page===6&&beat===2?'ตรวจพบ ≠ จัดการแล้ว':page===7&&beat===2?'ไม่พบในรอบนี้':page===8&&beat===2?'พบ EICAR ใน Recycle Bin':page===8&&beat===3?'รายการที่ตรวจสอบไม่ได้':data.outcome;
 const metric=page===4&&beat===2?'ข้ามได้':page===5&&beat===2?'Real-time':page===8&&beat===2?'Deleted':page===8&&beat===3?'358':page===7&&beat===2?'0':data.metric;
 const unit=page===4&&beat===2?'เมื่อผู้ใช้เลือกยืนยัน':page===5&&beat===2?'Security layer ใน Timeline':page===8&&beat===2?'Action taken ใน Log':page===8&&beat===3?'Password protected':page===7&&beat===2?'รายการที่ตรวจพบ':data.detail;
 return <div className={`result-scene scene-${page}`}>
  <div className="finding-title"><AnimatePresence mode="wait" initial={false}><motion.h1 key={headline} initial={{opacity:0,y:reduced?0:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reduced?0:.35,ease:[.22,1,.36,1]}}>{headline}</motion.h1></AnimatePresence></div>
  <div className="finding-body"><ProtectionTheatre page={page} beat={beat} open={open}/><div className="finding-copy"><AnimatePresence mode="wait" initial={false}><motion.div key={beat} initial={{opacity:0,y:reduced?0:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reduced?0:.45,ease:[.22,1,.36,1]}}>
  {beat===0?<><h2>{data.action}</h2><p className="finding-file">{data.file}</p></>:<><strong className="finding-metric">{metric}</strong><p className="finding-unit">{unit}</p><p className="finding-detail">{page===4&&beat===2?'มีหน้าต่างเตือนยืนยันก่อนข้ามการบล็อก':page===5&&beat===2?'เหตุการณ์นี้ไม่ใช่การทดสอบ Advanced Threat Defense':page===7&&beat===2?'ผลเฉพาะขอบเขต Quick Scan รอบที่บันทึก':page===8&&beat===2?'พบใน Recycle Bin รวม eicarcom2.zip → eicar_com.zip → eicar.com':data.caption}</p></>}
  </motion.div></AnimatePresence></div></div>
  <div className="finding-boundary"><motion.p initial={false} animate={{opacity:beat>=2?1:0}} transition={{duration:reduced?0:.4}} aria-hidden={beat<2}><b>ขอบเขตการตีความ</b>{data.limit}</motion.p></div>
 </div>;
}
