/* ********************************************************************** */
var UI = UI || {};
UI.hasJqueryObject = function ($el) {
    return $el.length > 0;
};

// tab
UI.tab = {
    init: function () {
        this.reset();
    },
    createSelector: function () {
        this.$tab = UI.$body.find(".tab-wrap");
        this.$tabCtrl = this.$tab.find(".ctrl");
        this.$tabView = this.$tab.find(".view");
    },
    reset: function () {
        this.createSelector();
        this.$tab.each(function (idx) {
            var that = $(this);
            that.attr("data-tab", idx).find(UI.tab.$tabCtrl).each(function (_idx) {
                $(this).attr("data-ctrl", _idx);
            });
            that.find(UI.tab.$tabCtrl).eq(0).addClass("on");
        });
        this.addEvents();
    },
    addEvents: function () {
        this.$tabCtrl.off("click.tab").on("click.tab", this.handleTabClick);
    },
    handleTabClick: function () {
        var tabIdx = $(this).parents(".tab-wrap").attr("data-tab");
        var ctrlIdx = $(this).attr("data-ctrl");
        UI.tab.$tab.eq(tabIdx).find(UI.tab.$tabView).hide();
        UI.tab.$tab.eq(tabIdx).find(UI.tab.$tabView).eq(ctrlIdx).show();
        UI.tab.$tab.eq(tabIdx).find(UI.tab.$tabCtrl).removeClass("on");
        UI.tab.$tab.eq(tabIdx).find(UI.tab.$tabCtrl).eq(ctrlIdx).addClass("on");
    }
};

// accordion
UI.accor = {
    init: function () {
        this.createSelector();

        // 펼쳐져 있을 경우
        $('[data-accor-item]').each(function () {
            const initTarget = $(this).find('>[data-accor-target]');

            if ($(this).hasClass('on')) {
                $(this).find('>.accordion-title .blind').text('접기');
                initTarget.addClass('shown');
            }
        })

        this.click();
    },
    createSelector: function () {
        this.$accor = UI.$body.find('[data-accor]');
        this.$accorItem = this.$accor.find('>[data-accor-item]');
        this.$accorTrigger = this.$accorItem.find('>.accordion-title>[data-accor-trigger]');
        this.$accorTarget = this.$accorItem.find('>[data-accor-target]');
    },
    click: function () {
        this.$accorTrigger.on('click.accor', function () {
            const item = $(this).closest('.accordion-item');
            const target = item.find('>[data-accor-target]');

            // 각각 활성화
            if (item.hasClass('on')) {
                target.css('height', target.children().outerHeight());
                target.removeClass('shown');
                target.addClass('hiding');
                target.css('height', 0);

                target.off('transitionstart').on('transitionstart', function () {
                    $(this).trigger('accr.hiding')
                })

                target.off('transitionend').on('transitionend', function () {
                    $(this).removeClass('hiding');
                    $(this).removeClass('shown');
                    $(this).addClass('hidden');
                    $(this).removeAttr('style');

                    $(this).trigger('accr.hidden');
                })
            } else {
                // 하나만 활성화일 때
                if ($(this).closest('[data-accor]').data('accor') === "only") {
                    item.siblings().each(function () {
                        const targetAll = $(this).find('>[data-accor-target]');

                        if (targetAll.hasClass('shown')) {
                            $(this).removeClass('on');
                            targetAll.css('height', targetAll.children().outerHeight());
                            targetAll.removeClass('shown');
                            targetAll.addClass('hiding');
                            targetAll.css('height', 0);

                            targetAll.off('transitionstart').on('transitionstart', function () {
                                $(this).trigger('accr.hiding');
                            })

                            targetAll.off('transitionend').on('transitionend', function () {
                                $(this).removeClass('hiding');
                                $(this).removeClass('shown');
                                $(this).addClass('hidden');
                                $(this).removeAttr('style');

                                $(this).trigger('accr.hidden');
                            })
                        }
                    })
                }

                target.removeClass('hidden');
                target.addClass('showing');
                target.css('height', target.children().outerHeight());

                target.off('transitionstart').on('transitionstart', function () {
                    $(this).trigger('accr.showing')
                })

                target.off('transitionend').on('transitionend', function () {
                    $(this).removeClass('showing');
                    $(this).removeClass('hidden');
                    $(this).addClass('shown');
                    $(this).removeAttr('style');

                    $(this).trigger('accr.shown');
                })
            }

            item.toggleClass('on');
        });
    }
};


$(function () {
    UI.$window = $(window);
    UI.$body = $("body");
    if (UI.hasJqueryObject(UI.$body.find(".tab-wrap"))) UI.tab.init();
    if (UI.hasJqueryObject(UI.$body.find('[data-accor]'))) UI.accor.init();
});