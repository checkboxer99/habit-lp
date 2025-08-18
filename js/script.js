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
        // アクセシビリティ向上
        this.setAttribute('aria-expanded', 'true');
        this.setAttribute('aria-label', 'モバイルメニューを閉じる');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
        // アクセシビリティ向上
        this.setAttribute('aria-expanded', 'false');
        this.setAttribute('aria-label', 'モバイルメニューを開く');
      }
    });
    
    // メニューリンクをクリックした時にメニューを閉じる
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
        // アクセシビリティ向上
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'モバイルメニューを開く');
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

  // FAQ アコーディオン機能（アクセシビリティ対応）
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const icon = this.querySelector('i');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // 他のFAQを閉じる（モバイルでは一つずつ開く）
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-question i');
            const otherButton = item.querySelector('.faq-question');
            if (otherAnswer.style.display === 'block') {
              otherAnswer.style.display = 'none';
              otherIcon.style.transform = 'rotate(0deg)';
              otherButton.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }
      
      // 現在のFAQを開閉
      if (isExpanded) {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        this.setAttribute('aria-expanded', 'false');
      } else {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
        this.setAttribute('aria-expanded', 'true');
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

  // パフォーマンス最適化：Intersection Observer を使用した遅延読み込み
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // アニメーション対象の要素を監視
    document.querySelectorAll('.feature-card, .pricing-card, .faq-item').forEach(el => {
      observer.observe(el);
    });
  }

  // モチベーション支援カードの特別なアニメーション
  if ('IntersectionObserver' in window) {
    const motivationObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('animate-in');
          
          // カード内の要素を順番にアニメーション
          const benefits = card.querySelectorAll('.motivation-benefit');
          benefits.forEach((benefit, index) => {
            setTimeout(() => {
              benefit.style.opacity = '1';
              benefit.style.transform = 'translateY(0)';
            }, index * 150);
          });
        }
      });
    }, { threshold: 0.3 });

    // モチベーション支援カードを監視
    const motivationCard = document.querySelector('.motivation-support-card');
    if (motivationCard) {
      motivationObserver.observe(motivationCard);
      
      // 初期設定
      motivationCard.querySelectorAll('.motivation-benefit').forEach(benefit => {
        benefit.style.opacity = '0';
        benefit.style.transform = 'translateY(20px)';
        benefit.style.transition = 'all 0.5s ease';
      });
    }
  }

  // CTAボタンのクリック追跡（アナリティクス用）
  document.querySelectorAll('.cta-button, .plan-button').forEach(button => {
    button.addEventListener('click', function(e) {
      // Google Analytics 4 イベント送信
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'engagement',
          'event_label': this.textContent.trim(),
          'value': 1
        });
      }
      
      // Google Tag Manager データレイヤー
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'cta_click',
          'cta_text': this.textContent.trim(),
          'cta_position': this.closest('section') ? this.closest('section').id : 'unknown'
        });
      }
    });
  });

  // 訪問サポートカードのホバーエフェクト向上
  document.querySelectorAll('.visit-plan-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      // 他のカードを少し薄くする
      document.querySelectorAll('.visit-plan-card').forEach(otherCard => {
        if (otherCard !== this) {
          otherCard.style.opacity = '0.7';
        }
      });
    });
    
    card.addEventListener('mouseleave', function() {
      // 全てのカードの透明度を戻す
      document.querySelectorAll('.visit-plan-card').forEach(otherCard => {
        otherCard.style.opacity = '1';
      });
    });
  });

  // 緊急サポートカードの特別なエフェクト
  const emergencyCard = document.querySelector('.emergency-support');
  if (emergencyCard) {
    emergencyCard.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.animation = 'pulse 0.5s ease-in-out 3';
      }
    });

    // 緊急サポートカードをクリックした時の追加イベント
    emergencyCard.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'emergency_support_click', {
          'event_category': 'engagement',
          'event_label': 'motivation_support',
          'value': 1
        });
      }
    });
  }

  // モチベーション関連の例にホバーエフェクト
  document.querySelectorAll('.motivation-example').forEach(example => {
    example.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.animation = 'heartbeat 1s ease-in-out 2';
      }
    });
  });

  // 訪問サポートの追加オプションカードのアニメーション
  if ('IntersectionObserver' in window) {
    const visitObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // カードを順番にアニメーション
          const cards = entry.target.querySelectorAll('.visit-option-card, .visit-example-item');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.transform = 'translateY(0)';
              card.style.opacity = '1';
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    // 訪問サポート関連要素を監視
    document.querySelectorAll('.visit-additional-options, .visit-examples').forEach(el => {
      visitObserver.observe(el);
    });
  }

  // 初期設定：アニメーション用の準備
  document.querySelectorAll('.visit-option-card, .visit-example-item').forEach(item => {
    item.style.transform = 'translateY(20px)';
    item.style.opacity = '0';
    item.style.transition = 'all 0.5s ease';
  });

  // フォーム送信の追跡
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'engagement',
          'event_label': 'contact_form',
          'value': 1
        });
      }
    });
  });

  // スクロール深度の追跡
  let scrollTracked = {
    25: false,
    50: false,
    75: false,
    100: false
  };

  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    Object.keys(scrollTracked).forEach(percent => {
      if (scrollPercent >= percent && !scrollTracked[percent]) {
        scrollTracked[percent] = true;
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll', {
            'event_category': 'engagement',
            'event_label': `${percent}%`,
            'value': parseInt(percent)
          });
        }
      }
    });
  }, { passive: true });

  // モチベーション支援関連のイベント追跡
  document.querySelectorAll('.motivation-feature, .motivation-example').forEach(element => {
    element.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'motivation_feature_click', {
          'event_category': 'engagement',
          'event_label': 'motivation_support_interest',
          'value': 1
        });
      }
    });
  });

  // ページ読み込み完了時のパフォーマンス測定
  window.addEventListener('load', function() {
    if ('performance' in window && 'timing' in performance) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          'name': 'page_load',
          'value': loadTime
        });
      }
    }

    // Core Web Vitals の測定
    if ('web-vitals' in window) {
      // Web Vitals ライブラリが利用可能な場合
      webVitals.getCLS(console.log);
      webVitals.getFID(console.log);
      webVitals.getLCP(console.log);
    }
  });

  // エラートラッキング
  window.addEventListener('error', function(e) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        'description': e.message,
        'fatal': false
      });
    }
  });

  // プリロードされたリソースの活用
  function preloadCriticalResources() {
    const criticalImages = [
      '/images/og-image.jpg',
      '/images/logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Service Worker の登録（PWA対応）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  // キーボードナビゲーション対応
  document.addEventListener('keydown', function(e) {
    // Escキーでモバイルメニューを閉じる
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }

    // Enterキーでリンクを実行
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
      e.target.click();
    }
  });

  // タッチデバイス対応の改善
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // 上方向のスワイプ - ナビゲーションを非表示
        if (navbar && window.innerWidth <= 768) {
          navbar.style.transform = 'translateY(-100%)';
        }
      } else {
        // 下方向のスワイプ - ナビゲーションを表示
        if (navbar && window.innerWidth <= 768 && window.scrollY > 100) {
          navbar.style.transform = 'translateY(0)';
        }
      }
    }
  }

  // レイジーローディング（画像の遅延読み込み）
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // IntersectionObserver がサポートされていない場合のフォールバック
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  // モチベーション支援の特別なインタラクション
  function initMotivationInteractions() {
    // モチベーション支援カードのクリック時のエフェクト
    const motivationCard = document.querySelector('.motivation-support-card');
    if (motivationCard) {
      motivationCard.addEventListener('click', function() {
        // ハートビートエフェクト
        this.style.animation = 'pulse-heart 1s ease-in-out';
        setTimeout(() => {
          this.style.animation = '';
        }, 1000);
      });
    }

    // 緊急サポート関連の要素にマウスオーバー時の説明表示
    const emergencyElements = document.querySelectorAll('.emergency-support, .motivation-example');
    emergencyElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        // ツールチップ風の効果（既存のスタイルを活用）
        this.style.boxShadow = '0 10px 30px rgba(229, 62, 62, 0.3)';
      });

      element.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
      });
    });
  }

  // 訪問サポートに関する特別なユーザーエクスペリエンス
  function initVisitSupportUX() {
    // 訪問サポート料金表のスクロール時のアニメーション
    const visitCards = document.querySelectorAll('.visit-plan-card');
    visitCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

    // モチベーション特集の要素に特別なハイライト
    const motivationFeatures = document.querySelectorAll('.motivation-feature');
    motivationFeatures.forEach(feature => {
      feature.addEventListener('mouseenter', function() {
        const heartIcon = this.querySelector('i');
        if (heartIcon) {
          heartIcon.style.transform = 'scale(1.2)';
          heartIcon.style.transition = 'transform 0.3s ease';
        }
      });

      feature.addEventListener('mouseleave', function() {
        const heartIcon = this.querySelector('i');
        if (heartIcon) {
          heartIcon.style.transform = 'scale(1)';
        }
      });
    });
  }

  // 初期化関数を実行
  lazyLoadImages();
  preloadCriticalResources();
  initMotivationInteractions();
  initVisitSupportUX();

  // リサイズ時の最適化
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      setVH();
      
      // モバイルメニューをリセット
      if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        if (mobileMenuBtn) {
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }, 250);
  }, { passive: true });

  // モチベーション関連のFAQが開かれた時の特別処理
  const motivationFAQ = Array.from(document.querySelectorAll('.faq-question')).find(
    question => question.textContent.includes('やりたくない時')
  );

  if (motivationFAQ) {
    motivationFAQ.addEventListener('click', function() {
      // モチベーション関連のFAQがクリックされた時の追跡
      if (typeof gtag !== 'undefined') {
        gtag('event', 'motivation_faq_click', {
          'event_category': 'engagement',
          'event_label': 'motivation_support_faq',
          'value': 1
        });
      }

      // 特別なハイライト効果
      setTimeout(() => {
        const answer = this.parentElement.querySelector('.faq-answer');
        if (answer && answer.style.display === 'block') {
          answer.style.background = 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)';
          answer.style.borderLeft = '4px solid #e53e3e';
          answer.style.padding = '1.5rem 1.5rem 1.5rem 2rem';
        }
      }, 300);
    });
  }

  // デバッグ用の関数（開発時のみ有効化）
  function debugPerformance() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Performance Debug Mode');
      
      // Navigation Timing API
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page Load Time: ${loadTime}ms`);
      }

      // Resource Timing API
      if (performance.getEntriesByType) {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 100);
        console.log('Slow Resources:', slowResources);
      }
    }
  }

  // 開発環境でのパフォーマンス監視
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', debugPerformance);
  }

  // カスタムイベント: モチベーション支援への関心度測定
  let motivationInterestScore = 0;
  
  // モチベーション関連要素への操作を追跡
  document.querySelectorAll('.motivation-support-card, .motivation-feature, .motivation-example, .emergency-support').forEach(element => {
    element.addEventListener('mouseenter', function() {
      motivationInterestScore++;
    });

    element.addEventListener('click', function() {
      motivationInterestScore += 2;
      
      // 一定の関心度に達した時にカスタムイベント発火
      if (motivationInterestScore >= 5) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'high_motivation_interest', {
            'event_category': 'engagement',
            'event_label': 'user_interested_in_motivation_support',
            'value': motivationInterestScore
          });
        }
      }
    });
  });

  // 訪問サポートセクションでの滞在時間測定
  let visitSectionStartTime = null;
  
  if ('IntersectionObserver' in window) {
    const visitSectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visitSectionStartTime = Date.now();
        } else if (visitSectionStartTime) {
          const timeSpent = Date.now() - visitSectionStartTime;
          
          // 30秒以上閲覧した場合
          if (timeSpent > 30000) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'long_visit_section_view', {
                'event_category': 'engagement',
                'event_label': 'extended_visit_support_interest',
                'value': Math.round(timeSpent / 1000)
              });
            }
          }
          
          visitSectionStartTime = null;
        }
      });
    }, { threshold: 0.5 });

    const visitSection = document.getElementById('visit-pricing');
    if (visitSection) {
      visitSectionObserver.observe(visitSection);
    }
  }

});