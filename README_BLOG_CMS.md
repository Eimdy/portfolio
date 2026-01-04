# Portfolio Blog & CMS - Setup Guide

## 📋 Fitur yang Ditambahkan

### 1. **Blog Section**
- Menu "Blog" di navigation
- Tampilan blog posts dengan style yang sama seperti Projects
- Halaman detail untuk setiap blog post
- Mendukung markdown formatting

### 2. **CMS (Content Management System)**
- Dashboard untuk mengelola blog posts dan projects
- CRUD operations (Create, Read, Update, Delete)
- Filter berdasarkan tipe konten (Blog/Project)
- Search functionality
- Auto-generate slug dari title
- Image preview
- Tag management

### 3. **Database SQLite**
- Lightweight local database
- Auto-initialization dengan seed data
- Mendukung migrasi ke database lain (PostgreSQL, MySQL, dll)

---

## 🚀 Instalasi

### 1. Install Dependencies
```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Database akan otomatis dibuat dan diisi dengan sample data saat pertama kali aplikasi dijalankan.

---

## 📂 Struktur File Baru

```
Portfolio/
├── database/
│   ├── schema.sql              # Database schema
│   └── portfolio.db            # SQLite database (auto-created)
├── lib/
│   └── db.ts                   # Database connection & queries
├── app/
│   ├── api/
│   │   └── content/
│   │       ├── route.ts        # GET all, POST new
│   │       └── [id]/
│   │           └── route.ts    # GET, PUT, DELETE by ID
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx        # Blog detail page
│   └── cms/
│       └── page.tsx            # CMS dashboard
├── components/
│   ├── Blog.tsx                # Blog section component
│   └── cms/
│       ├── ContentList.tsx     # Content list with filters
│       └── ContentForm.tsx     # Create/Edit form
└── MIGRATION.md                # Database migration guide
```

---

## 🎯 Cara Menggunakan

### Mengakses CMS
1. Buka browser dan navigasi ke: `http://localhost:3000/cms`
2. Anda akan melihat dashboard CMS dengan daftar semua content

### Membuat Blog Post Baru
1. Klik tombol **"Create New"**
2. Pilih type: **Blog Post**
3. Isi form:
   - **Title**: Judul blog post
   - **Slug**: Auto-generate dari title (bisa diedit manual)
   - **Description**: Ringkasan singkat
   - **Content**: Konten lengkap (mendukung markdown)
   - **Tags**: Comma-separated (contoh: `React,TypeScript,Tutorial`)
   - **Image URL**: URL gambar untuk thumbnail
4. Klik **"Create Content"**

### Membuat Project Baru
1. Klik tombol **"Create New"**
2. Pilih type: **Project**
3. Isi form dengan data project
4. Klik **"Create Content"**

### Edit Content
1. Di list content, klik tombol **"Edit"** pada item yang ingin diedit
2. Ubah data yang diperlukan
3. Klik **"Update Content"**

### Delete Content
1. Di list content, klik tombol **"Delete"**
2. Konfirmasi penghapusan

### Filter & Search
- Gunakan tab **All/Blog/Projects** untuk filter berdasarkan tipe
- Gunakan search box untuk mencari berdasarkan title atau tags

---

## 🔧 API Endpoints

### GET `/api/content`
Mendapatkan semua content atau filter berdasarkan type
```
GET /api/content              # Semua content
GET /api/content?type=blog    # Hanya blog posts
GET /api/content?type=project # Hanya projects
GET /api/content?q=react      # Search
```

### POST `/api/content`
Membuat content baru
```json
{
  "type": "blog",
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "description": "Short description",
  "content": "Full content here...",
  "tags": "React,TypeScript",
  "image": "https://example.com/image.jpg"
}
```

### GET `/api/content/[id]`
Mendapatkan content berdasarkan ID

### PUT `/api/content/[id]`
Update content berdasarkan ID

### DELETE `/api/content/[id]`
Hapus content berdasarkan ID

---

## 📊 Database Schema

```sql
CREATE TABLE content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('blog', 'project')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL,
    image TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Migrasi Database

Untuk migrasi ke database production (PostgreSQL, MySQL, dll), lihat file **`MIGRATION.md`** yang berisi:
- Cara export data dari SQLite
- Setup untuk PostgreSQL
- Setup untuk MySQL
- Setup untuk cloud services (Vercel Postgres, Supabase, PlanetScale)
- Environment variables configuration

---

## 📝 Markdown Support

Blog content mendukung **full markdown** formatting dengan `react-markdown`:

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Lists
```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Links
```markdown
[Link text](https://example.com)
```

### Code
```markdown
Inline `code` with backticks

\`\`\`javascript
// Code block
const example = 'Hello World';
\`\`\`
```

### Blockquotes
```markdown
> This is a blockquote
```

### Images in Content
```markdown
![Alt text](https://example.com/image.jpg)
```

**Note**: Hero image tetap diinput melalui field "Image URL" terpisah di form CMS.

---

## 🎨 Styling

Semua komponen menggunakan style yang konsisten dengan design system portfolio:
- PaperCSS aesthetic
- Border-based design
- Hover effects
- Responsive layout

---

## ⚠️ Catatan Penting

1. **Database Location**: Database SQLite disimpan di `database/portfolio.db`
2. **Backup**: Selalu backup database sebelum melakukan perubahan besar
3. **Production**: Untuk production, disarankan migrasi ke PostgreSQL atau MySQL
4. **Images**: Gunakan URL absolut untuk images (bisa dari Unsplash, CDN, dll)

---

## 🐛 Troubleshooting

### Error: Module not found 'better-sqlite3'
```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

### Database tidak terbuat
Database akan otomatis dibuat saat pertama kali mengakses API. Coba akses:
```
http://localhost:3000/api/content
```

### Port sudah digunakan
Ubah port di `package.json` atau kill process yang menggunakan port 3000

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**Happy Coding! 🚀**
