'use client';

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Home, FileText, Image, UploadCloud, Mail, PenSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

const links = [
  { href: '/', label: 'Ana Sayfa', icon: Home },
  { href: '/yazilar', label: 'Yazılar', icon: FileText },
  { href: '/galeri', label: 'Galeri', icon: Image },
  { href: '/iletisim', label: 'İletişim', icon: Mail },
];

const secondaryLinks = [
    { href: '/medya-ekle', label: 'Medya Ekle', icon: UploadCloud },
    { href: '/araclar/baslik-olustur', label: 'Başlık Aracı', icon: PenSquare },
];


export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="block">
          <h1 className="text-2xl font-headline text-center px-2 py-4 text-sidebar-foreground">
            🧑‍💻 Yusuf’un Blogu
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="size-4 mr-2" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenu>
             <SidebarSeparator className="my-2"/>
             {secondaryLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="size-4 mr-2" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

      </SidebarContent>
       <SidebarFooter>
          <SidebarSeparator className="my-2"/>
            <div className="flex items-center justify-between px-2">
                <SidebarMenu className="flex-row !gap-0.5">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith('/admin') || pathname === '/giris'}
                            className="justify-start"
                            size="icon"
                            variant="ghost"
                        >
                            <Link href="/admin">
                            <Shield className="size-4" />
                            <span className="sr-only">Yönetici Paneli</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <ThemeToggle />
            </div>
       </SidebarFooter>
    </>
  );
}
