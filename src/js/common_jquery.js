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
        // this.hover();
    },
    createSelector: function () {
        this.$tooltip = UI.$body.find('[data-tooltip]');
        this.$tooltipTrigger = this.$tooltip.find('[data-tooltip-trigger]');
        this.$tooltipTarget = this.$tooltip.find('[data-tooltip-target]');
    },
    click: function () {
        UI.$body.on('click.tooltip', function (e) {
            const current = $(e.target);
            const current_tooltip = current.closest('[data-tooltip]');
            const current_target = current_tooltip.find('[data-tooltip-target]');

            if (current.is(UI.tooltip.$tooltipTrigger)) {
                if (!current_target.hasClass('shown')) {
                    current_target.removeClass('hidden');
                    current_target.addClass('showing');
                    setTimeout(function () {
                        current_target.addClass('fade');
                    }, 10)

                    current_target.off('transitionstart').on('transitionstart', function () {
                        $(this).trigger('tooltip.showing');
                    })

                    current_target.off('transitionend').on('transitionend', function () {
                        $(this).removeClass('showing');
                        $(this).addClass('shown');

                        $(this).trigger('tooltip.shown');
                    });
                } else {
                    // hide
                    current_target.removeClass('fade');
                    current_target.removeClass('shown');
                    current_target.addClass('hiding');

                    current_target.off('transitionstart').on('transitionstart', function () {
                        $(this).trigger('tooltip.hiding');
                    })

                    current_target.off('transitionend').on('transitionend', function () {
                        $(this).removeClass('hiding');
                        $(this).addClass('hidden');

                        $(this).trigger('tooltip.hidden');
                    })
                }
            } else {
                UI.tooltip.$tooltip.each(function () {
                    if ($(this).is('.backdrop')) {
                        $(this).find('[data-tooltip-target]').removeClass('fade');

                        $(this).find('[data-tooltip-target]').off('transitionstart').on('transitionstart', function () {
                            $(this).removeClass('shown');
                            $(this).addClass('hiding');

                            $(this).trigger('tooltip.hiding');
                        })

                        $(this).find('[data-tooltip-target]').off('transitionend').on('transitionend', function () {
                            $(this).removeClass('hiding');
                            $(this).addClass('hidden');

                            $(this).trigger('tooltip.hidden');
                        })
                    }
                })
            }

            UI.tooltip.$tooltipTrigger.off('click.tooltip', UI.tooltip.click());
            UI.tooltip.$tooltipTarget.on('transitionend', function () {
                UI.tooltip.$tooltipTrigger.on('click.tooltip', UI.tooltip.click());

                UI.tooltip.$tooltipTarget.off('transitionstart').off('transitionend');
            })
        })
    },
    // click: function () {
    //     this.$tooltipTrigger.off('click.tooltip').on('click.tooltip', function (e) {
    //         const current_tooltip = $(e.target).closest('[data-tooltip]');
    //         const current_target = $(e.target).siblings('[data-tooltip-target]');

    //         // show
    //         if (!current_target.hasClass('shown')) {
    //             current_target.removeClass('hidden');
    //             current_target.addClass('showing');
    //             setTimeout(function () {
    //                 current_target.addClass('fade');
    //             }, 10)

    //             current_target.off('transitionstart').on('transitionstart', function () {
    //                 $(this).trigger('tooltip.showing');
    //             })

    //             current_target.off('transitionend').on('transitionend', function () {
    //                 $(this).removeClass('showing');
    //                 $(this).addClass('shown');
    //                 $(this).removeAttr('style');

    //                 $(this).trigger('tooltip.shown');
    //             });
    //         } else {
    //             // hide
    //             current_target.removeClass('shown');
    //             current_target.removeClass('fade');
    //             current_target.addClass('hiding');

    //             current_target.off('transitionstart').on('transitionstart', function () {
    //                 $(this).trigger('tooltip.hiding');
    //             })

    //             current_target.off('transitionend').on('transitionend', function () {
    //                 $(this).removeClass('hiding');
    //                 $(this).addClass('hidden');
    //                 $(this).removeAttr('style');

    //                 $(this).trigger('tooltip.hidden');
    //             })
    //         }

    //         current_tooltip.toggleClass('on');

    //         UI.tooltip.$tooltipTrigger.off('click.tooltip', UI.tooltip.click());
    //         UI.tooltip.$tooltipTarget.on('transitionend', function () {
    //             UI.tooltip.$tooltipTrigger.on('click.tooltip', UI.tooltip.click());

    //             UI.tooltip.$tooltipTarget.off('transitionstart').off('transitionend');
    //         })
    //     });
    //     UI.$body.off('click.tooltip').on('click.tooltip', function(e) {
    //         if(!$(e.target).is('[data-tooltip-trigger]') && !$(e.target).is('[data-tooltip-target]')) {
    //             UI.tooltip.$tooltip.each(function() {
    //                 if($(this).is('.backdrop')) {
    //                     $(this).removeClass('on');
    //                 }
    //             })
    //         }
    //     })
    // },
    hover: function () {
        this.$tooltipTrigger.on('mouseover', function () {
            console.log('b')
        })
        this.$tooltipTrigger.on('mouseout', function () {
            console.log('c')
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