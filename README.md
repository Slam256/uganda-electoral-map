# Uganda Electoral Map

Interactive map visualizing Uganda's electoral landscape for the 2026 presidential and general elections. Explore district boundaries, voter demographics, and presidential campaign routes across all 146 districts.

![Uganda Electoral Map](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![OpenLayers](https://img.shields.io/badge/OpenLayers-9-1F6B75?logo=openlayers)

## 🌟 Features

### Current Features ✅

- **Interactive Electoral Map**
  - Full-screen map interface with floating panels
  - 146 district boundaries with detailed geometries
  - 1,437 subcounty boundaries for granular exploration
  - Click-to-select districts/subcounties with visual highlighting
  - Layer switcher for toggling between administrative levels

- **Electoral Data Visualization**
  - 2021 registered voter counts per district
  - Population statistics for districts and subcounties
  - District codes and administrative classifications
  - Real-time data fetching from Supabase

- **Campaign Information Database**
  - Presidential campaign schedule (Sept 2025 - Jan 2026)
  - 8 presidential candidates with party affiliations
  - 27 registered political parties with logos and colors
  - 1000+ campaign event records

- **User Experience**
  - Dark mode with system preference detection
  - Manual theme toggle (Light/Dark/System)
  - Collapsible information panels
  - Responsive design for desktop and mobile

### What's Next 🚀

- [ ] **Campaign Route Visualization**
  - Display presidential candidate tour routes on map
  - Animate campaign progression over time
  - Color-coded routes by candidate/party

-[ ] **Expand Campaign Information Database**
  - Add nominated MPs information 
  - Add local government information 

- [ ] **Advanced Filtering & Search**
  - Search districts/subcounties by name
  - Filter campaign events by date range
  - Filter by candidate or political party
  - Multi-layer filtering (show only contested districts)

- [ ] **Constituency Boundaries**
  - Add constituency boundaries layer QGIS support needed here
  - Electoral area data integration

- [ ] **Data Visualizations**
  - Choropleth maps (voter density, turnout predictions)
  - Bar charts for voter statistics
  - Timeline visualization for campaign events
  - Comparative analysis tools

- [ ] **Progressive Web App (PWA)**
  - Offline map capabilities
  - Install as standalone app
  - Cached map tiles for low-connectivity areas

- [ ] **Export & Share**
  - Export map views as images
  - Share specific district information
  - Generate reports for selected areas

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Mapping Library:** OpenLayers 9 with ol-layerswitcher
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL + PostGIS)
- **Map Tiles:** CartoDB Positron (light theme)
- **Data Format:** GeoJSON, EsriJSON

## 📊 Data Sources

- **Electoral Commission Uganda (EC)** - 2021 voter registration data, campaign schedules and positions 
- **ArcGIS Feature Services** - District and subcounty boundaries
- **geo-ref.net** - Population statistics


## 🏗️ Project Structure

```
uganda-electoral-map/
├── src/
│   ├── components/
│   │   ├── MapComponent.jsx      # OpenLayers map implementation
│   │   ├── DistrictPanel.jsx     # Info panel with collapsible UI
│   │   └── ThemeToggle.jsx       # Dark mode toggle
│   ├── context/
│   │   ├── ThemeContext.js       # Theme context
│   │   ├── ThemeProvider.jsx     # Theme provider with localStorage
│   │   └── useTheme.js          # Theme hook
│   ├── hooks/
│   │   └── useAdminData.js       # Supabase data fetching hook
│   ├── utils/
│   │   └── supabase.js           # Supabase client configuration
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── public/                        # Static assets
├── .env.example                   # Environment variables template
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn/pnpm
- Supabase account (free tier works)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone
   cd folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_APP_SUPABASE_URL=your_supabase_project_url
   VITE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   > **Note:** Never commit your `.env` file! It's already in `.gitignore`.

4. **Set up Supabase Database**
    Still figuring this part out. Contributors should contact me for database setup instructions.
    We shall figure something out.
    
5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🤝 How to Contribute

We welcome contributions from developers, designers, data analysts, and civic tech enthusiasts! Here's how you can help:

### Ways to Contribute

1. **Code Contributions**
   - Fix bugs or implement new features
   - Improve performance or accessibility
   - Add tests or documentation

2. **Data Contributions**
   - Help collect/verify campaign schedule data
   - Improve electoral boundary accuracy
   - Add missing constituency information

3. **Design Contributions**
   - Improve UI/UX
   - Create visualizations or infographics
   - Design campaign route animations

4. **Documentation**
   - Improve README or code comments
   - Create tutorials or guides
   - Translate content

### Contribution Process

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/uganda-electoral-map.git
   cd uganda-electoral-map
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # Examples:
   # git checkout -b feature/campaign-routes
   # git checkout -b fix/district-name-matching
   # git checkout -b docs/setup-guide
   ```

4. **Make your changes**
   - Write clean, commented code
   - Follow existing code style
   - Test your changes thoroughly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add campaign route visualization"
   ```

   **Commit message format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with:
     - Description of changes
     - Related issue number (if applicable)
     - Screenshots (for UI changes)
     - Testing done

### Development Guidelines

- **Code Style:** Follow React best practices, use functional components with hooks
- **Component Structure:** Keep components small and focused
- **State Management:** Use React hooks (useState, useEffect, custom hooks)
- **Styling:** Use Tailwind utility classes, maintain dark mode compatibility
- **Database Queries:** Optimize Supabase queries, use proper indexes
- **Git Hygiene:** Keep commits atomic, write descriptive commit messages

### Reporting Issues

Found a bug or have a feature request?

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the problem, not the person
- Help create a welcoming community

## 📝 Database Schema

### Core Tables

- **districts** (146 records) - District boundaries with voter data 2021 elections
- **subcounties** (1,437 records) - Subcounty boundaries with population
- **constituencies** -  Electoral constituencies need more information
- **political_parties** (27 records) - Registered parties with branding
- **candidates** (8 records) - Presidential candidates currently will add other positions
- **campaign_schedule** (1000+ records) - Campaign events timeline

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Data Attribution

- Electoral data: Electoral Commission Uganda
- Population data: geo-ref.net
- Boundary data: ArcGIS/Uganda Bureau of Statistics

When using this data, please provide appropriate attribution.

## 🙏 Acknowledgments

- Electoral Commission Uganda for voter data
- Uganda Bureau of Statistics for geographic boundaries
- OpenLayers community for excellent mapping tools
- Supabase for database infrastructure
- All contributors and the Uganda civic tech community

## 📧 Contact

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/uganda-electoral-map/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/uganda-electoral-map/discussions)

---

**Built with ❤️ for Uganda's democratic process**

*Disclaimer: This is an independent civic tech project and is not affiliated with any political party or the Electoral Commission of Uganda.*