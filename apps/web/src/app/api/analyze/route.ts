import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

const schema = z.object({
  flaggedContent: z
    .array(z.string())
    .describe(
      'Array of specific words or phrases that are inappropriate for memorial content'
    ),
});

export async function POST(req: Request) {
  try {
    const { text, systemPrompt } = await req.json();

    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: openai('gpt-5-nano'),
      schema,
      system: systemPrompt,
      prompt: text,
    });

    return Response.json({
      flaggedContent: result.object.flaggedContent,
    });
  } catch (error) {
    console.error('Error analyzing content:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to analyze content';
    return Response.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
