# Technical Manual: Pag-Ambit Interactive Web Comic

## 1. Project Overview

**Pag-Ambit** is a modern, interactive web-based comic application designed to provide an immersive reading experience. It leverages realistic page-flipping physics, dynamic multimedia integration (video/audio), and a responsive user interface.

### Key Features
*   **Realistic Page Flip**: Powered by `react-pageflip`.
*   **Multimedia Integration**: Supports images, videos (MP4 loops), and audio.
*   **Responsive Design**: Mobile-first approach with `tailwindcss`.
*   **Interactive Controls**: Custom controls for navigation, zoom, and settings.

---

## 2. Technology Stack

### Core Framework & Build Tooling
*   **React (v19.0.0)**: Component-based UI library.
*   **Vite (v6.3.1)**: Fast build tool and development server.

### Styling & UI
*   **Tailwind CSS (v4.1.4)**: Utility-first CSS framework.
*   **PostCSS & Autoprefixer**: CSS processing for compatibility.
*   **Lucide React**: Icon library.

### Specialized Libraries
*   **react-pageflip (v2.0.3)**: Page-turning simulation engine.
*   **Puppeteer (v24.31.0)**: Screenshot automation tool (dev dependency).

---

## 3. Installation & Setup

### Prerequisites
*   **Node.js**: v16 or higher.
*   **npm** or **yarn**: Package manager.

### 1. Clone the Repository
```bash
git clone https://github.com/Babyama0901/Pag-Ambit-Interactive-Web-Comic-Book.git
cd Pag-Ambit-Interactive-Web-Comic-Book
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 4. Build for Production
Create an optimized build for deployment:
```bash
npm run build
```
The output will be in the `dist` directory.

---

## 4. Code Structure

### Directory Layout
```
src/
├── components/
│   ├── Book.jsx       # Main book component logic
│   ├── Controls.jsx   # UI controls (nav, zoom, settings)
│   ├── Modal.jsx      # Reusable modal dialogs
│   ├── MediaPage.jsx  # Individual page rendering (Img/Video)
│   ├── Magnifier.jsx  # Magnifying glass overlay
│   └── ...
├── App.jsx            # Root application component
├── main.jsx           # Entry point
└── ...
public/
├── Layout/            # Comic book page images
├── sounds/            # Audio assets
└── ...
```

### Key Components

#### `Book.jsx`
The heart of the application. It manages:
*   `HTMLFlipBook` instance configuration.
*   Current page state.
*   Coordination between controls and page turns.
*   Rendering of `MediaPage` components.

#### `MediaPage.jsx`
Handles the display of individual pages. It intelligently switches between rendering an `<img>` tag for static pages and a `<video>` tag for animated pages (cinemagraphs). It also manages overlay interactions like speech bubbles.

#### `Controls.jsx`
A detached UI layer that provides user inputs without interfering with the book's visual flow. Features include navigation buttons, zoom slider, night mode toggle, and "More Options" menu.

---

## 5. Deployment

The project is configured for deployment to **GitHub Pages**.

### Deploy Script
The `package.json` includes a deploy script:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### To Deploy
Simply run:
```bash
npm run deploy
```
This will build the project and push the `dist` folder to the `gh-pages` branch.

---

## 6. Testing & Documentation Automation

### capture_screenshots.js
A custom script using Puppeteer to automate screenshot generation for documentation.
Usage:
```bash
node capture_screenshots.js
```
This launches a headless browser, navigates through the book, and saves screenshots of every page to the `screenshots/` directory.
