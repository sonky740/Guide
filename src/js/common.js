const UI_Control = {};

UI_Control.layout = {
  init: function () {
    const $url = window.location.href.split('/');
    const $urlLast = $url[$url.length - 1];

    // lnb
    const $lnbParent = document.querySelector('.guide-nav');
    let $lnb = '<strong>Guide</strong>'
    $lnb += '<ul>'
    $lnb += '<li><a href="/Guide/src/html/guide/accordion.html">accordion</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/accordion_jquery.html">accordion_jquery</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/tooltip_jquery.html">tooltip_jquery</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/context-menu.html">context-menu</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/pagination.html">pagination</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/form.html">form</a></li>'
    $lnb += '</ul>'
    $lnbParent.innerHTML = $lnb;

    // lnb === url ? active : null
    const $lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
    [].forEach.call($lnbTrigger, function (el) {
      const $target = el.getAttribute('href').split('/');
      const $targetLast = $target[$target.length - 1];

      if ($urlLast === $targetLast) el.classList.add('active');
    })

    // header 
    const $headerParent = document.querySelector('.header');
    let $header = '<div>'
    $header += '<h1>'
    $header += '<a href="/Guide/src/html/" title="홈으로">Sonky</a>'
    $header += '</h1>'
    $header += '</div>'
    $headerParent.innerHTML = $header;
  }
}

UI_Control.checkAll = {
  init: function () {
    const $check = document.querySelectorAll('input[data-checkbox]');
    [].forEach.call($check, function (el) {
      const $elem = '[name=' + el.getAttribute('data-checkbox') + ']:not([data-checkbox])';
      const $bullet = document.querySelectorAll($elem);

      [].forEach.call($bullet, function (al) {
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
      [].forEach.call(items, function (el) {
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

UI_Control.accor = {
  init: function () {
    const $accr = document.querySelectorAll('[data-toggle="accr"]');

    Array.prototype.forEach.call($accr, function ($accrEl) {
      const $body = $accrEl.querySelectorAll('[data-accr]');

      Array.prototype.forEach.call($body, function ($bodyEl) {
        const $trigger = $bodyEl.querySelector('[data-accr-trigger]');
        const $triggerAll = $accrEl.querySelectorAll('[data-accr-trigger]'); // 이벤트 진행 중에 트리거의 이벤트를 없애기 위함.
        const $trigger_ir = $trigger.querySelector('.blind');
        const $target = $bodyEl.querySelector('[data-accr-target]');
        const $target_body = $target.querySelector('[data-accr-target]>.accr-content-body');

        // init
        if ($bodyEl.getAttribute('data-accr') === 'show') {
          $trigger_ir.innerText = "접기";
          $target.style.height = $target_body.clientHeight + 'px';
        } else {
          $trigger_ir.innerText = "펼치기";
        }

        // 클릭 이벤트
        $trigger.addEventListener('click', function (e) {
          e.preventDefault();

          // 선택한게 열려있으면 닫기
          if ($bodyEl.getAttribute('data-accr') === 'show') {
            $trigger_ir.innerText = "펼치기";
            $bodyEl.setAttribute('data-accr', 'hiding');
            $target.removeAttribute('style');

            $bodyEl.addEventListener('transitionend', function (e) {
              if (e.target !== $trigger) {
                this.setAttribute('data-accr', '');
              }
            })
          } else {
            // 전체 닫기
            if ($accrEl.getAttribute('data-accr-mode') !== 'each') {
              $body.forEach(function ($bodyAll) {
                if ($bodyAll.getAttribute('data-accr') === 'show') {
                  $bodyAll.querySelector('.blind').innerText = "펼치기";
                  $bodyAll.setAttribute('data-accr', 'hiding');
                }
                $bodyAll.querySelector('[data-accr-target]').removeAttribute('style');
                $bodyAll.addEventListener('transitionend', function (e) {
                  if (e.target !== $trigger) {
                    $bodyAll.setAttribute('data-accr', '');
                  }
                });
              });
            }
            // 선택한 영역 열기
            $trigger_ir.innerText = "접기";
            $bodyEl.setAttribute('data-accr', 'showing');
            $target.style.height = $target_body.clientHeight + 'px';

            // 클릭 이벤트를 없애기 위함.
            const stopFunc = function (e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return false;
            };

            // 이벤트 실행 중에 trigger 클릭 이벤트 삭제
            $triggerAll.forEach(function ($trAll) {
              ['click', 'touchend'].forEach(function (events) {
                $trAll.addEventListener(events, stopFunc, true);
              })
            })
            $bodyEl.addEventListener('transitionend', function () {
              this.setAttribute('data-accr', 'show');

              // 이벤트 종료 후 trigger 클릭 이벤트 재할당
              $triggerAll.forEach(function ($trAll) {
                ['click', 'touchend'].forEach(function (events) {
                  $trAll.removeEventListener(events, stopFunc, true);
                })
              })
            })
          }
        })
      })
    })
  }
}

window.addEventListener('DOMContentLoaded', function () {
  // IE forEach 대응
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (document.querySelectorAll('.guide-nav').length) UI_Control.layout.init();
  if (document.querySelectorAll('input[data-checkbox]').length) UI_Control.checkAll.init();
  if (document.querySelectorAll('[data-context]').length) UI_Control.contextMenu.init();
  if (document.querySelectorAll('[data-accor]').length) UI_Control.accor.init();
})