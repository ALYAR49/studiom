# Proje Dosyalarını Bilgisayara İndirme ve GitHub'a Yükleme

Bu kılavuz, proje kodlarınızı bilgisayarınıza indirip ardından kendi GitHub hesabınıza nasıl yükleyeceğinizi ve veritabanı ayarlarını nasıl yapacağınızı adım adım anlatmaktadır.

## 1. Proje Dosyalarını Bilgisayara İndirme

Bu projenin tüm kodlarını ve dosyalarını bilgisayarınıza bir ZIP arşivi olarak indirmek için lütfen aşağıdaki adımları izleyin:

1.  **İndirme Düğmesini Bulun:** İndirme düğmesi, kod düzenleyicinin veya uygulamanın bir parçası değildir. İçinde çalıştığınız **Firebase Studio arayüzünün üst kısmında** yer alır. Genellikle sağ üst köşede, diğer kontrol düğmelerinin (Paylaş, Ayarlar vb.) yanında bulunur. Düğme üzerinde **"Download Code"**, **"Export as ZIP"** veya benzeri bir metin yazabilir ve genellikle **aşağıyı gösteren bir ok (↓)** simgesine sahiptir.

2.  **Projeyi İndirin:** Bu düğmeye tıkladığınızda, projenin tüm dosyalarını içeren bir `.zip` dosyası bilgisayarınıza indirilmeye başlayacaktır.

3.  **Arşivi Çıkarın:** İndirme işlemi tamamlandıktan sonra, bilgisayarınızdaki `.zip` dosyasına sağ tıklayın ve "Tümünü Çıkart" (Extract All) veya benzeri bir seçeneği seçerek dosyaları bir klasöre çıkarın.

## 2. Supabase Projesi Oluşturma ve Kurulum

Bu uygulamanın çalışması için bir Supabase projesine ihtiyacı var. Aşağıdaki adımları izleyerek Supabase projenizi oluşturabilir ve gerekli veritabanı tablolarını kurabilirsiniz.

### a. Supabase Projesi Oluşturun
1. [supabase.com](https://supabase.com) adresine gidin ve bir hesap oluşturun veya giriş yapın.
2. "New Project" butonuna tıklayarak yeni bir proje oluşturun. Projenize bir isim verin ve güçlü bir veritabanı şifresi belirleyin.
3. Projeniz oluşturulduktan sonra, **Project Settings > API** menüsüne gidin. Buradaki **Project URL** ve **Project API Keys** altındaki `anon` `public` anahtarını kopyalayın.

### b. `.env` Dosyasını Yapılandırın
Proje kodlarınızda, ana dizinde bulunan `.env` dosyasını açın ve Supabase'den aldığınız bilgileri aşağıdaki gibi ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=BURAYA_PROJE_URL'NİZİ_YAPIŞTIRIN
NEXT_PUBLIC_SUPABASE_ANON_KEY=BURAYA_ANON_PUBLIC_ANAHTARINIZI_YAPIŞTIRIN
```

### c. Veritabanı Tablolarını Oluşturun
Aşağıdaki SQL kodlarını Supabase projenizdeki **SQL Editor**'e yapıştırarak gerekli tabloları oluşturun. "+ New query" diyerek yeni bir sorgu penceresi açabilirsiniz.

**1. `posts` Tablosu (Blog Yazıları için):**

```sql
-- "posts" tablosunu oluşturur
CREATE TABLE posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT,
    content TEXT,
    image_url TEXT
);

-- "posts" tablosu için genel okuma izni verir
CREATE POLICY "Allow public read access to posts"
ON posts
FOR SELECT
USING (true);

-- "posts" tablosuna sadece giriş yapmış kullanıcıların veri eklemesine izin verir
CREATE POLICY "Allow authenticated users to insert posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (true);
```

**2. `media_items` Tablosu (Galeri için):**

```sql
-- "media_items" tablosunu oluşturur
CREATE TABLE media_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT,
    url TEXT,
    type TEXT
);

-- "media_items" tablosu için genel okuma izni verir
CREATE POLICY "Allow public read access to media_items"
ON media_items
FOR SELECT
USING (true);

-- "media_items" tablosuna sadece giriş yapmış kullanıcıların veri eklemesine izin verir
CREATE POLICY "Allow authenticated users to insert media_items"
ON media_items
FOR INSERT
TO authenticated
WITH CHECK (true);
```

**3. `messages` Tablosu (İletişim Formu Mesajları için):**

```sql
-- "messages" tablosunu oluşturur
CREATE TABLE messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    email TEXT,
    message TEXT
);

-- "messages" tablosuna herkesin veri eklemesine (mesaj göndermesine) izin verir
CREATE POLICY "Allow public insert to messages"
ON messages
FOR INSERT
WITH CHECK (true);
```

Bu adımları tamamladıktan sonra, uygulamanız Supabase veritabanı ile sorunsuz bir şekilde çalışacaktır.

## 3. Projeyi GitHub'a Yükleme

Proje dosyalarını bilgisayarınıza indirdikten sonra, aşağıdaki adımları izleyerek kendi GitHub hesabınıza yükleyebilirsiniz. (Bu adımlar için bilgisayarınızda `git`'in yüklü olması gerekmektedir.)

1.  **Yeni Bir GitHub Reposu Oluşturun:**
    *   [GitHub.com](https://github.com) adresine gidin ve hesabınıza giriş yapın.
    *   Sağ üst köşedeki "+" simgesine tıklayın ve "New repository" seçeneğini seçin.
    *   Reponuza bir isim verin (örneğin, `benim-blog-projem`).
    *   Repoyu "Public" (Herkese Açık) veya "Private" (Özel) olarak ayarlayabilirsiniz.
    *   **ÖNEMLİ:** "Add a README file", "Add .gitignore" veya "Choose a license" seçeneklerinden **hiçbirini işaretlemeyin**. Boş bir repo oluşturmamız gerekiyor.
    *   "Create repository" düğmesine tıklayın.

2.  **Projeyi Komut Satırından GitHub'a Gönderin:**
    *   Bilgisayarınızda bir terminal (Komut İstemi, PowerShell, veya macOS/Linux'ta Terminal) açın.
    *   `cd` komutu ile daha önce ZIP'ten çıkardığınız proje klasörünün içine gidin. Örneğin: `cd C:\Users\KullaniciAdiniz\Downloads\proje-klasoru`
    *   Aşağıdaki komutları sırayla çalıştırın:

    ```bash
    # Proje klasörünü bir Git reposu olarak başlat
    git init

    # Tüm proje dosyalarını Git'e ekle
    git add .

    # Dosyaların ilk versiyonunu kaydet (commit)
    git commit -m "İlk proje versiyonu"

    # Ana dalın adını "main" olarak ayarla
    git branch -M main

    # GitHub'da oluşturduğun repoyu bu projeye uzaktaki (remote) olarak ekle
    # <URL> yazan yeri GitHub'ın sana verdiği repo URL'si ile değiştir
    git remote add origin <URL>

    # Tüm kodları GitHub'daki "main" dalına gönder
    git push -u origin main
    ```

    **Not:** `<URL>` yazan yeri, GitHub'da repo oluşturduktan sonra size gösterilen URL ile değiştirmeyi unutmayın. Genellikle `https://github.com/kullanici-adiniz/repo-adiniz.git` formatında olur.

Bu adımları tamamladıktan sonra, projenizin tüm kodları kendi GitHub hesabınızda olacaktır. Umarım bu talimatlar yardımcı olur!
