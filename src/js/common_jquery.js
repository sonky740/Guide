/* ********************************************************************** */
var UI = UI || {};
UI.hasJqueryObject = function ($el) {
    return $el.length > 0;
};

// tab
UI.tab = {
    init: function () {
        this.createSelector();

        this.click();
    },
    createSelector: function () {
        this.$tab = UI.$body.find(".tabs");
        this.$tabTrigger = this.$tab.find("[data-tab-trigger]");
        this.$tabTarget = this.$tab.find(".tabs-content");
        this.isTransitioning = false;
    },
    click: function () {

    },
    transition: function () {

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
                $(this).find('>.accordion-title .blind').text('접기');
                initTarget.addClass('shown');
            } else {
                $(this).find('>.accordion-title .blind').text('펼치기');
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
                /* 애니메이션 없을 시 */
                if ($(this).closest('[data-accor-animation="false"]').length) {
                    target.addClass('hidden');
                    item.removeClass('on');
                    target.trigger('accor.hidden');
                    return false;
                }
                /* // 애니메이션 없을 시 */
                target.css('height', target.children().outerHeight());
                target.css('height', target.children().outerHeight());
                target.addClass('hiding');
                target.css('height', 0);

                target.off('transitionstart').on('transitionstart', function () {
                    $(this).trigger('accor.hiding')
                })

                target.off('transitionend').on('transitionend', function () {
                    $(this).removeClass('hiding');
                    $(this).addClass('hidden');
                    $(this).removeAttr('style');

                    $(this).trigger('accor.hidden');
                })
            } else {
                // 하나만 활성화일 때
                if ($(this).closest('[data-accor]').data('accor') === "only") {
                    item.siblings().each(function () {
                        const targetAll = $(this).find('>[data-accor-target]');

                        if (targetAll.hasClass('shown')) {
                            $(this).removeClass('on');
                            /* 애니메이션 없을 시 */
                            if ($(this).closest('[data-accor-animation="false"]').length) {
                                targetAll.removeClass('shown');
                                targetAll.addClass('hidden');
                                targetAll.trigger('accor.hidden');
                                return false;
                            }
                            /* // 애니메이션 없을 시 */
                            targetAll.css('height', targetAll.children().outerHeight());
                            targetAll.css('height', targetAll.children().outerHeight());
                            targetAll.removeClass('shown');
                            targetAll.addClass('hiding');
                            targetAll.css('height', 0);

                            targetAll.off('transitionstart').on('transitionstart', function () {
                                $(this).trigger('accor.hiding');
                            })

                            targetAll.off('transitionend').on('transitionend', function () {
                                $(this).removeClass('hiding');
                                $(this).addClass('hidden');
                                $(this).removeAttr('style');

                                $(this).trigger('accor.hidden');
                            })
                        }
                    })
                }

                target.removeClass('hidden');
                /* 애니메이션 없을 시 */
                if ($(this).closest('[data-accor-animation="false"]').length) {
                    target.addClass('shown');
                    item.addClass('on');
                    target.trigger('accor.shown');
                    return false;
                }
                /* // 애니메이션 없을 시 */
                target.addClass('showing');
                target.css('height', target.children().outerHeight());

                target.off('transitionstart').on('transitionstart', function () {
                    $(this).trigger('accor.showing')
                })

                target.off('transitionend').on('transitionend', function () {
                    $(this).removeClass('showing');
                    $(this).addClass('shown');
                    $(this).removeAttr('style');

                    $(this).trigger('accor.shown');
                })
            }

            item.toggleClass('on');

            // 이벤트 중에 클릭 이벤트 취소
            UI.accor.$accorTrigger.off('click.accor', UI.accor.click());
            target.on('transitionend', function () {
                UI.accor.$accorTrigger.on('click.accor', UI.accor.click());

                target.off('transitionstart').off('transitionend');
            })
        });
    }
};

UI.tooltip = {
    init: function () {
        this.createSelector();

        this.$tooltipTarget.addClass('hidden');

        this.click();
    },
    createSelector: function () {
        this.$tooltip = UI.$body.find('[data-tooltip]');
        this.$tooltipTrigger = this.$tooltip.find('[data-tooltip-trigger]');
        this.$tooltipTarget = this.$tooltip.find('[data-tooltip-target]');
    },
    click: function () {
        UI.$body.on('click.tooltip', function (e) {
            e.stopPropagation();

            const current = $(e.target);
            const current_tooltip = current.closest('[data-tooltip]');
            const current_trigger = current.closest('[data-tooltip-trigger]');
            const current_target = current_tooltip.find('[data-tooltip-target]');

            if (current.is(current_trigger)) {
                if (current_target.hasClass('shown')) {
                    // hide
                    current_target.removeClass('fade');
                    current_target.removeClass('shown');
                    current_target.addClass('hiding');
                } else {
                    // show
                    current_target.removeClass('hiding');
                    current_target.removeClass('hidden');
                    current_target.addClass('showing');
                    setTimeout(function () {
                        current_target.addClass('fade');
                    }, 0)
                }
            } else if (!current.is(UI.tooltip.$tooltipTarget)) {
                UI.tooltip.backdrop();
            }

            UI.tooltip.transition(current_target);
        })
    },
    backdrop: function () {
        UI.tooltip.$tooltip.each(function () {
            if ($(this).is('.backdrop')) {
                const b_target = $(this).find('[data-tooltip-target]');
                b_target.removeClass('showing');
                b_target.removeClass('fade');
                
                b_target.off('transitionstart').on('transitionstart', function () {
                    $(this).removeClass('shown');
                    $(this).addClass('hiding');

                    $(this).trigger('tooltip.hiding');
                })

                b_target.off('transitionend').on('transitionend', function () {
                    $(this).removeClass('hiding');
                    $(this).addClass('hidden');

                    $(this).trigger('tooltip.hidden');
                })
            }
        })
    },
    transition: function (target) {
        target.off('transitionstart').on('transitionstart', function () {
            if (target.hasClass('showing')) {
                target.trigger('tooltip.showing');
            } else if (target.hasClass('hiding')) {
                target.trigger('tooltip.hiding');
            }
        })

        target.off('transitionend').on('transitionend', function () {
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
    }
}


$(function () {
    UI.$window = $(window);
    UI.$body = $("body");
    if (UI.hasJqueryObject(UI.$body.find(".tab-wrap"))) UI.tab.init();
    if (UI.hasJqueryObject(UI.$body.find('[data-accor]'))) UI.accor.init();
    if (UI.hasJqueryObject(UI.$body.find('[data-tooltip-trigger]'))) UI.tooltip.init();
});