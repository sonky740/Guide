/* eslint-disable */

/* ********************************************************************** */
var UI = UI || {};
UI.hasJqueryObject = function ($el) {
  return $el.length > 0;
};

// tab
UI.tab = {
  init: function () {
    this.createSelector();

    this.$tabTrigger.each(function () {
      const li = $(this).parent();
      const target = $('[data-tabs-target=' + $(this).data('tabs-trigger') + ']')

      if (li.hasClass('on')) {
        target.addClass('fade shown');
      } else {
        target.addClass('hidden');
      }
    })

    this.click();
  },
  createSelector: function () {
    this.$tab = UI.$body.find("[data-tabs]");
    this.$tabTrigger = this.$tab.find("[data-tabs-trigger]");
    this.$tabTarget = this.$tab.find("[data-tabs-target]");
    this.isTransitioning = false;
  },
  click: function () {
    this.$tabTrigger.off('click.tabs').on('click.tabs', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (UI.tab.isTransitioning) {
        return false;
      }

      const trigger = $(e.target);
      const target = $('[data-tabs-target= ' + trigger.data('tabs-trigger') + ']');

      if (!trigger.parent().hasClass('on')) {
        trigger.parent().siblings().each(function () {
          $(this).removeClass('on');
        })
        trigger.parent().addClass('on');
      } else {
        return false;
      }

      target.siblings().each(function () {
        const targetAll = $(this)

        if (targetAll.hasClass('shown')) {
          targetAll.removeClass('shown');
          targetAll.addClass('hiding');
          targetAll.removeClass('fade');

          UI.tab.transition(targetAll);
        }
        targetAll.on('transitionend.tabs', function () {
          target.removeClass('hidden');
          target.addClass('showing');

          setTimeout(function () {
            target.addClass('fade');
          }, 0)
        })
      })
      UI.tab.transition(target);
    })
  },
  transition: function (target) {
    target.off('transitionstart.tabs').on('transitionstart.tabs', function () {
      UI.tab.isTransitioning = true;
      if (target.hasClass('showing')) {
        target.trigger('tabs.showing');
      } else if (target.hasClass('hiding')) {
        target.trigger('tabs.hiding');
      }
    })
    target.off('transitionend.tabs').on('transitionend.tabs', function () {
      UI.tab.isTransitioning = false;

      if (target.hasClass('showing')) {
        target.removeClass('showing');
        target.addClass('shown');

        target.trigger('tabs.shown');
      } else if (target.hasClass('hiding')) {
        target.removeClass('hiding');
        target.addClass('hidden');

        target.trigger('tabs.hidden');
      }
    })
  }
};

// accordion
UI.accor = {
  init: function () {
    this.createSelector();

    $('[data-accor-item]').each(function () {
      const initTarget = $(this).find('>[data-accor-target]');

      // 펼쳐져 있을 경우
      if ($(this).hasClass('on')) {
        $(this).find('[data-accor-trigger]').addClass('on');
        $(this).find('[data-accor-trigger] .blind').text('접기');
        initTarget.addClass('shown');
      } else {
        $(this).find('[data-accor-trigger] .blind').text('펼치기');
        initTarget.addClass('hidden');
      }
    })

    this.click();
  },
  createSelector: function () {
    this.$accor = UI.$body.find('[data-accor]');
    this.$accorItem = this.$accor.find('>[data-accor-item]');
    this.$accorTrigger = this.$accorItem.find('>.accordion-title>[data-accor-trigger]');
  },
  click: function () {
    this.$accorTrigger.on('click.accor', function () {
      const item = $(this).closest('.accordion-item');
      const target = item.find('>[data-accor-target]');

      // 각각 활성화
      if (item.hasClass('on')) {
        target.removeClass('shown');
        $(this).find('.blind').text('펼치기');

        /* 애니메이션 없을 시 */
        if ($(this).closest('[data-accor-animation="false"]').length) {
          target.addClass('hidden');
          item.removeClass('on');
          $(this).removeClass('on');
          target.trigger('accor.hidden');
          return false;
        }
        /* // 애니메이션 없을 시 */
        target.css('height', target.children().outerHeight());
        target.css('height', target.children().outerHeight());
        target.addClass('hiding');
        target.css('height', 0);
      } else {
        // 하나만 활성화일 때
        if ($(this).closest('[data-accor]').data('accor') === "only") {
          item.siblings().each(function () {
            const targetAll = $(this).find('>[data-accor-target]');

            if (targetAll.hasClass('shown')) {
              $(this).find('[data-accor-trigger] .blind').text('펼치기');
              $(this).find('[data-accor-trigger]').removeClass('on');

              /* 애니메이션 없을 시 */
              if ($(this).closest('[data-accor-animation="false"]').length) {
                targetAll.removeClass('shown');
                targetAll.addClass('hidden');
                $(this).removeClass('on');

                targetAll.trigger('accor.hidden');
                return false;
              }
              /* // 애니메이션 없을 시 */
              targetAll.css('height', targetAll.children().outerHeight());
              targetAll.css('height', targetAll.children().outerHeight());

              targetAll.removeClass('shown');
              targetAll.addClass('hiding');
              targetAll.css('height', 0);

              UI.accor.transition(targetAll);
            }
          })
        }
        target.removeClass('hidden');
        $(this).find('.blind').text('접기');
        /* 애니메이션 없을 시 */
        if ($(this).closest('[data-accor-animation="false"]').length) {
          target.addClass('shown');
          item.addClass('on');
          $(this).addClass('on');

          target.trigger('accor.shown');
          return false;
        }
        /* // 애니메이션 없을 시 */
        target.addClass('showing');
        target.css('height', target.children().outerHeight());
      }

      item.addClass('on');
      $(this).toggleClass('on');

      UI.accor.transition(target);

      // 이벤트 중에 클릭 이벤트 취소
      UI.accor.$accorTrigger.off('click.accor', UI.accor.click());
      target.on('transitionend', function () {
        UI.accor.$accorTrigger.on('click.accor', UI.accor.click());

        target.off('transitionstart').off('transitionend');
      })
    });
  },
  transition: function (target) {
    target.off('transitionstart.accor').on('transitionstart.accor', function () {
      if (target.hasClass('showing')) {
        target.trigger('accor.showing')
      } else if (target.hasClass('hiding')) {
        target.trigger('accor.hiding')
      }
    })
    target.off('transitionend.accor').on('transitionend.accor', function () {
      if (target.hasClass('showing')) {
        target.removeClass('showing');
        target.addClass('shown');
        target.removeAttr('style');

        setTimeout(function () {
          target.trigger('accor.shown');
        }, 0)
      } else if (target.hasClass('hiding')) {
        target.removeClass('hiding');
        target.addClass('hidden');
        target.removeAttr('style');

        target.closest('[data-accor-item]').removeClass('on');

        setTimeout(function () {
          target.trigger('accor.hidden');
        }, 0)
      }
    })
  }
};

