# 🌍 Travel Article

A modern travel article platform built with React, TypeScript, and Vite. Share your travel experiences, discover new destinations, and connect with fellow travelers.

## ✨ Features

- 🔐 **Authentication System** - Secure user registration and login
- 📝 **Article Management** - Create, edit, and delete travel articles
- 🖼️ **Rich Content** - Support for cover images and detailed descriptions
- 🏷️ **Category System** - Organize articles by categories
- 💬 **Comments** - Engage with articles through comments
- 🌐 **Internationalization** - Multi-language support (English & Indonesian)
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔍 **Category Filtering** - Filter articles by category

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variants

### Internationalization

- **React Intl** - Internationalization framework

### HTTP Client

- **Axios** - Promise-based HTTP client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shafwarijal/travel-article.git
   cd travel-article
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=your_api_url_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## 📦 Available Scripts

- `npm run dev` - Start development server on port 5000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🗂️ Project Structure

```
travel-article/
├── public/              # Static assets
├── src/
│   ├── app/            # Page components (Next.js-style routing)
│   │   ├── landing/    # Landing page
│   │   ├── login/      # Login page
│   │   ├── register/   # Register page
│   │   ├── article-detail/  # Article detail page
│   │   └── article-form/    # Article create/edit form
│   ├── components/     # Reusable components
│   │   ├── features/   # Feature-specific components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components (shadcn-style)
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization
│   │   └── locales/    # Translation files
│   ├── lib/            # Library configurations
│   │   └── validations/ # Zod schemas
│   ├── pages/          # Page implementations
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── .env                # Environment variables
├── vercel.json         # Vercel configuration
└── vite.config.ts      # Vite configuration
```

## 🎯 Key Features Explained

### Authentication

- Authentication
- Protected routes for authenticated users
- Persistent auth state with Zustand

### Article Management

- Create articles with title, description, cover image, and content
- Edit your own articles
- Delete functionality

### Comments System

- Add comments to articles
- View all comments with user information
- Paginated comments loading

### Internationalization

- English and Indonesian language support
- Language switcher component
- Persistent language preference

### Theme System

- Persistent theme preference

## 🔐 Environment Variables

| Variable       | Description          | Required |
| -------------- | -------------------- | -------- |
| `VITE_API_URL` | Backend API base URL | Yes      |

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional)

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

   Or connect your GitHub repository to Vercel dashboard for automatic deployments.

### Build Settings

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 📝 API Integration

This application requires a backend API. Configure the API URL in your `.env` file.

Expected API endpoints:

- `POST /api/auth/local/register` - User registration
- `POST /api/auth/local` - User login
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/categories` - Get all categories
- `GET /api/comments` - Get comments
- `POST /api/comments` - Create comment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Shafwatur Rijal**

- GitHub: [@shafwarijal](https://github.com/shafwarijal)

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://react.dev/) - The library for web and native user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [TanStack Query](https://tanstack.com/query) - Powerful asynchronous state management

---

Made with ❤️ by Shafwatur Rijal

```
>>>>>>> f4f6fef (feat: Initial commit with project setup and login page)
```
