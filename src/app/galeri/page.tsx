'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from '@/components/ui/skeleton';

type MediaItem = {
  id: number;
  title: string;
  url: string;
  type: 'image' | 'video';
  created_at: string;
};

export default function GaleriPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMediaItems(data as MediaItem[]);
      } else if (error) {
        console.error("Error fetching media:", error);
      }
      setLoading(false);
    };

    fetchMedia();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-headline mb-2">Galeri</h1>
      <p className="text-muted-foreground mb-8">Projelerimden ve ilham kaynaklarımdan bir seçki.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading 
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-[250px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))
          : mediaItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group flex flex-col">
                <div className="aspect-video bg-black flex items-center justify-center">
                  {item.type === 'image' ? (
                     <Image
                        src={item.url}
                        alt={item.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                  ) : (
                    <video controls className="w-full h-full object-contain">
                      <source src={item.url} type="video/mp4" />
                      Tarayıcınız video etiketini desteklemiyor.
                    </video>
                  )}
                </div>
                <div className="p-3 text-center font-medium bg-card flex-grow flex items-center justify-center">
                  <h3 className="text-sm">{item.title}</h3>
                </div>
              </Card>
        ))}
      </div>
      {!loading && mediaItems.length === 0 && (
        <div className="text-center col-span-full py-12 text-muted-foreground">
          <p>Galeride henüz hiç medya yok.</p>
        </div>
      )}
    </div>
  );
}
