window.addEventListener('DOMContentLoaded', function () {
  layout();
  url();
  checkAll();
  uiTab();
  uiTooltip();
  scrollMagic();
})

/**
 * layout
 */
function layout() {
  var $url = window.location.href.split('/');
  var $urlLast = $url[$url.length - 1];

  // lnb
  var $lnbParent = document.querySelector('.guide-nav');
  var $lnb = '<strong>Guide</strong>'
  $lnb += '<ul>'
  $lnb += '<li><a href="/src/html/guide/context-menu.html">context-menu</a></li>'
  $lnb += '<li><a href="/src/html/guide/pagination.html">pagination</a></li>'
  $lnb += '<li><a href="/src/html/guide/form.html">form</a></li>'
  $lnb += '</ul>'
  $lnbParent.innerHTML = $lnb;
  
  // lnb === url ? active : null
  var $lnbTrigger = document.querySelectorAll('.guide-nav ul li a');
  [].forEach.call($lnbTrigger, function(el) {
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
}

/**
 * url에 따른 컨텐츠
 */
function url() {
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
}

/**
 * 체크박스
 */
function checkAll() {
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
}

/**
 * 탭
 */
function uiTab() {
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
}

/**
 * 툴팁
 */
function uiTooltip() {
  var $tooltip = document.querySelectorAll('[data-tooltip]');
  [].forEach.call($tooltip, function (el) {
    var $tooltipKey = el.getAttribute('data-tooltip');
    var $tooltipTrigger = el.querySelector(':first-child');

    // 마우스오버
    if ($tooltipKey === "hover" || $tooltipKey === "") {
      ['mouseover', 'focus'].forEach(function (trigger) {
        el.addEventListener(trigger, function () {
          el.classList.add('active');
        })
      })

      el.addEventListener('mouseleave', function () {
        el.classList.remove('active');
      })
    }
    // 클릭
    else if ($tooltipKey === "click") {
      $tooltipTrigger.addEventListener('click', function (e) {
        e.preventDefault();

        if (el.classList.contains('active')) {
          el.classList.remove('active');
          $tooltipTrigger.classList.remove('active');
        } else {
          el.classList.add('active');
          $tooltipTrigger.classList.add('active');
        }
      })
    }
  })
}

/**
 * 스크롤 애니메이션
 */
function scrollMagic() {
  var scrollTrigger = document.querySelectorAll('[data-scroll]');

  if (scrollTrigger.length > 0) {
    var controller = new ScrollMagic.Controller();
    for (var i = 0; i < scrollTrigger.length; i++) {

      // fade-out
      if (scrollTrigger[i].dataset.scroll === 'fade-out') {
        var Type1 = new ScrollMagic.Scene({
            triggerElement: scrollTrigger[i],
            triggerHook: 0.8
          })
          .setClassToggle(scrollTrigger[i], 'active')
          .addTo(controller)
        // .addIndicators({name: i+1, colorStart: 'red', colorTrigger: 'blue'});
      }

      // another
    }
  }
}