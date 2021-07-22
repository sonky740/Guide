window.addEventListener('DOMContentLoaded', function () {
  // IE forEach 대응
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  UI_Control.layout();
  UI_Control.url();
  UI_Control.checkAll();
  UI_Control.tab();
  UI_Control.contextMenu();
  UI_Control.accr();
})

var UI_Control = {
  /**
   * layout
   */
  layout: function () {
    var $url = window.location.href.split('/');
    var $urlLast = $url[$url.length - 1];

    // lnb
    var $lnbParent = document.querySelector('.guide-nav');
    var $lnb = '<strong>Guide</strong>'
    $lnb += '<ul>'
    $lnb += '<li><a href="/Guide/src/html/guide/accordion.html">accordion</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/context-menu.html">context-menu</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/pagination.html">pagination</a></li>'
    $lnb += '<li><a href="/Guide/src/html/guide/form.html">form</a></li>'
    $lnb += '</ul>'
    $lnbParent.innerHTML = $lnb;

    // lnb === url ? active : null
    var $lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
    [].forEach.call($lnbTrigger, function (el) {
      var $target = el.getAttribute('href').split('/');
      var $targetLast = $target[$target.length - 1];

      if ($urlLast === $targetLast) el.classList.add('active');
    })

    // header 
    var $headerParent = document.querySelector('.header');
    var $header = '<div>'
    $header += '<h1>'
    $header += '<a href="/src/html/" title="홈으로">Sonky</a>'
    $header += '</h1>'
    $header += '</div>'
    $headerParent.innerHTML = $header;
  },

  /**
   * url에 따른 컨텐츠
   */
  url: function () {
    var $url = window.location.href.split('?')[1];
    if ($url) {
      var $urlCode = $url.slice(0, 6);
    }

    var $dataUrl = document.querySelectorAll('[data-url]');
    [].forEach.call($dataUrl, function (el) {
      var $elValue = el.getAttribute('data-url');

      if ($urlCode !== $elValue) {
        el.parentNode.removeChild(el)
      }
    })
  },

  /**
   * 체크박스
   */
  checkAll: function () {
    var $check = document.querySelectorAll('input[data-checkbox]');
    [].forEach.call($check, function (el) {
      var $elem = '[name=' + el.getAttribute('data-checkbox') + ']:not([data-checkbox])';
      var $bullet = document.querySelectorAll($elem);

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
          var $checked = document.querySelectorAll('input:checked' + $elem).length;
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
        var $gChecked = document.querySelectorAll('input:checked' + $elem).length;
        if ($gChecked === $bullet.length) {
          el.checked = true;
        }
      })
    })
  },

  /**
   * 탭
   */
  tab: function () {
    var $tab = document.querySelectorAll('[data-tab-group]');
    [].forEach.call($tab, function (el) {
      var $group = el.getAttribute('data-tab-group');
      var $trigger = el.querySelectorAll('[data-tabtit]');
      var $bullet = document.querySelectorAll('[data-tabcon]');

      [].forEach.call($trigger, function (el2) {
        var $title = el2.getAttribute('data-tabtit')
        el2.addEventListener('click', function (e) {
          // a태그 일 경우
          if (el2.getAttribute('href')) {
            e.preventDefault();

            [].forEach.call($trigger, function (el2all) {
              el2all.classList.remove('active');
            })
            this.classList.add('active');
          }

          [].forEach.call($bullet, function (el3) {
            var $content = el3.getAttribute('data-tabcon');
            var $content2 = el3.getAttribute('id');

            if ($group === $content) {
              if ($title === $content2) {
                el3.classList.add('active');
              } else {
                el3.classList.remove('active');
              }
            }
          })
        })
      });
    })
  },

  /**
   * contextMenu
   */
  contextMenu: function () {
    const items = document.querySelectorAll('[data-context] > a');

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
  },

  /**
   * 아코디언
   */
  accr: function () {
    var $accr = document.querySelectorAll('[data-toggle="accr"]');

    Array.prototype.forEach.call($accr, function ($accrEl) {
      var $body = $accrEl.querySelectorAll('[data-accr]');

      Array.prototype.forEach.call($body, function ($bodyEl) {
        var $trigger = $bodyEl.querySelector('[data-accr-trigger]');
        var $triggerAll = $accrEl.querySelectorAll('[data-accr-trigger]'); // 이벤트 진행 중에 트리거의 이벤트를 없애기 위함.
        var $trigger_ir = $trigger.querySelector('.blind');
        var $target = $bodyEl.querySelector('[data-accr-target]');
        var $target_body = $target.querySelector('[data-accr-target] .accr_content_body');

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
              })
            })
            // 선택한 영역 열기
            $trigger_ir.innerText = "접기";
            $bodyEl.setAttribute('data-accr', 'showing');
            $target.style.height = $target_body.clientHeight + 'px';

            // 클릭 이벤트를 없애기 위함.
            var stopFunc = function (e) {
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