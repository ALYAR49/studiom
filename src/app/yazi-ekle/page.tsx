'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Save } from 'lucide-react';

export default function YaziEklePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push('/giris');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen başlık ve içerik alanlarını doldurun.",
      });
      return;
    }
    setIsSubmitting(true);

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      image_url: imageUrl || null,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata oluştu",
        description: "Yazı eklenirken bir sorun oluştu: " + error.message,
      });
    } else {
      toast({
        title: "Başarılı!",
        description: "Yazı başarıyla eklendi.",
      });
      setTitle('');
      setContent('');
      setImageUrl('');
      router.push('/yazilar');
    }
    setIsSubmitting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-headline mb-2">Yeni Yazı Ekle</h1>
      <p className="text-muted-foreground mb-8">Düşüncelerinizi ve bilgilerinizi paylaşın.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Yazı Detayları</CardTitle>
          <CardDescription>Aşağıdaki alanları doldurarak yeni bir yazı oluşturun.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                type="text"
                placeholder="Yazınızın başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="imageUrl">Görsel URL (İsteğe Bağlı)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://ornek.com/gorsel.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <Textarea
                id="content"
                placeholder="Yazınızın içeriğini buraya yazın..."
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Save className="mr-2" /> {isSubmitting ? 'Kaydediliyor...' : 'Yazıyı Kaydet'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
