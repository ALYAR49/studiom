'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
};

export default function YazilarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
      } else if (data) {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-headline mb-2">Yazılar</h1>
      <p className="text-muted-foreground mb-8">Tasarım, teknoloji ve yaratıcılık üzerine düşüncelerim.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading 
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="aspect-video overflow-hidden rounded-md mb-4">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-full mt-1" />
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          : posts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video overflow-hidden rounded-md mb-4 bg-muted">
                   <Image 
                     src={post.image_url || "https://placehold.co/600x400.png"}
                     alt={post.title} 
                     width={600}
                     height={400} 
                     className="object-cover w-full h-full" 
                     data-ai-hint="blog post" />
                </div>
                <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                <CardDescription>{post.content.substring(0, 100)}...</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/yazilar/${post.id}`}>
                    Devamını Oku <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
        ))}
      </div>
       {!loading && posts.length === 0 && (
        <div className="text-center col-span-full py-12 text-muted-foreground">
          <p>Henüz hiç yazı yok.</p>
        </div>
      )}
    </div>
  );
}
