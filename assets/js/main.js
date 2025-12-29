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
   * Mobile nav toggle
   */

  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function (event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function () {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
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
 * Універсальна відправка форм у Telegram через Cloudflare Proxy (Альбомний режим)
 */

// Глобальний масив для зберігання вибраних файлів
let selectedFiles = [];

document.querySelectorAll('.telegram-form').forEach(form => {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Захист від ботів (Honeypot)
    if (this.hp_field && this.hp_field.value) {
      console.warn("Spam bot detected");
      return;
    }

    const PROXY_URL = "https://tg-proxy-master.tim21102025.workers.dev";
    const loading = this.querySelector('.loading');
    const success = this.querySelector('.sent-message');
    const btn = this.querySelector('button[type="submit"]');
    const filePreview = document.getElementById('file-preview');

    // Показуємо завантаження
    if (loading) loading.style.display = 'block';
    if (success) success.style.display = 'none';
    btn.disabled = true;

    try {
      // 2. Формуємо дані клієнта
      const name = this.name.value;
      const phone = this.phone.value;
      const message = this.message.value;

      let response;

      if (selectedFiles.length > 0) {
        // --- ВАРІАНТ А: ВІДПРАВКА АЛЬБОМОМ (МЕДІАГРУПА) ---
        const formData = new FormData();
        
        // Додаємо всі файли в один об'єкт
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });

        // Передаємо дані для підпису до альбому
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('message', message);
        formData.append('is_album', 'true');

        response = await fetch(PROXY_URL, {
          method: 'POST',
          body: formData // Воркер сам зрозуміє, що це FormData
        });
      } else {
        // --- ВАРІАНТ Б: ВІДПРАВКА ТІЛЬКИ ТЕКСТУ ---
        response = await fetch(PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            message: message,
            is_album: 'false'
          })
        });
      }

      const result = await response.json();

      if (result.ok) {
        // Успіх
        if (success) success.style.display = 'block';
        this.reset();
        selectedFiles = [];
        if (filePreview) filePreview.innerHTML = '';
      } else {
        throw new Error(result.description || "Помилка API");
      }

    } catch (err) {
      console.error(err);
      alert("Виникла помилка при відправці. Будь ласка, спробуйте ще раз або зателефонуйте нам.");
    } finally {
      if (loading) loading.style.display = 'none';
      btn.disabled = false;
    }
  });
});

/**
 * Логіка вибору файлів та створення прев'ю
 */
const fileInput = document.getElementById('files') || document.getElementById('files-home');
const filePreview = document.getElementById('file-preview');

if (fileInput && filePreview) {
  fileInput.addEventListener('change', function () {
    const files = Array.from(this.files);

    files.forEach(file => {
      // Перевірка на ліміт у 10 файлів для Telegram MediaGroup
      if (selectedFiles.length >= 10) {
        alert("Можна додати не більше 10 файлів");
        return;
      }

      selectedFiles.push(file);

      const reader = new FileReader();
      const wrapper = document.createElement('div');
      wrapper.className = 'position-relative border rounded p-1 text-center bg-white shadow-sm';
      wrapper.style.width = '85px';

      // Кнопка видалення файлу
      const removeBtn = document.createElement('span');
      removeBtn.innerHTML = '&times;';
      removeBtn.style = `
        position: absolute; top: -8px; right: -8px; 
        background: #dc3545; color: white; 
        border-radius: 50%; width: 22px; height: 22px; 
        cursor: pointer; line-height: 20px; 
        font-weight: bold; font-size: 16px; 
        z-index: 10; border: 2px solid white;
      `;

      removeBtn.onclick = function () {
        selectedFiles = selectedFiles.filter(f => f !== file);
        wrapper.remove();
      };

      reader.onload = function (e) {
        if (file.type.startsWith('image/')) {
          wrapper.innerHTML = `<img src="${e.target.result}" class="rounded" style="width: 100%; height: 60px; object-fit: cover;">`;
        } else {
          wrapper.innerHTML = `
            <div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 60px;">
              <i class="bi bi-play-btn fs-2 text-secondary"></i>
            </div>`;
        }
        wrapper.innerHTML += `<div class="small text-truncate mt-1" style="font-size: 10px;">${file.name}</div>`;
        wrapper.appendChild(removeBtn);
      };

      reader.readAsDataURL(file);
      filePreview.appendChild(wrapper);
    });

    // Скидаємо інпут, щоб можна було вибрати той самий файл знову
    this.value = '';
  });
}