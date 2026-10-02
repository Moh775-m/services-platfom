🛠️ Hadhramout Services

منصة إلكترونية تهدف إلى تسهيل الوصول إلى الخدمات والموارد المحلية في حضرموت من خلال واجهة ويب حديثة وسهلة الاستخدام.

🌐 Live Demo:
https://moh775-m.github.io/services-platfom/

📦 GitHub Repository:
https://github.com/Moh775-m/services-platfom

---

📌 نبذة عن المشروع

Hadhramout Services هو مشروع ويب يهدف إلى جمع وعرض مجموعة من الخدمات والموارد المحلية في منصة واحدة.

تم تطوير المشروع باستخدام تقنيات الويب الحديثة، مع التركيز على:

- سهولة الاستخدام.
- تصميم متجاوب مع مختلف أحجام الشاشات.
- تنظيم الخدمات بطريقة واضحة.
- إدارة البيانات باستخدام Supabase.
- تجربة مستخدم بسيطة وحديثة.

---

✨ المميزات

- 🏠 عرض الخدمات والموارد.
- 👷 عرض الحرفيين والخدمات المهنية.
- 🚜 عرض المعدات.
- 🏡 عرض المنازل والعقارات.
- 🛍️ عرض المنتجات.
- 🔎 إمكانية تنظيم واستعراض الخدمات.
- 📱 تصميم متجاوب مع الجوال والكمبيوتر.
- ☁️ تخزين وإدارة البيانات باستخدام Supabase.
- 🚀 نشر المشروع على GitHub Pages.
- ⚙️ نشر تلقائي باستخدام GitHub Actions.

---

🧰 التقنيات المستخدمة


React| 
بناء واجهة المستخدم
JavaScript| 
منطق التطبيق
Vite| 
تشغيل وبناء المشروع
Tailwind CSS| 
تصميم وتنسيق الواجهات
Supabase| 
قاعدة البيانات والخدمات الخلفية
Git| 
إدارة الإصدارات
GitHub| 
استضافة الكود
GitHub Actions| 
البناء والنشر التلقائي
GitHub Pages| 
استضافة الموقع

---

📁 هيكل المشروع

services-platfom/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── .github/
│   └── workflows/
│       └── main.yml
│
├── .env
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

«ملاحظة: قد تختلف بعض المجلدات والملفات حسب آخر تحديث للمشروع.»

---

🚀 تشغيل المشروع محليًا

1. استنساخ المشروع

git clone https://github.com/Moh775-m/services-platfom.git

2. الدخول إلى مجلد المشروع

cd services-platfom

3. تثبيت الحزم

npm install

4. إعداد متغيرات البيئة

أنشئ ملفًا باسم:

.env

وأضف متغيرات Supabase:

VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

5. تشغيل المشروع

npm run dev

بعدها افتح الرابط الذي يظهر في Terminal، وغالبًا يكون:

http://localhost:5173

---

🏗️ بناء المشروع

لبناء نسخة الإنتاج:

npm run build

سيتم إنشاء مجلد:

dist/

وهو مجلد ملفات الإنتاج الذي يتم نشره.

ولمعاينة نسخة الإنتاج محليًا:

npm run preview

---

🌐 النشر

تم إعداد المشروع للنشر على GitHub Pages باستخدام GitHub Actions.

يتم تشغيل عملية النشر عند رفع تحديث جديد إلى فرع:

main

وتتضمن العملية:

Git Push
   ↓
GitHub Actions
   ↓
npm ci
   ↓
npm run build
   ↓
dist/
   ↓
GitHub Pages

يتم استخدام GitHub Actions لأن مشروع Vite يحتاج إلى عملية Build قبل نشر ملفات الموقع.

---

🔐 Supabase

يستخدم المشروع Supabase لإدارة البيانات والخدمات الخلفية.

يتم تمرير إعدادات Supabase من خلال متغيرات البيئة:

VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY

وفي GitHub Actions يتم تخزينها باستخدام GitHub Secrets بدلًا من وضع القيم مباشرة داخل ملف Workflow.

«⚠️ لا تقم برفع ملف ".env" إلى GitHub إذا كان يحتوي على مفاتيح أو بيانات سرية.»

---

⚙️ GitHub Pages Configuration

بما أن اسم مستودع المشروع هو:

services-platfom

فإن إعداد Vite يستخدم:

base: '/services-platfom/'

وهذا مطلوب عند نشر تطبيق Vite داخل مسار مستودع على GitHub Pages.

---

👨‍💻 المطور

Mohsen Al-Mashjari

طالب تقنية معلومات ومهتم بتطوير تطبيقات الويب باستخدام تقنيات Frontend الحديثة.

🔗 روابط

- GitHub: https://github.com/Moh775-m
- Project: https://github.com/Moh775-m/services-platfom
- Live Website: https://moh775-m.github.io/services-platfom/

---

📄 License

هذا المشروع تم تطويره لأغراض تعليمية وتطويرية.

جميع الحقوق محفوظة © 2026 Mohsen Al-Mashjari.
