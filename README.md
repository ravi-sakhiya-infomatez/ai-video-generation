# 🎥 AI Video Generator — Transform Product URLs into Video Ads

**Instantly generate professional, scroll-stopping video ads from any Amazon or Shopify product URL.**

This full-stack application leverages the power of **GPT-4** for compelling scriptwriting and **Remotion** for high-quality programmatic video generation. Simply paste a product link, and the AI handles the rest—extracting details, writing the script, and rendering the video.

> ✅ **Built with:** `Next.js`, `TypeScript`, `Remotion`, `Puppeteer`, `OpenAI GPT-4`, `TailwindCSS`, `ShadcnUI`

---

## 📸 Functionality

- **Input:** Paste a product URL (Amazon or Shopify).
- **AI Processing:** Automatically extracts images, product titles, features, and benefits.
- **Script Generation:** GPT-4 writes engaging, high-converting ad scripts.
- **Video Rendering:** Remotion creates a 15–30 second MP4 video with professional overlays.
- **Download:** Preview and download the final video in minutes.

---

## 🚀 Features

*   🔗 **Universal Compatibility:** Support for Amazon and Shopify product pages.
*   ✍️ **Smart Scriptwriting:** AI-generated scripts tailored for sales.
*   🎞️ **High-Quality Output:** Smooth animations and professional transitions.
*   📱 **Social Ready:** Perfect for TikTok, Instagram Reels, and YouTube Shorts (9:16 format).
*   ⚡ **Real-time Preview:** Watch the video generate in real-time.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS, ShadcnUI |
| **Video Engine** | Remotion |
| **AI Model** | Gemini API | OpenAI GPT-4 |
| **Automation** | Puppeteer |
| **State Management** | Zustand, React Query |

---

## � Getting Started

### Prerequisites

*   Node.js v18+
*   Gemini API
*   OpenAI API Key
*   Google Chrome (for Puppeteer scraping)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd ai-video-generator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📄 License

This project is licensed under the MIT License.
