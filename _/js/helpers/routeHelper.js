
var RouteHelper = (function () {
  var serverData = {};

  function showCurrentPage (routes, currentPath, isPageLoad, data) {
    serverData = data;
    // Sometimes we are getting currentPath as Monitor instead of monitor.
    currentPath = currentPath.toLowerCase();
    if (currentPath && routes[currentPath] && routes[currentPath].callback && $('.page-content').html().trim()) {
      try {
        var currentRoute = routes[currentPath];
        // if it is a page load, or if the route needs to be refreshed everytime,
        // trigger the callback.
        if (isPageLoad || currentRoute.refresh) {
          triggerCallback(currentRoute.callback, data, currentRoute.json);
        }
      } catch (e) {
        console.error(e);
        // show a message to the user.
        toastr.error(PBConstants.PROCESSING_ERR);
      }
    }
  }

  function triggerCallback (callback, data, dataProps) {
    // now trigger the callback based on the route.
    if (Array.isArray(dataProps)) {
      var args = [];
      for (var i = 0, len = dataProps.length; i !== len; ++i) {
        args.push(data[dataProps[i]]);
      }
      callback.apply(window, args);
    } else {
      if (!dataProps) {
        callback(data);
      } else {
        callback(data[dataProps]);
      }
    }
  }

  function init (routes) {
    // Routes intialization.
    $.each(routes, function (path) {
      page(path, function (ctx) {
        var route = getRoute(ctx, routes);
        ctx.save();
        getTemplateHTML(route.template, serverData, route.callback, route.json, route.heading);
      });
    });
  }

  /**
  * Fetch the associated template HTML.
  * @param {*} href
  * @param {*} tableData
  * @param {*} callback
  */
  function getTemplateHTML (templateId, tableData, callback, jsonProp, heading) {
    var currentElement = $('#' + templateId).html();
    var $pageContent = $('.page-content');
    $pageContent.empty();
    $pageContent.html(currentElement);
    var $tabHeading = $('.tab-heading');

    // Set tab heading and document title.
    if (heading) {
      $tabHeading.html(heading);
    }
    loadPage(tableData, callback, jsonProp);
  }

  /**
 * Callback function triggered after route change
 * @param {any} data
 * @param {any} callback
 * @param {any} jsonProp
 */
  function loadPage (data, callback, jsonProp) {
    if (callback) {
      jQuery(document).trigger('evt.before-page-load');
      triggerCallback(callback, data, jsonProp);
    }
  }

  function getRoute (ctx, routes) {
    // Sometimes we are getting ctx.canonicalPath as Monitor instead of monitor.
    var path = ctx.pathname.toLowerCase();
    var currentRoute = routes[path];
    currentRoute.path = path;
    return currentRoute;
  }

  return {
    showCurrentPage: showCurrentPage,
    init: init
  };
}());