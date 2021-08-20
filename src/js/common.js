const UI_Control = {};

UI_Control.layout = {
  init: function () {
    const $url = window.location.href.split('/');
    const $urlLast = $url[$url.length - 1];

    // lnb
    const $lnbParent = document.querySelector('.guide-nav');
    let $lnb = '<h2 class="guide-nav-title">Guide<button type="button" class="guide-nav-close" title="Guide Close"></button></h2>'
    $lnb += '<ul>'
    $lnb += '  <li><a href="/Guide/src/html/guide/accordion.html">accordion</a></li>'
    $lnb += '  <li><a href="/Guide/src/html/guide/accordion_jquery.html">accordion_jquery</a></li>'
    $lnb += '  <li><a href="/Guide/src/html/guide/tooltip_jquery.html">tooltip_jquery</a></li>'
    $lnb += '  <li><a href="/Guide/src/html/guide/context-menu.html">context-menu</a></li>'
    $lnb += '  <li><a href="/Guide/src/html/guide/pagination.html">pagination</a></li>'
    $lnb += '  <li><a href="/Guide/src/html/guide/form.html">form</a></li>'
    $lnb += '</ul>'
    $lnbParent.innerHTML = $lnb;

    // lnb === url ? active : null
    const $lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
    Array.prototype.forEach.call($lnbTrigger, function (el) {
      const $target = el.getAttribute('href').split('/');
      const $targetLast = $target[$target.length - 1];

      if ($urlLast === $targetLast) el.classList.add('active');
    })

    // header 
    const $headerParent = document.querySelector('.header');
    let $header = '<div class="header-wrap">'
    $header += '<h1>'
    $header += '  <a href="/Guide/src/html/" title="홈으로">Sonky</a>'
    $header += '</h1>'
    $header += '<button type="button" class="header-bar" title="Guide Menu">'
    $header += '  <i aria-hidden="true"></i>'
    $header += '</button>'
    $header += '</div>'
    $headerParent.innerHTML = $header;

    // header button
    const $menuTrigger = document.querySelector('.header-bar');
    const $menuTarget = document.querySelector('.guide-nav');
    const $menuClose = document.querySelector('.guide-nav-close');
    $menuTrigger.addEventListener('click', function () {
      this.classList.add('on');
      $menuTarget.classList.add('on');
    })

    $menuClose.addEventListener('click', function () {
      $menuTrigger.classList.remove('on');
      $menuTarget.style.left = '-100%';
    })

    $menuTarget.addEventListener('transitionend', function (e) {
      if (e.target === $menuTarget) {
        $menuTarget.removeAttribute('style');
        $menuTarget.classList.remove('on');
      } else {
        return false;
      }
    })
  }
}

UI_Control.checkAll = {
  init: function () {
    const $check = document.querySelectorAll('input[data-checkbox]');
    Array.prototype.forEach.call($check, function (el) {
      const $elem = '[name=' + el.getAttribute('data-checkbox') + ']:not([data-checkbox])';
      const $bullet = document.querySelectorAll($elem);

      Array.prototype.forEach.call($bullet, function (al) {
        // 전체 클릭, 해제
        el.addEventListener('click', function () {
          if (el.checked === true) {
            al.checked = true;
          } else {
            al.checked = false;
          }
        })

        // 요소 클릭, 해제
        al.addEventListener('click', function () {
          const $checked = document.querySelectorAll('input:checked' + $elem).length;
          if ($checked === $bullet.length) {
            el.checked = true;
          } else {
            el.checked = false;
          }
        })

        // 전체 클릭이 되어있다면
        if (el.checked) {
          al.checked = true;
        }

        // 전부 클릭이 되어있다면
        const $gChecked = document.querySelectorAll('input:checked' + $elem).length;
        if ($gChecked === $bullet.length) {
          el.checked = true;
        }
      })
    })
  }
}

UI_Control.contextMenu = {
  init: function () {
    const items = document.querySelectorAll('[data-context] > button');

    document.body.addEventListener('click', function (e) {
      const targetClassList = e.target;
      if (targetClassList.classList.contains('context')) return;

      // 개별토글
      Array.prototype.forEach.call(items, function (el) {
        if (targetClassList === el) {
          e.preventDefault();
          targetClassList.parentNode.classList.toggle('open');
          items.forEach(function (elem) {
            if (elem !== e.target) elem.parentNode.classList.remove('open');
          });
          return;
        }
      })

      // 전체 삭제
      items.forEach(function (elem) {
        if (targetClassList === elem) return;
        elem.parentNode.classList.remove('open');
      });
    });
  }
}

