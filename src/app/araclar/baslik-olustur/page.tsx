import TitleGenerator from "@/components/title-generator";

export default function BaslikOlusturPage() {
  return (
    <div>
      <h1 className="text-4xl font-headline mb-2">Başlık Oluşturma Aracı</h1>
      <p className="text-muted-foreground mb-8">Yapay zeka ile makale konunuz için en iyi başlıkları ve anahtar kelimeleri bulun.</p>
      <TitleGenerator />
    </div>
  );
}
