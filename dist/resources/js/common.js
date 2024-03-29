/**
 * 엄격 모드
 */
'use strict';

/**
 * @author 손기연
 * @memberof UI_Control
 * @namespace UI_Control
 * 
 * 목차
 * @see UI_Control.modal 모달
 * @see UI_Control.accr 아코디언
 * @see UI_Control.tab 탭
 * @see UI_Control.tip 툴팁
 * @see UI_Control.counter 숫자 카운터
 * @see UI_Control.range 범위 설정 range
 * @see UI_Control.checkAll 전체 체크박스
 * @see UI_Control.inputDelete 인풋-삭제버튼
 * @see UI_Control.inputMode 인풋-삭제버튼
 * @see UI_Control.ellipsis 말줄임
 * @see UI_Control.scrollView 스크롤에 따른 view
 * @see UI_Control.parallax 패럴랙스
 * @see UI_Control.scrollDetail 디테일한 스크롤 설정
 */
const UI_Control = {};

/**
 * 세자리마다 , 표시
 * @param {number} x
 */
function numberComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 형제요소
 * @param {Element} node
 */
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

/**
 * 쓰로틀 - 일정 시간 간격으로 func 실행
 * @param {Function} callback 
 * @param {number} limit 
 * @returns 
 */
// function throttle(callback, limit) {
//   limit = 100;
//   let waiting = false;
//   return function () {
//     if (!waiting) {
//       callback.apply(this, arguments);
//       waiting = true;
//       setTimeout(function () {
//         waiting = false;
//       }, limit);
//     }
//   };
// }

/**
 * ios version check
 * @returns {number}
 */
// function checkVersion() {
//   var agent = window.navigator.userAgent,
//     start = agent.indexOf('OS');
//   if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
//     return window.Number(agent.substr(start + 3, 3).replace('_', '.'));
//   }
//   return 0;
// }

/**
 * 기본 레이아웃
 */
