# T2A Bangkok Dinner Cruise - Vercel Deployment

โฟลเดอร์นี้เป็นเว็บไซต์ Static HTML/CSS/JavaScript ที่พร้อมนำขึ้น Vercel โดยไม่ต้องติดตั้ง package หรือสั่ง build

## ไฟล์ที่ต้องอยู่บน Vercel

- `index.html`
- `app.js`
- `assets.js`
- `content.js`
- `styles.css`
- `tokens.css`
- `vercel.json`
- `assets/` พร้อมไฟล์ภาพ โลโก้ และไอคอนทั้งหมด

ห้ามอัปโหลดเฉพาะ `index.html` เพราะหน้าเว็บอ้างอิงไฟล์อื่นด้วย relative path

## วิธีแนะนำ: Deploy ผ่าน GitHub

1. สร้าง GitHub repository ใหม่
2. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดจากชุดนี้ไว้ที่ root ของ repository โดย `index.html` ต้องอยู่ระดับแรก
3. เปิด `https://vercel.com/new`
4. เชื่อมต่อ GitHub และเลือก Import repository ที่สร้างไว้
5. ตั้งค่า:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: เว้นว่าง
   - Output Directory: เว้นว่าง
   - Install Command: เว้นว่าง
6. กด Deploy
7. เมื่อเสร็จจะได้ URL รูปแบบ `https://ชื่อโปรเจกต์.vercel.app`

หลังจากนั้น ทุกครั้งที่ push ขึ้น branch หลัก Vercel จะ deploy เวอร์ชันใหม่ให้อัตโนมัติ

## วิธีสำรอง: Deploy ด้วย Vercel CLI

ต้องติดตั้ง Node.js ก่อน แล้วเปิด PowerShell ในโฟลเดอร์นี้:

```powershell
npm install --global vercel
vercel login
vercel
```

เมื่อต้องการอัปเดต Production:

```powershell
vercel --prod
```

สำหรับคำถามตั้งค่าเริ่มต้น ให้เลือกสร้าง Project ใหม่ ใช้โฟลเดอร์ปัจจุบัน และไม่แก้ไข Project Settings เพิ่มเติม

## ตรวจสอบหลัง Deploy

- โลโก้และภาพทุก section แสดงครบ
- Google Fonts โหลดได้
- Dropdown, tabs, carousel, keyboard navigation และ responsive layout ทำงาน
- เปิด DevTools > Console แล้วไม่มีข้อความ 404
- ทดสอบ Desktop, Tablet และ Mobile

หมายเหตุ: ฟอนต์โหลดจาก Google Fonts ผู้ใช้งานจึงต้องเชื่อมต่ออินเทอร์เน็ต
