# Note Summarizer

A lightweight React web application for summarizing meeting transcripts, articles, and long notes into concise executive summaries and key action items.

## Features

- **Text & Transcript Summarization**: Instantly extracts main points and key takeaways from long text.
- **Client-Side Processing**: Runs extractive NLP directly in the browser with zero server dependencies required.
- **LLM Integration**: Option to connect Google Gemini for generative summaries if an API key is provided.
- **Saved History**: Keeps a local record of saved summaries in your browser using `localStorage`.
- **Responsive Interface**: Clean UI built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/note-summarizer.git
   cd note-summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up Gemini API key:
   Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *If omitted, the app uses built-in client-side text processing.*

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## License

MIT

