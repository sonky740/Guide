'use strict';
const UI_Control = {};

// 세자릿수 콤마 정규식
function numberComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 형제 요소
function siblings(node) {
  var children = node.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function (e) {
    return e != node;
  });
}

// 쓰로틀 - 일정 시간 간격으로 func 실행
function throttle(fn, ms) {
  let throttled = false;
  return function () {
    if (!throttled) {
      throttled = setTimeout(function () {
        throttled = null;
        fn.apply(this, arguments);
      }, ms);
    }
  };
}

// ios version check
function checkVersion() {
  var agent = window.navigator.userAgent,
    start = agent.indexOf('OS');
  if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
    return window.Number(agent.substr(start + 3, 3).replace('_', '.'));
  }
  return 0;
}

UI_Control.layout = {
  init: function () {
    const url = window.location.href.split('/');
    const urlLast = url[url.length - 1].split('.html')[0];

    // lnb
    const lnbParent = document.querySelector('.guide-nav');
    let lnb = '<h2 class="guide-nav-title">Guide<button type="button" class="guide-nav-close" title="Guide Close"></button></h2>';
    lnb += '<ul>';
    lnb += '  <li><a href="/Guide/src/html/guide/modal.html">modal</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/accordion.html">accordion</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/tab.html">tab</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/tooltip.html">tooltip</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/range.html">range</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/counter.html">counter</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/scroll.html">scroll</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/parallax.html">parallax</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/swiper.html">swiper</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/form.html">form</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/pagination.html">pagination</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/accordion_jquery.html">accordion_jquery</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/tooltip_jquery.html">tooltip_jquery</a></li>';
    lnb += '  <li><a href="/Guide/src/html/guide/tab_jquery.html">tab_jquery</a></li>';
    lnb += '</ul>';
    lnbParent.innerHTML = lnb;

    // lnb === url ? active : null
    const lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
    Array.prototype.forEach.call(lnbTrigger, function (el) {
      const target = el.getAttribute('href').split('/');
      const targetLast = target[target.length - 1].split('.html')[0];

      if (urlLast === targetLast) el.classList.add('active');
    });

    // header 
    const headerParent = document.querySelector('.header');
    let header = '<div class="header-wrap">';
    header += '<h1>';
    header += '  <a href="/Guide/src/html/" title="홈으로">';
    header += '    <svg width="100" height="40" viewBox="0 0 100 45">';
    header += '      <text x="0" y="85%">SONKY</text>';
    header += '    </svg>';
    header += '  </a>';
    header += '</h1>';
    header += '<button type="button" class="header-bar trigger" title="Guide Menu">';
    header += '  <i aria-hidden="true"></i>';
    header += '</button>';
    header += '</div>';
    headerParent.innerHTML = header;

    // header button
    const menuTrigger = document.querySelector('.header-bar');
    const menuTarget = document.querySelector('.guide-nav');
    const menuClose = document.querySelector('.guide-nav-close');

    menuTrigger.classList.add('trigger');

    menuTrigger.addEventListener('click', function () {
      if (this.classList.contains('trigger')) {
        document.body.style.overflow = 'hidden';
        this.classList.remove('trigger');
        this.classList.add('on');
        menuTarget.classList.add('on');
      }
    });

    menuClose.addEventListener('click', function () {
      if (this.classList.contains('trigger')) {
        this.classList.remove('trigger');
        menuTarget.classList.remove('on');
        menuTrigger.classList.add('trigger');
        menuTrigger.classList.remove('on');
      }
    });

    menuTarget.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'transform' && !menuTrigger.classList.contains('trigger')) {
        menuClose.classList.add('trigger');
      } else if (e.propertyName === 'transform' && menuTrigger.classList.contains('trigger')) {
        document.body.removeAttribute('style');
      }
    });
  }
};

