import re,json,shutil,pathlib
p=pathlib.Path('.')
t=(p/'BITDEFENDER_SLIDE_CONTENT_BRIEF.md').read_text(encoding='utf-8')
sections=re.split(r'\n### (?=หน้า \d+ —|A[12] —)',t)[1:]
ids=['c3ea0075-f9b8-487e-8ca0-8376882ec686','95186356-da60-4c7b-8964-4981237826d7','77860aa8-0321-4a2a-b897-01a8954e0e8b','f1552055-9692-471a-a1d6-d66ded3e7138','5e187b89-33c7-43e2-a5ed-798186c281e6','a56245cd-9959-4a97-98a4-2c48cb2643b5','95c0eab9-059f-4a74-84fc-8fda80e25b25','8e7a35ec-de56-46c6-9d5b-d91b68466481','539fc350-ee5f-4a8c-97e3-7717151bc3c7','2f1289c5-073f-447c-9edd-1ec8b1d2e850','b9172213-26fd-449e-a56b-d5750829ef20','ed504f9e-5ef1-4cfb-8c20-e1dca4b4657f','24c9bc37-2f3f-4790-a7cf-b644bc542a52','c3609dd2-cfd8-4c80-9284-6a479e8a16fb','d50c7f63-35ee-4889-b99a-38ee546d76e7','4ed69f3c-7195-4111-83be-614ecf7a6c5c']
for i,x in enumerate(ids,1): shutil.copyfile('C:/Users/Fiatk/AppData/Local/Temp/codex-clipboard-'+x+'.png',p/f'public/evidence/{i}.png')
(p/'public/evidence/mapping.json').write_text(json.dumps(dict(enumerate(ids,1)),indent=2))
images=[[],[],[],[1],[7,6],[5,4],[3],[2],[12,11],[16,15,14,13],[],[],[],[16,15,14,13,8],[]]
data=[]
for i,s in enumerate(sections):
 s=s.split('\n## ')[0]
 title=s.split('\n')[0].split(' — ',1)[1]
 match=re.search(r'\*\*บนสไลด์:\*\*(.*?)(?=\*\*Speaker notes|\*\*บทพูดตั้งต้น)',s,re.S)
 body=match.group(1).strip() if match else ('รายละเอียดผลและภาพหลักฐานเพิ่มเติม' if i==13 else 'รายงาน Bitdefender Total Security หน้า 5–20 และภาพทดลองที่แนบ\n\nขอบเขต: EICAR · เครื่องเดียว · สแกนครั้งเดียวต่อแบบ · ค่าทรัพยากร ณ จุดเวลา')
 notes=re.search(r'\*\*(?:Speaker notes|บทพูดตั้งต้น):\*\*(.*?)(?=\*\*(?:ภาพ|หลักฐาน)|$)',s,re.S)
 source=re.search(r'\*\*หลักฐาน:\*\*(.*)',s)
 tm=re.search(r'\*\*เวลา:\*\* (\d+)',s)
 data.append(dict(title=title,body=body,notes=notes.group(1).strip() if notes else s,time=int(tm.group(1)) if tm else 0,source=source.group(1).strip() if source else 'รายงานต้นฉบับและภาพทดลองของผู้จัดทำ',images=images[i]))
(p/'src/content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
