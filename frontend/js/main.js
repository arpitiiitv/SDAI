/**
 * School of Data and AI — Main JS
 * Mobile nav, form submit to backend, certificate verification
 */

(function () {
  'use strict';

  // API base: production uses Render, development uses localhost:3000
  var API_BASE = (function () {
    var loc = window.location;
    // Local development: backend on port 3000
    if (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') {
      if (loc.port === '3000') return '';
      return 'http://localhost:3000';
    }
    // Production: Render backend
    return 'https://sdai-m9tc.onrender.com';
  })();

  // ——— Mobile nav toggle ———
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // ——— Contact / Masterclass form ———
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      var typeInput = document.getElementById('form-type');
      var type = (typeInput && typeInput.value) ? typeInput.value : 'masterclass';
      var courseTrack = null;
      var match = window.location.search.match(/[?&]course=([^&]+)/);
      if (match) courseTrack = decodeURIComponent(match[1]);

      var payload = {
        name: contactForm.querySelector('[name="name"]').value.trim(),
        phone: contactForm.querySelector('[name="phone"]').value.trim(),
        email: contactForm.querySelector('[name="email"]').value.trim(),
        message: (contactForm.querySelector('[name="message"]') && contactForm.querySelector('[name="message"]').value) ? contactForm.querySelector('[name="message"]').value.trim() : '',
        type: type,
        courseTrack: courseTrack
      };

      fetch(API_BASE + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          btn.disabled = false;
          btn.textContent = originalText;
          alert(data.message || 'Thank you! We have received your submission and will get back to you soon.');
          contactForm.reset();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = originalText;
          alert('Could not send. Please check your connection or contact us by phone/email.');
        });
    });
  }

  // ——— Certificate verification ———
  var verifyForm = document.getElementById('verify-form');
  var verifyResult = document.getElementById('verify-result');
  if (verifyForm && verifyResult) {
    verifyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var idInput = document.getElementById('certificate-id');
      var certId = (idInput && idInput.value) ? idInput.value.trim() : '';
      if (!certId) {
        verifyResult.textContent = 'Please enter a Certificate ID.';
        verifyResult.style.color = 'var(--gray-600)';
        return;
      }
      verifyResult.textContent = 'Verifying…';
      verifyResult.style.color = 'var(--gray-600)';

      fetch(API_BASE + '/api/verify/' + encodeURIComponent(certId))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.valid) {
            verifyResult.innerHTML = 'Certificate is <strong>valid</strong>. Holder: ' +
              (data.certificate.studentName || '—') + ', Course: ' +
              (data.certificate.course || '—') +
              (data.certificate.issuedAt ? ', Issued: ' + data.certificate.issuedAt : '') + '.';
            verifyResult.style.color = 'var(--accent)';
          } else {
            verifyResult.textContent = data.message || 'Certificate not found.';
            verifyResult.style.color = 'var(--gray-600)';
          }
        })
        .catch(function () {
          verifyResult.textContent = 'Verification failed. Please try again or check your connection.';
          verifyResult.style.color = 'var(--gray-600)';
        });
    });
  }
})();