UI_Control.modal = {
  init: function () {
    this.constructor();

    this.modalTrigger.forEach(function (el) {
      el.addEventListener('click', UI_Control.modal.show);
    });

    document.addEventListener('click', UI_Control.modal.hide);

    this.transition();
  },
  constructor: function () {
    this.modalTrigger = document.querySelectorAll('[data-modal-trigger]');
    this.modalTarget = document.querySelectorAll('[data-modal]');
    this.modalClose = document.querySelectorAll('[data-modal-close]');
    this.isTransitioning = false;
  },
  show: function (node) {
    if (UI_Control.modal.isTransitioning) {
      return false;
    }

    setTimeout(function () {
      UI_Control.modal.setTransitioning(true);
    });

    document.body.style.overflow = 'hidden';
    UI_Control.bodyFixed.init('off'); // body scroll 제거

    let textTarget = '';
    if (typeof node === 'object') {
      textTarget = document.querySelector('#' + this.getAttribute('data-modal-trigger'));
    } else {
      textTarget = document.querySelector(node);
    }

    const target = textTarget;
    target.classList.add('showing');

    setTimeout(function () {
      target.classList.add('fade');
      target.setAttribute('tabindex', '0');
      target.focus();
    }, 50);
  },
  hide: function (e) {
    // 닫기 버튼
    UI_Control.modal.modalClose.forEach(function (el) {
      let textTarget = '';
      if (typeof e === 'object') {
        textTarget = el.closest('[data-modal]');
      } else {
        textTarget = document.querySelector(e);
      }
      const modal = textTarget;
      if (e.target === el || typeof e === 'string' && modal.classList.contains('shown')) {
        // e.preventDefault();

        if (UI_Control.modal.isTransitioning) {
          return false;
        }

        modal.classList.add('hiding');
        modal.classList.remove('shown');
        modal.classList.remove('fade');
      }
    });

    // dim 클릭 닫기
    if (typeof e !== 'string') {
      if (e.target.classList.contains('ly-modal') && e.target.getAttribute('data-backdrop') === null) {
        e.stopPropagation();

        if (UI_Control.modal.isTransitioning) {
          return false;
        }

        e.target.classList.add('hiding');
        e.target.classList.remove('shown');
        e.target.classList.remove('fade');
      } else {
        return false;
      }
    }
  },
  transition: function () {
    this.modalTarget.forEach(function (el) {
      // 이벤트 시작 시
      el.addEventListener('transitionstart', function (e) {
        if (el.classList.contains('showing') && e.target.classList.contains('ly-modal-wrap') && e.propertyName === 'opacity') {
          const showing = new CustomEvent('modal.showing');
          this.dispatchEvent(showing);
        } else if (el.classList.contains('hiding') && e.target.classList.contains('ly-modal-wrap') && e.propertyName === 'opacity') {
          document.querySelector('[data-modal-trigger="' + el.getAttribute('id') + '"]').focus();
          el.removeAttribute('tabindex');
          const hiding = new CustomEvent('modal.hiding');
          this.dispatchEvent(hiding);
        }
        return false;
      });
      // 이벤트 끝날 시
      el.addEventListener('transitionend', function (e) {
        UI_Control.modal.setTransitioning(false);

        if (el.classList.contains('showing') && e.target.classList.contains('ly-modal-wrap') && e.propertyName === 'opacity') {
          el.classList.remove('showing');
          el.classList.add('shown');

          const shown = new CustomEvent('modal.shown');
          this.dispatchEvent(shown);
        } else if (el.classList.contains('hiding') && e.target.classList.contains('ly-modal-wrap') && e.propertyName === 'opacity') {
          el.classList.remove('hiding');
          document.body.style.overflow = 'auto';
          UI_Control.bodyFixed.init('on'); // body scroll 제거 해제

          const hidden = new CustomEvent('modal.hidden');
          this.dispatchEvent(hidden);
        }
        return false;
      });
    });
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

// 바디 스크롤 제어
let scrollTop = 0;
UI_Control.bodyFixed = {
  init: function (mode) {
    this.$wrap = document.body;

    if (mode == 'off') { //body scroll 제거
      scrollTop = window.scrollY || document.documentElement.scrollTop;
      this.$wrap.style.position = 'fixed';
      this.$wrap.style.top = -scrollTop + 'px';
      this.$wrap.style.left = 0;
      this.$wrap.style.width = 100 + '%';
      return scrollTop;
    } else if (mode == 'on') { //body scroll 제거 해제
      this.$wrap.removeAttribute('style');
      window.scrollTo({
        top: scrollTop
      });
    }
  }
};

UI_Control.accr = {
  init: function () {
    this.constructor();

    this.accrTrigger.forEach(function (trigger) {
      const accr = trigger.closest('[data-accr]');
      const item = trigger.closest('[data-accr-item]');
      const target = item.querySelector('[data-accr-target]');
      const content = target.children[0];
      const ir = trigger.querySelector('.blind');

      if (!item.classList.contains('on')) {
        target.classList.add('hidden');
        ir.innerHTML = '펼치기';
      } else {
        trigger.classList.add('on');
        target.classList.add('shown');
        ir.innerHTML = '접기';
      }

      if (!accr.getAttribute('data-accr-animation')) {
        UI_Control.accr.click(trigger, accr, item, target, content, ir);
      } else {
        UI_Control.accr.clickNoAni(trigger, accr, item, target, ir);
      }
    });
  },
  constructor: function () {
    this.accrTrigger = document.querySelectorAll('[data-accr-trigger]');
    this.isTransitioning = false;
  },
  click: function (trigger, accr, item, target, content, ir) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();
      e.stopPropagation();

      if (UI_Control.accr.isTransitioning) {
        return false;
      }

      UI_Control.accr.setTransitioning(true);

      // 각각 열릴 때
      if (target.classList.contains('shown')) {
        // hide
        ir.innerHTML = '펼치기';
        target.style.height = content.clientHeight + 'px';
        target.style.height = content.clientHeight + 'px';
        target.classList.add('hiding');
        target.classList.remove('shown');
        target.removeAttribute('style');
      } else if (target.classList.contains('hidden')) {
        // show
        item.classList.add('on');
        ir.innerHTML = '접기';
        target.classList.add('showing');
        target.classList.remove('hidden');
        target.style.height = content.clientHeight + 'px';
      }

      // 하나만 열릴 때 [data-accr="only"]
      if (accr.getAttribute('data-accr') === 'only') {
        siblings(item).forEach(function (ta) {
          const targetAll = ta.querySelector('[data-accr-target]');
          if (targetAll.classList.contains('shown')) {
            targetAll.style.height = targetAll.children[0].clientHeight + 'px';

            setTimeout(function () {
              targetAll.classList.add('hiding');
              targetAll.classList.remove('shown');

              targetAll.removeAttribute('style');
              targetAll.closest('[data-accr-item]').querySelector('[data-accr-trigger]').classList.remove('on');
              targetAll.closest('[data-accr-item]').querySelector('[data-accr-trigger]').querySelector('.blind').innerHTML = '펼치기';

              UI_Control.accr.transition(targetAll);
            }, 0);
          }
        });
      }

      trigger.classList.toggle('on');

      UI_Control.accr.transition(target);
    });
  },
  clickNoAni: function (trigger, accr, item, target, ir) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();

      // 숨길 때 - 공통
      if (target.classList.contains('shown')) {
        target.classList.remove('shown');
        target.classList.add('hidden');
        ir.innerHTML = '펼치기';

        const hidden = new CustomEvent('accr.hidden');
        target.dispatchEvent(hidden);
      } else {
        // 하나만 펼쳐질 때
        if (accr.getAttribute('data-accr') === 'only') {
          siblings(item).forEach(function (ta) {
            const targetAll = ta.querySelector('[data-accr-target]');
            if (targetAll.classList.contains('shown')) {
              targetAll.classList.remove('shown');
              targetAll.classList.add('hidden');

              const hidden = new CustomEvent('accr.hidden');
              targetAll.dispatchEvent(hidden);
            }
          });
          accr.querySelectorAll('[data-accr-item]').forEach(function (items) {
            items.classList.remove('on');
            items.querySelector('[data-accr-trigger]').classList.remove('on');
            items.querySelector('.blind').innerHTML = '펼치기';
          });
        }
        // 각각 펼쳐질 때
        target.classList.remove('hidden');
        target.classList.add('shown');
        ir.innerHTML = '접기';

        const shown = new CustomEvent('accr.shown');
        target.dispatchEvent(shown);
      }
      item.classList.toggle('on');
      trigger.classList.toggle('on');
    });
  },
  transition: function (target) {
    // transition start
    target.addEventListener('transitionstart', function transitionstart() {
      if (this.classList.contains('showing')) {
        const showing = new CustomEvent('accr.showing');
        this.dispatchEvent(showing);
      } else if (this.classList.contains('hiding')) {
        const hiding = new CustomEvent('accr.hiding');
        this.dispatchEvent(hiding);
      }

      target.removeEventListener('transitionstart', transitionstart);
    });
    // transition end
    target.addEventListener('transitionend', function transitionend() {
      UI_Control.accr.setTransitioning(false);

      if (this.classList.contains('showing')) {
        this.classList.remove('showing');
        this.classList.add('shown');
        this.removeAttribute('style');

        const shown = new CustomEvent('accr.shown');
        this.dispatchEvent(shown);
      } else if (this.classList.contains('hiding')) {
        this.classList.remove('hiding');
        this.classList.add('hidden');
        this.closest('[data-accr-item]').classList.remove('on');

        const hidden = new CustomEvent('accr.hidden');
        this.dispatchEvent(hidden);
      }

      target.removeEventListener('transitionend', transitionend);
    });
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

UI_Control.tab = {
  init: function () {
    this.constructor();

    this.tabTrigger.forEach(function (trigger) {
      const tabNav = trigger.closest('[data-tab]');
      const item = tabNav.querySelectorAll('[data-tab-item]');
      const group = document.querySelectorAll('[data-tab-group="' + tabNav.getAttribute('data-tab') + '"]');
      const target = document.querySelector('[data-tab-target="' + trigger.getAttribute('data-tab-trigger') + '"]');

      if (trigger.parentNode.classList.contains('on')) {
        ['fade', 'shown'].forEach(function (classNames) {
          target.classList.add(classNames);
        });
      } else {
        target.classList.add('hidden');
      }

      if (checkVersion() === 12) {
        UI_Control.tab.clickNoAni(trigger, item, group, target);
      } else {
        UI_Control.tab.click(trigger, item, group, target);
      }
    });
  },
  constructor: function () {
    this.tabTrigger = document.querySelectorAll('[data-tab-trigger]');
    this.isTransitioning = false;
  },
  click: function (trigger, item, group, target) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();
      e.stopPropagation();

      if (UI_Control.tab.isTransitioning) {
        return false;
      }

      // nav-tab
      if (!trigger.parentNode.classList.contains('on')) {
        item.forEach(function (el) {
          el.classList.remove('on');
        });
        e.target.parentNode.classList.add('on');
      } else {
        return false;
      }

      // tab-target
      group.forEach(function (el) {
        if (el.classList.contains('shown')) {
          el.classList.add('hiding');
          el.classList.remove('shown');
          el.classList.remove('fade');

          UI_Control.tab.transition(el);

          el.addEventListener('transitionend', function transitionend() {
            target.classList.add('showing');
            target.classList.remove('hidden');

            setTimeout(function () {
              target.classList.add('fade');
              UI_Control.tab.transition(target);
              el.removeEventListener('transitionend', transitionend);
            }, 50);

          });
        }
      });
    });
  },
  clickNoAni: function (trigger, item, group, target) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();
      e.stopPropagation();

      if (UI_Control.tab.isTransitioning) {
        return false;
      }

      // nav-tab
      if (!trigger.parentNode.classList.contains('on')) {
        item.forEach(function (el) {
          el.classList.remove('on');
        });
        e.target.parentNode.classList.add('on');
      } else {
        return false;
      }

      // tab-target
      group.forEach(function (el) {
        if (el.classList.contains('shown')) {
          el.classList.add('hidden');
          el.classList.remove('shown');
          el.classList.remove('fade');

          target.classList.remove('hidden');
          target.classList.add('shown');
          target.classList.add('fade');
        }
      });
    });
  },
  transition: function (target) {
    // transition start
    target.addEventListener('transitionstart', function transitionstart() {
      UI_Control.tab.setTransitioning(true);

      if (this.classList.contains('showing')) {
        const showing = new CustomEvent('tab.showing');
        this.dispatchEvent(showing);
      } else if (this.classList.contains('hiding')) {
        const hiding = new CustomEvent('tab.hiding');
        this.dispatchEvent(hiding);
      }
      target.removeEventListener('transitionstart', transitionstart);
    });
    // transition end
    target.addEventListener('transitionend', function transitionend() {
      UI_Control.tab.setTransitioning(false);

      if (this.classList.contains('showing')) {
        this.classList.remove('showing');
        this.classList.add('shown');

        const shown = new CustomEvent('tab.shown');
        this.dispatchEvent(shown);
      } else if (this.classList.contains('hiding')) {
        this.classList.remove('hiding');
        this.classList.add('hidden');

        const hidden = new CustomEvent('tab.hidden');
        this.dispatchEvent(hidden);
      }
      target.removeEventListener('transitionend', transitionend);
    });
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

UI_Control.tip = {
  init: function () {
    this.constructor();

    this.tipTrigger.forEach(function (trigger) {
      const tooltip = trigger.closest('[data-tip]');
      const target = tooltip.querySelector('[data-tip-target]');
      const close = tooltip.querySelector('[data-tip-close]');

      target.classList.add('hidden');

      UI_Control.tip.show(trigger, target);
      UI_Control.tip.hide(trigger, target, close);
    });
  },
  constructor: function () {
    this.tipTrigger = document.querySelectorAll('[data-tip-trigger]');
    this.isTransitioning = false;
  },
  show: function (trigger, target) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();

      if (UI_Control.tip.isTransitioning) {
        return false;
      }

      if (target.classList.contains('hidden')) {
        target.classList.remove('hidden');
        target.classList.add('showing');

        setTimeout(function () {
          target.classList.add('fade');
        }, 50);
      } else {
        return false;
      }

      UI_Control.tip.transition(target);
    });
  },
  hide: function (trigger, target, close) {
    document.addEventListener('click', function (e) {
      const cTarget = close.closest('[data-tip-target]');

      if (target.classList.contains('shown')) {

        if (UI_Control.tip.isTransitioning) {
          return false;
        }

        if (e.target === close) {
          cTarget.classList.add('hiding');
          cTarget.classList.remove('shown');
          cTarget.classList.remove('fade');
          UI_Control.tip.transition(target);
          return false;
        }

        if (target.closest('[data-tip]').getAttribute('data-tip') === 'backdrop' && e.target !== target && e.target !== trigger) {
          target.classList.add('hiding');
          target.classList.remove('shown');
          target.classList.remove('fade');
          UI_Control.tip.transition(target);
          return false;
        }
      }
    });
  },
  transition: function (target) {
    target.addEventListener('transitionstart', function transitionstart() {
      UI_Control.tip.setTransitioning(true);
      if (target.classList.contains('showing')) {
        const showing = new CustomEvent('tip.showing');
        target.dispatchEvent(showing);
      } else if (target.classList.contains('hiding')) {
        const hiding = new CustomEvent('tip.hiding');
        target.dispatchEvent(hiding);
      }
      target.removeEventListener('transitionstart', transitionstart);
    });
    target.addEventListener('transitionend', function transitionend() {
      UI_Control.tip.setTransitioning(false);
      if (target.classList.contains('showing')) {
        target.classList.add('shown');
        target.classList.remove('showing');

        const shown = new CustomEvent('tip.shown');
        target.dispatchEvent(shown);
      } else if (target.classList.contains('hiding')) {
        target.classList.add('hidden');
        target.classList.remove('hiding');

        const hidden = new CustomEvent('tip.hidden');
        target.dispatchEvent(hidden);
      }
      target.removeEventListener('transitionend', transitionend);
    });
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

UI_Control.counter = {
  init: function () {
    this.constructor();

    this.counter.forEach(function (el) {
      const initNumber = el.getAttribute('data-init-number');
      const duration = el.getAttribute('data-duration');
      const comma = el.getAttribute('data-comma');
      let startTime = null;

      const step = function (currentTime) {
        if (!startTime) {
          startTime = currentTime;
        }
        const progress = Math.min((currentTime - startTime) / duration, 1);
        if (comma) {
          el.innerHTML = numberComma(Math.floor(progress * (el.getAttribute('data-counter') - Number(initNumber)) + Number(initNumber)));
        } else {
          el.innerHTML = Math.floor(progress * (el.getAttribute('data-counter') - Number(initNumber)) + Number(initNumber));
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          const counterEnd = new CustomEvent('counter.end');
          el.dispatchEvent(counterEnd);
        }
      };

      window.requestAnimationFrame(step);
    });
  },
  constructor: function () {
    this.counter = document.querySelectorAll('[data-counter]');
  }
};

UI_Control.range = {
  init: function () {

    // IE 얼럿
    if (window.navigator.userAgent.match(/MSIE|Internet Explorer|Trident/i)) {
      alert('IE에서는 작동하지 않습니다.');
      setTimeout(function () {
        history.back();
      });
      location.href = 'microsoft-edge:https://sonky740.github.io/Guide/src/html/guide/range.html';
      return false;
    }

    this.constructor();

    this.range.forEach(function (rangeThis) {
      const rangeTarget = rangeThis.querySelector('input[type="range"]');
      const rangeLabel = rangeThis.querySelector('.range-label');
      const rangeFill = rangeThis.querySelector('.range-fill');

      // init
      UI_Control.range.input(rangeThis, rangeTarget, rangeLabel, rangeFill);

      // 간격 표시
      const spacingBody = rangeThis.querySelector('.range-fill-spacing');
      if (spacingBody) {
        const spacing = rangeTarget.max / rangeTarget.step;

        for (let i = 0; i < spacing; i++) {
          const spacing_li = document.createElement('li');
          spacingBody.appendChild(spacing_li);
        }
      }

      // input event
      rangeTarget.addEventListener('input', function () {
        UI_Control.range.input(rangeThis, rangeTarget, rangeLabel, rangeFill);
      });

      // else {
      //   UI_Control.range.polyfill(rangeTarget);
      // }
    });
  },
  constructor: function () {
    this.range = document.querySelectorAll('[data-range]');
  },
  input: function (rangeThis, rangeTarget, rangeLabel, rangeFill) {
    // percent
    const per = (rangeTarget.value - rangeTarget.min) / (rangeTarget.max - rangeTarget.min) * 100;

    // bar
    rangeFill.style.width = per + '%';

    // 말풍선
    if (rangeLabel) {
      rangeLabel.style.left = per + '%';
      rangeLabel.innerHTML = numberComma(rangeTarget.value) + rangeTarget.getAttribute('data-unit');

      if (per < 12.5) {
        rangeLabel.classList.add('left');
        rangeLabel.classList.remove('right');
      } else if (per <= 12.5) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-44%)';
      } else if (per <= 25) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-46%)';
      } else if (per <= 37.5) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-48%)';
      } else if (per <= 50) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-50%)';
      } else if (per <= 62.5) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-51%)';
      } else if (per <= 75) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-53%)';
      } else if (per <= 87.5) {
        rangeLabel.classList.remove('right');
        rangeLabel.style.transform = 'translateX(-55%)';
      } else if (per > 87.5) {
        rangeLabel.classList.add('right');
        rangeLabel.classList.remove('left');
      } else {
        rangeLabel.classList.remove('right');
        rangeLabel.classList.remove('left');
        rangeLabel.style.left = per + '%';
      }
    }

    // min값 선택 안되게
    if (per === 0 && rangeThis.classList.contains('min-no')) {
      rangeLabel.classList.remove('left');
      rangeTarget.value = rangeTarget.step;
      rangeLabel.innerHTML = numberComma(rangeTarget.step) + rangeTarget.getAttribute('data-unit');
      rangeLabel.style.left = (rangeTarget.step / rangeTarget.max) * 100 + '%';
      rangeFill.style.width = (rangeTarget.step / rangeTarget.max) * 100 + '%';
    }

    // 타입1 = 급속, 완속 충전
    if (rangeThis.classList.contains('type1')) {
      const dataLeft = rangeThis.querySelector('[data-left]');
      const dataRight = rangeThis.querySelector('[data-right]');

      dataLeft.innerHTML = rangeTarget.value + rangeTarget.getAttribute('data-unit');
      dataRight.innerHTML = Number(rangeTarget.max - rangeTarget.value) + rangeTarget.getAttribute('data-unit');
    }
  },
  // polyfill: function (rangeTarget) {
  //   // ios range 터치되게
  //   function iosPolyfill(e) {
  //     let val = (e.pageX - rangeTarget.getBoundingClientRect().left) /
  //       (rangeTarget.getBoundingClientRect().right - rangeTarget.getBoundingClientRect().left),
  //       max = rangeTarget.getAttribute("max"),
  //       segment = 1 / (max - 1),
  //       segmentArr = [];

  //     max++;

  //     for (let i = 0; i < max; i++) {
  //       segmentArr.push(segment * i);
  //     }

  //     var segCopy = segmentArr.slice(),
  //     // arrow 함수로 변경해야함. IE에서 자꾸 에러 띄워서 function으로 냅둠.
  //     ind = segmentArr.sort(function (a, b) {
  //       Math.abs(val - a) - Math.abs(val - b)
  //     })[0];
  //     // ind = segmentArr.sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0];

  //     rangeTarget.value = segCopy.indexOf(ind) + 1;

  //     init(e.target);
  //   }
  //   if (!!navigator.platform.match(/iPhone|iPod|iPad/)) {
  //     rangeTarget.addEventListener("touchend", iosPolyfill, {
  //       passive: true
  //     });
  //   }
  // }
};

