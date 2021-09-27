const UI_Control = {};

// 세자릿수 콤마 정규식
function numberComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

UI_Control.layout = {
  init: function () {
    const url = window.location.href.split('/');
    const urlLast = url[url.length - 1].split('.html')[0];

    // lnb
    const lnbParent = document.querySelector('.guide-nav');
    let lnb = '<h2 class="guide-nav-title">Guide<button type="button" class="guide-nav-close" title="Guide Close"></button></h2>'
    lnb += '<ul>'
    lnb += '  <li><a href="/Guide/src/html/guide/modal.html">modal</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/accordion.html">accordion</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/tab.html">tab</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/range.html">range</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/counter.html">counter</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/accordion_jquery.html">accordion_jquery</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/tooltip_jquery.html">tooltip_jquery</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/tab_jquery.html">tab_jquery</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/context-menu.html">context-menu</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/pagination.html">pagination</a></li>'
    lnb += '  <li><a href="/Guide/src/html/guide/form.html">form</a></li>'
    lnb += '</ul>'
    lnbParent.innerHTML = lnb;

    // lnb === url ? active : null
    const lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
    Array.prototype.forEach.call(lnbTrigger, function (el) {
      const target = el.getAttribute('href').split('/');
      const targetLast = target[target.length - 1].split('.html')[0];

      if (urlLast === targetLast) el.classList.add('active');
    })

    // header 
    const headerParent = document.querySelector('.header');
    let header = '<div class="header-wrap">'
    header += '<h1>'
    header += '  <a href="/Guide/src/html/" title="홈으로">Sonky</a>'
    header += '</h1>'
    header += '<button type="button" class="header-bar trigger" title="Guide Menu">'
    header += '  <i aria-hidden="true"></i>'
    header += '</button>'
    header += '</div>'
    headerParent.innerHTML = header;

    // header button
    const menuTrigger = document.querySelector('.header-bar');
    const menuTarget = document.querySelector('.guide-nav');
    const menuClose = document.querySelector('.guide-nav-close');

    menuTrigger.classList.add('trigger');

    menuTrigger.addEventListener('click', function () {
      document.body.style.overflow = 'hidden';
      if (this.classList.contains('trigger')) {
        this.classList.add('on');
        menuTarget.classList.add('on');
      }
      this.classList.remove('trigger');
    })

    menuTrigger.addEventListener('transitionend', function () {
      if (menuTarget.classList.contains('on')) {
        menuClose.classList.add('trigger');
      }
    })

    menuClose.addEventListener('click', function () {
      document.body.removeAttribute('style');
      if (this.classList.contains('trigger')) {
        menuTrigger.classList.remove('on');
        menuTarget.style.left = '-100%';
      }
    })

    menuTarget.addEventListener('transitionend', function (e) {
      if (e.target === menuTarget) {
        menuTarget.removeAttribute('style');
        menuTarget.classList.remove('on');
        menuTrigger.classList.add('trigger');
        menuClose.classList.remove('trigger');
      } else {
        return false;
      }
    })
  }
}

