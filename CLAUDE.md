Create a Next.js playground app for testing a profanity detection system for Keeper Memorials using Vercel AI SDK and shadcn/ui.

TECH STACK:

- Next.js 15 with App Router
- Vercel AI SDK (generateObject function)
- shadcn/ui components
- Zod for schema validation
- OpenAI gpt-4o-mini model
- Bun

You can install any components from shadcn using bun

UI REQUIREMENTS:

1. Main Page Layout:

   - Clean, professional design with Keeper Memorials branding
   - Title: "Memorial Content Moderation Playground"
   - Subtitle: "Test profanity detection for memorial tributes"

2. System Prompt Section:
   - Label: "System Prompt" with info icon tooltip
   - Expandable textarea (collapsible) with the following DEFAULT VALUE:

```
You are a content moderation system for Keeper Memorials, a B2B memorialization platform.

Your role is to detect truly inappropriate language in tributes and memorial messages while respecting authentic emotional expression of grief and loss.

IMPORTANT: Memorials are emotional spaces. People grieving may use strong language to express pain, loss, or frustration (especially about death/illness). This is natural and acceptable.

FLAG content that is:
- Disrespectful, mocking, or insulting toward the deceased
- Hate speech, slurs, or discriminatory language directed at any person or group
- Sexual or explicitly inappropriate content
- Violent threats or harmful language toward others
- Spam, promotional content, or clearly off-topic material

DO NOT FLAG:
- Emotional expressions of grief, even with profanity (e.g., "I fucking miss you", "This is so damn unfair")
- Anger at death, illness, or circumstances (e.g., "Fuck cancer", "Damn this disease")
- Raw authentic feelings about loss (e.g., "I'm so fucking sad", "Why the hell did this happen")
- Cultural or religious expressions that may seem strong but are contextually appropriate

Rules:
- Only return words/phrases that make the content genuinely inappropriate for a memorial
- Support multiple languages
- Detect obfuscated attempts to bypass moderation (e.g., "f@ggot", "n1gger", "b1tch" used as insult)
- When in doubt, allow the content - err on the side of authentic grief expression
- Return an empty array if content is emotionally raw but respectful

Examples:
- "I fucking miss you so much" → []
- "Fuck cancer for taking you from us" → []
- "You were a fucking idiot and nobody liked you" → ["fucking idiot", "nobody liked you"]
- "Rest in peace you stupid bitch" → ["stupid bitch"]
- "Why the hell did this happen to someone so good" → []
- "Damn I wish you were still here" → []
- "Go to hell, you deserved this" → ["Go to hell, you deserved this"]
```

- Make it editable
- Add "Reset to Default" button

3. Input Section:

   - Label: "Memorial Text to Analyze"
   - Large textarea for user input
   - Placeholder: "Enter a memorial tribute or message to test..."
   - Character counter showing length

4. Action Button:

   - Primary button: "Analyze Content"
   - Show loading spinner when processing
   - Disable when textarea is empty

5. Results Modal:

   - Opens when analysis is complete
   - Clean, card-based design
   - Title: "Analysis Results"
   - Two sections:
     a) Status Badge:

     - If flaggedContent is empty: Green badge "✓ Content Approved"
     - If flaggedContent has items: Red badge "⚠ Content Flagged"

     b) Flagged Content List:

     - If empty: Show "No inappropriate content detected"
     - If items exist: Show each flagged phrase in a red-tinted card with the exact text

   - Actions: "Close" button and "Copy JSON" button
   - Close on outside click or ESC key

6. Example Test Cases Section (below main form):
   - Title: "Quick Test Examples"
   - 4-6 example buttons that populate the input textarea:
     - "I fucking miss you so much"
     - "Fuck cancer for taking you"
     - "You were a terrible person"
     - "Rest in peace, beautiful soul"
     - "Damn I wish you were still here"
     - "Go to hell, you deserved this"

FUNCTIONALITY:

The app should have:

- Client component with state management for the form
- API route at /api/analyze that uses generateObject from Vercel AI SDK
- Zod schema:

```typescript
z.object({
  flaggedContent: z
    .array(z.string())
    .describe(
      'Array of specific words or phrases that are inappropriate for memorial content'
    ),
});
```

- Model: openai('gpt-4o-mini')
- Error handling with toast notifications
- Responsive design (mobile-friendly)

DESIGN STYLE:

- Professional and clean
- Soft, respectful color palette (blues, grays)
- Good spacing and typography
- Use shadcn/ui components: Button, Textarea, Dialog, Card, Badge, Separator
- Smooth transitions and animations

Generate a complete, working Next.js app with all components and API routes included.
