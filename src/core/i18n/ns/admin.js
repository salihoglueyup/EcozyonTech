// Admin CMS copy. Bilingual like every namespace; the dictionary deep-parity
// test enforces matching TR/EN keys, so add to both halves together.
export default {
  tr: {
    title: 'Yönetim',
    signInTitle: 'Yönetime giriş',
    signInIntro: 'İçeriği yönetmek için yetkili bir GitHub hesabıyla giriş yap.',
    signInBtn: 'GitHub ile giriş yap',
    loading: 'Yükleniyor…',
    signedInAs: '{login} olarak giriş yapıldı',
    intro: 'Blog yazılarını buradan oluştur, düzenle ve yayımla.',
    logout: 'Çıkış yap',
    errors: {
      unconfigured: 'Giriş henüz yapılandırılmadı (sunucu sırları eksik).',
      forbidden: 'Bu GitHub hesabı yetkili değil.',
      state: 'Oturum doğrulaması başarısız oldu; lütfen tekrar dene.',
      oauth: 'GitHub ile bağlantı kurulamadı; lütfen tekrar dene.',
    },
  },
  en: {
    title: 'Admin',
    signInTitle: 'Sign in to admin',
    signInIntro: 'Sign in with an authorized GitHub account to manage content.',
    signInBtn: 'Sign in with GitHub',
    loading: 'Loading…',
    signedInAs: 'Signed in as {login}',
    intro: 'Create, edit and publish blog posts from here.',
    logout: 'Sign out',
    errors: {
      unconfigured: 'Sign-in is not configured yet (server secrets are missing).',
      forbidden: 'This GitHub account is not authorized.',
      state: 'Session validation failed; please try again.',
      oauth: 'Could not connect to GitHub; please try again.',
    },
  },
};
