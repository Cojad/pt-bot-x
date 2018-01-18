
!(function ($) {
  "use strict";

  var Sidemenu = function () {
    this.$body = $("body"),
      this.$openLeftBtn = $(".open-left"),
      this.$menuItem = $("#sidebar-menu a")
  };

  Sidemenu.prototype.openLeftBar = function () {
    $("#wrapper").toggleClass("enlarged");
    $("#wrapper").addClass("forced");

    if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
      $("body").removeClass("fixed-left").addClass("fixed-left-void");
    } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
      $("body").removeClass("fixed-left-void").addClass("fixed-left");
    }

    if ($("#wrapper").hasClass("enlarged")) {
      $(".left ul").removeAttr("style");
    } else {
      $(".subdrop").siblings("ul:first").show();
    }

    toggle_slimscroll(".slimscrollleft");
    $("body").trigger("resize");
  },

    //menu item click
    Sidemenu.prototype.menuItemClick = function ($element) {

      if (!$element.hasClass("subdrop")) {
        // hide any open menus and remove all other classes
        //$("ul", $element.parents("ul:first")).slideUp(350);
        $("a", $element.parents("ul:first")).removeClass("subdrop");
        $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");

        // open our new menu and add the open class
        $element.next("ul").show();
        $element.addClass("subdrop");
        $(".pull-right i", $element.parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
        $(".pull-right i", $element.siblings("ul")).removeClass("md-remove").addClass("md-add");
      } else {
        if ($element.parent().hasClass('has_sub')) {
          //$element.removeClass('subdrop').next('ul').hide();
        }
      }

    },

    //init sidemenu
    Sidemenu.prototype.init = function () {
      var $this = this;

      var ua = navigator.userAgent,
        event = (ua.match(/iP/i)) ? "touchend" : "click";
        var menuItemEvent = (ua.match(/iP/i)) ? "touchend" : "click";

      //bind on click
      this.$openLeftBtn.on(event, function (e) {
        // To fix the issue of menu is not getting opened in lower resolutions
        // Reason: On click on menu icon, heading width will get increased.
        // touch will be on heading and heading click event will get triggered
        // If we delay the menu touch end functionality execution, heading width will get increased after the delay and touch will not be there on heading.
        if (event !== 'touchend') {
          $this.openLeftBar();
        } else {
          setTimeout(function () {
            $this.openLeftBar();
          }, 100);
        }
      });

      // LEFT SIDE MAIN NAVIGATION
      var touchmoved;
      $this.$menuItem.on(menuItemEvent, function(){
          // If it is due to scrolling then don't execute anything
          if(touchmoved !== true){
            $this.menuItemClick($(this));
          }
      }).on('touchmove', function(){
          touchmoved = true;
      }).on('touchstart', function(){
          touchmoved = false;
      });

      // NAVIGATION HIGHLIGHT & OPEN PARENT
      $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
    },

    //init Sidemenu
    $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu

}(window.jQuery)),

  (function ($) {
    "use strict";

    var FullScreen = function () {
      this.$body = $("body"),
        this.$fullscreenBtn = $("#btn-fullscreen")
    };

    //turn on full screen
    // Thanks to http://davidwalsh.name/fullscreen
    FullScreen.prototype.launchFullscreen = function (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
      FullScreen.prototype.exitFullscreen = function () {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      },
      //toggle screen
      FullScreen.prototype.toggle_fullscreen = function () {
        var $this = this;
        var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
        if (fullscreenEnabled) {
          if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $this.launchFullscreen(document.documentElement);
          } else {
            $this.exitFullscreen();
          }
        }
      },
      //init sidemenu
      FullScreen.prototype.init = function () {
        var $this = this;
        //bind
        $this.$fullscreenBtn.on('click', function (e) {
          // If we don't prevent default functionality then window history state path  will be set to
          // current anchor link href, which is null.
          e.preventDefault();
          $this.toggle_fullscreen();
        });
      },
      //init FullScreen
      $.FullScreen = new FullScreen, $.FullScreen.Constructor = FullScreen

  }(window.jQuery)),

  // main app module
  (function ($) {
    "use strict";

    var App = function () {
      this.VERSION = "2.0.0",
        this.AUTHOR = "Nordic Product Ltd",
        this.SUPPORT = "geir@mtxplore.com",
        this.pageScrollElement = "html, body",
        this.$body = $("body")
    };

    //on doc load
    App.prototype.onDocReady = function (e) {
      FastClick.attach(document.body);
      resizefunc.push("initscrolls");
      resizefunc.push("changeptype");

      $('.animate-number').each(function () {
        $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-duration")));
      });

      //RUN RESIZE ITEMS
      $(window).resize(debounce(resizeitems, 100));
      $("body").trigger("resize");

      // right side-bar toggle
      $('.right-bar-toggle').on('click', function (e) {

        $('#wrapper').toggleClass('right-bar-enabled');
      });


    },
      //initilizing
      App.prototype.init = function () {
        var $this = this;
        //document load initialization
        $(document).ready($this.onDocReady);
        //init side bar - left
        $.Sidemenu.init();
        //init fullscreen
        $.FullScreen.init();
      },

      $.App = new App, $.App.Constructor = App

  }(window.jQuery)),

  // initializing main application module
  (function ($) {
    "use strict";
    $.App.init();
  }(window.jQuery));

