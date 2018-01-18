var DomHelper = (function () {

  /**
   * It checks whether data exists or not and bind the data to the given id element.
   */
  function checkAndBindData (elems, data, possibleClasses, classesObj) {
    // Loop over the elements
    for (var prop in elems) {
      var elemId = '#' + elems[prop][0];
      var $elem = $(elemId);
      // Check if data has given property.
      if (data.hasOwnProperty(prop)) {
        // Bind the data.
        $elem.html(data[prop]);
        addClassesAndTitles($elem, prop, elems, data, possibleClasses, classesObj);
      } else {
        $elem.html('--');
      }
    }
  }

  function addClassesAndTitles ($elem, prop, elems, data, possibleClasses, classesObj) {
    // Remove possible classes and add given class.
    var elementClass = elems[prop][1];
    possibleClasses = possibleClasses ? possibleClasses : '';
    $elem.removeClass(possibleClasses);
    elementClass ? $elem.addClass(classesObj[elementClass]) : '';
    // Check whether title is there, if it's there then add it.
    var elementTitle = elems[prop][2];
    elementTitle ? $elem.attr('title', data[elementTitle]) : '';
  }

  /**
   * Removes all the possible classes and adds the current class.
   */
  function replaceClasses ($element, possibleClassesArr, currentClass) {
    var possibleClasses = possibleClassesArr.join(' ');
    $element.removeClass(possibleClasses).addClass(currentClass);
  }

  return {
    checkAndBindData: checkAndBindData,
    replaceClasses: replaceClasses
  };
}());