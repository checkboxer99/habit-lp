// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  
  // モバイル対応：ナビゲーションバーの表示制御
  let lastScrollTop = 0;
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      navbar.classList.add('visible');
      
      // モバイルでのスクロール方向による表示制御
      if (window.innerWidth <= 768) {
        if (scrollTop > lastScrollTop && scrollTop > 200) {
          // 下スクロール時は非表示
          navbar.style.transform = 'translateY(-100%)';
        } else {
          // 上スクロール時は表示
          navbar.style.transform = 'translateY(0)';
        }
      }
    } else {
      navbar.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });
  
  // モバイルメニューの制御
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const icon = this.querySelector('i');
      
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        // モバイルメニューが開いた時の処理
        document.body.style.overflow = 'hidden';
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
      }
    });
    
    // メニューリンクをクリックした時にメニューを閉じる
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        document.body.style.overflow = '';
      });
    });
  }
  
  // スムーススクロール機能（モバイル最適化）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - (window.innerWidth <= 768 ? 80 : 100);
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // FAQ アコーディオン機能（モバイル最適化）
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const icon = this.querySelector('i');
      
      // 他のFAQを閉じる（モバイルでは一つずつ開く）
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-question i');
            if (otherAnswer.style.display === 'block') {
              otherAnswer.style.display = 'none';
              otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        });
      }
      
      // 現在のFAQを開閉
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
      } else {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // iOS Safari対応：100vh問題の解決
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
});