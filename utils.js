Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.min = function() {
  return Math.min.apply(Math, this);
};

Array.prototype.max = function() {
  return Math.max.apply(Math, this);
};
