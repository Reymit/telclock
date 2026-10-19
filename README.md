# TelClock 🕒

**Automatically update your Telegram profile last name with the current time in beautiful Unicode fonts.**

Powered by **Cloudflare Workers** + Telegram **Chat Automation** (Business Connection).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

---

## 🌐 English

### Features

- Updates your Telegram **last name** every minute with current time
- Beautiful mathematical bold Unicode font (`𝟍𝟎:𝟑𝟐`)
- Works with your personal profile via Chat Automation
- Fully serverless (Cloudflare Workers)
- Supports external cron (recommended) or Cloudflare Cron Triggers
- Persian timezone (`Asia/Tehran`) by default

### Requirements

1. A Telegram bot (created with @BotFather)
2. Cloudflare account (free plan is enough)
3. Enable **Chat Automation** + **Edit Name** permission for the bot

### Quick Start

1. Create a new Worker in Cloudflare Dashboard
2. Paste the content of `worker.js`
3. Add Variables:
   - `BOT_TOKEN` (Secret)
   - `FIRST_NAME` (your first name)
4. Create a KV Namespace and bind it as `KV`
5. Deploy & register webhook:  
   `https://your-worker.workers.dev/register`
6. Go to Telegram → Settings → Chat Automation → select your bot → enable **Manage Profile** → check **Edit Name**
7. (Recommended) Create a free cron job at [cron-job.org](https://cron-job.org) that hits `/update` every minute

### Manual Test

Open:
```
https://your-worker.workers.dev/update
```

If you see `{"ok":true,"result":true}` your profile last name should update immediately.

---

## 🇮🇷 فارسی

### ویژگی‌ها

- هر دقیقه **اسم دوم** (لست نیم) پروفایلت رو با ساعت فعلی آپدیت می‌کند
- فونت یونیکد بولد ریاضی (`𝟍𝟎:𝟑𝟐`)
- با استفاده از **Chat Automation** کار می‌کند
- کاملاً سرورلس (Cloudflare Workers)
- پشتیبانی از کرون خارجی (cron-job.org) یا کرون داخلی کلودفلر
- زمان پیش‌فرض تهران

### پیش‌نیازها

1. یک ربات تلگرام (از طریق @BotFather)
2. اکانت Cloudflare (پلن رایگان کافی است)
3. فعال‌سازی **Chat Automation** + اجازه **Edit Name**

### نصب قدم‌به‌قدم

#### مرحله ۱: ساخت Worker
1. برو به [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Create → Create Worker
3. محتوای `worker.js` را کامل کپی کن و جایگزین کن
4. Deploy بزن

#### مرحله ۲: متغیرها (Variables)
- `BOT_TOKEN` → توکن ربات (بهصورت Secret)
- `FIRST_NAME` → اسم اولت (مثلاً علی)

#### مرحله ۳: KV Namespace
1. Workers & Pages → KV → Create a namespace
2. اسمش رو بذار `telclock-kv`
3. برگرد به Worker → Settings → Bindings → Add binding
4. Variable name: `KV`  |  Namespace: همان KVی که ساختی

#### مرحله ۴: ثبت وب‌هوک
آدرس زیر را در مرورگر باز کن:
```
https://YOUR-WORKER.workers.dev/register
```

#### مرحلم ۵: Chat Automation
1. تلگرام → Settings → Chat Automation
2. رباتت رو انتخاب کن
3. **Manage Profile** رو روشن کن
4. تیک **Edit Name** رو بزن

#### مرحله ۶: کرون (پیشنهادی)
از [cron-job.org](https://cron-job.org) یک Job بساز که هر دقیقه این آدرس رو زد:
```
https://YOUR-WORKER.workers.dev/update
```

---

## 📁 Project Structure

```
telclock/
├── worker.js          # Main Cloudflare Worker code
├── README.md          # This file (EN + FA)
├── LICENSE            # MIT
└── .gitignore
```

---

## ⚠️ Important Notes

- The bot **must** have `can_edit_name` (Edit Name) permission via Chat Automation.
- Cloudflare Cron Triggers sometimes fail silently — external cron is more reliable.
- Do not change your name too frequently (Telegram may rate-limit).

---

## 📝 License

MIT License — feel free to use, modify and share.

---

Made with ❤️ for the Telegram community
