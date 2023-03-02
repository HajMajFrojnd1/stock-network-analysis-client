
const parseDate = (start, end) =>{

    start = new Date(start);
    end = new Date(end);
    let strDate = "" + start.getDate() + "." + (start.getMonth() + 1) + "." + start.getFullYear();
    strDate+= " - "+ end.getDate() + "." + (end.getMonth() + 1) + "." + end.getFullYear();

    return strDate;
}

function stringToColour(str) {
    var hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (let i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

function scaleRange(value, minAllowed, maxAllowed, min, max) {
    return (maxAllowed - minAllowed) * (value - min) / (max - min) + minAllowed;
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

function selectColor(colorNum, colors){
    return hslToHex((colorNum * (360 / colors) % 360),100,50);
}

const transitionColor = (color1, color2, percentage) =>{

  var hex = function(x) {
      x = x.toString(16);
      return (x.length == 1) ? '0' + x : x;
  };

  let r = Math.ceil(parseInt(color1.substring(0,2), 16) * percentage + parseInt(color2.substring(0,2), 16) * (1-percentage));
  let g = Math.ceil(parseInt(color1.substring(2,4), 16) * percentage + parseInt(color2.substring(2,4), 16) * (1-percentage));
  let b = Math.ceil(parseInt(color1.substring(4,6), 16) * percentage + parseInt(color2.substring(4,6), 16) * (1-percentage));

  return "#" + hex(r) + hex(g) + hex(b);
}
const getPositionAlongTheLine = (x1, y1, x2, y2, percentage) => {
  return  {
              x : x1 * (1.0 - percentage) + x2 * percentage, 
              y : y1 * (1.0 - percentage) + y2 * percentage
          };
}

const parseOptionsDate = (date) =>{
  date = date.replaceAll(".", "-").split(" - ");
  let start = date[0].split("-");
  start = start[2] + "-" + start[1] + "-" + start[0];
  let end = date[1].split("-");
  end = end[2] + "-" + end[1] + "-" + end[0];
  return [start, end];
}

module.exports.parseDate = parseDate;
module.exports.stringToColour = stringToColour;
module.exports.scaleRange = scaleRange;
module.exports.getRandomColor = selectColor;
module.exports.transitionColor = transitionColor;
module.exports.getPositionAlongTheLine = getPositionAlongTheLine;
module.exports.parseOptionsDate = parseOptionsDate;