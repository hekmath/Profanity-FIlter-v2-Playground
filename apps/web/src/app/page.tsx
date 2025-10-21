'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Info, Loader2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const DEFAULT_SYSTEM_PROMPT = `You are a content moderation system for Keeper Memorials, a B2B memorialization platform.

Your role is to detect truly inappropriate language in tributes and memorial messages while respecting authentic emotional expression of grief and loss.

IMPORTANT: Memorials are emotional spaces. People grieving may use strong language to express pain, loss, or frustration (especially about death/illness). This is natural and acceptable.

FLAG content that is:
- Disrespectful, mocking, or insulting toward the deceased
- Hate speech, slurs, or discriminatory language directed at any person or group
- Sexual or explicitly inappropriate content
- Violent threats or harmful language toward others
- Spam, promotional content, or clearly off-topic material
- Religious or moral judgment of the deceased (implying they deserved death, were punished by a higher power, or are condemned)

Note on religious language: Religious and spiritual expressions are welcome when comforting, but NOT when:
- Implying the deceased is being punished or judged by a higher power
- Suggesting they deserved their death due to divine/moral judgment
- Using religious concepts to condemn, diminish, or cast negative judgment on the deceased

DO NOT FLAG:
- Emotional expressions of grief, even with profanity (e.g., "I fucking miss you", "This is so damn unfair")
- Anger at death, illness, or circumstances (e.g., "Fuck cancer", "Damn this disease")
- Raw authentic feelings about loss (e.g., "I'm so fucking sad", "Why the hell did this happen")
- Comforting religious/spiritual beliefs about the afterlife (e.g., "They're with God now", "Heaven gained an angel", "May they find peace in the next life")
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
- "God has judged them" → ["God has judged them"]
- "They're paying for their sins now" → ["paying for their sins"]
- "God punished them for their choices" → ["God punished them for their choices"]
- "They're with God now, at peace" → []
- "Heaven gained an angel today" → []`;

const EXAMPLE_CASES = [
  'I fucking miss you so much',
  'Fuck cancer for taking you',
  'You were a terrible person',
  'Rest in peace, beautiful soul',
  'Damn I wish you were still here',
  'Go to hell, you deserved this',
];

export default function Home() {
  const [memorialText, setMemorialText] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    flaggedContent: string[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!memorialText.trim()) {
      toast.error('Please enter memorial text to analyze');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: memorialText,
          systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to analyze content';
      toast.error(errorMessage);
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyJSON = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  const handleResetSystemPrompt = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    toast.success('System prompt reset to default');
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Theme Toggle */}
      <div className="flex justify-end">
        <ModeToggle />
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Keeper Profanity Filter v2 Playground
        </h1>
        <p className="text-muted-foreground text-lg">
          Test profanity detection
        </p>
      </div>

      <Separator />

      {/* System Prompt Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">System Prompt</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="The system prompt defines how the AI should moderate content"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSystemPrompt}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setIsSystemPromptExpanded(!isSystemPromptExpanded)
                }
              >
                {isSystemPromptExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {isSystemPromptExpanded && (
          <CardContent>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Enter system prompt..."
            />
          </CardContent>
        )}
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Memorial Text to Analyze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={memorialText}
            onChange={(e) => setMemorialText(e.target.value)}
            className="min-h-[150px]"
            placeholder="Enter a memorial tribute or message to test..."
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {memorialText.length} characters
            </span>
            <Button
              onClick={handleAnalyze}
              disabled={!memorialText.trim() || isAnalyzing}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Content'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Test Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXAMPLE_CASES.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => setMemorialText(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analysis Results</DialogTitle>
            <DialogDescription>
              Content moderation analysis complete
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              {analysisResult?.flaggedContent.length === 0 ? (
                <Badge
                  variant="default"
                  className="text-base px-6 py-2 bg-green-500 hover:bg-green-600"
                >
                  ✓ Content Approved
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-base px-6 py-2">
                  ⚠ Content Flagged
                </Badge>
              )}
            </div>

            <Separator />

            {/* Flagged Content List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Flagged Content:</h3>
              {analysisResult?.flaggedContent.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="py-6 text-center text-muted-foreground">
                    No inappropriate content detected
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {analysisResult?.flaggedContent.map((item, index) => (
                    <Card
                      key={index}
                      className="border-destructive/50 bg-destructive/10"
                    >
                      <CardContent className="py-3 px-4">
                        <p className="font-mono text-sm">{item}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCopyJSON}>
                Copy JSON
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
