import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('tmp/theatre-qa',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5175/');await page.waitForTimeout(600);
 for(const index of [4,5,6,7,8]){
  await page.locator('nav button').last().click();await page.locator('.menu-item').nth(index).click();await page.waitForTimeout(500);
  const last=index===8?3:2;
  for(let beat=0;beat<=last;beat++){
   if(beat)await page.keyboard.press('ArrowRight');
   await page.waitForTimeout(950);
   assert.equal(await page.locator('article').getAttribute('data-beat'),String(beat));
   assert.ok(await page.locator('article img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0)));
   assert.match(await page.locator('.theatre-mode').innerText(),/ภาพหน้าจอจริง/);
   const cue=await page.locator('.story-cue').boundingBox();for(const selector of ['.protection-theatre','.theatre-narration']){const box=await page.locator(selector).boundingBox();assert.ok(box.y+box.height<cue.y+2,`Layout overlaps cue: ${index}-${beat} ${selector}`);}
   await page.locator('.stage').screenshot({path:`tmp/theatre-qa/${index+1}-${beat}.png`});
  }
  await page.keyboard.press('ArrowLeft');await page.waitForTimeout(500);
  assert.equal(await page.locator('article').getAttribute('data-beat'),String(last-1));
  await page.locator('.real-canvas').click();assert.ok(await page.locator('.large img').isVisible());await page.keyboard.press('Escape');
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('nav button').last().click();await page.locator('.menu-item').nth(5).click();await page.waitForTimeout(400);await page.keyboard.press('ArrowRight');await page.waitForTimeout(500);
 assert.ok(await page.locator('.real-canvas').isVisible());
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);await page.screenshot({path:'tmp/theatre-qa/mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS: five UI sequences, 16 states, reverse navigation, evidence links and reduced motion.');
}finally{await browser.close()}