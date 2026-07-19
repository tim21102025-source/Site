document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Mobile nav — slide-in panel
   */
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const burgerBtn = document.querySelector('.mobile-nav-toggle');
  const closeBtn = document.querySelector('.mobile-nav-close');

  function openMobileNav() {
    document.body.classList.add('nav-open');
    mobileNav?.classList.add('active');
    mobileOverlay?.classList.add('active');
    burgerBtn?.classList.add('active');
    const st = document.querySelector('.scroll-top');
    if (st) st.style.display = 'none';
  }

  function closeMobileNav() {
    document.body.classList.remove('nav-open');
    mobileNav?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    burgerBtn?.classList.remove('active');
    const st = document.querySelector('.scroll-top');
    if (st) st.style.display = '';
  }

  burgerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (mobileNav?.classList.contains('active')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  closeBtn?.addEventListener('click', closeMobileNav);
  mobileOverlay?.addEventListener('click', closeMobileNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
      closeMobileNav();
    }
  });

  /**
   * Mobile dropdown accordions
   */
  document.querySelectorAll('.dropdown-toggle-mobile').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.dropdown');
      const submenu = parent?.querySelector('.dropdown-mobile');
      if (!submenu) return;

      const isOpen = submenu.classList.contains('open');

      // close all other open dropdowns
      document.querySelectorAll('.dropdown-mobile.open').forEach(d => {
        if (d !== submenu) {
          d.classList.remove('open');
          d.closest('.dropdown')?.querySelector('.dropdown-toggle-mobile')?.classList.remove('dropdown-open');
        }
      });

      submenu.classList.toggle('open', !isOpen);
      toggle.classList.toggle('dropdown-open', !isOpen);
    });
  });

  /**
   * Close mobile nav on link click (except dropdown toggles)
   */
  document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('dropdown-toggle-mobile')) return;
      if (mobileNav?.classList.contains('active')) {
        closeMobileNav();
      }
    });
  });

  /**
   * Header scroll effect — фіксує хедер після скролу за межу topbar
   */
  const header = document.querySelector('.header');
  const topbar = document.getElementById('topbar-vidnovlennya');
  if (header) {
    const toggleHeader = function () {
      const topbarHeight = topbar ? topbar.offsetHeight : 0;
      if (window.scrollY > topbarHeight + 20) {
        header.classList.add('header-scrolled');
        if (topbar) topbar.style.display = 'none';
      } else {
        header.classList.remove('header-scrolled');
        if (topbar) topbar.style.display = '';
      }
    }
    window.addEventListener('load', toggleHeader);
    document.addEventListener('scroll', toggleHeader);
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function () {
      if (document.body.classList.contains('nav-open')) return;
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope) {

    let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
    let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

    window.addEventListener('load', () => {
      let portfolioIsotope = new Isotope(document.querySelector('.portfolio-container'), {
        itemSelector: '.portfolio-item',
        layoutMode: portfolioLayout,
        filter: portfolioFilter,
        sortBy: portfolioSort
      });

      let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
      menuFilters.forEach(function (el) {
        el.addEventListener('click', function () {
          document.querySelector('.portfolio-isotope .portfolio-flters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aos_init === 'function') {
            aos_init();
          }
        }, false);
      });

    });

  }

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 2 slides at once in desktop view
   */
  new Swiper('.slides-2', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});




// Раскрытие выпадающих списков при наведении на десктопе
if (window.innerWidth > 1280) {
  document.querySelectorAll('.header .dropdown').forEach(function (everydropdown) {
    everydropdown.addEventListener('mouseenter', function (e) {
      let el_link = this.querySelector('a[data-bs-toggle="dropdown"], button[data-bs-toggle="dropdown"]');
      if (el_link != null) {
        let nextEl = el_link.nextElementSibling;
        el_link.classList.add('show');
        nextEl.classList.add('show');
      }
    });
    everydropdown.addEventListener('mouseleave', function (e) {
      let el_link = this.querySelector('a[data-bs-toggle="dropdown"], button[data-bs-toggle="dropdown"]');
      if (el_link != null) {
        let nextEl = el_link.nextElementSibling;
        el_link.classList.remove('show');
        nextEl.classList.remove('show');
      }
    });
  });
}