UI_Control.checkAll = {
  init: function () {
    this.constructor();

    this.all.forEach(function (master) {
      const elem = '[name=' + master.getAttribute('data-checkbox') + ']:not([data-checkbox])';
      const bullet = document.querySelectorAll(elem);

      bullet.forEach(function (child, i) {
        // 전체 클릭이 되어있다면
        if (master.checked) {
          child.checked = true;
        }

        // 전부 클릭이 되어있다면
        const gChecked = document.querySelectorAll('input:checked' + elem).length;
        if (gChecked === bullet.length) {
          master.checked = true;
        }

        UI_Control.checkAll.click(elem, master, bullet, child, i);
      });
    });
  },
  constructor: function () {
    this.all = document.querySelectorAll('input[data-checkbox]');
  },
  click: function (elem, master, bullet, child, i) {
    const checkA = new CustomEvent('checked');
    const checkC = new CustomEvent('unchecked');

    // 전체 클릭, 해제
    master.addEventListener('click', function () {
      if (master.checked) {
        child.checked = true;
        if (i === 0) {
          master.dispatchEvent(checkA);
        }
      } else {
        child.checked = false;
        if (i === 0) {
          master.dispatchEvent(checkC);
        }
      }
    });

    // 요소 클릭, 해제
    child.addEventListener('click', function () {
      const checked = document.querySelectorAll('input:checked' + elem).length;
      if (checked === bullet.length) {
        master.checked = true;
        master.dispatchEvent(checkA);
      } else if (master.checked && checked === bullet.length - 1) {
        master.checked = false;
        master.dispatchEvent(checkC);
      }
    });
  }
};

