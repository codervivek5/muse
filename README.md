# Atelier of Muskan 🎨✨

**Atelier of Muskan** (codename: *muse*) is an immersive, premium digital sanctuary designed to showcase artistic masterpieces with a focus on soul, emotion, and shared inspiration. It combines high-end aesthetic design with a powerful administrative command center.

---

## 🌟 Key Features

### 🖼️ Immersive Gallery Experience
- **Interactive Staggered Grid:** A visually stunning, responsive layout that scales gracefully from mobile to desktop.
- **Museum-Style Modal:** High-resolution artwork display with independent scrolling for reflections, keeping the masterpiece in focus at all times.
- **Multimedia Modules:** "Behind the Brush" section for process reels and artist voiceovers (coming soon).
- **Ephemeral Ink:** A unique, interactive stroke effect that follows your touch/cursor.

### 🔐 Administrative Command Center
- **Secure Authentication:** Robust user login and registration powered by **Supabase Auth**.
- **Intuitive CRUD:** Effortlessly manage your collection—add new artworks, edit descriptions, or remove pieces from the gallery.
- **Smart Image Optimization:** Integrated client-side compression (target < 200KB) ensuring lightning-fast load times even with high-res art.

### 🚀 Performance & Design
- **Fully Responsive:** Tailored experience for Mobile, Tablet, and Desktop.
- **Dynamic Design System:** Custom theme engine (Midnight Studio) with premium gold accents and smooth motion transitions.
- **Vercel Optimized:** Pre-configured for seamless deployment with custom SPA routing.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Backend/Database:** [Supabase](https://supabase.com/)
- **UI Components:** [Lucide React](https://lucide.dev/), [SweetAlert2](https://sweetalert2.github.io/)
- **Communication:** [FormSubmit](https://formsubmit.co/) for dynamic enquiries

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/muse.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Configuration
Create a `.env` file in the root directory and add your credentials:

```ini
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_CONTACT_EMAIL=muskan742275@gmail.com
```

### 3. Database Setup
The library uses a Supabase table named `artworks`. Ensure your table schema includes:
- `id` (uuid)
- `title` (text)
- `description` (text)
- `image_url` (text)
- `category` (text)
- `created_at` (timestamp)

---

## 📦 Deployment

This project is optimized for deployment on **Vercel**. 
The included `vercel.json` handles Single Page Application (SPA) routing to ensure your admin routes work perfectly in production.

---

## 🎨 Visual Identity

| Element | Specification |
| :--- | :--- |
| **Primary Theme** | Midnight Studio (Deep Dark) |
| **Accent Color** | #D4AF37 (Gold) |
| **Typography** | Serif (Titles) & Sans-Serif (Content) |

---

Developed with ❤️ for **Muskan's Atelier**.
