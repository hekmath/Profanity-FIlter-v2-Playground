# Memorial Content Moderation Playground

A Next.js playground app for testing an AI-powered profanity detection system designed specifically for Keeper Memorials. This tool helps test content moderation for memorial tributes while respecting authentic emotional expressions of grief.

## Features

- **AI-Powered Analysis** - Uses OpenAI's GPT-4o-mini with structured outputs via Vercel AI SDK
- **Customizable System Prompt** - Collapsible editor to modify the moderation guidelines
- **Real-time Feedback** - Instant analysis with clear visual indicators
- **Example Test Cases** - Quick-fill buttons with sample memorial texts
- **Professional UI** - Built with shadcn/ui components and responsive design
- **Toast Notifications** - User-friendly feedback using Sonner

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Vercel AI SDK** with `generateObject` function
- **Zod** for schema validation
- **OpenAI** gpt-4o-mini model
- **shadcn/ui** components
- **Tailwind CSS** for styling
- **Turborepo** for monorepo management
- **Bun** package manager

## Getting Started

### Prerequisites

- Bun installed on your machine
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Install the dependencies:

```bash
bun install
```

2. Set up your environment variables:

```bash
# Copy the example file
cp .env.example .env.local

# Add your OpenAI API key to .env.local
OPENAI_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
bun dev:web
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Usage

1. **System Prompt**: Click the chevron icon to expand and customize the moderation guidelines
2. **Enter Text**: Type or paste memorial text into the main textarea
3. **Quick Examples**: Click any example button to test pre-written scenarios
4. **Analyze**: Click "Analyze Content" to run the AI moderation
5. **View Results**: Review flagged content in the modal dialog
6. **Copy Results**: Export the analysis as JSON







## Project Structure

```
profanity-playground/
├── apps/
│   └── web/                          # Next.js application
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/analyze/
│       │   │   │   └── route.ts      # API route for content analysis
│       │   │   ├── layout.tsx        # Root layout with metadata
│       │   │   └── page.tsx          # Main playground UI
│       │   ├── components/
│       │   │   └── ui/               # shadcn/ui components
│       │   └── lib/
│       │       └── utils.ts          # Utility functions
│       └── components.json           # shadcn/ui configuration
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun dev:web`: Start only the web application
- `bun build`: Build all applications
- `bun check-types`: Check TypeScript types across all apps

## How It Works

The app uses OpenAI's structured output feature to ensure consistent, type-safe responses:

1. User submits memorial text and system prompt
2. API route (`/api/analyze`) sends request to OpenAI
3. AI analyzes content using Zod schema validation
4. Returns array of flagged words/phrases
5. UI displays results with status badge and detailed breakdown

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## License

MIT
