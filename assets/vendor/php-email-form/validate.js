/**
* PHP Email Form Validation - v3.5
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      // --- START: CUSTOM PHONE PREFIX LOGIC (ADDED) ---
      let phoneInput = thisForm.querySelector('input[name="phone"]');
      
      if (phoneInput) {
          // 1. Удаляем все пробелы из введенного номера
          let cleanedPhoneValue = phoneInput.value.replace(/\s/g, ''); 
          
          // Проверяем, что поле телефона не пустое (хотя оно required)
          if (cleanedPhoneValue) {
              // 2. Добавляем префикс +38 к чистому номеру и сохраняем в FormData
              formData.set('phone', '+38' + cleanedPhoneValue);
          }
      }
      // --- END: CUSTOM PHONE PREFIX LOGIC ---

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
        // Пытаемся получить ответ как JSON (для Formspree)
        // Если это не JSON, возвращаем текст, чтобы сохранить совместимость со старым бэкендом
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(data => data);
        } else {
            return response.text().then(data => data.trim());
        }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      
      // *** ИСПРАВЛЕННАЯ ЛОГИКА ПРОВЕРКИ УСПЕХА ***
      const isSuccess = data === 'OK' || (typeof data === 'object' && data !== null && data.ok === true);
      
      if (isSuccess) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? JSON.stringify(data) : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    
    // Пытаемся отобразить ошибку в более читаемом виде
    let errorMessage = error.message || error;
    if (errorMessage.includes('{"next":')) {
        // Убираем лишнюю информацию, оставляя только текст об ошибке, если он есть
        try {
            const errorObj = JSON.parse(errorMessage.replace('Error: ', ''));
            if (errorObj.ok === true) {
                // Если ошибка возникла из-за успешного ответа, но не распознанного ранее
                errorMessage = 'Ваш запрос успешно отправлен.';
                thisForm.querySelector('.sent-message').classList.add('d-block');
                thisForm.querySelector('.error-message').classList.remove('d-block');
                thisForm.reset(); 
                return; // Прерываем отображение как ошибки
            }
        } catch(e) {
            // Если не удалось распарсить JSON, оставляем как есть
        }
    }

    thisForm.querySelector('.error-message').innerHTML = errorMessage;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();