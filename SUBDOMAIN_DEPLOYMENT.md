# Subdomain Deployment Guide

Panduan untuk deploy aplikasi ini dengan subdomain terpisah untuk blog, portfolio, dan CMS.

## 🌐 Struktur Subdomain

- **Portfolio**: `eimdy.my.id` → Homepage portfolio
- **Blog**: `blog.eimdy.my.id` → Blog dengan semua posts
- **CMS**: `cms.eimdy.my.id` → Content management system

---

## 📁 Struktur Aplikasi

Aplikasi ini sudah didesain untuk mendukung deployment dengan subdomain terpisah:

### Routes
```
/                    → Portfolio homepage
/blog               → All blog posts
/blog/[slug]        → Individual blog post
/cms                → CMS dashboard
/api/content        → API endpoints (shared)
```

### Navigation
- **Portfolio**: Menggunakan `Navigation.tsx` dengan menu internal
- **Blog**: Menggunakan `BlogNavigation.tsx` dengan link ke portfolio
- **CMS**: Standalone dengan link ke home

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### 1. Deploy Main App
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### 2. Configure Domains di Vercel Dashboard
1. Buka project di Vercel Dashboard
2. Settings → Domains
3. Tambahkan domains:
   - `eimdy.my.id`
   - `blog.eimdy.my.id`
   - `cms.eimdy.my.id`

#### 3. Configure Rewrites (vercel.json)
Buat file `vercel.json` di root project:

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "blog.eimdy.my.id"
        }
      ]
    },
    {
      "source": "/",
      "destination": "/blog",
      "has": [
        {
          "type": "host",
          "value": "blog.eimdy.my.id"
        }
      ]
    },
    {
      "source": "/",
      "destination": "/cms",
      "has": [
        {
          "type": "host",
          "value": "cms.eimdy.my.id"
        }
      ]
    }
  ]
}
```

#### 4. DNS Configuration
Di DNS provider (Cloudflare, Namecheap, dll):

```
Type    Name    Value
A       @       76.76.21.21 (Vercel IP)
CNAME   blog    cname.vercel-dns.com
CNAME   cms     cname.vercel-dns.com
```

---

### Option 2: Next.js Middleware

Buat file `middleware.ts` di root project:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Blog subdomain
  if (hostname.startsWith('blog.')) {
    const url = request.nextUrl.clone();
    
    // Redirect root to /blog
    if (url.pathname === '/') {
      url.pathname = '/blog';
      return NextResponse.rewrite(url);
    }
    
    // Allow blog routes
    if (url.pathname.startsWith('/blog') || url.pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    
    // Block other routes
    url.pathname = '/blog';
    return NextResponse.redirect(url);
  }

  // CMS subdomain
  if (hostname.startsWith('cms.')) {
    const url = request.nextUrl.clone();
    
    // Redirect root to /cms
    if (url.pathname === '/') {
      url.pathname = '/cms';
      return NextResponse.rewrite(url);
    }
    
    // Allow CMS and API routes
    if (url.pathname.startsWith('/cms') || url.pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    
    // Block other routes
    url.pathname = '/cms';
    return NextResponse.redirect(url);
  }

  // Main domain - portfolio
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### Option 3: Nginx Reverse Proxy

Jika deploy di VPS dengan Nginx:

```nginx
# Portfolio - eimdy.my.id
server {
    listen 80;
    server_name eimdy.my.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Blog - blog.eimdy.my.id
server {
    listen 80;
    server_name blog.eimdy.my.id;

    location / {
        proxy_pass http://localhost:3000/blog;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# CMS - cms.eimdy.my.id
server {
    listen 80;
    server_name cms.eimdy.my.id;

    location / {
        proxy_pass http://localhost:3000/cms;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 Environment Variables

Buat file `.env.local`:

```bash
# Base URLs for cross-subdomain navigation
NEXT_PUBLIC_PORTFOLIO_URL=https://eimdy.my.id
NEXT_PUBLIC_BLOG_URL=https://blog.eimdy.my.id
NEXT_PUBLIC_CMS_URL=https://cms.eimdy.my.id

# Database (jika migrasi dari SQLite)
DATABASE_URL=postgresql://user:password@host:5432/portfolio
```

Update navigation links untuk menggunakan env variables:

```typescript
// components/BlogNavigation.tsx
const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || '/';

// components/Navigation.tsx (portfolio)
const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL || '/blog';
const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || '/cms';
```

---

## 📊 Database Considerations

### Development (SQLite)
- Database lokal di `database/portfolio.db`
- Cocok untuk development dan testing

### Production
Untuk production dengan subdomain terpisah, **WAJIB** migrasi ke database terpusat:

**Recommended**: PostgreSQL (Vercel Postgres, Supabase, Neon)

Alasan:
- ✅ Shared database untuk semua subdomain
- ✅ Concurrent access
- ✅ Better performance
- ✅ Automatic backups

Lihat `MIGRATION.md` untuk panduan lengkap migrasi database.

---

## ✅ Testing Locally

### 1. Edit hosts file
**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

Tambahkan:
```
127.0.0.1 eimdy.my.id
127.0.0.1 blog.eimdy.my.id
127.0.0.1 cms.eimdy.my.id
```

### 2. Run development server
```bash
npm run dev
```

### 3. Test URLs
- Portfolio: `http://eimdy.my.id:3000`
- Blog: `http://blog.eimdy.my.id:3000`
- CMS: `http://cms.eimdy.my.id:3000`

---

## 🔒 Security Notes

1. **CMS Protection**: Tambahkan authentication untuk `/cms` route
2. **API Security**: Implement rate limiting untuk API endpoints
3. **CORS**: Configure CORS jika subdomain berbeda
4. **SSL**: Gunakan HTTPS untuk semua subdomain (Vercel auto-provides)

---

## 📝 Checklist Deployment

- [ ] Migrasi database dari SQLite ke PostgreSQL/MySQL
- [ ] Setup environment variables
- [ ] Configure subdomain di hosting provider
- [ ] Setup DNS records
- [ ] Test semua subdomain
- [ ] Enable SSL/HTTPS
- [ ] Setup monitoring dan analytics
- [ ] Backup database
- [ ] Test navigation antar subdomain

---

## 🆘 Troubleshooting

### Issue: Subdomain tidak redirect dengan benar
**Solution**: Pastikan middleware.ts atau vercel.json sudah dikonfigurasi dengan benar

### Issue: Database connection error
**Solution**: Pastikan DATABASE_URL di environment variables sudah benar

### Issue: CORS error saat akses API dari subdomain berbeda
**Solution**: Configure CORS di API routes:
```typescript
// app/api/content/route.ts
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};
```

---

**Happy Deploying! 🚀**
