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
        
        // モバイルでFAQが開いた時、少し上にスクロール
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            const rect = faqItem.getBoundingClientRect();
            if (rect.top < 100) {
              window.scrollTo({
                top: window.pageYOffset + rect.top - 120,
                behavior: 'smooth'
              });
            }
          }, 300);
        }
      }
    });
  });

  // 初期状態でFAQの回答を非表示
  document.querySelectorAll('.faq-answer').forEach(answer => {
    answer.style.display = 'none';
  });

  // モバイル向け：スクロール時のアニメーション（パフォーマンス最適化）
  const observerOptions = {
    threshold: window.innerWidth <= 768 ? 0.05 : 0.1,
    rootMargin: window.innerWidth <= 768 ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // アニメーション対象の要素を監視
  document.querySelectorAll('.feature-card, .testimonial-card, .faq-item, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // CTAボタンのクリック追跡（アナリティクス用）
  document.querySelectorAll('.cta-button, .plan-button').forEach(button => {
    button.addEventListener('click', function() {
      // Google Analytics や他の分析ツール用のイベント送信
      console.log('CTA Button clicked:', this.textContent);
      
      // 例：Google Analytics 4 の場合
      // gtag('event', 'click', {
      //   'event_category': 'CTA',
      //   'event_label': this.textContent
      // });
    });
  });

  // モバイル対応: タッチイベントの最適化
  let touchStartY = 0;
  let touchStartTime = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchStartY - touchY;
    const touchTime = Date.now() - touchStartTime;
    
    // 速いスワイプを検知
    if (touchTime < 300 && Math.abs(touchDiff) > 50) {
      // 上スワイプでCTAボタンを軽く強調
      if (touchDiff > 0) {
        document.querySelectorAll('.cta-button, .plan-button').forEach(btn => {
          btn.style.transform = 'scale(1.02)';
          setTimeout(() => {
            btn.style.transform = '';
          }, 200);
        });
      }
    }
  }, { passive: true });

  // モバイル向け：画面サイズ変更時の対応
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // 画面サイズが変わった時の処理
      if (window.innerWidth > 768) {
        // デスクトップサイズになった時、モバイルメニューを閉じる
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuBtn.querySelector('i').classList.remove('fa-times');
          mobileMenuBtn.querySelector('i').classList.add('fa-bars');
          document.body.style.overflow = '';
        }
      }
    }, 250);
  }, { passive: true });

  // iOS Safari対応：100vh問題の解決
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVH();
  window.addEventListener('resize', setVH, { passive: true });

  // モバイル向け：フォーカス時のズーム防止
  if (window.innerWidth <= 768) {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        if (this.style.fontSize !== '16px') {
          this.style.fontSize = '16px';
        }
      });
    });
  }

  // パフォーマンス最適化: 画像の遅延読み込み
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // 通知メッセージの表示（モバイル最適化）
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: ${window.innerWidth <= 768 ? '90px' : '20px'};
      right: ${window.innerWidth <= 768 ? '10px' : '20px'};
      left: ${window.innerWidth <= 768 ? '10px' : 'auto'};
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#48bb78' : '#667eea'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);
    
    // 3秒後に削除
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // ページ読み込み完了時の処理
  window.addEventListener('load', function() {
    // パフォーマンス測定
    if ('performance' in window) {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
      
      // モバイルでの読み込み時間が長い場合の対応
      if (window.innerWidth <= 768 && loadTime > 3000) {
        console.log('Mobile performance optimization needed');
      }
    }
  });

});