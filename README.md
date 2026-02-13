# Pag-Ambit: Interactive Web Comic Book

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

An immersive digital comic book experience built with modern web technologies. This project features a realistic page-flip effect, interactive controls, and multimedia support to bring stories to life on the web.

## 📖 Features

*   **Realistic Page Flip**: Utilizes `react-pageflip` to simulate the tactile feel of reading a physical book.
*   **Interactive Controls**:
    *   **Navigation**: Next/Prev buttons, Jump to Cover/End, Table of Contents, keyboard arrow keys.
    *   **View Modes**: Fullscreen support, Night Mode, and adjustable zoom (0.5x-3.0x).
    *   **Tools**: Bookmarking, Search (UI), Highlight (UI), Notes (links to external apps), Save/Download (UI), Share, and Print support.
*   **Multimedia Support**: Seamlessly handles both high-quality images and video content within the book pages, with interactive speech bubble overlays on hover.
*   **Responsive Design**: Automatically adjusts layout and dimensions for mobile devices and desktop screens.
*   **Audio Experience**: Integrated page-turn sound effects with mute control.

## 🛠️ Tech Stack

*   **Frontend Framework**: [React](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Core Library**: [react-pageflip](https://github.com/Nodlik/react-pageflip)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Babyama0901/Pag-Ambit-Interactive-Web-Comic-Book.git
    cd Pag-Ambit-Interactive-Web-Comic-Book
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Running Locally

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

Create an optimized build for deployment:
```bash
npm run build
```
The output will be in the `dist` directory.

## 📂 Project Structure

```
src/
├── components/
│   ├── Book.jsx       # Main book component with page-flip logic
│   ├── Controls.jsx   # UI controls for navigation and settings
│   └── Modal.jsx      # Reusable modal component for dialogs
├── App.jsx            # Root component
└── main.jsx           # Entry point
public/
├── Layout/            # Comic book page images
├── sounds/            # Audio assets
└── ...
```

## 📄 License

This project is available under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](LICENSE).