/**
* Універсальна відправка форм у Telegram через Cloudflare Proxy
*/
let selectedFiles = []; 

// Використовуємо делегування подій для стабільної роботи всіх форм (і в модалці, і на сторінці)
document.addEventListener('submit', async function (e) {
  const form = e.target.closest('.telegram-form');
  if (!form) return;

  e.preventDefault();

  // 1. Захист від ботів (Honeypot)
  if (form.hp_field && form.hp_field.value) return;

  const PROXY_URL = "https://tg-proxy-master.tim21102025.workers.dev";
  
  // Шукаємо елементи саме всередині поточної форми
  const loading = form.querySelector('.loading');
  const success = form.querySelector('.sent-message');
  const errorMsg = form.querySelector('.error-message');
  const btn = form.querySelector('button[type="submit"]');
  const filePreview = document.getElementById('file-preview') || document.getElementById('modal-file-preview');

  // Зберігаємо оригінальний текст кнопки
  const originalBtnText = btn.innerHTML;

  // Показуємо стан завантаження на кнопці
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Надсилаємо...';
  btn.style.opacity = '0.8';
  if (loading) loading.style.display = 'block';
  if (success) success.style.display = 'none';
  if (errorMsg) errorMsg.style.display = 'none';

  try {
    const name = form.name.value;
    const phone = form.phone.value;
    const userMsg = form.message.value.trim();

    // Збираємо повідомлення
    let parts = [];

    // Джерело звернення (для landing pages)
    const sourceField = form.querySelector('input[name="source"]');
    if (sourceField && sourceField.value) {
      parts.push(`[Джерело: ${sourceField.value}]`);
    }

    // Дані калькулятора якщо є (для landing pages)
    const calcField = form.querySelector('input[name="calc_data"]');
    if (calcField && calcField.value) {
      parts.push(calcField.value);
    }

    // Текст користувача
    if (userMsg) parts.push(userMsg);

    let message = parts.join('\n\n') || 'Заявка з сайту';

    let response;

    // Перевіряємо чи є файли для відправки
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('files', file));
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('message', message);
      formData.append('is_album', 'true');

      response = await fetch(PROXY_URL, { method: 'POST', body: formData });
    } else {
      response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message, is_album: 'false' })
      });
    }

    const result = await response.json();

    if (result.ok) {
      // GA4 — специфічні події для кожної форми
      if (typeof gtag === 'function') {
        let eventName = 'form_submit';
        let params = {};

        if (form.id === 'footerTelegramForm') {
          eventName = 'quick_message_submit';
          params = { form_location: 'contact_modal' };
        } else if (form.id === 'landingForm') {
          eventName = 'landing_form_submit';
          params = { form_location: 'landing', source: form.querySelector('input[name="source"]')?.value || 'unknown' };
        } else if (form.closest('.contact-page') || form.closest('section.contact')) {
          eventName = 'contact_page_submit';
          params = { form_location: 'contact_page' };
        } else {
          eventName = 'contact_form_submit';
          params = { form_location: 'main_page' };
        }

        gtag('event', eventName, params);
      }

      form.reset();
      selectedFiles = [];

      // Для landing — очищуємо бейдж та calc_data після reset
      const calcBadge = form.querySelector('#calc-badge');
      if (calcBadge) calcBadge.classList.add('d-none');
      const calcDataField = form.querySelector('#calc-data-input');
      if (calcDataField) calcDataField.value = '';
      // Очищуємо прев'ю (шукаємо обидва можливі ID)
      document.querySelectorAll('[id*="file-preview"]').forEach(el => el.innerHTML = '');

      // Закриваємо модалку форми якщо вона в модалці
      const formModal = form.closest('.modal');
      if (formModal) {
        const formModalInstance = bootstrap.Modal.getInstance(formModal);
        if (formModalInstance) formModalInstance.hide();
      }

      // Показуємо модалку успіху
      const successModal = document.getElementById('successModal');
      if (successModal) {
        const modal = new bootstrap.Modal(successModal);
        modal.show();
        // Автозакриття через 3 сек
        successModal.addEventListener('hidden.bs.modal', () => {
          modal.dispose();
        }, { once: true });
        setTimeout(() => {
          modal.hide();
        }, 3000);
      } else if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 3000);
      }
    } else {
      throw new Error(result.description || "Server Error");
    }

  } catch (err) {
    console.error("Помилка відправки:", err);
    if (errorMsg) {
      errorMsg.style.display = 'block';
      errorMsg.innerText = "Помилка відправки. Спробуйте ще раз.";
    } else {
      alert("Виникла помилка. Спробуйте ще раз або зателефонуйте нам.");
    }
  } finally {
    if (loading) loading.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
    btn.style.opacity = '1';
  }
});