UI.tooltip = {
  init: function () {
    this.createSelector();

    this.$tooltipTarget.addClass('hidden');

    this.show();
    this.close();
  },
  createSelector: function () {
    this.$tooltip = UI.$body.find('[data-tooltip]');
    this.$tooltipTrigger = this.$tooltip.find('[data-tooltip-trigger]');
    this.$tooltipTarget = this.$tooltip.find('[data-tooltip-target]');
    this.isTransitioning = false;
  },
  show: function () {
    this.$tooltipTrigger.off('click.tooltip').on('click.tooltip', function (e) {
      e.preventDefault();

      if (UI.tooltip.isTransitioning) return false;

      const trigger = $(e.target);
      const tooltip = trigger.closest('[data-tooltip]');
      const target = tooltip.find('[data-tooltip-target]');

      if (target.hasClass('hidden')) {
        target.removeClass('hidden');
        target.addClass('showing');
        setTimeout(function () {
          target.addClass('fade');
        }, 0)
      } else if (target.hasClass('shown')) {
        return false;
      }

      UI.tooltip.transition(target);
    })
  },
  close: function () {
    $(document).on('click.tooltip', function (e) {
      const current = $(e.target);
      const tooltip = current.closest('[data-tooltip]');
      const target = tooltip.find('[data-tooltip-target]');
      const backdrop = $('[data-tooltip].backdrop').find('[data-tooltip-target]')

      if (current.is('[data-tooltip-close]')) {
        if (UI.tooltip.isTransitioning) return false;

        target.removeClass('shown');
        target.addClass('hiding');
        target.removeClass('fade');
      }

      backdrop.each(function () {
        if ($(this).hasClass('shown')) {
          if (UI.tooltip.isTransitioning) return false;

          if (!current.is(backdrop)) {
            $(this).removeClass('shown');
            $(this).addClass('hiding');
            $(this).removeClass('fade');
          }
        }
      })

      UI.tooltip.transition(target);
    })
  },
  transition: function (target) {
    target.off('transitionstart.tooltip').on('transitionstart.tooltip', function () {
      UI.tooltip.isTransitioning = true;

      if (target.hasClass('showing')) {
        target.trigger('tooltip.showing');
      } else if (target.hasClass('hiding')) {
        target.trigger('tooltip.hiding');
      }
    })
    target.off('transitionend.tooltip').on('transitionend.tooltip', function () {
      UI.tooltip.isTransitioning = false;

      if (target.hasClass('showing')) {
        target.removeClass('showing');
        target.addClass('shown');

        target.trigger('tooltip.shown');
      } else if (target.hasClass('hiding')) {
        target.removeClass('hiding');
        target.addClass('hidden');

        target.trigger('tooltip.hidden');
      }
    })
    target.off('transitioncancel').on('transitioncancel', function () {
      console.log('a')
    })
  }
}


$(function () {
  UI.$window = $(window);
  UI.$body = $("body");
  if (UI.hasJqueryObject(UI.$body.find(".tab-wrap"))) UI.tab.init();
  if (UI.hasJqueryObject(UI.$body.find('[data-tabs-trigger]'))) UI.tab.init();
  if (UI.hasJqueryObject(UI.$body.find('[data-accor]'))) UI.accor.init();
  if (UI.hasJqueryObject(UI.$body.find('[data-tooltip-trigger]'))) UI.tooltip.init();
});