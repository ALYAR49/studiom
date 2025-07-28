'use server';

/**
 * @fileOverview An AI agent for generating engaging article titles.
 *
 * - generateArticleTitles - A function that generates article titles based on input.
 * - GenerateArticleTitlesInput - The input type for the generateArticleTitles function.
 * - GenerateArticleTitlesOutput - The return type for the generateArticleTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleTitlesInputSchema = z.object({
  topic: z.string().describe('The topic or short description of the article content.'),
});
export type GenerateArticleTitlesInput = z.infer<typeof GenerateArticleTitlesInputSchema>;

const GenerateArticleTitlesOutputSchema = z.object({
  titles: z.array(z.string()).describe('An array of engaging article titles.'),
  keywords: z.array(z.string()).describe('An array of relevant keywords for SEO optimization.'),
});
export type GenerateArticleTitlesOutput = z.infer<typeof GenerateArticleTitlesOutputSchema>;

export async function generateArticleTitles(input: GenerateArticleTitlesInput): Promise<GenerateArticleTitlesOutput> {
  return generateArticleTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticleTitlesPrompt',
  input: {schema: GenerateArticleTitlesInputSchema},
  output: {schema: GenerateArticleTitlesOutputSchema},
  prompt: `You are an expert blog title generator and SEO optimizer.

  Generate 5 engaging article titles based on the provided topic or description.
  Also, identify 5 relevant keywords for SEO optimization.

  Topic/Description: {{{topic}}}

  Format your response as a JSON object with "titles" (array of strings) and "keywords" (array of strings) fields.
  Ensure the titles are creative and attention-grabbing.
`,
});

const generateArticleTitlesFlow = ai.defineFlow(
  {
    name: 'generateArticleTitlesFlow',
    inputSchema: GenerateArticleTitlesInputSchema,
    outputSchema: GenerateArticleTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
