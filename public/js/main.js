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

  if (loading) loading.style.display = 'block';
  if (success) success.style.display = 'none';
  if (errorMsg) errorMsg.style.display = 'none';
  btn.disabled = true;

  try {
    const name = form.name.value;
    const phone = form.phone.value;
    const message = form.message.value;

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
      if (success) success.style.display = 'block';
      form.reset();
      selectedFiles = [];
      // Очищуємо прев'ю (шукаємо обидва можливі ID)
      document.querySelectorAll('[id*="file-preview"]').forEach(el => el.innerHTML = '');
      
      // Якщо форма в модалці — закриваємо її через 3 сек
      const modalElement = form.closest('.modal');
      if (modalElement) {
        setTimeout(() => {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
          if (success) success.style.display = 'none';
        }, 3000);
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
});