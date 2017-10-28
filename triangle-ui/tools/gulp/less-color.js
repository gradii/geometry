var tinycolor = require('tinycolor2');
var colorEasing = require('./bezier-easing').colorEasing;

var color = (function() {
  var warmDark = 0.5;     // warm color darken radio
  var warmRotate = -26;  // warm color rotate degree
  var coldDark = 0.55;     // cold color darken radio
  var coldRotate = 10;   // cold color rotate degree
  var getShadeColor = function(c) {
    var shadeColor = tinycolor(c);
    // warm and cold color will darken in different radio, and rotate in different degree
    // warmer color
    if (shadeColor.toRgb().r > shadeColor.toRgb().b) {
      return shadeColor.darken(shadeColor.toHsl().l * warmDark * 100).spin(warmRotate).toHexString();
    }
    // colder color
    return shadeColor.darken(shadeColor.toHsl().l * coldDark * 100).spin(coldRotate).toHexString();
  }
  var primaryEasing = colorEasing(0.6);

  // console.log( `primaryEasing ${primaryEasing}` );
  return function(color, index) {
    var currentEasing = colorEasing(index * 0.1);
    // return light colors after tint
    if (index <= 6) {
      console.log(`mix ${color} ${currentEasing * 100 / primaryEasing}`)
      return tinycolor.mix(
        '#ffffff',
        color,
        currentEasing * 100 / primaryEasing
      ).toHexString();
    }
    console.log(`shadecolor ${getShadeColor(color)}`);
    console.log( `currentEasing ${currentEasing}`);
    console.log( `primaryEasing ${primaryEasing}`);
    console.log(`percent ${(1 - (currentEasing - primaryEasing) / (1 - primaryEasing)) * 100}` );

    return tinycolor.mix(
      getShadeColor(color),
      color,
      (1 - (currentEasing - primaryEasing) / (1 - primaryEasing)) * 100
    ).toHexString();
  };
})

module.exports.colorpannel = color();