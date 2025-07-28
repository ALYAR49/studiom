'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'İsim en az 2 karakter olmalıdır.' }),
  email: z.string().email({ message: 'Geçerli bir e-posta adresi giriniz.' }),
  message: z.string().min(10, { message: 'Mesaj en az 10 karakter olmalıdır.' }).max(500, { message: 'Mesaj en fazla 500 karakter olabilir.' }),
});

export default function IletisimPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const { error } = await supabase.from('messages').insert({
        name: values.name,
        email: values.email,
        message: values.message,
    });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Mesajınız gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.',
      });
    } else {
      toast({
        title: 'Mesajınız Gönderildi!',
        description: 'En kısa sürede size geri dönüş yapacağım.',
      });
      form.reset();
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-headline mb-2">İletişim</h1>
      <p className="text-muted-foreground mb-8">Fikirleriniz, sorularınız veya işbirliği teklifleriniz için bana ulaşın.</p>
      
      <Card>
        <CardHeader>
            <CardTitle>Mesaj Gönder</CardTitle>
            <CardDescription>Aşağıdaki formu doldurarak benimle iletişime geçebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Adınız</FormLabel>
                    <FormControl>
                        <Input placeholder="Yusuf Ç." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>E-posta Adresiniz</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="yusuf@ornek.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Mesajınız</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Merhaba, siteniz harika olmuş..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                 <Send className="mr-2" /> {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