/**
 * Логіка вибору файлів (універсальна)
 */
function initFilePicker(inputId, previewId) {
  const fileInput = document.getElementById(inputId);
  const filePreview = document.getElementById(previewId);

  if (!fileInput || !filePreview) return;

  fileInput.addEventListener('change', function () {
    const files = Array.from(this.files);
    files.forEach(file => {
      if (selectedFiles.length >= 10) return;
      selectedFiles.push(file);

      const reader = new FileReader();
      const wrapper = document.createElement('div');
      wrapper.className = 'position-relative border rounded p-1 text-center bg-white shadow-sm';
      wrapper.style.width = '80px';

      const removeBtn = document.createElement('span');
      removeBtn.innerHTML = '&times;';
      removeBtn.style = "position:absolute; top:-8px; right:-8px; background:red; color:white; border-radius:50%; width:22px; height:22px; cursor:pointer; line-height:20px; font-weight:bold; text-align:center; border:1px solid white; z-index:10;";
      
      removeBtn.onclick = () => {
        selectedFiles = selectedFiles.filter(f => f !== file);
        wrapper.remove();
      };

      reader.onload = (e) => {
        if (file.type.startsWith('image/')) {
          wrapper.innerHTML = `<img src="${e.target.result}" class="rounded" style="width:100%; height:60px; object-fit:cover;">`;
        } else {
          wrapper.innerHTML = `<div class="bg-light rounded d-flex align-items-center justify-content-center" style="height:60px;"><i class="bi bi-play-btn fs-2 text-secondary"></i></div>`;
        }
        wrapper.innerHTML += `<div class="small text-truncate mt-1" style="font-size: 10px;">${file.name}</div>`;
        wrapper.appendChild(removeBtn);
      };
      reader.readAsDataURL(file);
      filePreview.appendChild(wrapper);
    });
    this.value = ''; // Скидаємо інпут для повторного вибору
  });
}

// Ініціалізація для всіх відомих ID
document.addEventListener('DOMContentLoaded', () => {
  initFilePicker('files', 'file-preview');         // Основна форма
  initFilePicker('modal-files', 'modal-file-preview'); // Модальне вікно

  /**
   * GA4 — трекінг кліків: телефони, пошта, месенджери
   */
  if (typeof gtag === 'function') {
    // Телефони: tel:
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', 'phone_click', {
          phone_number: link.href.replace('tel:', ''),
          page_path: window.location.pathname
        });
      });
    });

    // Пошта: mailto:
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', 'email_click', {
          email: link.href.replace('mailto:', ''),
          page_path: window.location.pathname
        });
      });
    });

    // Месенджери: viber, telegram, whatsapp
    document.querySelectorAll('a[href*="viber:"], a[href*="t.me"], a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', () => {
        let messenger = 'unknown';
        if (link.href.includes('viber:')) messenger = 'viber';
        else if (link.href.includes('t.me')) messenger = 'telegram';
        else if (link.href.includes('wa.me')) messenger = 'whatsapp';

        gtag('event', 'messenger_click', {
          messenger_type: messenger,
          page_path: window.location.pathname
        });
      });
    });
  }
});