UI_Control.scrollView = {
  init: function () {
    this.constructor();

    this.scrollItem.forEach(function (item) {
      let itemTop = item.getBoundingClientRect().top;
      let viewH = document.documentElement.offsetHeight;
      let multiple = Number(item.getAttribute('data-scroll-multiple')) || 4 / 5;

      if (itemTop < viewH * multiple) {
        item.classList.add('focus-in');
      }

      UI_Control.scrollView.scroll(item, multiple);
    });
  },
  constructor: function () {
    this.scrollItem = document.querySelectorAll('[data-scroll-item]');
  },
  scroll: function (item, multiple) {
    document.addEventListener('scroll', throttle(function () {
      let itemTop = item.getBoundingClientRect().top;
      let viewH = document.documentElement.offsetHeight;

      if (itemTop < viewH * multiple && !item.classList.contains('focus-in')) {
        item.classList.add('focus-in');

        const show = new CustomEvent('scroll.show');
        item.dispatchEvent(show);
      } else if (itemTop > viewH * multiple / multiple * 3 / 4 && item.classList.contains('focus-in')) {
        item.classList.remove('focus-in');

        const hide = new CustomEvent('scroll.hide');
        item.dispatchEvent(hide);
      }
    }, 100));
  }
};

UI_Control.parallax = {
  init: function () {
    const parallaxItem = document.querySelectorAll('[data-parallax]');

    Array.prototype.forEach.call(parallaxItem, (el) => {
      const speed = el.dataset.parallaxSpeed;
      
      document.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 전체 문서의 높이
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // 현재 보이는 브라우저의 높이
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        // 눈에 보이지 않는 남은 높이
        const contentHeight = scrollHeight - clientHeight;

        const percent = (scrollTop / contentHeight) * 100;
        
        el.style.transform = 'translateY(-' + speed * percent * 0.25 + 'px)';
      });
    });
  }
};

