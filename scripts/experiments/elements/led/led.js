define(['chroma'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  
  var chroma = $__0.default;
  function led() {
    return {
      restrict: 'E',
      template: '<b class="led-off"></b><b class="led-on"></b>',
      scope: {
        color: '=',
        offColor: '=',
        size: '@'
      },
      link: function(scope, element, attrs) {
        element.addClass('led');
        var offLed = angular.element(element.children()[0]);
        var onLed = angular.element(element.children()[1]);
        var computedStyle = window.getComputedStyle(element.children()[0], null);
        var origCss = {
          borderColor: chroma(computedStyle.getPropertyValue('border-color')),
          backgroundColor: chroma(computedStyle.getPropertyValue('background-color'))
        };
        var size = parseInt(scope.size);
        element.css({
          'width': size + 'px',
          'height': size + 'px'
        });
        offLed.css({
          'margin-top': '-' + size / 2 + 'px',
          'margin-left': '-' + size / 2 + 'px',
          'border-radius': size / 2 + 'px',
          'border-width': size / 6 + 'px'
        });
        onLed.css({
          'margin-top': '-' + size / 2 + 'px',
          'margin-left': '-' + size / 2 + 'px',
          'border-radius': size / 2 + 'px',
          'border-width': size / 6 + 'px'
        });
        function update(colorObj, oldColorObj) {
          var color = scope.color ? chroma(scope.color, 'rgb') : chroma(0, 0, 0);
          var alpha = color.hsv()[2];
          var mixTo = chroma.hsv(color.hsv()[0], color.hsv()[1], Math.max(0.5, color.hsv()[2]));
          onLed.css({
            'background-color': mixTo,
            'border-color': chroma.interpolate(mixTo, 'black', (1.3 - mixTo.hsv()[2]) * 0.5),
            'box-shadow': '0 0 ' + 2.5 * size * alpha + 'px ' + 0.1 * size * alpha + 'px ' + mixTo.css(),
            'opacity': alpha
          });
          if (color.css() === 'rgb(0,0,0)' && scope.offColor) {
            var offColor = chroma.hsl(chroma(scope.offColor, 'rgb').hsl()[0], 1, 0.6);
            onLed.css({'opacity': 0});
            offLed.css({
              'border-color': offColor,
              'opacity': 1
            });
          } else {
            offLed.css({
              'border-color': origCss.borderColor,
              'opacity': 1 - alpha
            });
          }
        }
        scope.$watch('color', update, true);
        scope.$watch('offColor', update, true);
      }
    };
  }
  var $__default = led;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});
