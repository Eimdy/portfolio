# Portfolio Website

Modern, responsive portfolio website built with Next.js 15, TypeScript, and cutting-edge web technologies.

## ✨ Features

- 🎨 **Modern Design** - Beautiful UI with glassmorphism effects and smooth animations
- 🌙 **Dark Mode** - Eye-friendly dark theme with vibrant gradients
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Performance Optimized** - Built with Next.js 15 App Router for optimal speed
- 🎯 **SEO Ready** - Proper metadata and semantic HTML
- 🔧 **TypeScript** - Type-safe code for better development experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd Portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
Portfolio/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main homepage
│   └── globals.css         # Global styles & design system
├── components/
│   ├── Navigation.tsx      # Sticky navigation bar
│   ├── Hero.tsx           # Landing section
│   ├── About.tsx          # About me section
│   ├── Projects.tsx       # Portfolio projects
│   ├── Skills.tsx         # Skills & technologies
│   └── Contact.tsx        # Contact form
├── public/                 # Static assets (images, icons)
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🎨 Customization

### Update Personal Information

1. **Hero Section** (`components/Hero.tsx`):
   - Change "Your Name" to your actual name
   - Update the title and description

2. **About Section** (`components/About.tsx`):
   - Replace the emoji with your photo
   - Update the description and "What I Do" list

3. **Projects** (`components/Projects.tsx`):
   - Replace example projects with your actual projects
   - Update project titles, descriptions, tech stacks, and links

4. **Skills** (`components/Skills.tsx`):
   - Modify the skills list to match your expertise
   - Update the "currently learning" section

5. **Contact** (`components/Contact.tsx`):
   - Update social media links
   - Configure email integration (replace the simulated form submission)

6. **Metadata** (`app/layout.tsx`):
   - Update the title, description, and author name

### Styling

The design system is defined in `app/globals.css` with CSS custom properties:
- Colors and gradients
- Spacing and typography
- Animations and transitions
- Utility classes

Modify these variables to customize the look and feel.

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

The built application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean

## 🛠️ Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: CSS (Custom Design System)
- **Font**: Inter (Google Fonts)
- **Deployment**: Vercel (recommended)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using Next.js
