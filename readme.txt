
Front end

public/
  ├── index.html           # Entry HTML file
  └── assets/              # Static assets (images, icons, etc.)

src/
  ├── assets/              # Images, fonts, icons, etc.
  ├── components/          # Reusable UI components
  ├── services/            # API calls, utility functions, etc.
  ├── types/               # TypeScript type definitions
  ├── styles/              # Tailwind-specific and custom styles
      ├── global.css       # Global styles (custom styles, overrides)
      ├── components/      # Component-specific styles (optional)
      │   ├── Button.css   # If needed for custom components
      │   └── Header.css   # Custom styles for Header
      └── pages/           # Page-specific styles (optional)
          ├── Home.css     # Home page custom styles
          └── About.css    # About page custom styles
  ├── app.css              # App-wide styles (optional, can include Tailwind's imports)
  ├── app.tsx              # Main app component
  ├── index.css            # Tailwind import and custom global styles
  ├── main.tsx             # Entry point for the app
