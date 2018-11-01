// Select random element from the array
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

// Select lowest number in the array
Array.prototype.min = function() {
  return Math.min.apply(Math, this);
};

// Select highest number in the array
Array.prototype.max = function() {
  return Math.max.apply(Math, this);
};


(function() {
  let convertArray = [
    {
      from: ["meter", "m"],
      to: ["feet", "ft"],
      calc: function(value) {
        return value * 3.281
      }
    },
    {
      from: ["feet", "ft"],
      to: ["meter", "m"],
      calc: function(value) {
        return value / 3.281;
      }
    },
    {
      from: ["feet", "ft"],
      to: ["inch", "inches"],
      calc: function(value) {
        return value * 12;
      }
    },
    {
      from: ["inch", "inches"],
      to: ["feet", "ft"],
      calc: function(value) {
        return value / 12;
      }
    }
  ];
  let convertObj = {};
  for(let a = 0;a < convertArray.length;a++) {
    let obj = convertArray[a];
    for(let b = 0;b < obj.from.length;b++) {
      convertObj[obj.from[b]] = {};
      for(let c = 0;c < obj.to.length;c++) {
        convertObj[obj.from[b]][obj.to[c]] = obj.calc;
      }
    }
  }

  // Convert something to something else
  Math.convert = function(from, to, fromValue) {
    return convertObj[from][to](fromValue);
  };
})();