UI_Control.modal = {
  init: function () {
    this.constructor();

    this.open();
    this.close();

    this.transition();
  },
  constructor: function () {
    this.modalTrigger = document.querySelectorAll('[data-modal-trigger]');
    this.modalTarget = document.querySelectorAll('.ly-modal');
    this.modalClose = document.querySelectorAll('[data-modal-close]');
    this.isTransitioning = false;
  },
  open: function () {
    this.modalTrigger.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();

        if (UI_Control.modal.isTransitioning) {
          return false;
        }

        const target = document.querySelector('#' + el.getAttribute('data-modal-trigger'))
        setTimeout(function () {
          target.classList.add('showing');
        }, 0)

        setTimeout(function () {
          target.classList.add('fade');
        }, 100)
      })
    })
  },
  close: function () {
    // 닫기 버튼
    this.modalClose.forEach(function (el) {
      const modal = el.closest('.ly-modal');
      el.addEventListener('click', function (e) {
        e.preventDefault();

        if (UI_Control.modal.isTransitioning) {
          return false;
        }

        modal.classList.add('hiding');
        modal.classList.remove('shown');
        modal.classList.remove('fade');
      })
    })

    // dim 클릭 닫기
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('ly-modal') && e.target.getAttribute('data-backdrop') === null) {

        if (UI_Control.modal.isTransitioning) {
          return false;
        }

        e.target.classList.add('hiding');
        e.target.classList.remove('shown');
        e.target.classList.remove('fade');
      }
    })
  },
  transition: function () {
    this.modalTarget.forEach(function (el) {
      // 이벤트 시작 시
      el.addEventListener('transitionstart', function (e) {
        UI_Control.modal.setTransitioning(true);

        if (el.classList.contains('showing') && e.target.classList.contains('ly-modal-wrap') && e.propertyName === 'opacity') {
          const showing = new CustomEvent('modal.showing');
          this.dispatchEvent(showing);
        } else if (el.classList.contains('hiding') && e.target.classList.contains('ly-modal-wrap') && e.propertyName === 'opacity') {
          const hiding = new CustomEvent('modal.hiding');
          this.dispatchEvent(hiding);
        }
        return false;
      })
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

          const hidden = new CustomEvent('modal.hidden');
          this.dispatchEvent(hidden);
        }
        return false;
      })
    })
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
}

UI_Control.accr = {
  init: function () {
    this.constructor();

    this.accrTrigger.forEach(function (trigger) {
      const accr = trigger.closest('[data-accr]');
      const item = trigger.closest('[data-accr-item]');
      const target = item.querySelector('[data-accr-target]');
      const targetAll = accr.querySelectorAll('[data-accr-target]');
      const content = target.querySelector('.accordion-body');
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
        UI_Control.accr.click(trigger, accr, item, target, targetAll, content, ir);
      } else {
        UI_Control.accr.clickNoAni(trigger, accr, item, target, targetAll, ir);
      }
    })
  },
  constructor: function () {
    this.accrTrigger = document.querySelectorAll('[data-accr-trigger]');
    this.isTransitioning = false;
  },
  click: function (trigger, accr, item, target, targetAll, content, ir) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();
      e.stopPropagation();

      if (UI_Control.accr.isTransitioning) {
        return false;
      }

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
        targetAll.forEach(function (ta) {
          if (ta.classList.contains('shown')) {
            ta.style.height = ta.querySelector('.accordion-body').clientHeight + 'px';

            setTimeout(function () {
              ta.classList.add('hiding');
              ta.classList.remove('shown');

              ta.removeAttribute('style')
              ta.closest('[data-accr-item]').querySelector('[data-accr-trigger]').classList.remove('on');
              ta.closest('[data-accr-item]').querySelector('[data-accr-trigger]').querySelector('.blind').innerHTML = '펼치기';

              UI_Control.accr.transition(ta);
            }, 0)
          }
        })
      }

      trigger.classList.toggle('on');

      UI_Control.accr.transition(target);
    })
  },
  clickNoAni: function (trigger, accr, item, target, targetAll, ir) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();

      // 숨길 때 - 공통
      if (target.classList.contains('shown')) {
        target.classList.remove('shown');
        target.classList.add('hidden');
        ir.innerHTML = '펼치기'

        const hidden = new CustomEvent('accr.hidden');
        target.dispatchEvent(hidden);
      } else {
        // 하나만 펼쳐질 때
        if (accr.getAttribute('data-accr') === 'only') {
          targetAll.forEach(function (ta) {
            if (ta.classList.contains('shown')) {
              ta.classList.remove('shown');
              ta.classList.add('hidden');

              const hidden = new CustomEvent('accr.hidden');
              ta.dispatchEvent(hidden);
            }
          })
          accr.querySelectorAll('[data-accr-item]').forEach(function (items) {
            items.classList.remove('on');
            items.querySelector('[data-accr-trigger]').classList.remove('on');
            items.querySelector('.blind').innerHTML = '펼치기';
          })
        }
        // 각각 펼쳐질 때
        target.classList.remove('hidden');
        target.classList.add('shown');
        ir.innerHTML = '접기'

        const shown = new CustomEvent('accr.shown');
        target.dispatchEvent(shown);
      }
      item.classList.toggle('on');
      trigger.classList.toggle('on');
    })
  },
  transition: function (target) {
    // transition start
    target.addEventListener('transitionstart', function transitionstart() {
      UI_Control.accr.setTransitioning(true);

      if (this.classList.contains('showing')) {
        const showing = new CustomEvent('accr.showing');
        this.dispatchEvent(showing);
      } else if (this.classList.contains('hiding')) {
        const hiding = new CustomEvent('accr.hiding');
        this.dispatchEvent(hiding);
      }

      target.removeEventListener('transitionstart', transitionstart);
    })
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
    })
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
}

