# Smart AI Note & Summarizer

A fast, modern React single-page web application designed to instantly process, summarize, and extract key takeaways from text notes and transcripts. Built with React 18, Vite, TypeScript, and Tailwind CSS.

---

## ✨ Features

- ⚡ **Instant Client-Side Summarization**: Powered by an in-browser Extractive Natural Language Processing (NLP) engine—runs 100% on the client without requiring a server.
- 🤖 **Optional Gemini AI Integration**: Integrates directly with Google's Gemini 3.6 Flash model (`@google/genai`) for high-fidelity generative summaries when an API key is provided.
- 📌 **Key Takeaway Extraction**: Automatically distills lengthy text into actionable bullet points.
- 💾 **Local Storage Persistence**: Automatically saves your note history in browser local storage.
- 🎨 **Modern Responsive UI**: Styled with Tailwind CSS, supporting dark/light UI aesthetics with intuitive icons from `lucide-react`.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI / NLP**: `@google/genai` (Client-side) + Browser Extractive NLP Algorithm
- **Icons**: `lucide-react`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/smart-ai-note-summarizer.git
   cd smart-ai-note-summarizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file in the root directory or update `.env.example`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is set, the app seamlessly falls back to the client-side NLP summarization engine.*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