/* ------------ some utility functions ----------------------- */
// this full screen
var toggle_fullscreen = function () {

};

function executeFunctionByName (functionName, context /*, args */) {
  var args = [].slice.call(arguments).splice(2);
  var namespaces = functionName.split('.');
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(this, args);
}
var w, h, dw, dh;
var changeptype = function () {
  w = $(window).width();
  h = $(window).height();
  dw = $(document).width();
  dh = $(document).height();

  if (jQuery.browser.mobile === true) {
    $('body').addClass('mobile').removeClass('fixed-left');
  }

  if (!$('#wrapper').hasClass('forced')) {
    if (w > 1024) {
      $('body').removeClass('smallscreen').addClass('widescreen');
      $("#configBot ul").slideDown(350);
      $('#wrapper').removeClass('enlarged');
    } else {
      $('body').removeClass('widescreen').addClass('smallscreen');
      $('#wrapper').addClass('enlarged');
      $('.left ul').removeAttr('style');
    }
    if ($('#wrapper').hasClass('enlarged') && $('body').hasClass('fixed-left')) {
      $('body').removeClass('fixed-left').addClass('fixed-left-void');
    } else if (!$('#wrapper').hasClass('enlarged') && $('body').hasClass('fixed-left-void')) {
      $('body').removeClass('fixed-left-void').addClass('fixed-left');
    }
  }
  toggle_slimscroll('.slimscrollleft');
};

var debounce = function (func, wait, immediate) {
  var timeout, result;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};

function resizeitems () {
  if ($.isArray(resizefunc)) {
    for (i = 0; i < resizefunc.length; i++) {
      window[resizefunc[i]]();
    }
  }
}

function initscrolls () {
  if (jQuery.browser.mobile !== true) {
    // SLIM SCROLL
    $('.slimscroller').slimscroll({
      height: 'auto',
      size: '5px'
    });

    $('.slimscrollleft').slimScroll({
      height: 'auto',
      position: 'right',
      size: '5px',
      color: '#98a6ad',
      wheelStep: 5
    });
  }
}
function toggle_slimscroll (item) {
  if ($('#wrapper').hasClass('enlarged')) {
    $(item).css('overflow', 'inherit').parent().css('overflow', 'inherit');
    $(item).siblings('.slimScrollBar').css('visibility', 'hidden');
  } else {
    $(item).css('overflow', 'hidden').parent().css('overflow', 'hidden');
    $(item).siblings('.slimScrollBar').css('visibility', 'visible');
  }
}
