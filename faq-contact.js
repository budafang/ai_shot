document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('faq-contact-form');
  var status = document.getElementById('faq-contact-status');

  if (!form || !status) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    status.classList.remove('is-error');
    status.textContent = '\u9001\u51fa\u4e2d\uff0c\u8acb\u7a0d\u5019...';

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('submit_failed');
        }

        return response.json();
      })
      .then(function () {
        form.reset();
        status.textContent = '\u6536\u5230\u8207\u611f\u8b1d\uff0c\u6211\u5011\u6703\u76e1\u5feb\u56de\u8986\u3002';
        if (typeof gtag === 'function') {
          gtag('event', 'submit_faq_question', {
            page_path: window.location.pathname
          });
        }
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = '\u76ee\u524d\u9001\u51fa\u5931\u6557\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\uff0c\u6216\u6539\u7528 Email \u8207\u6211\u5011\u806f\u7d61\u3002';
      });
  });
});