UI_Control.layout = {
  init: function () {
    const url = window.location.href.split('/');
    const urlLast = url[url.length - 1].split('.html')[0];

    // lnb
    const lnbParent = document.querySelector('.guide-nav');
    if (lnbParent) {
      const root = urlLast === '' ? 'guide/' : '';
      let lnb = '<h2 class="guide-nav-title">Guide<button type="button" class="guide-nav-close" title="Guide Close"></button></h2>';
      lnb += '<ul>';
      lnb += '  <li><a href="' + root + 'modal.html">modal</a></li>';
      lnb += '  <li><a href="' + root + 'accordion.html">accordion</a></li>';
      lnb += '  <li><a href="' + root + 'tab.html">tab</a></li>';
      lnb += '  <li><a href="' + root + 'tooltip.html">tooltip</a></li>';
      lnb += '  <li><a href="' + root + 'range.html">range</a></li>';
      lnb += '  <li><a href="' + root + 'counter.html">counter</a></li>';
      lnb += '  <li><a href="' + root + 'ellipsis.html">ellipsis</a></li>';
      lnb += '  <li><a href="' + root + 'scroll.html">scroll</a></li>';
      lnb += '  <li><a href="' + root + 'parallax.html">parallax</a></li>';
      // lnb += '  <li><a href="' + root + 'swiper.html">swiper</a></li>';
      lnb += '  <li><a href="' + root + 'form.html">form</a></li>';
      lnb += '  <li><a href="' + root + 'pagination.html">pagination</a></li>';
      // lnb += '  <li><a href="' + root + 'accordion_jquery.html">accordion_jquery</a></li>';
      // lnb += '  <li><a href="' + root + 'tooltip_jquery.html">tooltip_jquery</a></li>';
      // lnb += '  <li><a href="' + root + 'tab_jquery.html">tab_jquery</a></li>';
      lnb += '</ul>';
      lnbParent.innerHTML = lnb;
    }

    // lnb === url ? active : null
    const lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
    Array.prototype.forEach.call(lnbTrigger, function (el) {
      const target = el.getAttribute('href').split('/');
      const targetLast = target[target.length - 1].split('.html')[0];

      if (urlLast === targetLast) el.classList.add('active');
    });

    // header 
    const headerParent = document.querySelector('.header');
    const serverURL = window.location.href.split('/');
    const serverURLFirst = serverURL[3] === 'html' ? '/html/' : '/Guide/dist/html/';
    let header = '<div class="header-wrap">';
    header += '<h1>';
    header += '  <a href="' + serverURLFirst + '" title="홈으로">';
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

/**
 * 모달
 */
UI_Control.modal = {
  init: function () {
    this.constructor();

    // 모달 트리거 클릭 시 모달 show
    this.modalTrigger.forEach(function (el) {
      el.addEventListener('click', UI_Control.modal.show);
    });

    // 모달 딤 클릭 시 hide
    this.modalTarget.forEach(function(el) {
      el.addEventListener('click', function(e) {
        if(e.target === el && el.dataset.modalBackdrop !== 'false') UI_Control.modal.hide(e);
      });
    });

    // 모달 닫기 버튼 클릭 시 hide
    this.modalClose.forEach(function(el) {
      el.addEventListener('click', UI_Control.modal.hide);
    });
  },
  constructor: function () {
    this.modalTrigger = document.querySelectorAll('[data-modal-trigger]');
    this.modalTarget = document.querySelectorAll('[data-modal]');
    this.modalClose = document.querySelectorAll('[data-modal-close]');
    this.isTransitioning = false;
  },
  /**
   * 모달 열림
   * @param {string} e id: '#example' || class: '.example' 
   */
  show: function (e) {
    if (UI_Control.modal.isTransitioning) return false;
    UI_Control.modal.setTransitioning(true);

    let target;
    if(e.preventDefault) {
      e.preventDefault();
      target = document.getElementById(e.target.dataset.modalTrigger);
    } else if (typeof e === 'string') {
      target = document.querySelector(e);
    }
    
    target.classList.add('showing');
    target.setAttribute('tabindex', '0');

    // window scroll 방지
    document.body.classList.add('modal-open');
    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };

    const showing = new CustomEvent('modal.showing');
    target.dispatchEvent(showing);

    function complete() {
      target.classList.remove('showing');
      target.classList.add('shown');
      target.focus();
      target.removeAttribute('tabindex');

      const shown = new CustomEvent('modal.shown');
      target.dispatchEvent(shown);

      UI_Control.modal.setTransitioning(false);
    }

    if (target.dataset.modalAnimation === 'false') {
      complete();
    } else {
      target.addEventListener('animationend', function animationend() {
        complete();
        target.removeEventListener('animationend', animationend);
      });
    }
  },
  /**
   * 모달 닫힘
   * @param {string} e id: '#example' || class: '.example' 
   */
  hide: function (e) {
    if (UI_Control.modal.isTransitioning) return false;
    UI_Control.modal.setTransitioning(true);
    
    let target;
    if (typeof e === 'string') {
      target = document.querySelector(e);
    } else {
      target = e.target.closest('[data-modal]');
    }

    target.classList.remove('shown');
    target.classList.add('hiding');
    
    const hiding = new CustomEvent('modal.hiding');
    target.dispatchEvent(hiding);

    function complete() {
      target.classList.remove('hiding');
      document.querySelector('[data-modal-trigger="'+ target.getAttribute('id') +'"]').focus();
      
      // 마지막 모달을 닫을 때 window scroll 복구
      const arr = [];
      document.querySelectorAll('[data-modal]').forEach(function(modals) {
        arr.push(modals.classList.contains('shown'));
      });
      
      arr.some(function(isOpen) {
        if (!isOpen) {
          document.body.classList.remove('modal-open');
          window.onscroll = function () {
            return true;
          };
        }
        return isOpen === true;
      });
      
      const hidden = new CustomEvent('modal.hidden');
      target.dispatchEvent(hidden);
      
      UI_Control.modal.setTransitioning(false);
    }

    if (target.dataset.modalAnimation === 'false') {
      complete();
    } else {
      target.addEventListener('animationend', function animationend(e) {
        if(e.target.hasAttribute('data-modal')) {
          complete();
        }
        target.removeEventListener('animationend', animationend);
      });
    }
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

/**
 * 바디 fixed 제어 (feat. 모달)
 */
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

/**
 * 아코디언
 */
UI_Control.accr = {
  init: function () {
    this.constructor();

    this.accrItem.forEach(function(item) {
        const target = item.querySelector('[data-accr-target]');
        const trigger = item.querySelector('[data-accr-trigger]');
        const ir = trigger.querySelector('.blind');

        if(item.classList.contains('on')) {
          target.classList.add('shown');
          trigger.classList.add('on');
          ir.innerText = '접기';
        } else {
          target.classList.add('hidden');
          ir.innerText = '펼치기';
        }

        trigger.addEventListener('click', function() {
          if (UI_Control.accr.isTransitioning) return false;
          UI_Control.accr.setTransitioning(true);

          if (!item.classList.contains('on')) {
            UI_Control.accr.show(item);
          } else {
            UI_Control.accr.hide(item);
          }
        });
    });
  },
  constructor: function () {
    this.accrItem = document.querySelectorAll('[data-accr-item]');
    this.isTransitioning = false;
  },
  show: function(item) {
    const accr = item.closest('[data-accr]');
    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');
    const ir = trigger.querySelector('.blind');

    item.classList.add('on');
    trigger.classList.add('on');
    ir.innerText = '접기';
    target.classList.remove('hidden');
    target.classList.add('showing');
    target.style.height = target.scrollHeight + 'px';

    const showing = new CustomEvent('accr.showing');
    target.dispatchEvent(showing);

    function complete() {
      target.classList.remove('showing');
      target.classList.add('shown');
      target.removeAttribute('style');
      UI_Control.accr.setTransitioning(false);

      const shown = new CustomEvent('accr.shown');
      target.dispatchEvent(shown);
    }

    if(accr.dataset.accr === 'only') {
      siblings(item).forEach(function(items) {
        if (items.classList.contains('on')) UI_Control.accr.hide(items);
      });
    }

    if(accr.dataset.accrAnimation === 'false') {
      complete();
    } else {
      target.addEventListener('transitionend', function transitionend() {
        complete();
        target.removeEventListener('transitionend', transitionend);
      });
    }
  },
  hide: function(item) {
    const accr = item.closest('[data-accr]');
    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');
    const ir = trigger.querySelector('.blind');

    trigger.classList.remove('on');
    ir.innerText = '펼치기';
    target.style.height = target.scrollHeight + 'px';
    target.style.height = target.scrollHeight + 'px';
    target.classList.remove('shown');
    target.classList.add('hiding');
    target.removeAttribute('style');

    const hiding = new CustomEvent('accr.hiding');
    target.dispatchEvent(hiding);

    function complete() {
      target.classList.remove('hiding');
      target.classList.add('hidden');
      item.classList.remove('on');
      UI_Control.accr.setTransitioning(false);

      const hidden = new CustomEvent('accr.hidden');
      target.dispatchEvent(hidden);
    }

    if(accr.dataset.accrAnimation === 'false') {
      complete();
    } else {
      target.addEventListener('transitionend', function transitionend() {
        complete();
        target.removeEventListener('transitionend', transitionend);
      });
    }
  },
  showAll: function(allItem) {
    allItem = document.querySelectorAll(allItem + '>[data-accr-item]');
    allItem.forEach(function(item) {
      const accr = item.closest('[data-accr]');

      if(accr.dataset.accr === 'only' || item.classList.contains('on')) return false;
      UI_Control.accr.show(item);
    });
  },
  hideAll: function(allItem) {
    allItem = document.querySelectorAll(allItem + '>[data-accr-item]');
    allItem.forEach(function(item) {
      if(!item.classList.contains('on')) return false;
      UI_Control.accr.hide(item);
    });
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

/**
 * 탭
 */
UI_Control.tab = {
  init: function () {
    this.constructor();

    this.tabTrigger.forEach(function (trigger) {
      const target = document.querySelector(trigger.dataset.tabTrigger);

      if(trigger.classList.contains('on')) {
        target.classList.add('shown');
      } else {
        target.classList.add('hidden');
      }

      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!trigger.classList.contains('on')) {
          UI_Control.tab.show(target);
        }
      });
    });
  },
  constructor: function () {
    this.tabTrigger = document.querySelectorAll('[data-tab-trigger]');
    this.isTransitioning = false;
  },
  show: function(target) {
    const trigger = document.querySelector('[data-tab-trigger="#'+ target.getAttribute('id') +'"]');
    const tab = trigger.closest('[data-tab]');

    if (UI_Control.tab.isTransitioning) return false;
    UI_Control.tab.setTransitioning(true);

    siblings(trigger).forEach(function (trs) {
      trs.classList.remove('on');
    });

    trigger.classList.add('on');

    siblings(target).forEach(function(group) {
      if(group.classList.contains('shown')) {
        group.classList.add('hiding');
        group.classList.remove('shown');

        const hiding = new CustomEvent('tab.hiding');
        group.dispatchEvent(hiding);

        if(tab.dataset.tabAnimation === 'false') {
          groupComplete();
        } else {
          group.addEventListener('animationend', function animationend() {
            groupComplete();
            group.removeEventListener('animationend', animationend);
          });
        }
      }

      function groupComplete() {
        group.classList.remove('hiding');
        group.classList.add('hidden');

        const hidden = new CustomEvent('tab.hidden');
        group.dispatchEvent(hidden);
        target.classList.remove('hidden');

        target.classList.add('showing');
        target.classList.add('shown');
        
        const showing = new CustomEvent('tab.showing');
        target.dispatchEvent(showing);
      }
    });

    function targetComplete() {
      target.classList.remove('showing');
      target.classList.add('shown');

      const shown = new CustomEvent('tab.shown');
      target.dispatchEvent(shown);

      UI_Control.tab.setTransitioning(false);
    }

    if(tab.dataset.tabAnimation === 'false') {
      targetComplete();
    } else {
      target.addEventListener('animationend', function animationend() {
        targetComplete();
        target.removeEventListener('animationend', animationend);
      });
    }
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
};

/**
 * 툴팁
 */
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

/**
 * 카운터
 */
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

/**
 * input[type="range"]
 */
UI_Control.range = {
  init: function () {
    this.constructor();

    this.range.forEach(function (rangeThis) {
      const rangeTarget = rangeThis.querySelectorAll('input[type="range"]');
      const rangeLabel = rangeThis.querySelector('.range-label');
      const rangeFill = rangeThis.querySelector('.range-fill');
      const rangeStart = rangeThis.querySelector('input[type="range"][data-range-multi="start"]');
      const rangeEnd = rangeThis.querySelector('input[type="range"][data-range-multi="end"]');

      rangeTarget.forEach(function (rangeTargets) {
        // 간격 표시
        const spacingBody = rangeThis.querySelector('.range-fill-spacing');
        if (spacingBody) {
          const spacing = rangeTargets.max / rangeTargets.step;

          for (let i = 0; i < spacing; i++) {
            const spacing_li = document.createElement('li');
            spacingBody.appendChild(spacing_li);
          }
        }

        // single, multi check
        if (!rangeStart && !rangeEnd) {
          // single init
          UI_Control.range.input(rangeThis, rangeTargets, rangeLabel, rangeFill);

          rangeTargets.addEventListener('input', function () {
            UI_Control.range.input(rangeThis, rangeTargets, rangeLabel, rangeFill);
          });
        } else {
          // multi init
          UI_Control.range.inputStart(rangeFill, rangeStart, rangeEnd);
          UI_Control.range.inputEnd(rangeFill, rangeStart, rangeEnd);

          rangeStart.addEventListener('input', function () {
            UI_Control.range.inputStart(rangeFill, rangeStart, rangeEnd);
          });
          rangeEnd.addEventListener('input', function () {
            UI_Control.range.inputEnd(rangeFill, rangeStart, rangeEnd);
          });
        }
      });
    });
  },
  constructor: function () {
    this.range = document.querySelectorAll('[data-range]');
  },
  /**
   * 단일 range
   * @param {HTMLElement} rangeThis [data-range]
   * @param {HTMLElement} rangeTargets input[type="range"]
   * @param {HTMLElement} rangeLabel 말풍선
   * @param {HTMLElement} rangeFill range 막대
   */
  input: function (rangeThis, rangeTargets, rangeLabel, rangeFill) {
    // percent
    const per = (rangeTargets.value - rangeTargets.min) / (rangeTargets.max - rangeTargets.min) * 100;

    // bar
    rangeFill.style.right = 100 - per + '%';

    // 말풍선
    if (rangeLabel) {
      rangeLabel.style.left = per + '%';
      rangeLabel.innerHTML = numberComma(rangeTargets.value) + rangeTargets.getAttribute('data-unit');

      if (per < 12.5) {
        rangeLabel.classList.add('left');
        rangeLabel.classList.remove('right');
      } else if (per > 87.5) {
        rangeLabel.classList.add('right');
        rangeLabel.classList.remove('left');
      } else {
        rangeLabel.classList.remove('left');
        rangeLabel.classList.remove('right');
      }

      if (per <= 12.5) {
        rangeLabel.style.transform = 'translateX(-40%)';
      } else if (per <= 25) {
        rangeLabel.style.transform = 'translateX(-42%)';
      } else if (per <= 37.5) {
        rangeLabel.style.transform = 'translateX(-46%)';
      } else if (per <= 50) {
        rangeLabel.style.transform = 'translateX(-48%)';
      } else if (per <= 62.5) {
        rangeLabel.style.transform = 'translateX(-52%)';
      } else if (per <= 75) {
        rangeLabel.style.transform = 'translateX(-55%)';
      } else if (per <= 87.5) {
        rangeLabel.style.transform = 'translateX(-58%)';
      } else {
        rangeLabel.style.left = per + '%';
      }
    }

    // min값 선택 안되게
    if (per === 0 && rangeThis.classList.contains('min-no')) {
      rangeLabel.classList.remove('left');
      rangeTargets.value = rangeTargets.step;
      rangeLabel.innerHTML = numberComma(rangeTargets.step) + rangeTargets.getAttribute('data-unit');
      rangeLabel.style.left = (rangeTargets.step / rangeTargets.max) * 100 + '%';
      rangeFill.style.right = 100 - (rangeTargets.step / rangeTargets.max) * 100 + '%';
    }
  },
  /**
   * 멀티 range - 왼쪽 range
   * @param {HTMLElement} rangeFill range multi 막대
   * @param {HTMLElement} rangeStart range start element
   * @param {HTMLElement} rangeEnd range end element
   */
  inputStart: function (rangeFill, rangeStart, rangeEnd) {
    const perStart = (rangeStart.value - rangeStart.min) / (rangeStart.max - rangeStart.min) * 100;
    const perEnd = (rangeEnd.value - rangeEnd.min) / (rangeEnd.max - rangeEnd.min) * 100;
    rangeFill.style.left = perStart + '%';
    rangeFill.style.right = 100 - perEnd + '%';

    rangeStart.value = Math.min(parseInt(rangeStart.value), parseInt(rangeEnd.value) - 10);

    if (rangeStart.value >= rangeEnd.value - 5) {
      rangeStart.style.zIndex = '2';
    } else {
      rangeStart.removeAttribute('style');
    }
  },
  /**
   * 멀티 range - 오른쪽 range
   * @param {HTMLElement} rangeFill range multi 막대
   * @param {HTMLElement} rangeStart range start element
   * @param {HTMLElement} rangeEnd range end element
   */
  inputEnd: function (rangeFill, rangeStart, rangeEnd) {
    const perStart = (rangeStart.value - rangeStart.min) / (rangeStart.max - rangeStart.min) * 100;
    const perEnd = (rangeEnd.value - rangeEnd.min) / (rangeEnd.max - rangeEnd.min) * 100;
    rangeFill.style.left = perStart + '%';
    rangeFill.style.right = 100 - perEnd + '%';

    rangeEnd.value = Math.max(parseInt(rangeEnd.value), parseInt(rangeStart.value) + 10);
  }
};

/**
 * 전체 체크
 */
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

/**
 * input delete 생성
 */
UI_Control.inputDelete = {
  init: function () {
    this.constructor();

    this.trigger.forEach(function (el) {
      const deleteBtn = document.createElement('button');
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.classList.add('input-delete-btn');
      deleteBtn.innerHTML = '<span class="blind">내용 지우기</span>';

      function eventInit() {
        el.insertAdjacentElement('afterend', deleteBtn);
        el.classList.add('input-on');
      }

      function eventDelete() {
        el.value = '';
        deleteBtn.remove();
        el.classList.remove('input-on');
      }

      if (el.value !== '') {
        eventInit();
      }

      UI_Control.inputDelete.input(el, eventInit, eventDelete);
      UI_Control.inputDelete.delete(el, deleteBtn, eventDelete);
    });
  },
  constructor: function () {
    this.trigger = document.querySelectorAll('[data-input-delete]');
  },
  input: function (el, eventInit, eventDelete) {
    el.addEventListener('input', function () {
      if (el.value !== '' && !el.classList.contains('input-on')) {
        eventInit();
      } else if (el.value == '' && el.classList.contains('input-on')) {
        eventDelete();
      }
    });
  },
  delete: function (el, deleteBtn, eventDelete) {
    deleteBtn.addEventListener('click', function () {
      eventDelete();

      const deleteInput = new CustomEvent('input.delete');
      el.dispatchEvent(deleteInput);

      el.focus();
    });
  }
};

/**
 * input mode
 */
UI_Control.inputMode = {
  init: function () {
    this.constructor();

    this.input.forEach(function (el) {
      const input = el.querySelector('.input');

      if(input.value !== '') {
        el.classList.add('valid-on');
      }

      input.addEventListener('focus', function () {
        el.classList.add('focus-on');
      });

      input.addEventListener('blur', function () {
        el.classList.remove('focus-on');

        if (this.value === '') {
          el.classList.remove('valid-on');
        } else {
          el.classList.add('valid-on');
        }
      });
    });
  },
  constructor: function () {
    this.input = document.querySelectorAll('[data-input-mode]');
  },
};

/**
 * 글자수 기준 말 줄임
 */
UI_Control.ellipsis = {
  init: function () {
    this.constructor();

    this.target.forEach(function (el) {
      const limit = el.getAttribute('data-ellipsis');
      const text = el.innerText;
      const trigger = document.createElement('button');
      trigger.setAttribute('type', 'button');
      trigger.setAttribute('data-ellipsis-trigger', '');
      trigger.innerHTML = '더보기';

      // 단순히 글자수로 자를 때
      // if (text.length > limit) {
      //   el.setAttribute('title', text);
      //   const sliced = text.slice(0, limit);
      //   el.innerHTML = sliced + '...';
      //   el.insertAdjacentElement('afterend', trigger);
      // }

      // 바이트 체크
      function getByteCheck(str) {
        let len = 0;
        for (let i = 0; i < str.length; i++) {
          if (escape(str.charAt(i)).length === 6) {
            len++;
          }
          len++;
        }
        return len;
      }

      // bytes 기준으로 자를 때
      if (getByteCheck(text) > limit) {
        let buffer = 0;
        let idx = 0;
        while (getByteCheck(text) > limit) {
          const unicode = text.charCodeAt(idx);
          buffer += unicode > 127 ? 2 : 1;

          if (buffer > limit) break;
          idx++;
        }
        let result = text.substring(0, idx);
        result = result.replace(/\s*$/, '');

        el.setAttribute('title', text);
        el.innerHTML = result + '... ';
        el.insertAdjacentElement('afterend', trigger);
      }

      if (trigger) {
        UI_Control.ellipsis.show(trigger, el);
      }
    });
  },
  constructor: function () {
    this.target = document.querySelectorAll('[data-ellipsis]');
  },
  show: function (trigger, el) {
    trigger.addEventListener('click', function () {
      el.innerHTML = el.getAttribute('title');
      trigger.remove();
    });
  }
};

/**
 * 스크롤에 따른 view
 */
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
    document.addEventListener('scroll', function () {
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
    });
  }
};

/**
 * 패럴랙스
 */
UI_Control.parallax = {
  init: function () {
    this.constructor();

    this.parallaxItem.forEach(function (item) {
      const speed = item.dataset.parallaxSpeed;

      UI_Control.parallax.scroll(item, speed);
    });
  },
  constructor: function () {
    this.parallaxItem = document.querySelectorAll('[data-parallax]');
  },
  scroll: function (item, speed) {
    document.addEventListener('scroll', function () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // 전체 문서의 높이
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 현재 보이는 브라우저의 높이
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 눈에 보이지 않는 남은 높이
      const contentHeight = scrollHeight - clientHeight;

      const percent = (scrollTop / contentHeight) * 100;

      item.style.transform = 'translateY(-' + speed * percent * 0.25 + 'px)';
    });
  }
};

