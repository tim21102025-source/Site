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
* Універсальна відправка форм у Telegram
*/
document.querySelectorAll('.telegram-form').forEach(form => {
  form.addEventListener('submit', async function (e) { // Додано async
    e.preventDefault();

    const TOKEN = "7514457087:AAEXu4dbaMQqnSx8QEaYn1Je0raq7Eq0BLU";
    const CHAT_ID = "8283677886";

    const loading = this.querySelector('.loading');
    const success = this.querySelector('.sent-message');
    const btn = this.querySelector('button[type="submit"]');
    const fileInput = this.querySelector('#files');
    const filesCount = selectedFiles.length;

    loading.style.display = 'block';
    btn.disabled = true;

    // 1. Формуємо текст
    let text = `<b>🔔 НОВА ЗАЯВКА З САЙТУ</b>\n`;
    text += `--------------------------\n`;
    text += `<b>👤 Клієнт:</b> ${this.name.value}\n`;
    text += `<b>📞 Телефон:</b> +38${this.phone.value}\n`;
    text += `<b>📝 Проблема:</b> ${this.message.value}\n`;

    if (filesCount > 0) {
      text += `<b>📎 Додано файлів:</b> ${filesCount}`;
    }
    try {
      // 2. Відправляємо текст
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, parse_mode: 'html', text: text })
      });

      // 3. Відправляємо файли, якщо вони є
      if (filesCount > 0) {
        for (let file of selectedFiles) {
          const formData = new FormData();
          formData.append('chat_id', CHAT_ID);

          let method = file.type.includes('video') ? 'sendVideo' : 'sendPhoto';
          formData.append(file.type.includes('video') ? 'video' : 'photo', file);

          await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
            method: 'POST',
            body: formData
          });
        }
      }

      if (success) success.style.display = 'block';
      selectedFiles = []; // Очищуємо масив
      filePreview.innerHTML = ''; // Очищуємо прев'ю
      this.reset();
    } catch (err) {
      alert("Помилка при відправці файлів. Перевірте розмір (макс. 20МБ за файл).");
    } finally {
      loading.style.display = 'none';
      btn.disabled = false;
    }
  });
});

// Відображення списку обраних файлів
let selectedFiles = []; // Масив для зберігання актуальних файлів

const fileInput = document.getElementById('files');
const filePreview = document.getElementById('file-preview');

if (fileInput && filePreview) {
  fileInput.addEventListener('change', function () {
    const files = Array.from(this.files);

    files.forEach(file => {
      // Додаємо файл у наш масив
      selectedFiles.push(file);

      const reader = new FileReader();
      const wrapper = document.createElement('div');
      wrapper.className = 'position-relative border rounded p-1 text-center';
      wrapper.style.width = '85px';

      // Створюємо кнопку видалення
      const removeBtn = document.createElement('span');
      removeBtn.innerHTML = '&times;';
      removeBtn.style = 'position:absolute; top:-5px; right:-5px; background:red; color:white; border-radius:50%; width:20px; height:20px; cursor:pointer; line-height:18px; font-weight:bold; font-size:14px; z-index:10;';

      removeBtn.onclick = function () {
        // Видаляємо з масиву
        selectedFiles = selectedFiles.filter(f => f !== file);
        // Видаляємо візуально
        wrapper.remove();
      };

      reader.onload = function (e) {
        if (file.type.startsWith('image/')) {
          wrapper.innerHTML = `
                        <img src="${e.target.result}" class="rounded" style="width: 100%; height: 60px; object-fit: cover;">
                        <div class="small text-truncate" style="font-size: 10px; margin-top:2px;">${file.name}</div>
                    `;
        } else {
          wrapper.innerHTML = `
                        <div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 60px;">
                            <i class="bi bi-play-btn fs-2 text-secondary"></i>
                        </div>
                        <div class="small text-truncate" style="font-size: 10px; margin-top:2px;">${file.name}</div>
                    `;
        }
        wrapper.appendChild(removeBtn);
      };

      reader.readAsDataURL(file);
      filePreview.appendChild(wrapper);
    });

    // Очищуємо інпут, щоб можна було вибрати той самий файл повторно
    this.value = '';
  });
}