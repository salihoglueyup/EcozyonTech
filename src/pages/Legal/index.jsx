import { PageHeader, Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { Reveal } from '@/shared/ui/useReveal';
import { SectionNav } from '@/shared/ui/SectionNav';

const meta = routeByKey('legal');

const SECTIONS = [
  {
    id: 'privacy',
    title: { tr: 'Gizlilik ve Kişisel Verilerin Korunması Politikası (KVKK)', en: 'Privacy and Personal Data Protection Policy' },
    body: {
      tr: [
        'Ecozyon Tech ("Şirket", "Biz" veya "Ecozyon Tech") olarak veri gizliliğinize en üst düzeyde önem veriyor, kişisel verilerinizi Türkiye Cumhuriyeti Anayasası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK"), ilgili ikincil mevzuat ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) dahil olmak üzere uluslararası standartlara tam uyum içinde işliyoruz. Bu kapsamlı aydınlatma metni, veri sorumlusu sıfatıyla Ecozyon Tech tarafından kişisel verilerinizin nasıl toplandığı, hangi hukuki sebeplerle işlendiği, kimlere aktarılabileceği ve veri güvenliğinizin nasıl sağlandığı hakkında size detaylı ve şeffaf bir bilgi sunmak amacıyla hazırlanmıştır.',
        '1. Toplanan Kişisel Verileriniz ve Toplanma Yöntemleri: Platformumuzu kullanımınız sırasında çeşitli kategorilerde kişisel veriler elde etmekteyiz. Bunlar; Kimlik Bilgileri (Ad, Soyad), İletişim Bilgileri (E-posta adresi, telefon numarası), Mesleki Bilgiler (Çalışılan şirket, unvan, sektör), İşlem Güvenliği Bilgileri (IP adresi, tarayıcı bilgileri, log kayıtları, cihaz türü) ve Talep/Şikayet Bilgileri (Bize ilettiğiniz form mesajları ve müşteri hizmetleri etkileşimleri) şeklindedir. Bu veriler, web sitemiz üzerindeki iletişim formlarını doldurmanız, e-bültenimize abone olmanız, ürün demosu talep etmeniz, çerez onayınızı vermeniz ve platformumuzla doğrudan etkileşime girmeniz durumunda otomatik veya kısmen otomatik yöntemlerle elektronik ortamda toplanmaktadır.',
        '2. Kişisel Verilerinizin İşlenme Amaçları: Toplanan kişisel verileriniz KVKK\'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde; (i) Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli operasyonel süreçlerin yürütülmesi, (ii) Ürün ve hizmetlerimizin sizlere özelleştirilerek sunulması, (iii) Müşteri memnuniyeti, talep ve şikayet yönetiminin sağlanması, (iv) Şirketimizin ticari ve iş stratejilerinin belirlenmesi ve uygulanması, (v) Bilgi güvenliği süreçlerinin yürütülmesi ve siber saldırılara karşı önlem alınması, (vi) İlgili mevzuatlardan doğan yasal yükümlülüklerimizin (örneğin 5651 sayılı kanun kapsamındaki log kayıtları) yerine getirilmesi amaçlarıyla işlenmektedir.',
        '3. Kişisel Verilerin Aktarımı ve Paylaşımı: Topladığımız veriler, hizmetin ifası, yasal yükümlülüklerin yerine getirilmesi veya meşru menfaatlerimiz doğrultusunda kesinlikle gizlilik sözleşmeleri (NDA) ile korunan üçüncü taraflarla paylaşılabilir. Bu kapsamda verileriniz; bulut altyapı sağlayıcılarımıza (örn. AWS, Vercel), e-posta ve iletişim otomasyonu servislerimize (örn. Resend, Sendgrid) ve gerekli durumlarda yasal mercilere (mahkemeler, savcılıklar) KVKK’nın 8. ve 9. maddelerinde belirtilen şartlara uygun olarak aktarılabilmektedir. Ecozyon Tech, kişisel verilerinizi asla reklam ağlarına veya üçüncü taraf veri brokerlarına satmaz.',
        '4. Veri Güvenliği ve Saklama Süreleri: Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca veya ilgili mevzuatta öngörülen yasal saklama süreleri (genellikle 2 ila 10 yıl) boyunca saklanmaktadır. Verileriniz, AES-256 şifreleme standartları, katı erişim kontrolü (Role-Based Access Control) politikaları ve düzenli bağımsız siber güvenlik sızma testleri (penetration tests) ile korunan sunucularda barındırılmaktadır. Yapay zeka algoritmalarımızda müşteri geri bildirimlerini işlerken veriler derhal anonimleştirilir (personally identifiable information stripping) ve geri döndürülemez hale getirilir.',
        '5. KVKK Madde 11 Kapsamındaki Haklarınız: İlgili kişi olarak KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme, KVKK’nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme ve işlemlerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme haklarına sahipsiniz. Başvurularınızı yasal formatta hello@ecozyon.tech üzerinden bize iletebilirsiniz.',
      ],
      en: [
        'At Ecozyon Tech ("Company", "We", or "Ecozyon Tech"), we attach the utmost importance to your data privacy. We process your personal data in full compliance with the Constitution of the Republic of Turkey, the Personal Data Protection Law No. 6698 ("KVKK"), secondary legislation, and international standards including the European Union General Data Protection Regulation (GDPR). This comprehensive privacy notice is prepared to provide you with transparent, detailed information on how your personal data is collected, the legal grounds for processing, entities it may be transferred to, and the measures taken to secure your data by Ecozyon Tech as the data controller.',
        '1. Collected Personal Data and Collection Methods: During your use of our platform, we obtain personal data across various categories. These include; Identity Information (Name, Surname), Contact Information (Email address, phone number), Professional Information (Company name, title, industry), Transaction Security Information (IP address, browser information, log records, device type), and Request/Complaint Information (Messages submitted via forms and customer service interactions). This data is collected electronically through automated or semi-automated methods when you fill out contact forms, subscribe to our newsletter, request product demos, grant cookie consent, or interact directly with our platform.',
        '2. Purposes of Processing Personal Data: Your collected personal data is processed within the conditions specified in Articles 5 and 6 of the KVKK for the following purposes: (i) executing operational processes necessary to benefit you from the products and services offered by our Company, (ii) customizing our products and services to your preferences, (iii) managing customer satisfaction, requests, and complaints, (iv) determining and implementing our Company’s commercial and business strategies, (v) executing information security processes and preventing cyber attacks, and (vi) fulfilling our legal obligations arising from relevant legislation (e.g., log keeping under Law No. 5651).',
        '3. Transfer and Sharing of Personal Data: We may share the data we collect with third parties strictly protected by Non-Disclosure Agreements (NDAs) for the performance of our services, fulfillment of legal obligations, or our legitimate interests. In this context, your data may be transferred to our cloud infrastructure providers (e.g., AWS, Vercel), email and communication automation services (e.g., Resend), and when necessary, to legal authorities (courts, prosecutors) in accordance with Articles 8 and 9 of the KVKK. Ecozyon Tech absolutely never sells your personal data to ad networks or third-party data brokers.',
        '4. Data Security and Retention Periods: Your personal data is retained for the duration required by the processing purposes or the legal retention periods prescribed by relevant legislation (typically ranging from 2 to 10 years). Your data is hosted on servers protected by AES-256 encryption standards, strict Role-Based Access Control (RBAC) policies, and regular independent cybersecurity penetration tests. When processing customer feedback within our AI algorithms, the data is immediately anonymized (personally identifiable information stripping) and rendered irreversible.',
        '5. Your Rights Under Article 11 of KVKK: As a data subject, under Article 11 of the KVKK, you have the right to: learn whether your personal data is processed, request information if it has been processed, learn the purpose of processing and whether it is used accordingly, know the third parties to whom your data is transferred domestically or abroad, request correction if it is incomplete or incorrectly processed, request deletion or destruction of your personal data within the framework of the conditions stipulated in Article 7 of the KVKK, and request notification of the operations made to third parties to whom your data has been transferred. You can submit your applications in legal format to us via hello@ecozyon.tech.',
      ],
    },
  },
  {
    id: 'cookies',
    title: { tr: 'Genişletilmiş Çerez (Cookie) ve Takip Teknolojileri Politikası', en: 'Extended Cookie and Tracking Technologies Policy' },
    body: {
      tr: [
        'Ecozyon Tech platformu olarak, size daha iyi, hızlı, güvenli ve kişiselleştirilmiş bir web deneyimi sunabilmek adına çerez (cookie), web işaretçileri (web beacons), pikseller (pixels) ve yerel depolama (localStorage/sessionStorage) gibi takip teknolojilerini kullanıyoruz. Bu kapsamlı metin, sitemizde hangi teknolojilerin kullanıldığını, işlevlerini ve tarayıcı ayarlarınız üzerinden bu teknolojileri nasıl tam anlamıyla yönetebileceğinizi açıklamaktadır.',
        '1. Kullandığımız Çerez Türleri ve Amaçları: Sitemiz prensip gereği mahremiyetinizi (privacy-first) ihlal edebilecek agresif reklam çerezleri kullanmamaktadır. Sistemimizde aktif olan çerezler şunlardır: (a) Kesinlikle Gerekli (Zorunlu) Çerezler: Sitenin temel navigasyonu, güvenli alanlara erişim ve oturum yönetimi (JWT tabanlı session çerezleri) için elzemdir. Bu çerezler kapatılamaz. (b) İşlevsel Çerezler ve Yerel Depolama: Sitemizdeki arayüz tercihlerinizi (karanlık/aydınlık tema seçimi, dil tercihi i18n, vurgu rengi kişiselleştirmeleri) ve araçlara (örneğin ROI hesaplayıcı) girdiğiniz geçici verileri yalnızca tarayıcınızın "localStorage" alanında tutar. (c) Performans ve Analitik Çerezleri: Sitenin nasıl kullanıldığını analiz etmek, sayfa yükleme sürelerini ölçmek ve hataları tespit etmek için anonim veriler (Google Analytics veya kendi iç analitik tool\'umuz aracılığıyla, IP adresleri maskelenerek) toplanır.',
        '2. Yerel Depolama (Local Storage) Kullanımı İfşası: Geleneksel çerezlerin aksine, "localStorage" verileri her HTTP isteğiyle sunucularımıza otomatik olarak gönderilmez. Arayüz ayarlarınız sadece cihazınızda kalır. Sunucularımız, sadece uygulamanın gerektirdiği spesifik anlarda (örneğin bir formu kaydederken veya admin paneline giriş yaparken) bu verilere erişim talebinde bulunur.',
        '3. Çerez Yönetimi ve Opt-out (Vazgeçme) Hakkı: Sitemizi kullanmaya devam ederek onay verdiğiniz çerezleri dilediğiniz zaman tarayıcı ayarlarınızdan (Chrome, Safari, Firefox vb.) silebilir veya tamamen engelleyebilirsiniz. Çerez uyarı banner\'ımızı kapattığınızda, bu eylemin hatırlanması için "eco_cookie_consent" adında 1 yıl geçerli küçük bir onay çerezi cihazınıza bırakılır. Tarayıcınızda "Do Not Track" (DNT) sinyali açık ise, sistemimiz bunu algılayarak analitik çerezlerini otomatik olarak devre dışı bırakır. Lütfen zorunlu çerezleri engellemeniz durumunda admin girişlerinin ve dinamik temaların çalışmayacağını unutmayın.',
      ],
      en: [
        'The Ecozyon Tech platform employs tracking technologies such as cookies, web beacons, pixels, and local storage (localStorage/sessionStorage) to offer you a better, faster, more secure, and personalized web experience. This comprehensive policy explains which technologies are used on our site, their core functions, and how you can fully manage them via your browser settings.',
        '1. Types of Cookies We Use and Their Purposes: As a privacy-first platform, our site fundamentally refrains from using aggressive advertising cookies that violate your privacy. The cookies active in our system are: (a) Strictly Necessary Cookies: Essential for basic site navigation, accessing secure areas, and session management (JWT-based session cookies). These cannot be disabled. (b) Functional Cookies and Local Storage: Retains your interface preferences (dark/light theme, i18n language preference, accent color personalizations) and temporary data entered into tools (e.g., ROI calculator) solely within your browser’s "localStorage". (c) Performance and Analytics Cookies: Used to analyze how the site is used, measure page load times, and detect errors by collecting anonymous data (via Google Analytics or our internal analytics tool, with IP addresses strictly masked).',
        '2. Disclosure on the Use of Local Storage: Unlike traditional cookies, "localStorage" data is not automatically transmitted to our servers with every HTTP request. Your interface settings remain exclusively on your device. Our servers only request access to this data at specific moments required by the application (e.g., when saving a form state or logging into the admin panel).',
        '3. Cookie Management and Opt-out Rights: You can delete or completely block the cookies you consented to by continuing to use our site at any time through your browser settings (Chrome, Safari, Firefox, etc.). When you dismiss our cookie consent banner, a small consent cookie named "eco_cookie_consent" valid for 1 year is dropped on your device to remember this action. If the "Do Not Track" (DNT) signal is enabled in your browser, our system detects this and automatically disables analytics cookies. Please note that blocking strictly necessary cookies will disrupt admin logins and dynamic theming functionalities.',
      ],
    },
  },
  {
    id: 'terms',
    title: { tr: 'Kullanım Şartları ve Hizmet Sözleşmesi (TOS)', en: 'Terms of Service and Service Agreement (TOS)' },
    body: {
      tr: [
        'Ecozyon Tech platformuna, web sitemize ve sunduğumuz yapay zeka (AI) destekli bulut servislerine ("Hizmetler") hoş geldiniz. Bu web sitesine erişim sağlayarak, sayfalar arasında gezinerek veya sunduğumuz servisleri kullanarak aşağıdaki kullanım şartlarını, yasal uyarıları ve feragatnameleri ("Sözleşme") eksiksiz ve koşulsuz olarak okuduğunuzu, anladığınızı ve yasal olarak bağlayıcı olduğunu kabul etmiş sayılırsınız.',
        '1. Fikri Mülkiyet Hakları ve Telif: Sitemizde yer alan tüm metinler, grafikler, illüstrasyonlar, kullanıcı arayüzleri (UI), kullanıcı deneyimi (UX) tasarımları, yazılım kodları, veritabanı mimarisi, yapay zeka algoritmaları, algoritmik modeller, logolar ve markalar ("İçerik") (açık kaynaklı lisanslarla belirtilen üçüncü taraf kütüphaneler hariç) Ecozyon Tech’in münhasır mülkiyetindedir ve uluslararası telif hakları, marka hukuku ve diğer fikri mülkiyet kanunları ile korunmaktadır. Önceden yazılı izin alınmaksızın İçeriğin kopyalanması, tersine mühendisliğe (reverse engineering) tabi tutulması, ticari amaçla uyarlanması veya iframe ile başka sitelerde yayınlanması kesinlikle yasaktır.',
        '2. Hizmetlerin "Olduğu Gibi" Sunulması (As-Is Clause) ve Garanti Reddi: Şu an için platformumuz bir pilot (beta), teknolojik vitrin ve tanıtım niteliği taşımaktadır. Sunulan tüm içerikler, istatistikler ve yapay zeka çıktıları bilgilendirme amaçlıdır. Ecozyon Tech, hizmetlerin kesintisiz çalışacağını, tamamen hatasız olacağını, belirli bir amaca veya ticari beklentiye uygun olacağını açık veya zımni hiçbir şekilde garanti etmez (No Warranty of Merchantability or Fitness for a Particular Purpose). Algoritmaların ürettiği tahmin ve öneriler üzerinden alınacak ticari kararların tüm riski tamamen kullanıcıya aittir.',
        '3. Sınırlandırılmış Sorumluluk (Limitation of Liability): İlgili kanunların izin verdiği ölçüde; Ecozyon Tech, yöneticileri, çalışanları, iştirakleri veya tedarikçileri, sitenin kullanımından, kullanılamamasından, veri kaybından, güvenlik ihlallerinden veya yetkisiz erişimden doğabilecek hiçbir doğrudan, dolaylı, özel, arızi veya cezai zarardan (kâr kaybı, itibar kaybı dahil) sorumlu tutulamaz. Toplam sorumluluğumuz, her halükarda kullanıcının hizmetler için son 12 ayda ödediği miktar (eğer varsa) ile sınırlıdır.',
        '4. Kabul Edilebilir Kullanım Politikası (AUP) ve Fesih: Kullanıcılar, sistemi yasalara aykırı, hileli veya zarar verici amaçlarla kullanamazlar. Sistemin kasıtlı olarak yavaşlatılması (DDoS vb.), sızma girişimlerinde bulunulması, güvenlik açıklarının taranması, API uç noktalarının (endpoints) yetkisiz scriptler, spam botları veya veri kazıma (web scraping) araçları ile suistimal edilmesi kesinlikle yasaktır. Bu şartların ihlali durumunda, Ecozyon Tech önceden haber vermeksizin kullanıcının IP adresini engelleme, erişimini kalıcı olarak askıya alma ve ilgili yasal mercilere (savcılığa) suç duyurusunda bulunma hakkını saklı tutar.',
        '5. Uygulanacak Hukuk ve Uyuşmazlıkların Çözümü: Bu sözleşmeden doğabilecek her türlü ihtilafın çözümünde Türkiye Cumhuriyeti kanunları uygulanacaktır. Sözleşmenin ifasından veya yorumlanmasından kaynaklanabilecek uyuşmazlıklarda İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.',
        '6. Değişiklikler ve Güncellemeler: Ecozyon Tech, pazar koşulları, teknolojik altyapı değişiklikleri veya yeni yasal zorunluluklar sebebiyle bu Kullanım Şartlarını dilediği zaman, önceden bildirimde bulunmaksızın tek taraflı olarak güncelleme hakkını saklı tutar. Sözleşmede yapılan önemli değişiklikler, sitenin ana sayfasında veya bu dokümanın en üst kısmında yayınlandığı andan itibaren yürürlüğe girer. Sitemizi kullanmaya devam etmeniz, değiştirilmiş şartları kabul ettiğiniz anlamına gelir.',
      ],
      en: [
        'Welcome to the Ecozyon Tech platform, our website, and our artificial intelligence (AI) powered cloud services ("Services"). By accessing this website, navigating its pages, or utilizing the services we provide, you acknowledge that you have fully and unconditionally read, understood, and agreed to be legally bound by the following terms of service, legal notices, and disclaimers ("Agreement").',
        '1. Intellectual Property Rights and Copyright: All texts, graphics, illustrations, user interfaces (UI), user experience (UX) designs, software codes, database architectures, AI algorithms, algorithmic models, logos, and trademarks ("Content") present on our site (excluding expressly identified open-source third-party libraries) are the exclusive property of Ecozyon Tech. They are protected by international copyright laws, trademark laws, and other intellectual property statutes. Unauthorized copying, reverse engineering, commercial adaptation, or framing of the Content on other websites without prior written consent is strictly prohibited.',
        '2. Provision of Services "As-Is" and Disclaimer of Warranties: Currently, our platform operates partly as a pilot (beta), technological showcase, and promotional entity. All provided content, statistics, and AI outputs are for informational purposes. Ecozyon Tech makes no express or implied warranties that the services will be uninterrupted, entirely error-free, or suitable for a particular purpose or commercial expectation (No Warranty of Merchantability or Fitness for a Particular Purpose). The entire risk arising out of commercial decisions based on predictions and recommendations generated by the algorithms remains solely with the user.',
        '3. Limitation of Liability: To the maximum extent permitted by applicable law, in no event shall Ecozyon Tech, its directors, employees, affiliates, or suppliers be liable for any direct, indirect, special, incidental, consequential, or punitive damages (including loss of profits or loss of reputation) arising from the use of, inability to use, data loss, security breaches, or unauthorized access to the site. In any case, our total liability shall be limited strictly to the amount (if any) paid by the user for the services in the preceding 12 months.',
        '4. Acceptable Use Policy (AUP) and Termination: Users may not utilize the system for illegal, fraudulent, or malicious purposes. Deliberate attempts to degrade system performance (e.g., DDoS), unauthorized penetration testing, vulnerability scanning, or abusing API endpoints with unauthorized scripts, spam bots, or web scraping tools are strictly forbidden. In the event of any violation of these terms, Ecozyon Tech reserves the right to block the user’s IP address, permanently suspend access without prior notice, and file a criminal complaint with the relevant legal authorities.',
        '5. Governing Law and Dispute Resolution: The laws of the Republic of Turkey shall govern the resolution of any disputes arising from this agreement. The Istanbul Central (Çağlayan) Courts and Execution Offices shall have exclusive jurisdiction over any disputes arising from the performance or interpretation of this Agreement.',
        '6. Amendments and Updates: Ecozyon Tech reserves the unilateral right to update these Terms of Service at any time without prior notice, due to market conditions, technological infrastructure changes, or new legal requirements. Significant changes to the agreement take effect immediately upon publication on the site’s homepage or at the top of this document. Your continued use of our site constitutes your acceptance of the modified terms.',
      ],
    },
  },
];

export default function LegalPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  useDocumentMeta(
    meta.title[lang],
    tr ? 'Gizlilik politikası (KVKK) ve kullanım şartları.' : 'Privacy policy and terms of service.',
  );

  const navSections = SECTIONS.map((s) => ({ id: s.id, label: s.title[lang] }));

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <SectionNav sections={navSections} />
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <PageHeader
            eyebrow={tr ? 'Yasal' : 'Legal'}
            title={tr ? 'Gizlilik & Şartlar' : 'Privacy & Terms'}
            intro={tr ? 'Son güncelleme: Mayıs 2026' : 'Last updated: May 2026'}
            className="mb-12 max-w-3xl"
          />
        </Reveal>

        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={i * 50}>
              <div id={s.id} className="scroll-mt-28 rounded-2xl eco-card p-6 md:p-10 border-l-4 border-l-cyan-500">
                <h2 className="font-display text-[22px] tracking-tight text-slate-900 dark:text-slate-100 mb-6">{s.title[lang]}</h2>
                <div className="space-y-4">
                  {s.body[lang].map((p, j) => (
                    <p key={j} className="text-[14.5px] text-slate-700 dark:text-slate-300 leading-[1.75]">{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
