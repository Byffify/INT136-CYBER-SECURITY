import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const slides=JSON.parse(await readFile('src/content.json','utf8'));
const registry=JSON.parse(await readFile('public/evidence/registry.json','utf8'));
assert.equal(slides.length,15);
assert.equal(slides.slice(0,13).reduce((sum,s)=>sum+s.time,0),690);
for(const slide of slides.slice(0,13)){
 for(const field of ['script','cue','limitation','transition','sourceDocument','sourcePath'])assert.ok(slide[field]?.length,`${slide.title}: ${field}`);
}
for(const item of registry)await readFile(`public${item.path}`);
await mkdir('tmp/brief-qa',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const results=[];
try{
 await page.goto(process.env.PITCH_URL||'http://127.0.0.1:5175/');
 await page.locator('nav button').last().waitFor();
 await page.waitForTimeout(600);
 const choose=async(index)=>{
  await page.locator('nav button').last().click();
  assert.equal(await page.locator('.menu-item').count(),15);
  await page.locator('.menu-item').nth(index).click();
  await page.waitForFunction(i=>document.querySelector('article')?.getAttribute('data-page')===String(i),index);
  await page.waitForTimeout(400);
 };
 const advance=async()=>{await page.keyboard.press('ArrowRight');await page.waitForTimeout(30)};
 const steps=[1,2,3,1,2,2,2,2,3,3,1,1,2,0,0];
 for(let i=0;i<15;i++){
  await choose(i);
  for(let j=0;j<steps[i];j++)await advance();
  await page.waitForTimeout(800);
  assert.equal(await page.locator('article h1').count(),1);
  assert.ok(await page.locator('article img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)));
  const text=await page.locator('article').innerText();
  if(i===6){assert.match(text,/ตรวจพบ ≠ จัดการแล้ว/);assert.match(text,/Unresolved issues/)}
  if(i===7){assert.match(text,/ไม่พบในรอบนี้/);assert.match(text,/7,740|Quick Scan/)}
  if(i===8){assert.match(text,/358/);assert.match(text,/ไม่ใช่จำนวนภัยคุกคาม/)}
  if(i===9)for(const value of ['5%','22%','71%','52%','6.9','7.1','8.0','8.3','ค่ารวมทั้งเครื่อง'])assert.ok(text.includes(value),value);
  await page.locator('.stage').screenshot({path:`tmp/brief-qa/page-${i+1}.png`});
  if(i<13){
   await page.getByRole('button',{name:'บทพูด N',exact:true}).click();
   assert.match(await page.locator('.notes').innerText(),/บทพูด/);
   assert.match(await page.locator('.notes').innerText(),/คำเชื่อม/);
   assert.match(await page.locator('.source-details').innerText(),/รายงาน_Bitdefender_Total_Security.pdf/);
   await page.keyboard.press('Escape');
  }
  results.push({page:i<13?i+1:`A${i-12}`,status:'passed'});
 }
 await choose(13);
 assert.equal(await page.locator('.evidence-table tbody tr').count(),5);
 for(const [label,id] of [['ก่อน Quick Scan',16],['Quick Scan · 00:10',15],['หลัง Quick Scan',2],['Full Scan · 30:08',14],['Full Scan · 55:31',13]]){
  await page.getByRole('button',{name:`ดูภาพ ${label}`,exact:true}).click();
  assert.equal(await page.locator('.large img').getAttribute('src'),`/evidence/${id}.png`);
  await page.keyboard.press('Escape');
 }
 await page.getByRole('button',{name:'ดูภาพก่อนจัดการ #3'}).click();
 assert.equal(await page.locator('.large img').getAttribute('src'),'/evidence/3.png');
 await page.keyboard.press('Escape');
 await choose(14);
 assert.equal(await page.locator('.references-appendix a').count(),3);
 assert.match(await page.locator('.citation-status').innerText(),/อ้างตามบรรณานุกรมรายงาน/);
 await choose(12);for(let j=0;j<4;j++)await advance();
 assert.equal(await page.locator('article').getAttribute('data-page'),'12','Main sequence must not advance into appendix');
 await page.emulateMedia({reducedMotion:'reduce'});
 await choose(13);await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(200);await page.screenshot({path:'tmp/brief-qa/mobile-a1.png'});
 assert.deepEqual(errors,[]);
 await writeFile('tmp/brief-qa/results.json',JSON.stringify({pages:results,speakingBudgetSeconds:690,bufferSeconds:30,galleryImages:6,consoleErrors:errors,limitations:['Speaking time is allocated, not rehearsed','External bibliography targets not verified']},null,2));
 console.log('PASS: 15 pages, 13 complete notes, 690 seconds, 6 gallery images, bibliography links and separate appendix navigation.');
}finally{await browser.close()}
