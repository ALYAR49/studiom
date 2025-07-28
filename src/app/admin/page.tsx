'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { ArrowRight, LogOut, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { List, ListItem } from '@/components/ui/list';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push('/giris');
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/giris');
  };

  if (loading) {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-headline mb-2">Yönetici Paneli</h1>
            <p className="text-muted-foreground mb-8">İçerikleri yönetin.</p>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-headline mb-2">Yönetici Paneli</h1>
        <p className="text-muted-foreground mb-8">Hoş geldiniz, {user?.email}</p>

        <Card>
            <CardHeader>
                <CardTitle>İçerik Yönetimi</CardTitle>
                <CardDescription>Yeni içerikler ekleyin veya mevcut olanları düzenleyin.</CardDescription>
            </CardHeader>
            <CardContent>
               <List>
                 <ListItem>
                    <Link href="/medya-ekle" className="flex items-center justify-between group">
                    <span className="group-hover:text-primary transition-colors">📤 Medya Ekle</span>
                    <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </ListItem>
                 <ListItem>
                    <Link href="/yazi-ekle" className="flex items-center justify-between group">
                    <span className="group-hover:text-primary transition-colors">✍️ Yeni Yazı Ekle</span>
                    <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </ListItem>
               </List>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2" /> Çıkış Yap
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
