# ⚡ Zn_SkillsHub

> منصة الحرفيين المحليين الأولى في الجزائر

---

## 🗂️ هيكل المشروع

```
zn-skillshub/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── PaymentModal.tsx       # نافذة سداد العمولة
│   │   ├── auth/
│   │   │   └── LoginModal.tsx         # تسجيل دخول / إنشاء حساب
│   │   ├── layout/
│   │   │   ├── Layout.tsx             # الهيكل العام
│   │   │   ├── Navbar.tsx             # شريط التنقل
│   │   │   └── Footer.tsx             # الفوتر
│   │   ├── seller/
│   │   │   ├── SellerCard.tsx         # بطاقة الحرفي
│   │   │   ├── SellerGrid.tsx         # شبكة النتائج (4 مستويات)
│   │   │   └── RegisterSellerModal.tsx # تسجيل حرفي جديد
│   │   └── ui/
│   │       ├── Badge.tsx              # الشارات والنجوم
│   │       ├── Button.tsx             # الأزرار
│   │       ├── Input.tsx              # الحقول
│   │       ├── Modal.tsx              # النافذة المنبثقة
│   │       └── Skeleton.tsx           # حالة التحميل
│   ├── data/
│   │   ├── categories.ts              # الـ 40 فئة كاملة بالأقسام والأسعار
│   │   └── wilayas.ts                 # الـ 58 ولاية + الخريطة المجاورة
│   ├── hooks/
│   │   ├── useAuth.ts                 # React Query auth hooks
│   │   ├── useGPS.ts                  # GPS + Haversine distance
│   │   ├── useSellers.ts              # البحث والتسجيل
│   │   └── useSound.ts                # Web Audio API (بدون ملفات خارجية)
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client
│   │   ├── database.types.ts          # TypeScript types مولّدة من DB
│   │   └── supabase-schema.sql        # كامل schema قاعدة البيانات
│   ├── pages/
│   │   ├── HomePage.tsx               # الصفحة الرئيسية
│   │   ├── SearchPage.tsx             # صفحة البحث والفلترة
│   │   ├── SellerProfilePage.tsx      # ملف الحرفي
│   │   ├── DashboardPage.tsx          # لوحة الحرفي
│   │   ├── AdminPage.tsx              # لوحة الإدارة
│   │   ├── HowItWorksPage.tsx         # كيف يعمل
│   │   ├── PricingPage.tsx            # الأسعار
│   │   ├── MessagesPage.tsx           # المحادثات (Realtime)
│   │   ├── NotificationsPage.tsx      # الإشعارات
│   │   └── NotFoundPage.tsx           # 404
│   ├── services/
│   │   ├── auth.service.ts            # تسجيل دخول، إنشاء حساب، reset
│   │   ├── seller.service.ts          # CRUD الحرفيين + البحث GPS
│   │   ├── payment.service.ts         # CCP + الغرامات التصاعدية
│   │   ├── deal.service.ts            # الصفقات والتقييمات
│   │   ├── chat.service.ts            # المحادثات + Realtime
│   │   ├── notification.service.ts    # الإشعارات + templates
│   │   └── admin.service.ts           # إجراءات الإدارة
│   ├── store/
│   │   ├── auth.store.ts              # Zustand — المستخدم والحرفي
│   │   └── ui.store.ts                # Zustand — الثيم والنوافذ
│   ├── types/
│   │   └── index.ts                   # كل TypeScript types
│   └── utils/
│       ├── commission.ts              # حساب العمولات والغرامات
│       └── formatters.ts              # تنسيق التواريخ والأرقام
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 إعداد المشروع

### 1. المتطلبات
- Node.js 18+
- حساب على [Supabase](https://supabase.com) (مجاني)
- حساب على [Vercel](https://vercel.com) (مجاني)

### 2. التثبيت

```bash
git clone https://github.com/your-username/zn-skillshub.git
cd zn-skillshub
npm install
```

### 3. إعداد Supabase

1. أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com)
2. انتقل إلى **SQL Editor** وشغّل محتوى ملف `src/lib/supabase-schema.sql`
3. أنشئ 4 buckets في **Storage**:
   - `avatars` (public)
   - `verifications` (private)
   - `receipts` (private)
   - `gigs` (public)

### 4. متغيرات البيئة

```bash
cp .env.example .env
```

عدّل ملف `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=Zabzabikk@29
VITE_CCP_ACCOUNT=00799999004423597809
```

### 5. تشغيل محلي

```bash
npm run dev
# → http://localhost:3000
```

### 6. البناء والنشر

```bash
npm run build
# رفع على Vercel:
npx vercel --prod
```

---

## 💰 نظام العمولات

| الشريحة | العمولة |
|---------|---------|
| أول 10 صفقات | 0% (مجاناً) |
| الصفقة 11+ | 5% |
| حد المطالبة | 500 دج |
| مهلة الدفع | 48 ساعة |

### الغرامات التصاعدية

| المرة | الغرامة |
|-------|---------|
| 1     | +40%    |
| 2     | +60%    |
| 3     | +80%    |
| 4     | +100%   |
| 5     | حظر دائم |

---

## 🔐 بيانات الإدارة

- **رابط لوحة الإدارة:** `/admin`
- **كلمة السر:** `Zabzabikk@29`

---

## 💳 طرق الدفع

| الطريقة | الحالة |
|---------|--------|
| CCP (بريد الجزائر) رقم: `00799999004423597809` | ✅ متاح |
| البطاقة الذهبية Edahabia | 🕒 قريباً |

---

## 📱 التقنيات المستخدمة

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion
- **State:** Zustand + TanStack Query
- **Backend:** Supabase (Auth + DB + Storage + Realtime)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Hosting:** Vercel

---

## 🗺️ خوارزمية الترتيب في البحث

1. 🔥 **المروّجون في نفس الولاية** (أولاً دائماً)
2. ⭐ **المروّجون في الولايات المجاورة**
3. ✅ **الموثقون** (مرتّبون حسب المسافة GPS)
4. 👤 **الباقون** (مرتّبون حسب المسافة GPS)

---

## 📞 التواصل

**صاحب المشروع:** Zn_SkillsHub  
**الاستضافة:** Vercel  
**قاعدة البيانات:** Supabase
