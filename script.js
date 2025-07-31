// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  
  // スムーススクロール機能
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // FAQ アコーディオン機能
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const icon = this.querySelector('i');
      
      // 他のFAQを閉じる（オプション：一つずつ開く場合）
      // document.querySelectorAll('.faq-item').forEach(item => {
      //   if (item !== faqItem) {
      //     const otherAnswer = item.querySelector('.faq-answer');
      //     const otherIcon = item.querySelector('.faq-question i');
      //     otherAnswer.style.display = 'none';
      //     otherIcon.style.transform = 'rotate(0deg)';
      //   }
      // });
      
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

  // 初期状態でFAQの回答を非表示
  document.querySelectorAll('.faq-answer').forEach(answer => {
    answer.style.display = 'none';
  });

  // スクロール時のアニメーション（オプション）
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
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
  document.querySelectorAll('.feature-card, .testimonial-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // CTAボタンのクリック追跡（アナリティクス用）
  document.querySelectorAll('.cta-button').forEach(button => {
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

  // モバイル対応: タッチイベントの最適化
  let touchStartY = 0;
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchStartY - touchY;
    
    // 上スワイプでCTAボタンを強調表示（オプション）
    if (touchDiff > 50) {
      document.querySelectorAll('.cta-button').forEach(btn => {
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 300);
      });
    }
  }, { passive: true });

  // フォーム送信の処理（将来的にフォームを追加する場合）
  function handleFormSubmit(event) {
    event.preventDefault();
    
    // フォームデータの取得
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // 送信処理
    console.log('Form submitted:', data);
    
    // 成功メッセージの表示
    showNotification('お問い合わせありがとうございます！', 'success');
  }

  // 通知メッセージの表示
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#48bb78' : '#667eea'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒後に削除
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // ページ読み込み完了時の処理
  window.addEventListener('load', function() {
    // ローディングアニメーションがある場合の処理
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
    
    // パフォーマンス測定
    if ('performance' in window) {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    }
  });

});