UI_Control.touchCheck = {
  init: function () {

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    let xDown = null;
    let yDown = null;
    let xDiff = null;
    let yDiff = null;
    let timeDown = null;
    let startEl = null;

    /**
     * Fires swiped event if swipe detected on touchend
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchEnd(e) {

      // if the user released on a different target, cancel!
      if (startEl !== e.target) return;

      let swipeThreshold = parseInt(getNearestAttribute(startEl, 'data-swipe-threshold', '20'), 10); // default 20px
      let swipeTimeout = parseInt(getNearestAttribute(startEl, 'data-swipe-timeout', '500'), 10); // default 500ms
      let timeDiff = Date.now() - timeDown;
      let eventType = '';
      let changedTouches = e.changedTouches || e.touches || [];

      if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
        if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
          if (xDiff > 0) {
            eventType = 'swiped-left';
          } else {
            eventType = 'swiped-right';
          }
        }
      } else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
        if (yDiff > 0) {
          eventType = 'swiped-up';
        } else {
          eventType = 'swiped-down';
        }
      }

      if (eventType !== '') {

        let eventData = {
          dir: eventType.replace(/swiped-/, ''),
          xStart: parseInt(xDown, 10),
          xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
          yStart: parseInt(yDown, 10),
          yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10)
        };

        // fire `swiped` event event on the element that started the swipe
        startEl.dispatchEvent(new CustomEvent('swiped', {
          bubbles: true,
          cancelable: true,
          detail: eventData
        }));

        // fire `swiped-dir` event on the element that started the swipe
        startEl.dispatchEvent(new CustomEvent(eventType, {
          bubbles: true,
          cancelable: true,
          detail: eventData
        }));
      }

      // reset values
      xDown = null;
      yDown = null;
      timeDown = null;
    }

    /**
     * Records current location on touchstart event
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchStart(e) {

      // if the element has data-swipe-ignore="true" we stop listening for swipe events
      if (e.target.getAttribute('data-swipe-ignore') === 'true') return;

      startEl = e.target;

      timeDown = Date.now();
      xDown = e.touches[0].clientX;
      yDown = e.touches[0].clientY;
      xDiff = 0;
      yDiff = 0;
    }

    /**
     * Records location diff in px on touchmove event
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchMove(e) {

      if (!xDown || !yDown) return;

      let xUp = e.touches[0].clientX;
      let yUp = e.touches[0].clientY;

      xDiff = xDown - xUp;
      yDiff = yDown - yUp;
    }

    /**
     * Gets attribute off HTML element or nearest parent
     * @param {object} el - HTML element to retrieve attribute from
     * @param {string} attributeName - name of the attribute
     * @param {any} defaultValue - default value to return if no match found
     * @returns {any} attribute value or defaultValue
     */
    function getNearestAttribute(el, attributeName, defaultValue) {

      // walk up the dom tree looking for data-action and data-trigger
      while (el && el !== document.documentElement) {

        const attributeValue = el.getAttribute(attributeName);

        if (attributeValue) {
          return attributeValue;
        }

        el = el.parentNode;
      }

      return defaultValue;
    }
  }
};

