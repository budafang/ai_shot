document.addEventListener('DOMContentLoaded', function () {
  function sendEvent(name, payload) {
    if (typeof gtag !== 'function') return;
    gtag('event', name, payload);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim();
    var payload = {
      link_text: text,
      link_url: href,
      page_path: window.location.pathname
    };

    if (href.indexOf('docs.google.com/forms') !== -1) {
      sendEvent('click_signup', payload);
    }

    if (
      href === 'brief.html' ||
      href.indexOf('drive.google.com/file/d/1320KETKnnv7J6INFeqv_a4XGK7BK0ILR/view') !== -1 ||
      href.indexOf('drive.usercontent.google.com/uc?id=1320KETKnnv7J6INFeqv_a4XGK7BK0ILR') !== -1
    ) {
      sendEvent('click_brief', payload);
    }

    if (link.hasAttribute('data-case-link')) {
      sendEvent('click_case_source', payload);
    }

    if (link.hasAttribute('data-ai-literacy-link')) {
      sendEvent('click_ai_literacy_resource', payload);
    }
  });

  var trackedDepths = {};
  function trackScrollDepth() {
    var scrollTop = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    var percent = Math.round((scrollTop / docHeight) * 100);
    [25, 50, 75, 100].forEach(function (threshold) {
      if (percent >= threshold && !trackedDepths[threshold]) {
        trackedDepths[threshold] = true;
        sendEvent('scroll_depth', {
          depth_percent: threshold,
          page_path: window.location.pathname
        });
      }
    });
  }

  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  trackScrollDepth();
});
