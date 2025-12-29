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
    el.addEventListener('click', function(event) {
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
    el.addEventListener('click', function(event) {
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
    const togglescrollTop = function() {
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
      menuFilters.forEach(function(el) {
        el.addEventListener('click', function() {
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
  document.querySelectorAll('.header .dropdown').forEach(function(everydropdown){
    everydropdown.addEventListener('mouseenter', function(e){
      let el_link = this.querySelector('a[data-bs-toggle="dropdown"], button[data-bs-toggle="dropdown"]');
      if(el_link != null){
        let nextEl = el_link.nextElementSibling;
        el_link.classList.add('show');
        nextEl.classList.add('show');
      }
    });
    everydropdown.addEventListener('mouseleave', function(e){
      let el_link = this.querySelector('a[data-bs-toggle="dropdown"], button[data-bs-toggle="dropdown"]');
      if(el_link != null){
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
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const TOKEN = "7514457087:AAEXu4dbaMQqnSx8QEaYn1Je0raq7Eq0BLU";
        const CHAT_ID = "8283677886";
        const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
        
        const loading = this.querySelector('.loading');
        const success = this.querySelector('.sent-message');
        const errorMsg = this.querySelector('.error-message');
        const btn = this.querySelector('button[type="submit"]');

        // Показуємо стан завантаження
        if (loading) loading.style.display = 'block';
        if (success) success.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
        btn.disabled = true;

        // Визначаємо з якої сторінки прийшла заявка
        const pageTitle = document.title;

        // Формуємо текст
        let text = `<b>🔔 НОВА ЗАЯВКА З САЙТУ</b>\n`;
        // text += `<b>📍 Сторінка:</b> ${pageTitle}\n`;
        text += `--------------------------\n`;
        text += `<b>👤 Клієнт:</b> ${this.name.value}\n`;
        text += `<b>📞 Телефон:</b> +38${this.phone.value}\n`;
        text += `<b>📝 Повідомлення:</b> ${this.message.value}`;

        fetch(URI_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                parse_mode: 'html',
                text: text
            })
        })
        .then(response => {
            if (response.ok) {
                if (success) success.style.display = 'block';
                this.reset();
            } else {
                throw new Error('Помилка сервера');
            }
        })
        .catch(err => {
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.innerHTML = "Помилка відправки. Спробуйте ще раз.";
            } else {
                alert("Помилка відправки. Спробуйте пізніше.");
            }
        })
        .finally(() => {
            if (loading) loading.style.display = 'none';
            btn.disabled = false;
        });
    });
});