window.addEventListener('DOMContentLoaded', function () {
  // 구글 애널리틱스
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-C8DGM3YSKG';
  const scriptSource = document.createElement('script');
  scriptSource.innerText = 'window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "G-C8DGM3YSKG");';
  document.head.appendChild(script);
  document.head.appendChild(scriptSource);

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
    if (typeof window.CustomEvent === 'function') return false;

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
  if (document.querySelectorAll('[data-modal]').length) UI_Control.modal.init();
  if (document.querySelectorAll('[data-accr]').length) UI_Control.accr.init();
  if (document.querySelectorAll('[data-tab]').length) UI_Control.tab.init();
  if (document.querySelectorAll('[data-tip-trigger]').length) UI_Control.tip.init();
  if (document.querySelectorAll('[data-counter]').length) UI_Control.counter.init();
  if (document.querySelectorAll('[data-range]').length) UI_Control.range.init();
  if (document.querySelectorAll('[data-checkbox]').length) UI_Control.checkAll.init();
  if (document.querySelectorAll('[data-scroll-item]').length) UI_Control.scrollView.init();
  if (document.querySelectorAll('[data-parallax]').length) UI_Control.parallax.init();
});

window.addEventListener('resize', function () {
  if (document.querySelectorAll('[data-scroll-item]').length) UI_Control.scrollView.init();
});