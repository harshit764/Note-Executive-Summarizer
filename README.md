# Note Summarizer

> Turn long meeting transcripts, articles, and notes into concise summaries and actionable next steps — directly in your browser.

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge)](<YOUR_LIVE_DEMO_URL>)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](<YOUR_GITHUB_REPO_URL>)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

## Overview

Note Summarizer is a lightweight React application that converts long-form content into clear executive summaries and key action items.

It supports two summarization modes:

- **Client-side extractive summarization** for instant, private, zero-server processing.
- **Google Gemini-powered summarization** for more natural and context-aware summaries when an API key is configured.

The app is designed for professionals, students, and teams who need to quickly understand long meeting notes, research articles, and transcripts.

## Live Preview

> Add your deployed link and screenshots here.

- **Live Demo:** [View Application](<YOUR_LIVE_DEMO_URL>)
- **Repository:** [View Source Code](<YOUR_GITHUB_REPO_URL>)

### Screenshots

| Main Workspace | Saved History |
|---|---|
| ![Main workspace](<SCREENSHOT_URL_1>) | ![Saved summaries](<SCREENSHOT_URL_2>) |

## Key Features

### Smart Summarization

- Converts long text into concise summaries.
- Extracts the most important sentences and key takeaways.
- Generates actionable items from meeting notes and transcripts.
- Handles articles, reports, meeting notes, and general text.

### Dual Processing Modes

#### Client-Side Mode

- Runs directly in the browser.
- Requires no backend or external service.
- Keeps user content private.
- Works even without an API key.

#### Gemini Mode

- Uses Google Gemini for generative summaries.
- Produces more natural, structured, and context-aware output.
- Enabled only when a Gemini API key is configured.

### Saved Summary History

- Save important summaries for later reference.
- Stores history locally using `localStorage`.
- No account or database required.
- Delete saved summaries when they are no longer needed.

### Responsive User Interface

- Works across desktop, tablet, and mobile devices.
- Clean and focused writing experience.
- Built with reusable React components.
- Includes loading, empty, and error states.

## Why I Built This

Long-form information is everywhere, but extracting the important points manually takes time.

I built Note Summarizer to explore:

- Practical NLP techniques in the browser.
- AI-assisted user experiences.
- Client-side privacy-first application design.
- Local persistence without a traditional backend.
- Responsive UI development with React and Tailwind CSS.

## Technical Highlights

- Built with **React 19** and **TypeScript**.
- Uses **Vite** for fast development and optimized production builds.
- Implements browser-based extractive text processing.
- Supports optional Gemini API integration.
- Uses `localStorage` for persistent summary history.
- Fully responsive UI using Tailwind CSS.
- Uses Lucide React for consistent icons.
- Includes fallback behavior when the AI service is unavailable.
- Designed with a modular and extensible component structure.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and build tooling |
| Tailwind CSS | Responsive styling |
| Lucide React | Interface icons |
| Google Gemini API | Optional generative summarization |
| Browser localStorage | Local summary history |

## How It Works

```text
User enters long-form text
          |
          v
Application validates the input
          |
          +-----------------------------+
          |                             |
          v                             v
Client-side summarization       Gemini summarization
          |                             |
          +-------------+---------------+
                        |
                        v
        Summary and action items are displayed
                        |
                        v
              User can save the result