/**
 * 터치 방향 체크
 */
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

/**
 * 스크롤 디테일
 */
UI_Control.scrollDetail = {
  init: function () {
    let yOffset = 0; // window.pageYOffset
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) scene(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [{
        // 0
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
          container: document.querySelector('#scroll-section-0'),
          messageA: document.querySelector('#scroll-section-0 .scroll-section-message.a'),
          messageB: document.querySelector('#scroll-section-0 .scroll-section-message.b'),
          messageC: document.querySelector('#scroll-section-0 .scroll-section-message.c'),
          messageD: document.querySelector('#scroll-section-0 .scroll-section-message.d')
        },
        values: {
          messageA_opacity_in: [0, 1, {
            start: 0.1,
            end: 0.2
          }],
          messageB_opacity_in: [0, 1, {
            start: 0.3,
            end: 0.4
          }],
          messageC_opacity_in: [0, 1, {
            start: 0.5,
            end: 0.6
          }],
          messageD_opacity_in: [0, 1, {
            start: 0.7,
            end: 0.8
          }],
          messageA_translateY_in: [40, 0, {
            start: 0.1,
            end: 0.2
          }],
          messageB_translateY_in: [40, 0, {
            start: 0.3,
            end: 0.4
          }],
          messageC_translateY_in: [40, 0, {
            start: 0.5,
            end: 0.6
          }],
          messageD_translateY_in: [40, 0, {
            start: 0.7,
            end: 0.8
          }],
          messageA_opacity_out: [1, 0, {
            start: 0.25,
            end: 0.35
          }],
          messageB_opacity_out: [1, 0, {
            start: 0.45,
            end: 0.55
          }],
          messageC_opacity_out: [1, 0, {
            start: 0.65,
            end: 0.75
          }],
          messageD_opacity_out: [1, 0, {
            start: 0.85,
            end: 0.95
          }],
          messageA_translateY_out: [0, -40, {
            start: 0.25,
            end: 0.35
          }],
          messageB_translateY_out: [0, -40, {
            start: 0.45,
            end: 0.55
          }],
          messageC_translateY_out: [0, -40, {
            start: 0.65,
            end: 0.75
          }],
          messageD_translateY_out: [0, -40, {
            start: 0.85,
            end: 0.95
          }]
        }
      },
      {
        // 1
        type: 'normal',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
          container: document.querySelector('#scroll-section-1')
        }
      },
      {
        // 2
        type: 'normal',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
          container: document.querySelector('#scroll-section-2'),
        }
      }
    ];

    function setLayout() {
      // 각 스크롤 섹션의 높이 세팅
      for (let i = 0; i < sceneInfo.length; i++) {
        if (sceneInfo[i].type === 'sticky') {
          sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        } else if (sceneInfo[i].type === 'normal') {
          sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight + window.innerHeight * 0.5;
        }
        sceneInfo[i].objs.container.style.height = sceneInfo[i].scrollHeight + 'px';
      }

      yOffset = window.pageYOffset;

      let totalScrollHeight = 0;
      for (let i = 0; i < sceneInfo.length; i++) {
        totalScrollHeight += sceneInfo[i].scrollHeight;
        if (totalScrollHeight >= yOffset) {
          currentScene = i;
          break;
        }
      }

      document.body.setAttribute('id', 'show-scene-' + currentScene);
    }

    function calcValues(values, currentYOffset) {
      let rv;
      // 현재 scene에서 스크롤된 범위를 비율로 구하기
      const scrollHeight = sceneInfo[currentScene].scrollHeight;
      const scrollRatio = currentYOffset / scrollHeight;

      if (values.length === 3) {
        const partScrollStart = values[2].start * scrollHeight;
        const partScrollEnd = values[2].end * scrollHeight;
        const partScrollHeight = partScrollEnd - partScrollStart;

        if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
          rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
        } else if (currentYOffset < partScrollStart) {
          rv = values[0];
        } else if (currentYOffset > partScrollEnd) {
          rv = values[1];
        }
      } else {
        rv = scrollRatio * (values[1] - values[0]) + values[0];
      }

      return rv;
    }

    function playAnimation() {
      const objs = sceneInfo[currentScene].objs;
      const values = sceneInfo[currentScene].values;
      const currentYOffset = yOffset - prevScrollHeight;
      const scrollHeight = sceneInfo[currentScene].scrollHeight;
      const scrollRatio = currentYOffset / scrollHeight;

      switch (currentScene) {
        case 0:

          if (scrollRatio <= 0.22) {
            // in
            objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
            objs.messageA.style.transform = 'translate3d(0,' + calcValues(values.messageA_translateY_in, currentYOffset) + '%, 0)';
          } else {
            // out
            objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
            objs.messageA.style.transform = 'translate3d(0,' + calcValues(values.messageA_translateY_out, currentYOffset) + '%, 0)';
          }

          if (scrollRatio <= 0.42) {
            // in
            objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
            objs.messageB.style.transform = 'translate3d(0,' + calcValues(values.messageB_translateY_in, currentYOffset) + '%, 0)';
          } else {
            // out
            objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
            objs.messageB.style.transform = 'translate3d(0,' + calcValues(values.messageB_translateY_out, currentYOffset) + '%, 0)';
          }

          if (scrollRatio <= 0.62) {
            // in
            objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
            objs.messageC.style.transform = 'translate3d(0,' + calcValues(values.messageC_translateY_in, currentYOffset) + '%, 0)';
          } else {
            // out
            objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
            objs.messageC.style.transform = 'translate3d(0,' + calcValues(values.messageC_translateY_out, currentYOffset) + '%, 0)';
          }

          if (scrollRatio <= 0.82) {
            // in
            objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
            objs.messageD.style.transform = 'translate3d(0,' + calcValues(values.messageD_translateY_in, currentYOffset) + '%, 0)';
          } else {
            // out
            objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
            objs.messageD.style.transform = 'translate3d(0,' + calcValues(values.messageD_translateY_out, currentYOffset) + '%, 0)';
          }

          break;
      }
    }

    function scrollCurrent() {
      enterNewScene = false;
      prevScrollHeight = 0; // 초기화
      for (let i = 0; i < currentScene; i++) {
        prevScrollHeight += sceneInfo[i].scrollHeight;
      }

      if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
        enterNewScene = true;
        currentScene++;
        document.body.setAttribute('id', 'show-scene-' + currentScene);
      }

      if (yOffset < prevScrollHeight) {
        enterNewScene = true;
        currentScene === 0 ? false : null;
        currentScene--;
        document.body.setAttribute('id', 'show-scene-' + currentScene);
      }

      if (enterNewScene) {
        return false;
      }

      playAnimation();
    }

    setLayout();
    window.addEventListener('scroll', function () {
      yOffset = window.pageYOffset;
      scrollCurrent();
    });

    ['resize', 'orientationchange'].forEach(function (events) {
      window.addEventListener(events, function () {
        window.location.reload();
      });
    });
  }
};

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
  // IE remove 대응
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  if (document.querySelectorAll('.guide-nav').length) UI_Control.layout.init();
  if (document.querySelectorAll('[data-modal]').length) UI_Control.modal.init();
  if (document.querySelectorAll('[data-accr]').length) UI_Control.accr.init();
  if (document.querySelectorAll('[data-tab]').length) UI_Control.tab.init();
  if (document.querySelectorAll('[data-tip-trigger]').length) UI_Control.tip.init();
  if (document.querySelectorAll('[data-counter]').length) UI_Control.counter.init();
  if (document.querySelectorAll('[data-range]').length) UI_Control.range.init();
  if (document.querySelectorAll('[data-checkbox]').length) UI_Control.checkAll.init();
  if (document.querySelectorAll('[data-input-delete]').length) UI_Control.inputDelete.init();
  if (document.querySelectorAll('[data-input-mode]').length) UI_Control.inputMode.init();
  if (document.querySelectorAll('[data-ellipsis]').length) UI_Control.ellipsis.init();
  if (document.querySelectorAll('[data-scroll-item]').length) UI_Control.scrollView.init();
  if (document.querySelectorAll('[data-parallax]').length) UI_Control.parallax.init();
});

window.addEventListener('load', function () {
  if (document.querySelectorAll('.scroll-section').length) UI_Control.scrollDetail.init();
});

window.addEventListener('resize', function () {
  if (document.querySelectorAll('[data-scroll-item]').length) UI_Control.scrollView.init();
});