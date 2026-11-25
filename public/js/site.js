/* PD Touch Auto Repair: site behaviour. No dependencies.
   Every feature works without this file: the menu links are in the footer,
   all chooser answers are shown, and the form posts to email. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Page ready: starts the hero headline reveal ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { doc.classList.add('is-ready'); });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('.bar__toggle-label');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      if (label) label.textContent = open ? 'Close' : 'Menu';
      if (open) {
        var first = nav.querySelector('a');
        if (first) first.focus();
      }
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
      // Keep focus inside the open menu.
      if (e.key === 'Tab' && document.body.classList.contains('menu-open')) {
        var items = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll('a')));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- Header hides on scroll down, returns on scroll up ---------- */
  var bar = document.querySelector('[data-bar]');
  if (bar) {
    var lastY = window.scrollY;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var menuOpen = document.body.classList.contains('menu-open');
        var hide = y > lastY && y > 240 && !menuOpen && !bar.contains(document.activeElement);
        bar.classList.toggle('is-hidden', hide);
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Section entrances, staggered per section ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    // Stagger the parts of the same parent by 80ms each.
    var groups = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement;
      var n = groups.get(p) || 0;
      el.style.setProperty('--d', Math.min(n, 6) * 80 + 'ms');
      groups.set(p, n + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) {
      // Anything already on the first screen arrives straight away.
      if (el.getBoundingClientRect().top < window.innerHeight) {
        requestAnimationFrame(function () { el.classList.add('is-in'); });
      } else {
        io.observe(el);
      }
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- "What happened to your car?" chooser (tabs) ---------- */
  document.querySelectorAll('[data-chooser]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var narrow = window.matchMedia('(max-width: 899px)');

    var select = function (i, opts) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
        panels[j].classList.toggle('is-in', on && !(opts && opts.initial));
      });
      if (opts && opts.focus) tabs[i].focus();
      if (opts && opts.reveal && narrow.matches) {
        var r = panels[i].getBoundingClientRect();
        if (r.bottom > window.innerHeight || r.top < 0) {
          panels[i].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'nearest' });
        }
      }
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, { reveal: true }); });
      tab.addEventListener('keydown', function (e) {
        var k = e.key;
        var n = tabs.length;
        var next = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') next = (i + 1) % n;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') next = (i - 1 + n) % n;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = n - 1;
        if (next !== null) {
          e.preventDefault();
          select(next, { focus: true });
        }
      });
    });
    select(0, { initial: true });
  });

  /* ---------- Quote request form ---------- */
  var form = document.querySelector('[data-quote-form]');
  if (form) setupForm(form);

  // Chooser answers fill in the form when it is on the same page;
  // otherwise their links open the contact page with the service chosen.
  document.querySelectorAll('[data-use-service]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (!form || form.hidden || !form.service) return;
      e.preventDefault();
      form.service.value = link.getAttribute('data-use-service');
      form.service.dispatchEvent(new Event('change'));
      form.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, reduce.matches ? 0 : 450);
    });
  });

  function setupForm(form) {
    form.noValidate = true;
    var summary = form.querySelector('[data-error-summary]');
    var done = document.querySelector('[data-form-done]');
    var submit = form.querySelector('[type="submit"]');

    // Prefill from links such as /contact/?service=spray-painting&client=insurance
    var params = new URLSearchParams(window.location.search);
    var service = params.get('service');
    if (service && form.service && form.service.querySelector('option[value="' + CSS.escape(service) + '"]')) {
      form.service.value = service;
    }
    var client = params.get('client');
    if (client) {
      var radio = form.querySelector('input[name="client"][value="' + CSS.escape(client) + '"]');
      if (radio) radio.checked = true;
    }

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name.'; },
      phone: function (v) {
        var digits = v.replace(/[^\d]/g, '');
        if (!v.trim()) return 'Enter a phone number so we can call you back.';
        return digits.length >= 9 && digits.length <= 15 ? '' : 'Enter a phone number like 081 216 0146.';
      },
      email: function (v) {
        if (!v.trim()) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter an email address like name@example.com, or leave it empty.';
      },
      vehicle: function (v) { return v.trim().length >= 2 ? '' : 'Enter the vehicle, for example Toyota Hilux.'; },
      service: function (v) { return v ? '' : 'Choose the service you need.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Tell us a little about the problem.'; },
    };

    var errorEl = function (name) { return document.getElementById(name + '-error'); };

    var check = function (name) {
      var field = form.elements[name];
      if (!field) return '';
      var msg = rules[name](field.value || '');
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var el = errorEl(name);
      if (el) el.textContent = msg;
      return msg;
    };

    // Validate a field once the visitor leaves it, then live while they fix it.
    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () { if (field.value) check(name); });
      field.addEventListener('input', function () { if (field.getAttribute('aria-invalid') === 'true') check(name); });
      field.addEventListener('change', function () { if (field.getAttribute('aria-invalid') === 'true') check(name); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errors = [];
      Object.keys(rules).forEach(function (name) {
        var msg = check(name);
        if (msg) errors.push({ name: name, msg: msg });
      });

      if (errors.length) {
        summary.hidden = false;
        var list = summary.querySelector('ul');
        list.innerHTML = '';
        errors.forEach(function (err) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + err.name;
          a.textContent = err.msg;
          a.addEventListener('click', function (ev) {
            ev.preventDefault();
            form.elements[err.name].focus();
          });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.querySelector('h2').textContent = errors.length === 1 ? 'There is 1 thing to fix' : 'There are ' + errors.length + ' things to fix';
        summary.focus();
        return;
      }
      summary.hidden = true;

      // Spam trap: real people never fill the hidden field.
      if (form.elements.website && form.elements.website.value) return;

      var data = new FormData(form);
      var endpoint = form.getAttribute('data-endpoint');
      submit.setAttribute('aria-busy', 'true');
      submit.disabled = true;

      var finish = function (ok) {
        submit.removeAttribute('aria-busy');
        submit.disabled = false;
        if (!ok) {
          summary.hidden = false;
          summary.querySelector('h2').textContent = 'Your request did not send';
          summary.querySelector('ul').innerHTML = '<li>Please call 081 216 0146 or email princessdtouch@gmail.com instead.</li>';
          summary.focus();
          return;
        }
        showDone(data);
      };

      if (endpoint) {
        // A real form service is configured (see README).
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { finish(r.ok); })
          .catch(function () { finish(false); });
      } else {
        // Placeholder handling until a backend is connected: show the
        // success state and offer the same request as a ready-made email.
        setTimeout(function () { finish(true); }, 500);
      }
    });

    function showDone(data) {
      var name = String(data.get('name') || '').trim().split(' ')[0];
      var lines = [
        'Name: ' + data.get('name'),
        'Phone: ' + data.get('phone'),
        'Email: ' + (data.get('email') || '-'),
        'Vehicle: ' + data.get('vehicle'),
        'Service: ' + form.service.options[form.service.selectedIndex].text,
        '',
        String(data.get('message') || ''),
      ];
      var mail = 'mailto:princessdtouch@gmail.com?subject=' +
        encodeURIComponent('Quote request: ' + data.get('vehicle')) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      var mode = form.getAttribute('data-endpoint') ? 'sent' : 'email';
      done.querySelectorAll('[data-done-mode]').forEach(function (el) {
        el.hidden = el.getAttribute('data-done-mode') !== mode;
      });
      done.querySelectorAll('[data-done-name]').forEach(function (el) { el.textContent = name ? ', ' + name : ''; });
      done.querySelector('[data-done-mail]').href = mail;
      form.hidden = true;
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }
})();