UI_Control.accr = {
  init: function () {
    this.constructor();

    this.$accrTrigger.forEach(function (trigger) {
      const accr = trigger.closest('[data-accr]');
      const item = trigger.closest('[data-accr-item]');
      const target = item.querySelector('[data-accr-target]');
      const targetAll = accr.querySelectorAll('[data-accr-target]');
      const content = target.querySelector('.accordion-body');

      if (!item.classList.contains('on')) {
        target.classList.add('hidden');
      }

      UI_Control.accr.click(trigger, accr, item, target, targetAll, content);
    })
  },
  constructor: function () {
    this.$accr = document.querySelectorAll('[data-accr]');
    this.$accrTrigger = document.querySelectorAll('[data-accr-trigger]');
  },
  click: function (trigger, accr, item, target, targetAll, content) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();
      e.stopPropagation();

      // 각각 열릴 때
      if (target.classList.contains('shown')) {
        // hide
        target.style.height = content.clientHeight + 'px';
        target.style.height = content.clientHeight + 'px';
        target.classList.remove('shown');
        target.classList.add('hiding');
        target.removeAttribute('style');
      } else if (target.classList.contains('hidden')) {
        // show
        target.classList.remove('hidden');
        target.classList.add('showing');
        target.style.height = content.clientHeight + 'px';
      }

      // 하나만 열릴 때 [data-accr="only"]
      if (accr.getAttribute('data-accr') === 'only') {
        targetAll.forEach(function (ta) {
          if (ta.classList.contains('shown')) {
            ta.style.height = ta.querySelector('.accordion-body').clientHeight + 'px';
            ta.style.height = ta.querySelector('.accordion-body').clientHeight + 'px';
            ta.classList.remove('shown');
            ta.classList.add('hiding');
            ta.removeAttribute('style')

            ta.closest('[data-accr-item]').classList.remove('on');

            UI_Control.accr.transition(ta);
          }
        })
      }

      item.classList.toggle('on');

      UI_Control.accr.transition(target);

      const stopFunc = function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };

      // 트랜지션 시작 시 클릭 이벤트 삭제
      target.addEventListener('transitionstart', function () {
        UI_Control.accr.$accrTrigger.forEach(function (el) {
          el.removeEventListener('click', click);
          el.addEventListener('click', stopFunc, true);
        })
      })

      // 트랜지션 후 클릭 이벤트 복구
      target.addEventListener('transitionend', function () {
        trigger.addEventListener('click', click);
        UI_Control.accr.$accrTrigger.forEach(function (el) {
          el.removeEventListener('click', stopFunc, true);
        })
      })
    })
  },
  transition: function (target) {
    // transition start
    target.addEventListener('transitionstart', function () {
      if (this.classList.contains('showing')) {
        const showing = new CustomEvent('accr.showing');
        this.dispatchEvent(showing);
      } else if (this.classList.contains('hiding')) {
        const hiding = new CustomEvent('accr.hiding');
        this.dispatchEvent(hiding);
      }
      target.removeEventListener('transitionstart', arguments.callee);
    })
    // transition end
    target.addEventListener('transitionend', function () {
      if (this.classList.contains('showing')) {
        this.classList.remove('showing');
        this.classList.add('shown');
        this.removeAttribute('style');

        const shown = new CustomEvent('accr.shown');
        this.dispatchEvent(shown);
      } else if (this.classList.contains('hiding')) {
        this.classList.remove('hiding');
        this.classList.add('hidden');

        const hidden = new CustomEvent('accr.hidden');
        this.dispatchEvent(hidden);
      }
      target.removeEventListener('transitionend', arguments.callee);
    })
  }
}

window.addEventListener('DOMContentLoaded', function () {
  // IE closest 대응
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
  // IE forEach 대응
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  // IE CustomEvent 대응
  (function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })();

  if (document.querySelectorAll('.guide-nav').length) UI_Control.layout.init();
  if (document.querySelectorAll('input[data-checkbox]').length) UI_Control.checkAll.init();
  if (document.querySelectorAll('[data-context]').length) UI_Control.contextMenu.init();
  if (document.querySelectorAll('[data-accr]').length) UI_Control.accr.init();
})