UI_Control.tab = {
  init: function () {
    this.constructor();

    this.tabTrigger.forEach(function (trigger) {
      const tabNav = trigger.closest('[data-tab]');
      const item = tabNav.querySelectorAll('[data-tab-item]');
      const group = document.querySelectorAll('[data-tab-group="' + tabNav.getAttribute('data-tab') + '"]');
      const target = document.querySelector('[data-tab-target="' + trigger.getAttribute('data-tab-trigger') + '"]')

      UI_Control.tab.click(trigger, item, group, target)

      if (trigger.parentNode.classList.contains('on')) {
        ['fade', 'shown'].forEach(function (classNames) {
          target.classList.add(classNames);
        })
      } else {
        target.classList.add('hidden');
      }
    })
  },
  constructor: function () {
    this.tabTrigger = document.querySelectorAll('[data-tab-trigger]');
    this.isTransitioning = false;
  },
  click: function (trigger, item, group, target) {
    trigger.addEventListener('click', function click(e) {
      e.preventDefault();

      if (UI_Control.tab.isTransitioning) {
        return false;
      }

      // nav-tab
      if (!trigger.parentNode.classList.contains('on')) {
        item.forEach(function (el) {
          el.classList.remove('on');
        })
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
            }, 0);

            UI_Control.tab.transition(target);
            el.removeEventListener('transitionend', transitionend);
          })
        }
      })
    })
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
    })
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
    })
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  }
}

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
        }
      };

      window.requestAnimationFrame(step);
    })
  },
  constructor: function () {
    this.counter = document.querySelectorAll('[data-counter]');
  }
}

UI_Control.range = {
  init: function () {
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
      })

      // IE 얼럿
      if ((navigator.appName == 'Netscape' && navigator.userAgent.toLowerCase().indexOf('trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1)) {
        alert('IE에서는 작동하지 않습니다. ')
        return false;
      }
      // else {
      //   UI_Control.range.polyfill(rangeTarget);
      // }
    })
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
}

UI_Control.checkAll = {
  init: function () {
    const check = document.querySelectorAll('input[data-checkbox]');
    Array.prototype.forEach.call(check, function (el) {
      const elem = '[name=' + el.getAttribute('data-checkbox') + ']:not([data-checkbox])';
      const bullet = document.querySelectorAll(elem);

      Array.prototype.forEach.call(bullet, function (al) {
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
          const checked = document.querySelectorAll('input:checked' + elem).length;
          if (checked === bullet.length) {
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
        const gChecked = document.querySelectorAll('input:checked' + elem).length;
        if (gChecked === bullet.length) {
          el.checked = true;
        }
      })
    })
  }
}

UI_Control.Tooltip = {
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
  if (document.querySelectorAll('.ly-modal').length) UI_Control.modal.init();
  if (document.querySelectorAll('[data-accr]').length) UI_Control.accr.init();
  if (document.querySelectorAll('[data-tab]').length) UI_Control.tab.init();
  if (document.querySelectorAll('[data-counter]').length) UI_Control.counter.init();
  if (document.querySelectorAll('[data-range]').length) UI_Control.range.init();
  if (document.querySelectorAll('[data-checkbox]').length) UI_Control.checkAll.init();
  if (document.querySelectorAll('[data-context]').length) UI_Control.Tooltip.init();
})