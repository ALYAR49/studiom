'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateArticleTitles, type GenerateArticleTitlesOutput } from '@/ai/flows/generate-article-titles';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Separator } from './ui/separator';

const formSchema = z.object({
  topic: z.string().min(10, { message: 'Konu en az 10 karakter olmalıdır.' }),
});

export default function TitleGenerator() {
  const { toast } = useToast();
  const [generationResult, setGenerationResult] = useState<GenerateArticleTitlesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGenerationResult(null);
    try {
      const result = await generateArticleTitles(values);
      setGenerationResult(result);
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        variant: 'destructive',
        title: 'Bir hata oluştu',
        description: 'Başlıklar oluşturulurken bir sorunla karşılaşıldı. Lütfen tekrar deneyin.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Konu</CardTitle>
            <CardDescription>Başlık ve anahtar kelime oluşturmak istediğiniz konuyu girin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Makale Konusu veya Açıklaması</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Modern web geliştirmede Next.js kullanımı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Oluştur
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Oluşturulan Sonuçlar</CardTitle>
            <CardDescription>Yapay zeka tarafından önerilen başlıklar ve anahtar kelimeler.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-muted-foreground gap-4 pt-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Yaratıcı başlıklar hazırlanıyor...</p>
              </div>
            )}
            {!isLoading && !generationResult && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground gap-4 pt-8">
                <Lightbulb className="h-8 w-8" />
                <p>Başlık ve anahtar kelime önerileri burada görünecektir. <br /> Başlamak için bir konu girin.</p>
              </div>
            )}
            {generationResult && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center"><Sparkles className="mr-2 size-5 text-accent" />Önerilen Başlıklar</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {generationResult.titles.map((title, index) => (
                      <li key={index}>{title}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3">SEO Anahtar Kelimeleri</h3>
                  <div className="flex flex-wrap gap-2">
                    {generationResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
