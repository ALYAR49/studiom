'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  title: string;
};

export default function MedyaEklePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<MediaItem>({ type: 'image', url: '', title: '' });
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
    if (!form.title || !form.url) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen başlık ve URL alanlarını doldurun.",
      });
      return;
    }
    setIsSubmitting(true);

    const { error } = await supabase.from('media_items').insert({
      title: form.title,
      url: form.url,
      type: form.type,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata oluştu",
        description: "Medya eklenirken bir sorun oluştu: " + error.message,
      });
    } else {
      toast({
        title: "Başarılı!",
        description: "Medya galeriye başarıyla eklendi.",
      });
      setForm({ type: 'image', url: '', title: '' });
       // Optional: refresh gallery page data or redirect
       router.push('/galeri');
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
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
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
      <h1 className="text-4xl font-headline mb-2">Medya Ekle</h1>
      <p className="text-muted-foreground mb-8">Galeri veya yazılarınız için yeni fotoğraf veya videolar yükleyin.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Yeni Medya Ekle</CardTitle>
          <CardDescription>Yüklenecek medyanın bilgilerini girin.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                type="text"
                placeholder="Örn: Harika bir günbatımı"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Medya URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://ornek.com/resim.jpg"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
               <Label htmlFor="type">Medya Türü</Label>
              <Select
                value={form.type}
                onValueChange={(value: 'image' | 'video') => setForm({ ...form, type: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Medya türünü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Görsel</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <UploadCloud className="mr-2" /> {isSubmitting ? 'Ekleniyor...' : 'Galeriye Ekle'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
