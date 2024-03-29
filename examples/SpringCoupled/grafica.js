/*! grafica.js (0.3.1): a library for p5.js. Author: Javier Graciá Carpio, license: LGPL-3.0, 2018-09-28 */ function GPoint() {
  var a, b, c;
  if (3 === arguments.length)
    (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
  else if (2 === arguments.length && arguments[0] instanceof p5.Vector)
    (a = arguments[0].x), (b = arguments[0].y), (c = arguments[1]);
  else if (2 === arguments.length)
    (a = arguments[0]), (b = arguments[1]), (c = "");
  else if (1 === arguments.length && arguments[0] instanceof GPoint)
    (a = arguments[0].getX()),
      (b = arguments[0].getY()),
      (c = arguments[0].getLabel());
  else if (1 === arguments.length && arguments[0] instanceof p5.Vector)
    (a = arguments[0].x), (b = arguments[0].y), (c = "");
  else {
    if (0 !== arguments.length)
      throw new Error("GPoint constructor: signature not supported");
    (a = 0), (b = 0), (c = "");
  }
  (this.x = a),
    (this.y = b),
    (this.label = c),
    (this.valid = this.isValidNumber(this.x) && this.isValidNumber(this.y));
}
function GTitle(a, b) {
  (this.parent = a),
    (this.dim = b.slice()),
    (this.relativePos = 0.5),
    (this.plotPos = this.relativePos * this.dim[0]),
    (this.offset = 10),
    (this.text = ""),
    (this.textAlignment = this.parent.CENTER),
    (this.fontName = "Helvetica"),
    (this.fontColor = this.parent.color(100)),
    (this.fontStyle = this.parent.BOLD),
    (this.fontSize = 13);
}
function GAxisLabel(a, b, c) {
  (this.parent = a),
    (this.type =
      b === this.parent.BOTTOM ||
      b === this.parent.TOP ||
      b === this.parent.LEFT ||
      b === this.parent.RIGHT
        ? b
        : this.parent.BOTTOM),
    (this.dim = c.slice()),
    (this.relativePos = 0.5),
    (this.plotPos =
      this.type === this.parent.BOTTOM || this.type === this.parent.TOP
        ? this.relativePos * this.dim[0]
        : -this.relativePos * this.dim[1]),
    (this.offset = 35),
    (this.rotate =
      this.type !== this.parent.BOTTOM && this.type !== this.parent.TOP),
    (this.text = ""),
    (this.textAlignment = this.parent.CENTER),
    (this.fontName = "Helvetica"),
    (this.fontColor = this.parent.color(0)),
    (this.fontSize = 13);
}
function GAxis(a, b, c, d, e) {
  (this.parent = a),
    (this.type =
      b === this.parent.BOTTOM ||
      b === this.parent.TOP ||
      b === this.parent.LEFT ||
      b === this.parent.RIGHT
        ? b
        : this.parent.BOTTOM),
    (this.dim = c.slice()),
    (this.lim = d.slice()),
    (this.log = e),
    this.log &&
      (this.lim[0] <= 0 || this.lim[1] <= 0) &&
      (console.log(
        "The limits are negative. This is not allowed in logarithmic scale."
      ),
      console.log("Will set them to (0.1, 10)"),
      this.lim[1] > this.lim[0]
        ? ((this.lim[0] = 0.1), (this.lim[1] = 10))
        : ((this.lim[0] = 10), (this.lim[1] = 0.1))),
    (this.offset = 5),
    (this.lineColor = this.parent.color(0)),
    (this.lineWidth = 1),
    (this.nTicks = 5),
    (this.ticksSeparation = -1),
    (this.ticks = []),
    (this.plotTicks = []),
    (this.ticksInside = []),
    (this.tickLabels = []),
    (this.fixedTicks = !1),
    (this.tickLength = 3),
    (this.smallTickLength = 2),
    (this.expTickLabels = !1),
    (this.rotateTickLabels =
      this.type !== this.parent.BOTTOM && this.type !== this.parent.TOP),
    (this.drawTickLabels =
      this.type === this.parent.BOTTOM || this.type === this.parent.LEFT),
    (this.tickLabelOffset = 7),
    (this.ticksPrecision = void 0),
    (this.lab = new GAxisLabel(this.parent, this.type, this.dim)),
    (this.drawAxisLabel = !0),
    (this.fontName = "Helvetica"),
    (this.fontColor = this.parent.color(0)),
    (this.fontSize = 11),
    this.updateTicks(),
    this.updatePlotTicks(),
    this.updateTicksInside(),
    this.updateTickLabels();
}
function GHistogram(a, b, c, d) {
  (this.parent = a),
    (this.type =
      b === GPlot.VERTICAL || b === GPlot.HORIZONTAL ? b : GPlot.VERTICAL),
    (this.dim = c.slice()),
    (this.plotPoints = []);
  for (var e = 0; e < d.length; e++) this.plotPoints[e] = new GPoint(d[e]);
  (this.visible = !0),
    (this.separations = [2]),
    (this.bgColors = [this.parent.color(150, 150, 255)]),
    (this.lineColors = [this.parent.color(100, 100, 255)]),
    (this.lineWidths = [1]),
    (this.differences = []),
    (this.leftSides = []),
    (this.rightSides = []),
    this.updateArrays(),
    (this.labelsOffset = 8),
    (this.drawLabels = !1),
    (this.rotateLabels = !1),
    (this.fontName = "Helvetica"),
    (this.fontColor = this.parent.color(0)),
    (this.fontSize = 11);
}
function GLayer(a, b, c, d, e, f, g) {
  (this.parent = a),
    (this.id = b),
    (this.dim = c.slice()),
    (this.xLim = d.slice()),
    (this.yLim = e.slice()),
    (this.xLog = f),
    (this.yLog = g),
    this.xLog &&
      (this.xLim[0] <= 0 || this.xLim[1] <= 0) &&
      (console.log(
        "One of the limits is negative. This is not allowed in logarithmic scale."
      ),
      console.log("Will set horizontal limits to (0.1, 10)"),
      (this.xLim[0] = 0.1),
      (this.xLim[1] = 10)),
    this.yLog &&
      (this.yLim[0] <= 0 || this.yLim[1] <= 0) &&
      (console.log(
        "One of the limits is negative. This is not allowed in logarithmic scale."
      ),
      console.log("Will set vertical limits to (0.1, 10)"),
      (this.yLim[0] = 0.1),
      (this.yLim[1] = 10)),
    (this.points = []),
    (this.plotPoints = []),
    (this.inside = []),
    (this.pointColors = [this.parent.color(255, 0, 0, 150)]),
    (this.pointSizes = [7]),
    (this.lineColor = this.parent.color(0, 150)),
    (this.lineWidth = 1),
    (this.hist = void 0),
    (this.histBasePoint = new GPoint(0, 0)),
    (this.labelBgColor = this.parent.color(255, 200)),
    (this.labelSeparation = [7, 7]),
    (this.fontName = "Helvetica"),
    (this.fontColor = this.parent.color(0)),
    (this.fontSize = 11),
    (this.cuts = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
}
function GPlot() {
  var a, b, c, d, e;
  if (5 === arguments.length)
    (a = arguments[0]),
      (b = arguments[1]),
      (c = arguments[2]),
      (d = arguments[3]),
      (e = arguments[4]);
  else if (3 === arguments.length)
    (a = arguments[0]),
      (b = arguments[1]),
      (c = arguments[2]),
      (d = 450),
      (e = 300);
  else {
    if (1 !== arguments.length)
      throw new Error("GPlot constructor: signature not supported");
    (a = arguments[0]), (b = 0), (c = 0), (d = 450), (e = 300);
  }
  (this.parent = a),
    (this.parentElt = this.parent._renderer.elt),
    (this.pos = [b, c]),
    (this.outerDim = [d, e]),
    (this.mar = [60, 70, 40, 30]),
    (this.dim = [
      this.outerDim[0] - this.mar[1] - this.mar[3],
      this.outerDim[1] - this.mar[0] - this.mar[2],
    ]),
    (this.xLim = [0, 1]),
    (this.yLim = [0, 1]),
    (this.fixedXLim = !1),
    (this.fixedYLim = !1),
    (this.xLog = !1),
    (this.yLog = !1),
    (this.invertedXScale = !1),
    (this.invertedYScale = !1),
    (this.includeAllLayersInLim = !0),
    (this.expandLimFactor = 0.1),
    (this.bgColor = this.parent.color(255)),
    (this.boxBgColor = this.parent.color(245)),
    (this.boxLineColor = this.parent.color(210)),
    (this.boxLineWidth = 1),
    (this.gridLineColor = this.parent.color(210)),
    (this.gridLineWidth = 1),
    (this.mainLayer = new GLayer(
      this.parent,
      GPlot.MAINLAYERID,
      this.dim,
      this.xLim,
      this.yLim,
      this.xLog,
      this.yLog
    )),
    (this.layerList = []),
    (this.xAxis = new GAxis(
      this.parent,
      this.parent.BOTTOM,
      this.dim,
      this.xLim,
      this.xLog
    )),
    (this.topAxis = new GAxis(
      this.parent,
      this.parent.TOP,
      this.dim,
      this.xLim,
      this.xLog
    )),
    (this.yAxis = new GAxis(
      this.parent,
      this.parent.LEFT,
      this.dim,
      this.yLim,
      this.yLog
    )),
    (this.rightAxis = new GAxis(
      this.parent,
      this.parent.RIGHT,
      this.dim,
      this.yLim,
      this.yLog
    )),
    (this.title = new GTitle(this.parent, this.dim)),
    (this.zoomingIsActive = !1),
    (this.zoomFactor = 1.3),
    (this.increaseZoomButton = this.parent.LEFT),
    (this.decreaseZoomButton = this.parent.RIGHT),
    (this.increaseZoomKeyModifier = GPlot.NONE),
    (this.decreaseZoomKeyModifier = GPlot.NONE),
    (this.centeringIsActive = !1),
    (this.centeringButton = this.parent.LEFT),
    (this.centeringKeyModifier = GPlot.NONE),
    (this.panningIsActive = !1),
    (this.panningButton = this.parent.LEFT),
    (this.panningKeyModifier = GPlot.NONE),
    (this.panningReferencePoint = void 0),
    (this.panningIntervalId = void 0),
    (this.labelingIsActive = !1),
    (this.labelingButton = this.parent.LEFT),
    (this.labelingKeyModifier = GPlot.NONE),
    (this.mousePos = void 0),
    (this.resetIsActive = !1),
    (this.resetButton = this.parent.RIGHT),
    (this.resetKeyModifier = this.parent.CONTROL),
    (this.xLimReset = void 0),
    (this.yLimReset = void 0),
    (this.clickListener = this.clickEvent.bind(this)),
    (this.wheelListener = this.wheelEvent.bind(this)),
    (this.mouseDownListener = this.mouseDownEvent.bind(this)),
    (this.mouseMoveListener = this.mouseMoveEvent.bind(this)),
    (this.mouseUpListener = this.mouseUpEvent.bind(this)),
    (this.touchStartListener = this.touchStartEvent.bind(this)),
    (this.touchMoveListener = this.touchMoveEvent.bind(this)),
    (this.touchEndListener = this.touchEndEvent.bind(this)),
    this.parentElt.addEventListener("click", this.clickListener, !1),
    this.parentElt.addEventListener("wheel", this.wheelListener, !1),
    this.parentElt.addEventListener("mousedown", this.mouseDownListener, !1),
    this.parentElt.addEventListener("touchstart", this.touchStartListener, !1);
}
(GPoint.prototype.isValidNumber = function (a) {
  return !isNaN(a) && isFinite(a);
}),
  (GPoint.prototype.set = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else if (2 === arguments.length && arguments[0] instanceof p5.Vector)
      (a = arguments[0].x), (b = arguments[0].y), (c = arguments[1]);
    else if (2 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = "");
    else if (1 === arguments.length && arguments[0] instanceof GPoint)
      (a = arguments[0].getX()),
        (b = arguments[0].getY()),
        (c = arguments[0].getLabel());
    else {
      if (!(1 === arguments.length && arguments[0] instanceof p5.Vector))
        throw new Error("GPoint.set(): signature not supported");
      (a = arguments[0].x), (b = arguments[0].y), (c = "");
    }
    (this.x = a),
      (this.y = b),
      (this.label = c),
      (this.valid = this.isValidNumber(this.x) && this.isValidNumber(this.y));
  }),
  (GPoint.prototype.setX = function (a) {
    (this.x = a),
      (this.valid = this.isValidNumber(this.x) && this.isValidNumber(this.y));
  }),
  (GPoint.prototype.setY = function (a) {
    (this.y = a),
      (this.valid = this.isValidNumber(this.x) && this.isValidNumber(this.y));
  }),
  (GPoint.prototype.setLabel = function (a) {
    this.label = a;
  }),
  (GPoint.prototype.setXY = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else if (1 === arguments.length && arguments[0] instanceof GPoint)
      (a = arguments[0].getX()), (b = arguments[0].getY());
    else {
      if (!(1 === arguments.length && arguments[0] instanceof p5.Vector))
        throw new Error("GPoint.setXY(): signature not supported");
      (a = arguments[0].x), (b = arguments[0].y);
    }
    (this.x = a),
      (this.y = b),
      (this.valid = this.isValidNumber(this.x) && this.isValidNumber(this.y));
  }),
  (GPoint.prototype.getX = function () {
    return this.x;
  }),
  (GPoint.prototype.getY = function () {
    return this.y;
  }),
  (GPoint.prototype.getLabel = function () {
    return this.label;
  }),
  (GPoint.prototype.getValid = function () {
    return this.valid;
  }),
  (GPoint.prototype.isValid = function () {
    return this.valid;
  }),
  (GTitle.prototype.draw = function () {
    this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textStyle(this.fontStyle),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.noStroke(),
      this.parent.textAlign(this.textAlignment, this.parent.BOTTOM),
      this.parent.text(this.text, this.plotPos, -this.offset - this.dim[1]),
      this.parent.textStyle(this.parent.NORMAL),
      this.parent.pop();
  }),
  (GTitle.prototype.setDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GTitle.setDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a > 0 &&
      b > 0 &&
      ((this.dim[0] = a),
      (this.dim[1] = b),
      (this.plotPos = this.relativePos * this.dim[0]));
  }),
  (GTitle.prototype.setRelativePos = function (a) {
    (this.relativePos = a), (this.plotPos = this.relativePos * this.dim[0]);
  }),
  (GTitle.prototype.setOffset = function (a) {
    this.offset = a;
  }),
  (GTitle.prototype.setText = function (a) {
    this.text = a;
  }),
  (GTitle.prototype.setTextAlignment = function (a) {
    (a !== this.parent.CENTER &&
      a !== this.parent.LEFT &&
      a !== this.parent.RIGHT) ||
      (this.textAlignment = a);
  }),
  (GTitle.prototype.setFontName = function (a) {
    this.fontName = a;
  }),
  (GTitle.prototype.setFontColor = function (a) {
    this.fontColor = a;
  }),
  (GTitle.prototype.setFontStyle = function (a) {
    this.fontStyle = a;
  }),
  (GTitle.prototype.setFontSize = function (a) {
    a > 0 && (this.fontSize = a);
  }),
  (GTitle.prototype.setFontProperties = function (a, b, c) {
    c > 0 && ((this.fontName = a), (this.fontColor = b), (this.fontSize = c));
  }),
  (GAxisLabel.prototype.draw = function () {
    switch (this.type) {
      case this.parent.BOTTOM:
        this.drawAsXLabel();
        break;
      case this.parent.LEFT:
        this.drawAsYLabel();
        break;
      case this.parent.TOP:
        this.drawAsTopLabel();
        break;
      case this.parent.RIGHT:
        this.drawAsRightLabel();
    }
  }),
  (GAxisLabel.prototype.drawAsXLabel = function () {
    this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.noStroke(),
      this.rotate
        ? (this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER),
          this.parent.translate(this.plotPos, this.offset),
          this.parent.rotate(-0.5 * Math.PI),
          this.parent.text(this.text, 0, 0))
        : (this.parent.textAlign(this.textAlignment, this.parent.TOP),
          this.parent.text(this.text, this.plotPos, this.offset)),
      this.parent.pop();
  }),
  (GAxisLabel.prototype.drawAsYLabel = function () {
    this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.noStroke(),
      this.rotate
        ? (this.parent.textAlign(this.textAlignment, this.parent.BOTTOM),
          this.parent.translate(-this.offset, this.plotPos),
          this.parent.rotate(-0.5 * Math.PI),
          this.parent.text(this.text, 0, 0))
        : (this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER),
          this.parent.text(this.text, -this.offset, this.plotPos)),
      this.parent.pop();
  }),
  (GAxisLabel.prototype.drawAsTopLabel = function () {
    this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.noStroke(),
      this.rotate
        ? (this.parent.textAlign(this.parent.LEFT, this.parent.CENTER),
          this.parent.translate(this.plotPos, -this.offset - this.dim[1]),
          this.parent.rotate(-0.5 * Math.PI),
          this.parent.text(this.text, 0, 0))
        : (this.parent.textAlign(this.textAlignment, this.parent.BOTTOM),
          this.parent.text(
            this.text,
            this.plotPos,
            -this.offset - this.dim[1]
          )),
      this.parent.pop();
  }),
  (GAxisLabel.prototype.drawAsRightLabel = function () {
    this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.noStroke(),
      this.rotate
        ? (this.parent.textAlign(this.textAlignment, this.parent.TOP),
          this.parent.translate(this.offset + this.dim[0], this.plotPos),
          this.parent.rotate(-0.5 * Math.PI),
          this.parent.text(this.text, 0, 0))
        : (this.parent.textAlign(this.parent.LEFT, this.parent.CENTER),
          this.parent.text(this.text, this.offset + this.dim[0], this.plotPos)),
      this.parent.pop();
  }),
  (GAxisLabel.prototype.setDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GAxisLabel.setDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a > 0 &&
      b > 0 &&
      ((this.dim[0] = a),
      (this.dim[1] = b),
      (this.plotPos =
        this.type === this.parent.BOTTOM || this.type === this.parent.TOP
          ? this.relativePos * this.dim[0]
          : -this.relativePos * this.dim[1]));
  }),
  (GAxisLabel.prototype.setRelativePos = function (a) {
    (this.relativePos = a),
      (this.plotPos =
        this.type === this.parent.BOTTOM || this.type === this.parent.TOP
          ? this.relativePos * this.dim[0]
          : -this.relativePos * this.dim[1]);
  }),
  (GAxisLabel.prototype.setOffset = function (a) {
    this.offset = a;
  }),
  (GAxisLabel.prototype.setRotate = function (a) {
    this.rotate = a;
  }),
  (GAxisLabel.prototype.setText = function (a) {
    this.text = a;
  }),
  (GAxisLabel.prototype.setTextAlignment = function (a) {
    (a !== this.parent.CENTER &&
      a !== this.parent.LEFT &&
      a !== this.parent.RIGHT) ||
      (this.textAlignment = a);
  }),
  (GAxisLabel.prototype.setFontName = function (a) {
    this.fontName = a;
  }),
  (GAxisLabel.prototype.setFontColor = function (a) {
    this.fontColor = a;
  }),
  (GAxisLabel.prototype.setFontSize = function (a) {
    a > 0 && (this.fontSize = a);
  }),
  (GAxisLabel.prototype.setFontProperties = function (a, b, c) {
    c > 0 && ((this.fontName = a), (this.fontColor = b), (this.fontSize = c));
  }),
  (GAxis.prototype.obtainSigDigits = function (a) {
    return Math.round(-Math.log(0.5 * Math.abs(a)) / Math.LN10);
  }),
  (GAxis.prototype.roundPlus = function (a, b) {
    return (
      (a = Math.round(a * Math.pow(10, b)) / Math.pow(10, b)),
      b <= 0 && (a = Math.round(a)),
      a
    );
  }),
  (GAxis.prototype.adaptSize = function (a, b) {
    b < a.length && a.splice(b, Number.MAX_VALUE);
  }),
  (GAxis.prototype.updateTicks = function () {
    this.log ? this.obtainLogarithmicTicks() : this.obtainLinearTicks();
  }),
  (GAxis.prototype.obtainLogarithmicTicks = function () {
    var a, b;
    this.lim[1] > this.lim[0]
      ? ((a = Math.floor(Math.log(this.lim[0]) / Math.LN10)),
        (b = Math.ceil(Math.log(this.lim[1]) / Math.LN10)))
      : ((a = Math.floor(Math.log(this.lim[1]) / Math.LN10)),
        (b = Math.ceil(Math.log(this.lim[0]) / Math.LN10)));
    var c = 9 * (b - a) + 1;
    this.adaptSize(this.ticks, c);
    for (var d = a; d < b; d++)
      for (
        var e = this.roundPlus(Math.exp(d * Math.LN10), -d), f = 0;
        f < 9;
        f++
      )
        this.ticks[9 * (d - a) + f] = (f + 1) * e;
    (this.ticks[this.ticks.length - 1] = this.roundPlus(
      Math.exp(b * Math.LN10),
      -d
    )),
      this.lim[1] < this.lim[0] && this.ticks.reverse();
  }),
  (GAxis.prototype.obtainLinearTicks = function () {
    var a = 0,
      b = 0,
      c = 0;
    if (this.ticksSeparation > 0) {
      for (
        a =
          this.lim[1] > this.lim[0]
            ? this.ticksSeparation
            : -this.ticksSeparation,
          c = this.obtainSigDigits(a);
        this.roundPlus(a, c) - a != 0;

      )
        c++;
      b = Math.floor((this.lim[1] - this.lim[0]) / a);
    } else
      this.nTicks > 0 &&
        ((a = (this.lim[1] - this.lim[0]) / this.nTicks),
        (c = this.obtainSigDigits(a)),
        (a = this.roundPlus(a, c)),
        (0 === a || Math.abs(a) > Math.abs(this.lim[1] - this.lim[0])) &&
          (c++,
          (a = this.roundPlus((this.lim[1] - this.lim[0]) / this.nTicks, c))),
        (b = Math.floor((this.lim[1] - this.lim[0]) / a)));
    if (b > 0) {
      var d = this.lim[0] + (this.lim[1] - this.lim[0] - b * a) / 2;
      for (
        d = this.roundPlus(d - 2 * a, c);
        (this.lim[1] - d) * (this.lim[0] - d) > 0;

      )
        d = this.roundPlus(d + a, c);
      var e = Math.floor(Math.abs((this.lim[1] - d) / a)) + 1;
      this.adaptSize(this.ticks, e), (this.ticks[0] = d);
      for (var f = 1; f < e; f++)
        this.ticks[f] = this.roundPlus(this.ticks[f - 1] + a, c);
      this.ticksPrecision = c;
    } else this.ticks = [];
  }),
  (GAxis.prototype.updatePlotTicks = function () {
    var a,
      b,
      c = this.ticks.length;
    if ((this.adaptSize(this.plotTicks, c), this.log))
      for (
        a =
          this.type === this.parent.BOTTOM || this.type === this.parent.TOP
            ? this.dim[0] / Math.log(this.lim[1] / this.lim[0])
            : -this.dim[1] / Math.log(this.lim[1] / this.lim[0]),
          b = 0;
        b < c;
        b++
      )
        this.plotTicks[b] = Math.log(this.ticks[b] / this.lim[0]) * a;
    else
      for (
        a =
          this.type === this.parent.BOTTOM || this.type === this.parent.TOP
            ? this.dim[0] / (this.lim[1] - this.lim[0])
            : -this.dim[1] / (this.lim[1] - this.lim[0]),
          b = 0;
        b < c;
        b++
      )
        this.plotTicks[b] = (this.ticks[b] - this.lim[0]) * a;
  }),
  (GAxis.prototype.updateTicksInside = function () {
    var a,
      b = this.ticks.length;
    if (
      (this.adaptSize(this.ticksInside, b),
      this.type === this.parent.BOTTOM || this.type === this.parent.TOP)
    )
      for (a = 0; a < b; a++)
        this.ticksInside[a] =
          this.plotTicks[a] >= 0 && this.plotTicks[a] <= this.dim[0];
    else
      for (a = 0; a < b; a++)
        this.ticksInside[a] =
          -this.plotTicks[a] >= 0 && -this.plotTicks[a] <= this.dim[1];
  }),
  (GAxis.prototype.updateTickLabels = function () {
    var a,
      b,
      c,
      d,
      e = this.ticks.length;
    if ((this.adaptSize(this.tickLabels, e), this.log))
      for (d = 0; d < e; d++)
        (a = this.ticks[d]),
          a > 0
            ? ((b = Math.log(a) / Math.LN10),
              (c = Math.abs(b - Math.round(b)) < 1e-4),
              c
                ? ((b = Math.round(b)),
                  this.expTickLabels
                    ? (this.tickLabels[d] = "1e" + b)
                    : (this.tickLabels[d] =
                        b > -3.1 && b < 3.1
                          ? b >= 0
                            ? "" + Math.round(a)
                            : "" + a
                          : "1e" + b))
                : (this.tickLabels[d] = ""))
            : (this.tickLabels[d] = "");
    else
      for (d = 0; d < e; d++)
        (a = this.ticks[d]),
          a % 1 == 0
            ? (this.tickLabels[d] = "" + Math.round(a))
            : void 0 !== this.ticksPrecision && this.ticksPrecision >= 0
            ? (this.tickLabels[d] =
                "" + parseFloat(a).toFixed(this.ticksPrecision))
            : (this.tickLabels[d] = "" + a);
  }),
  (GAxis.prototype.moveLim = function (a) {
    if (a[1] !== a[0])
      if (this.log && (a[0] <= 0 || a[1] <= 0))
        console.log(
          "The limits are negative. This is not allowed in logarithmic scale."
        );
      else {
        if (((this.lim[0] = a[0]), (this.lim[1] = a[1]), !this.fixedTicks)) {
          var b = this.ticks.length;
          if (this.log) this.obtainLogarithmicTicks();
          else if (b > 0) {
            var c = 0,
              d = 0;
            if (this.ticksSeparation > 0)
              for (
                c =
                  this.lim[1] > this.lim[0]
                    ? this.ticksSeparation
                    : -this.ticksSeparation,
                  d = this.obtainSigDigits(c);
                this.roundPlus(c, d) - c != 0;

              )
                d++;
            else
              (c =
                1 === b
                  ? this.lim[1] - this.lim[0]
                  : this.ticks[1] - this.ticks[0]),
                (d = this.obtainSigDigits(c)),
                (c = this.roundPlus(c, d)),
                (0 === c ||
                  Math.abs(c) > Math.abs(this.lim[1] - this.lim[0])) &&
                  (d++,
                  (c =
                    1 === b
                      ? this.lim[1] - this.lim[0]
                      : this.ticks[1] - this.ticks[0]),
                  (c = this.roundPlus(c, d))),
                (c = this.lim[1] > this.lim[0] ? Math.abs(c) : -Math.abs(c));
            var e =
              this.ticks[0] + c * Math.ceil((this.lim[0] - this.ticks[0]) / c);
            (e = this.roundPlus(e, d)),
              (this.lim[1] - e) * (this.lim[0] - e) > 0 &&
                ((e =
                  this.ticks[0] +
                  c * Math.floor((this.lim[0] - this.ticks[0]) / c)),
                (e = this.roundPlus(e, d))),
              (b = Math.floor(Math.abs((this.lim[1] - e) / c)) + 1),
              this.adaptSize(this.ticks, b),
              (this.ticks[0] = e);
            for (var f = 1; f < b; f++)
              this.ticks[f] = this.roundPlus(this.ticks[f - 1] + c, d);
            this.ticksPrecision !== d &&
              console.log(
                "There is a problem in the axis ticks precision calculation"
              );
          }
          this.updateTickLabels();
        }
        this.updatePlotTicks(), this.updateTicksInside();
      }
  }),
  (GAxis.prototype.draw = function () {
    switch (this.type) {
      case this.parent.BOTTOM:
        this.drawAsXAxis();
        break;
      case this.parent.LEFT:
        this.drawAsYAxis();
        break;
      case this.parent.TOP:
        this.drawAsTopAxis();
        break;
      case this.parent.RIGHT:
        this.drawAsRightAxis();
    }
    this.drawAxisLabel && this.lab.draw();
  }),
  (GAxis.prototype.drawAsXAxis = function () {
    var a;
    for (
      this.parent.push(),
        this.parent.stroke(this.lineColor),
        this.parent.strokeWeight(this.lineWidth),
        this.parent.strokeCap(this.parent.SQUARE),
        this.parent.line(0, this.offset, this.dim[0], this.offset),
        a = 0;
      a < this.plotTicks.length;
      a++
    )
      this.ticksInside[a] &&
        (this.log && "" === this.tickLabels[a]
          ? this.parent.line(
              this.plotTicks[a],
              this.offset,
              this.plotTicks[a],
              this.offset + this.smallTickLength
            )
          : this.parent.line(
              this.plotTicks[a],
              this.offset,
              this.plotTicks[a],
              this.offset + this.tickLength
            ));
    if ((this.parent.pop(), this.drawTickLabels)) {
      if (
        (this.parent.push(),
        this.parent.textFont(this.fontName),
        this.parent.textSize(this.fontSize),
        this.parent.fill(this.fontColor),
        this.parent.noStroke(),
        this.rotateTickLabels)
      ) {
        var b = 0.5 * Math.PI;
        for (
          this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            (this.parent.push(),
            this.parent.translate(
              this.plotTicks[a],
              this.offset + this.tickLabelOffset
            ),
            this.parent.rotate(-b),
            this.parent.text(this.tickLabels[a], 0, 0),
            this.parent.pop());
      } else
        for (
          this.parent.textAlign(this.parent.CENTER, this.parent.TOP), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            this.parent.text(
              this.tickLabels[a],
              this.plotTicks[a],
              this.offset + this.tickLabelOffset
            );
      this.parent.pop();
    }
  }),
  (GAxis.prototype.drawAsYAxis = function () {
    var a;
    for (
      this.parent.push(),
        this.parent.stroke(this.lineColor),
        this.parent.strokeWeight(this.lineWidth),
        this.parent.strokeCap(this.parent.SQUARE),
        this.parent.line(-this.offset, 0, -this.offset, -this.dim[1]),
        a = 0;
      a < this.plotTicks.length;
      a++
    )
      this.ticksInside[a] &&
        (this.log && "" === this.tickLabels[a]
          ? this.parent.line(
              -this.offset,
              this.plotTicks[a],
              -this.offset - this.smallTickLength,
              this.plotTicks[a]
            )
          : this.parent.line(
              -this.offset,
              this.plotTicks[a],
              -this.offset - this.tickLength,
              this.plotTicks[a]
            ));
    if ((this.parent.pop(), this.drawTickLabels)) {
      if (
        (this.parent.push(),
        this.parent.textFont(this.fontName),
        this.parent.textSize(this.fontSize),
        this.parent.fill(this.fontColor),
        this.parent.noStroke(),
        this.rotateTickLabels)
      ) {
        var b = 0.5 * Math.PI;
        for (
          this.parent.textAlign(this.parent.CENTER, this.parent.BOTTOM), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            (this.parent.push(),
            this.parent.translate(
              -this.offset - this.tickLabelOffset,
              this.plotTicks[a]
            ),
            this.parent.rotate(-b),
            this.parent.text(this.tickLabels[a], 0, 0),
            this.parent.pop());
      } else
        for (
          this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            this.parent.text(
              this.tickLabels[a],
              -this.offset - this.tickLabelOffset,
              this.plotTicks[a]
            );
      this.parent.pop();
    }
  }),
  (GAxis.prototype.drawAsTopAxis = function () {
    var a;
    for (
      this.parent.push(),
        this.parent.stroke(this.lineColor),
        this.parent.strokeWeight(this.lineWidth),
        this.parent.strokeCap(this.parent.SQUARE),
        this.parent.translate(0, -this.dim[1]),
        this.parent.line(0, -this.offset, this.dim[0], -this.offset),
        a = 0;
      a < this.plotTicks.length;
      a++
    )
      this.ticksInside[a] &&
        (this.log && "" === this.tickLabels[a]
          ? this.parent.line(
              this.plotTicks[a],
              -this.offset,
              this.plotTicks[a],
              -this.offset - this.smallTickLength
            )
          : this.parent.line(
              this.plotTicks[a],
              -this.offset,
              this.plotTicks[a],
              -this.offset - this.tickLength
            ));
    if ((this.parent.pop(), this.drawTickLabels)) {
      if (
        (this.parent.push(),
        this.parent.textFont(this.fontName),
        this.parent.textSize(this.fontSize),
        this.parent.fill(this.fontColor),
        this.parent.noStroke(),
        this.parent.translate(0, -this.dim[1]),
        this.rotateTickLabels)
      ) {
        var b = 0.5 * Math.PI;
        for (
          this.parent.textAlign(this.parent.LEFT, this.parent.CENTER), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            (this.parent.push(),
            this.parent.translate(
              this.plotTicks[a],
              -this.offset - this.tickLabelOffset
            ),
            this.parent.rotate(-b),
            this.parent.text(this.tickLabels[a], 0, 0),
            this.parent.pop());
      } else
        for (
          this.parent.textAlign(this.parent.CENTER, this.parent.BOTTOM), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            this.parent.text(
              this.tickLabels[a],
              this.plotTicks[a],
              -this.offset - this.tickLabelOffset
            );
      this.parent.pop();
    }
  }),
  (GAxis.prototype.drawAsRightAxis = function () {
    var a;
    for (
      this.parent.push(),
        this.parent.stroke(this.lineColor),
        this.parent.strokeWeight(this.lineWidth),
        this.parent.strokeCap(this.parent.SQUARE),
        this.parent.translate(this.dim[0], 0),
        this.parent.line(this.offset, 0, this.offset, -this.dim[1]),
        a = 0;
      a < this.plotTicks.length;
      a++
    )
      this.ticksInside[a] &&
        (this.log && "" === this.tickLabels[a]
          ? this.parent.line(
              this.offset,
              this.plotTicks[a],
              this.offset + this.smallTickLength,
              this.plotTicks[a]
            )
          : this.parent.line(
              this.offset,
              this.plotTicks[a],
              this.offset + this.tickLength,
              this.plotTicks[a]
            ));
    if ((this.parent.pop(), this.drawTickLabels)) {
      if (
        (this.parent.push(),
        this.parent.textFont(this.fontName),
        this.parent.textSize(this.fontSize),
        this.parent.fill(this.fontColor),
        this.parent.noStroke(),
        this.parent.translate(this.dim[0], 0),
        this.rotateTickLabels)
      ) {
        var b = 0.5 * Math.PI;
        for (
          this.parent.textAlign(this.parent.CENTER, this.parent.TOP), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            (this.parent.push(),
            this.parent.translate(
              this.offset + this.tickLabelOffset,
              this.plotTicks[a]
            ),
            this.parent.rotate(-b),
            this.parent.text(this.tickLabels[a], 0, 0),
            this.parent.pop());
      } else
        for (
          this.parent.textAlign(this.parent.LEFT, this.parent.CENTER), a = 0;
          a < this.plotTicks.length;
          a++
        )
          this.ticksInside[a] &&
            "" !== this.tickLabels[a] &&
            this.parent.text(
              this.tickLabels[a],
              this.offset + this.tickLabelOffset,
              this.plotTicks[a]
            );
      this.parent.pop();
    }
  }),
  (GAxis.prototype.setDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GAxis.setDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a > 0 &&
      b > 0 &&
      ((this.dim[0] = a),
      (this.dim[1] = b),
      this.updatePlotTicks(),
      this.lab.setDim(this.dim));
  }),
  (GAxis.prototype.setLim = function (a) {
    a[1] !== a[0] &&
      (this.log && (a[0] <= 0 || a[1] <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.lim[0] = a[0]),
          (this.lim[1] = a[1]),
          this.fixedTicks || (this.updateTicks(), this.updateTickLabels()),
          this.updatePlotTicks(),
          this.updateTicksInside()));
  }),
  (GAxis.prototype.setLimAndLog = function (a, b) {
    a[1] !== a[0] &&
      (b && (a[0] <= 0 || a[1] <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.lim[0] = a[0]),
          (this.lim[1] = a[1]),
          (this.log = b),
          this.fixedTicks || (this.updateTicks(), this.updateTickLabels()),
          this.updatePlotTicks(),
          this.updateTicksInside()));
  }),
  (GAxis.prototype.setLog = function (a) {
    a !== this.log &&
      ((this.log = a),
      this.log &&
        (this.lim[0] <= 0 || this.lim[1] <= 0) &&
        (console.log(
          "The limits are negative. This is not allowed in logarithmic scale."
        ),
        console.log("Will set them to (0.1, 10)"),
        this.lim[1] > this.lim[0]
          ? ((this.lim[0] = 0.1), (this.lim[1] = 10))
          : ((this.lim[0] = 10), (this.lim[1] = 0.1))),
      this.fixedTicks || (this.updateTicks(), this.updateTickLabels()),
      this.updatePlotTicks(),
      this.updateTicksInside());
  }),
  (GAxis.prototype.setOffset = function (a) {
    this.offset = a;
  }),
  (GAxis.prototype.setLineColor = function (a) {
    this.lineColor = a;
  }),
  (GAxis.prototype.setLineWidth = function (a) {
    a > 0 && (this.lineWidth = a);
  }),
  (GAxis.prototype.setNTicks = function (a) {
    a >= 0 &&
      ((this.nTicks = a),
      (this.ticksSeparation = -1),
      (this.fixedTicks = !1),
      this.log ||
        (this.updateTicks(),
        this.updatePlotTicks(),
        this.updateTicksInside(),
        this.updateTickLabels()));
  }),
  (GAxis.prototype.setTicksSeparation = function (a) {
    (this.ticksSeparation = a),
      (this.fixedTicks = !1),
      this.log ||
        (this.updateTicks(),
        this.updatePlotTicks(),
        this.updateTicksInside(),
        this.updateTickLabels());
  }),
  (GAxis.prototype.setTicks = function (a) {
    var b = a.length;
    this.adaptSize(this.ticks, b);
    for (var c = 0; c < b; c++) this.ticks[c] = a[c];
    (this.fixedTicks = !0),
      (this.ticksPrecision = void 0),
      this.updatePlotTicks(),
      this.updateTicksInside(),
      this.updateTickLabels();
  }),
  (GAxis.prototype.setTickLabels = function (a) {
    if (a.length === this.tickLabels.length) {
      for (var b = 0; b < this.tickLabels.length; b++)
        this.tickLabels[b] = a[b];
      (this.fixedTicks = !0), (this.ticksPrecision = void 0);
    }
  }),
  (GAxis.prototype.setFixedTicks = function (a) {
    a !== this.fixedTicks &&
      ((this.fixedTicks = a),
      this.fixedTicks ||
        (this.updateTicks(),
        this.updatePlotTicks(),
        this.updateTicksInside(),
        this.updateTickLabels()));
  }),
  (GAxis.prototype.setTickLength = function (a) {
    this.tickLength = a;
  }),
  (GAxis.prototype.setSmallTickLength = function (a) {
    this.smallTickLength = a;
  }),
  (GAxis.prototype.setExpTickLabels = function (a) {
    a !== this.expTickLabels &&
      ((this.expTickLabels = a), this.updateTickLabels());
  }),
  (GAxis.prototype.setRotateTickLabels = function (a) {
    this.rotateTickLabels = a;
  }),
  (GAxis.prototype.setDrawTickLabels = function (a) {
    this.drawTickLabels = a;
  }),
  (GAxis.prototype.setTickLabelOffset = function (a) {
    this.tickLabelOffset = a;
  }),
  (GAxis.prototype.setDrawAxisLabel = function (a) {
    this.drawAxisLabel = a;
  }),
  (GAxis.prototype.setAxisLabelText = function (a) {
    this.lab.setText(a);
  }),
  (GAxis.prototype.setFontName = function (a) {
    this.fontName = a;
  }),
  (GAxis.prototype.setFontColor = function (a) {
    this.fontColor = a;
  }),
  (GAxis.prototype.setFontSize = function (a) {
    a > 0 && (this.fontSize = a);
  }),
  (GAxis.prototype.setFontProperties = function (a, b, c) {
    c > 0 && ((this.fontName = a), (this.fontColor = b), (this.fontSize = c));
  }),
  (GAxis.prototype.setAllFontProperties = function (a, b, c) {
    this.setFontProperties(a, b, c), this.lab.setFontProperties(a, b, c);
  }),
  (GAxis.prototype.getTicks = function () {
    if (this.fixedTicks) return this.ticks.slice();
    for (var a = [], b = 0, c = 0; c < this.ticksInside.length; c++)
      this.ticksInside[c] && ((a[b] = this.ticks[c]), b++);
    return a;
  }),
  (GAxis.prototype.getTicksRef = function () {
    return this.ticks;
  }),
  (GAxis.prototype.getPlotTicks = function () {
    if (this.fixedTicks) return this.plotTicks.slice();
    for (var a = [], b = 0, c = 0; c < this.ticksInside.length; c++)
      this.ticksInside[c] && ((a[b] = this.plotTicks[c]), b++);
    return a;
  }),
  (GAxis.prototype.getPlotTicksRef = function () {
    return this.plotTicks;
  }),
  (GAxis.prototype.getAxisLabel = function () {
    return this.lab;
  }),
  (GHistogram.prototype.updateArrays = function () {
    var a,
      b = this.plotPoints.length;
    if (
      (this.differences.length > b &&
        (this.differences.splice(b, Number.MAX_VALUE),
        this.leftSides.splice(b, Number.MAX_VALUE),
        this.rightSides.splice(b, Number.MAX_VALUE)),
      1 === b)
    )
      (this.leftSides[0] =
        this.type === GPlot.VERTICAL ? 0.2 * this.dim[0] : 0.2 * this.dim[1]),
        (this.rightSides[0] = this.leftSides[0]);
    else if (b > 1) {
      for (a = 0; a < b - 1; a++)
        if (this.plotPoints[a].isValid() && this.plotPoints[a + 1].isValid()) {
          var c,
            d = this.separations[a % this.separations.length];
          (c =
            this.type === GPlot.VERTICAL
              ? this.plotPoints[a + 1].getX() - this.plotPoints[a].getX()
              : this.plotPoints[a + 1].getY() - this.plotPoints[a].getY()),
            (this.differences[a] = c > 0 ? (c - d) / 2 : (c + d) / 2);
        } else this.differences[a] = 0;
      for (
        this.leftSides[0] = this.differences[0],
          this.rightSides[0] = this.differences[0],
          a = 1;
        a < b - 1;
        a++
      )
        (this.leftSides[a] = this.differences[a - 1]),
          (this.rightSides[a] = this.differences[a]);
      (this.leftSides[b - 1] = this.differences[b - 2]),
        (this.rightSides[b - 1] = this.differences[b - 2]);
    }
  }),
  (GHistogram.prototype.draw = function (a) {
    if (this.visible) {
      var b = 0;
      a.isValid() && (b = this.type === GPlot.VERTICAL ? a.getY() : a.getX());
      var c,
        d,
        e,
        f,
        g,
        h,
        i = this.plotPoints.length;
      this.parent.push(),
        this.parent.rectMode(this.parent.CORNERS),
        this.parent.strokeCap(this.parent.SQUARE);
      for (var j = 0; j < i; j++)
        (c = this.plotPoints[j]),
          c.isValid() &&
            (this.type === GPlot.VERTICAL
              ? ((d = c.getX() - this.leftSides[j]),
                (e = c.getX() + this.rightSides[j]),
                (f = c.getY()),
                (g = b))
              : ((d = b),
                (e = c.getX()),
                (f = c.getY() - this.leftSides[j]),
                (g = c.getY() + this.rightSides[j])),
            d < 0 ? (d = 0) : d > this.dim[0] && (d = this.dim[0]),
            -f < 0 ? (f = 0) : -f > this.dim[1] && (f = -this.dim[1]),
            e < 0 ? (e = 0) : e > this.dim[0] && (e = this.dim[0]),
            -g < 0 ? (g = 0) : -g > this.dim[1] && (g = -this.dim[1]),
            (h = this.lineWidths[j % this.lineWidths.length]),
            this.parent.fill(this.bgColors[j % this.bgColors.length]),
            this.parent.stroke(this.lineColors[j % this.lineColors.length]),
            this.parent.strokeWeight(h),
            Math.abs(e - d) > 2 * h && Math.abs(g - f) > 2 * h
              ? this.parent.rect(d, f, e, g)
              : ((this.type === GPlot.VERTICAL &&
                  e !== d &&
                  (f !== g || (0 !== f && f !== -this.dim[1]))) ||
                  (this.type === GPlot.HORIZONTAL &&
                    g !== f &&
                    (d !== e || (0 !== d && d !== this.dim[0])))) &&
                (this.parent.rect(d, f, e, g),
                this.parent.line(d, f, d, g),
                this.parent.line(e, f, e, g),
                this.parent.line(d, f, e, f),
                this.parent.line(d, g, e, g)));
      this.parent.pop(), this.drawLabels && this.drawHistLabels();
    }
  }),
  (GHistogram.prototype.drawHistLabels = function () {
    var a,
      b,
      c = this.plotPoints.length,
      d = 0.5 * Math.PI;
    if (
      (this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.noStroke(),
      this.type === GPlot.VERTICAL)
    )
      if (this.rotateLabels)
        for (
          this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER), b = 0;
          b < c;
          b++
        )
          (a = this.plotPoints[b]),
            a.isValid() &&
              a.getX() >= 0 &&
              a.getX() <= this.dim[0] &&
              (this.parent.push(),
              this.parent.translate(a.getX(), this.labelsOffset),
              this.parent.rotate(-d),
              this.parent.text(a.getLabel(), 0, 0),
              this.parent.pop());
      else
        for (
          this.parent.textAlign(this.parent.CENTER, this.parent.TOP), b = 0;
          b < c;
          b++
        )
          (a = this.plotPoints[b]),
            a.isValid() &&
              a.getX() >= 0 &&
              a.getX() <= this.dim[0] &&
              this.parent.text(a.getLabel(), a.getX(), this.labelsOffset);
    else if (this.rotateLabels)
      for (
        this.parent.textAlign(this.parent.CENTER, this.parent.BOTTOM), b = 0;
        b < c;
        b++
      )
        (a = this.plotPoints[b]),
          a.isValid() &&
            -a.getY() >= 0 &&
            -a.getY() <= this.dim[1] &&
            (this.parent.push(),
            this.parent.translate(-this.labelsOffset, a.getY()),
            this.parent.rotate(-d),
            this.parent.text(a.getLabel(), 0, 0),
            this.parent.pop());
    else
      for (
        this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER), b = 0;
        b < c;
        b++
      )
        (a = this.plotPoints[b]),
          a.isValid() &&
            -a.getY() >= 0 &&
            -a.getY() <= this.dim[1] &&
            this.parent.text(a.getLabel(), -this.labelsOffset, a.getY());
    this.parent.pop();
  }),
  (GHistogram.prototype.setType = function (a) {
    a === this.type ||
      (a !== GPlot.VERTICAL && a !== GPlot.HORIZONTAL) ||
      ((this.type = a), this.updateArrays());
  }),
  (GHistogram.prototype.setDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GHistogram.setDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a > 0 &&
      b > 0 &&
      ((this.dim[0] = a), (this.dim[1] = b), this.updateArrays());
  }),
  (GHistogram.prototype.setPlotPoints = function (a) {
    var b,
      c = a.length;
    if (this.plotPoints.length === c)
      for (b = 0; b < c; b++) this.plotPoints[b].set(a[b]);
    else if (this.plotPoints.length > c) {
      for (b = 0; b < c; b++) this.plotPoints[b].set(a[b]);
      this.plotPoints.splice(c, Number.MAX_VALUE);
    } else {
      for (b = 0; b < this.plotPoints.length; b++) this.plotPoints[b].set(a[b]);
      for (b = this.plotPoints.length; b < c; b++)
        this.plotPoints[b] = new GPoint(a[b]);
    }
    this.updateArrays();
  }),
  (GHistogram.prototype.setPlotPoint = function (a, b) {
    if (a < this.plotPoints.length) this.plotPoints[a].set(b);
    else {
      if (a !== this.plotPoints.length)
        throw new Error(
          "GHistogram.setPlotPoint(): the index position is outside the array size"
        );
      this.plotPoints[a] = new GPoint(b);
    }
    this.updateArrays();
  }),
  (GHistogram.prototype.addPlotPoint = function () {
    if (2 === arguments.length)
      this.plotPoints.push(new GPoint(arguments[0], arguments[1]));
    else {
      if (1 !== arguments.length)
        throw new Error("GHistogram.addPlotPoint(): signature not supported");
      this.plotPoints.push(new GPoint(arguments[0]));
    }
    this.updateArrays();
  }),
  (GHistogram.prototype.removePlotPoint = function (a) {
    if (!(a < this.plotPoints.length))
      throw new Error(
        "GHistogram.removePlotPoint(): the index position is outside the array size"
      );
    this.plotPoints.splice(a, 1), this.updateArrays();
  }),
  (GHistogram.prototype.setSeparations = function (a) {
    (this.separations = a.slice()), this.updateArrays();
  }),
  (GHistogram.prototype.setBgColors = function (a) {
    this.bgColors = a.slice();
  }),
  (GHistogram.prototype.setLineColors = function (a) {
    this.lineColors = a.slice();
  }),
  (GHistogram.prototype.setLineWidths = function (a) {
    this.lineWidths = a.slice();
  }),
  (GHistogram.prototype.setVisible = function (a) {
    this.visible = a;
  }),
  (GHistogram.prototype.setLabelsOffset = function (a) {
    this.labelsOffset = a;
  }),
  (GHistogram.prototype.setDrawLabels = function (a) {
    this.drawLabels = a;
  }),
  (GHistogram.prototype.setRotateLabels = function (a) {
    this.rotateLabels = a;
  }),
  (GHistogram.prototype.setFontName = function (a) {
    this.fontName = a;
  }),
  (GHistogram.prototype.setFontColor = function (a) {
    this.fontColor = a;
  }),
  (GHistogram.prototype.setFontSize = function (a) {
    a > 0 && (this.fontSize = a);
  }),
  (GHistogram.prototype.setFontProperties = function (a, b, c) {
    c > 0 && ((this.fontName = a), (this.fontColor = b), (this.fontSize = c));
  }),
  (GLayer.prototype.isValidNumber = function (a) {
    return !isNaN(a) && isFinite(a);
  }),
  (GLayer.prototype.isId = function (a) {
    return this.id === a;
  }),
  (GLayer.prototype.valueToXPlot = function (a) {
    return this.xLog
      ? (this.dim[0] * Math.log(a / this.xLim[0])) /
          Math.log(this.xLim[1] / this.xLim[0])
      : (this.dim[0] * (a - this.xLim[0])) / (this.xLim[1] - this.xLim[0]);
  }),
  (GLayer.prototype.valueToYPlot = function (a) {
    return this.yLog
      ? (-this.dim[1] * Math.log(a / this.yLim[0])) /
          Math.log(this.yLim[1] / this.yLim[0])
      : (-this.dim[1] * (a - this.yLim[0])) / (this.yLim[1] - this.yLim[0]);
  }),
  (GLayer.prototype.valueToPlot = function () {
    if (2 === arguments.length)
      return [this.valueToXPlot(arguments[0]), this.valueToYPlot(arguments[1])];
    if (1 === arguments.length && arguments[0] instanceof GPoint)
      return new GPoint(
        this.valueToXPlot(arguments[0].getX()),
        this.valueToYPlot(arguments[0].getY()),
        arguments[0].getLabel()
      );
    if (
      1 === arguments.length &&
      arguments[0] instanceof Array &&
      arguments[0][0] instanceof GPoint
    ) {
      var a,
        b,
        c,
        d,
        e,
        f,
        g = arguments[0].length,
        h = [];
      if (this.xLog && this.yLog)
        for (
          a = this.dim[0] / Math.log(this.xLim[1] / this.xLim[0]),
            b = -this.dim[1] / Math.log(this.yLim[1] / this.yLim[0]),
            f = 0;
          f < g;
          f++
        )
          (c = arguments[0][f]),
            (d = Math.log(c.getX() / this.xLim[0]) * a),
            (e = Math.log(c.getY() / this.yLim[0]) * b),
            (h[f] = new GPoint(d, e, c.getLabel()));
      else if (this.xLog)
        for (
          a = this.dim[0] / Math.log(this.xLim[1] / this.xLim[0]),
            b = -this.dim[1] / (this.yLim[1] - this.yLim[0]),
            f = 0;
          f < g;
          f++
        )
          (c = arguments[0][f]),
            (d = Math.log(c.getX() / this.xLim[0]) * a),
            (e = (c.getY() - this.yLim[0]) * b),
            (h[f] = new GPoint(d, e, c.getLabel()));
      else if (this.yLog)
        for (
          a = this.dim[0] / (this.xLim[1] - this.xLim[0]),
            b = -this.dim[1] / Math.log(this.yLim[1] / this.yLim[0]),
            f = 0;
          f < g;
          f++
        )
          (c = arguments[0][f]),
            (d = (c.getX() - this.xLim[0]) * a),
            (e = Math.log(c.getY() / this.yLim[0]) * b),
            (h[f] = new GPoint(d, e, c.getLabel()));
      else
        for (
          a = this.dim[0] / (this.xLim[1] - this.xLim[0]),
            b = -this.dim[1] / (this.yLim[1] - this.yLim[0]),
            f = 0;
          f < g;
          f++
        )
          (c = arguments[0][f]),
            (d = (c.getX() - this.xLim[0]) * a),
            (e = (c.getY() - this.yLim[0]) * b),
            (h[f] = new GPoint(d, e, c.getLabel()));
      return h;
    }
    throw new Error("GLayer.valueToPlot(): signature not supported");
  }),
  (GLayer.prototype.updatePlotPoints = function () {
    var a,
      b,
      c,
      d,
      e,
      f,
      g = this.points.length;
    if (this.plotPoints.length < g)
      for (f = this.plotPoints.length; f < g; f++)
        this.plotPoints[f] = new GPoint();
    else
      this.plotPoints.length > g && this.plotPoints.splice(g, Number.MAX_VALUE);
    if (this.xLog && this.yLog)
      for (
        a = this.dim[0] / Math.log(this.xLim[1] / this.xLim[0]),
          b = -this.dim[1] / Math.log(this.yLim[1] / this.yLim[0]),
          f = 0;
        f < g;
        f++
      )
        (c = this.points[f]),
          (d = Math.log(c.getX() / this.xLim[0]) * a),
          (e = Math.log(c.getY() / this.yLim[0]) * b),
          this.plotPoints[f].set(d, e, c.getLabel());
    else if (this.xLog)
      for (
        a = this.dim[0] / Math.log(this.xLim[1] / this.xLim[0]),
          b = -this.dim[1] / (this.yLim[1] - this.yLim[0]),
          f = 0;
        f < g;
        f++
      )
        (c = this.points[f]),
          (d = Math.log(c.getX() / this.xLim[0]) * a),
          (e = (c.getY() - this.yLim[0]) * b),
          this.plotPoints[f].set(d, e, c.getLabel());
    else if (this.yLog)
      for (
        a = this.dim[0] / (this.xLim[1] - this.xLim[0]),
          b = -this.dim[1] / Math.log(this.yLim[1] / this.yLim[0]),
          f = 0;
        f < g;
        f++
      )
        (c = this.points[f]),
          (d = (c.getX() - this.xLim[0]) * a),
          (e = Math.log(c.getY() / this.yLim[0]) * b),
          this.plotPoints[f].set(d, e, c.getLabel());
    else
      for (
        a = this.dim[0] / (this.xLim[1] - this.xLim[0]),
          b = -this.dim[1] / (this.yLim[1] - this.yLim[0]),
          f = 0;
        f < g;
        f++
      )
        (c = this.points[f]),
          (d = (c.getX() - this.xLim[0]) * a),
          (e = (c.getY() - this.yLim[0]) * b),
          this.plotPoints[f].set(d, e, c.getLabel());
  }),
  (GLayer.prototype.xPlotToValue = function (a) {
    return this.xLog
      ? Math.exp(
          Math.log(this.xLim[0]) +
            (Math.log(this.xLim[1] / this.xLim[0]) * a) / this.dim[0]
        )
      : this.xLim[0] + ((this.xLim[1] - this.xLim[0]) * a) / this.dim[0];
  }),
  (GLayer.prototype.yPlotToValue = function (a) {
    return this.yLog
      ? Math.exp(
          Math.log(this.yLim[0]) -
            (Math.log(this.yLim[1] / this.yLim[0]) * a) / this.dim[1]
        )
      : this.yLim[0] - ((this.yLim[1] - this.yLim[0]) * a) / this.dim[1];
  }),
  (GLayer.prototype.plotToValue = function (a, b) {
    return [this.xPlotToValue(a), this.yPlotToValue(b)];
  }),
  (GLayer.prototype.isInside = function () {
    var a, b, c;
    if (2 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = this.isValidNumber(a) && this.isValidNumber(b));
    else {
      if (!(1 === arguments.length && arguments[0] instanceof GPoint))
        throw new Error("GLayer.isInside(): signature not supported");
      (a = arguments[0].getX()),
        (b = arguments[0].getY()),
        (c = arguments[0].isValid());
    }
    return !!c && a >= 0 && a <= this.dim[0] && -b >= 0 && -b <= this.dim[1];
  }),
  (GLayer.prototype.updateInsideList = function () {
    for (var a, b = this.plotPoints.length, c = 0; c < b; c++)
      (a = this.plotPoints[c]),
        (this.inside[c] =
          !!a.isValid() &&
          a.getX() >= 0 &&
          a.getX() <= this.dim[0] &&
          -a.getY() >= 0 &&
          -a.getY() <= this.dim[1]);
    this.inside.length > b && this.inside.splice(b, Number.MAX_VALUE);
  }),
  (GLayer.prototype.getPointIndexAtPlotPos = function (a, b) {
    var c;
    if (this.isInside(a, b))
      for (
        var d,
          e,
          f = Number.MAX_VALUE,
          g = this.plotPoints.length,
          h = this.pointSizes.length,
          i = 0;
        i < g;
        i++
      )
        this.inside[i] &&
          ((d = this.plotPoints[i]),
          (e = Math.pow(d.getX() - a, 2) + Math.pow(d.getY() - b, 2)) <
            Math.max(Math.pow(this.pointSizes[i % h] / 2, 2), 25) &&
            e < f &&
            ((f = e), (c = i)));
    return c;
  }),
  (GLayer.prototype.getPointAtPlotPos = function (a, b) {
    return this.points[this.getPointIndexAtPlotPos(a, b)];
  }),
  (GLayer.prototype.obtainBoxIntersections = function (a, b) {
    var c = 0;
    if (a.isValid() && b.isValid()) {
      var d = a.getX(),
        e = a.getY(),
        f = b.getX(),
        g = b.getY(),
        h = this.isInside(d, e),
        i = this.isInside(f, g);
      if (
        !(
          (h && i) ||
          (d < 0 && f < 0) ||
          (d > this.dim[0] && f > this.dim[0]) ||
          (-e < 0 && -g < 0) ||
          (-e > this.dim[1] && -g > this.dim[1])
        )
      ) {
        var j = f - d,
          k = g - e;
        if (0 === j)
          (c = 2),
            (this.cuts[0][0] = d),
            (this.cuts[0][1] = 0),
            (this.cuts[1][0] = d),
            (this.cuts[1][1] = -this.dim[1]);
        else if (0 === k)
          (c = 2),
            (this.cuts[0][0] = 0),
            (this.cuts[0][1] = e),
            (this.cuts[1][0] = this.dim[0]),
            (this.cuts[1][1] = e);
        else {
          var l = k / j,
            m = e - l * d;
          (c = 4),
            (this.cuts[0][0] = -m / l),
            (this.cuts[0][1] = 0),
            (this.cuts[1][0] = (-this.dim[1] - m) / l),
            (this.cuts[1][1] = -this.dim[1]),
            (this.cuts[2][0] = 0),
            (this.cuts[2][1] = m),
            (this.cuts[3][0] = this.dim[0]),
            (this.cuts[3][1] = m + l * this.dim[0]);
        }
        if (((c = this.getValidCuts(this.cuts, c, a, b)), h || i)) {
          if (1 !== c) {
            var n = h ? a : b;
            c > 1 &&
              (c = this.removeDuplicatedCuts(this.cuts, c, 0)) > 1 &&
              (c = this.removePointFromCuts(this.cuts, c, n, 0)) > 1 &&
              (c = this.removeDuplicatedCuts(this.cuts, c, 0.001)) > 1 &&
              (c = this.removePointFromCuts(this.cuts, c, n, 0.001)),
              0 === c &&
                ((c = 1),
                (this.cuts[0][0] = n.getX()),
                (this.cuts[0][1] = n.getY()));
          }
        } else
          c > 2 &&
            (c = this.removeDuplicatedCuts(this.cuts, c, 0)) > 2 &&
            (c = this.removeDuplicatedCuts(this.cuts, c, 0.001)),
            2 === c &&
              (Math.pow(this.cuts[0][0] - d, 2),
              Math.pow(this.cuts[0][1] - e),
              2 >
                Math.pow(this.cuts[1][0] - d, 2) +
                  Math.pow(this.cuts[1][1] - e, 2) &&
                ((this.cuts[2][0] = this.cuts[0][0]),
                (this.cuts[2][1] = this.cuts[0][1]),
                (this.cuts[0][0] = this.cuts[1][0]),
                (this.cuts[0][1] = this.cuts[1][1]),
                (this.cuts[1][0] = this.cuts[2][0]),
                (this.cuts[1][1] = this.cuts[2][1]))),
            1 === c &&
              ((c = 2),
              (this.cuts[1][0] = this.cuts[0][0]),
              (this.cuts[1][1] = this.cuts[0][1]));
        (h || i) && 1 !== c
          ? console.log("There should be one cut!!!")
          : h ||
            i ||
            0 === c ||
            2 === c ||
            console.log(
              "There should be either 0 or 2 cuts!!! " + c + " were found"
            );
      }
    }
    return c;
  }),
  (GLayer.prototype.getValidCuts = function (a, b, c, d) {
    for (
      var e = c.getX(),
        f = c.getY(),
        g = d.getX(),
        h = d.getY(),
        i = Math.abs(g - e),
        j = Math.abs(h - f),
        k = 0,
        l = 0;
      l < b;
      l++
    )
      this.isInside(a[l][0], a[l][1]) &&
        Math.abs(a[l][0] - e) <= i &&
        Math.abs(a[l][1] - f) <= j &&
        Math.abs(a[l][0] - g) <= i &&
        Math.abs(a[l][1] - h) <= j &&
        ((a[k][0] = a[l][0]), (a[k][1] = a[l][1]), k++);
    return k;
  }),
  (GLayer.prototype.removeDuplicatedCuts = function (a, b, c) {
    for (var d, e = 0, f = 0; f < b; f++) {
      d = !1;
      for (var g = 0; g < e; g++)
        if (
          Math.abs(a[g][0] - a[f][0]) <= c &&
          Math.abs(a[g][1] - a[f][1]) <= c
        ) {
          d = !0;
          break;
        }
      d || ((a[e][0] = a[f][0]), (a[e][1] = a[f][1]), e++);
    }
    return e;
  }),
  (GLayer.prototype.removePointFromCuts = function (a, b, c, d) {
    for (var e = c.getX(), f = c.getY(), g = 0, h = 0; h < b; h++)
      (Math.abs(a[h][0] - e) > d || Math.abs(a[h][1] - f) > d) &&
        ((a[g][0] = a[h][0]), (a[g][1] = a[h][1]), g++);
    return g;
  }),
  (GLayer.prototype.startHistogram = function (a) {
    this.hist = new GHistogram(this.parent, a, this.dim, this.plotPoints);
  }),
  (GLayer.prototype.drawPoints = function () {
    var a, b;
    if (0 === arguments.length) {
      a = this.plotPoints.length;
      var c = this.pointColors.length,
        d = this.pointSizes.length;
      if (
        (this.parent.push(),
        this.parent.ellipseMode(this.parent.CENTER),
        this.parent.noStroke(),
        1 === c && 1 === d)
      )
        for (this.parent.fill(this.pointColors[0]), b = 0; b < a; b++)
          this.inside[b] &&
            this.parent.ellipse(
              this.plotPoints[b].getX(),
              this.plotPoints[b].getY(),
              this.pointSizes[0],
              this.pointSizes[0]
            );
      else if (1 === c)
        for (this.parent.fill(this.pointColors[0]), b = 0; b < a; b++)
          this.inside[b] &&
            this.parent.ellipse(
              this.plotPoints[b].getX(),
              this.plotPoints[b].getY(),
              this.pointSizes[b % d],
              this.pointSizes[b % d]
            );
      else if (1 === d)
        for (b = 0; b < a; b++)
          this.inside[b] &&
            (this.parent.fill(this.pointColors[b % c]),
            this.parent.ellipse(
              this.plotPoints[b].getX(),
              this.plotPoints[b].getY(),
              this.pointSizes[0],
              this.pointSizes[0]
            ));
      else
        for (b = 0; b < a; b++)
          this.inside[b] &&
            (this.parent.fill(this.pointColors[b % c]),
            this.parent.ellipse(
              this.plotPoints[b].getX(),
              this.plotPoints[b].getY(),
              this.pointSizes[b % d],
              this.pointSizes[b % d]
            ));
      this.parent.pop();
    } else {
      if (!(1 === arguments.length && arguments[0] instanceof p5.Image))
        throw new Error("GLayer.drawPoints(): signature not supported");
      for (
        a = this.plotPoints.length,
          this.parent.push(),
          this.parent.imageMode(this.parent.CENTER),
          b = 0;
        b < a;
        b++
      )
        this.inside[b] &&
          this.parent.image(
            arguments[0],
            this.plotPoints[b].getX(),
            this.plotPoints[b].getY()
          );
      this.parent.pop();
    }
  }),
  (GLayer.prototype.drawPoint = function () {
    var a, b, c, d;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else if (2 === arguments.length && arguments[1] instanceof p5.Image)
      (a = arguments[0]), (d = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.drawPoint(): signature not supported");
      (a = arguments[0]), (b = this.pointColors[0]), (c = this.pointSizes[0]);
    }
    var e = this.valueToXPlot(a.getX()),
      f = this.valueToYPlot(a.getY());
    this.isInside(e, f) &&
      (this.parent.push(),
      void 0 !== d
        ? (this.parent.imageMode(this.parent.CENTER),
          this.parent.image(d, e, f))
        : (this.parent.ellipseMode(this.parent.CENTER),
          this.parent.fill(b),
          this.parent.noStroke(),
          this.parent.ellipse(e, f, c, c)),
      this.parent.pop());
  }),
  (GLayer.prototype.drawLines = function () {
    var a = this.plotPoints.length;
    this.parent.push(),
      this.parent.noFill(),
      this.parent.stroke(this.lineColor),
      this.parent.strokeWeight(this.lineWidth),
      this.parent.strokeCap(this.parent.SQUARE);
    for (var b = 0; b < a - 1; b++)
      if (this.inside[b] && this.inside[b + 1])
        this.parent.line(
          this.plotPoints[b].getX(),
          this.plotPoints[b].getY(),
          this.plotPoints[b + 1].getX(),
          this.plotPoints[b + 1].getY()
        );
      else if (
        this.plotPoints[b].isValid() &&
        this.plotPoints[b + 1].isValid()
      ) {
        var c = this.obtainBoxIntersections(
          this.plotPoints[b],
          this.plotPoints[b + 1]
        );
        this.inside[b]
          ? this.parent.line(
              this.plotPoints[b].getX(),
              this.plotPoints[b].getY(),
              this.cuts[0][0],
              this.cuts[0][1]
            )
          : this.inside[b + 1]
          ? this.parent.line(
              this.cuts[0][0],
              this.cuts[0][1],
              this.plotPoints[b + 1].getX(),
              this.plotPoints[b + 1].getY()
            )
          : c >= 2 &&
            this.parent.line(
              this.cuts[0][0],
              this.cuts[0][1],
              this.cuts[1][0],
              this.cuts[1][1]
            );
      }
    this.parent.pop();
  }),
  (GLayer.prototype.drawLine = function () {
    var a, b, c, d, e, f;
    if (4 === arguments.length && arguments[0] instanceof GPoint)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else if (4 === arguments.length)
      (e = arguments[0]),
        (f = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else if (2 === arguments.length && arguments[0] instanceof GPoint)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = this.lineColor),
        (d = this.lineWidth);
    else {
      if (2 !== arguments.length)
        throw new Error("GLayer.drawLine(): signature not supported");
      (e = arguments[0]),
        (f = arguments[1]),
        (c = this.lineColor),
        (d = this.lineWidth);
    }
    void 0 !== e &&
      (this.xLog && this.yLog
        ? ((a = new GPoint(
            this.xLim[0],
            Math.pow(10, (e * Math.log(this.xLim[0])) / Math.LN10 + f)
          )),
          (b = new GPoint(
            this.xLim[1],
            Math.pow(10, (e * Math.log(this.xLim[1])) / Math.LN10 + f)
          )))
        : this.xLog
        ? ((a = new GPoint(
            this.xLim[0],
            (e * Math.log(this.xLim[0])) / Math.LN10 + f
          )),
          (b = new GPoint(
            this.xLim[1],
            (e * Math.log(this.xLim[1])) / Math.LN10 + f
          )))
        : this.yLog
        ? ((a = new GPoint(this.xLim[0], Math.pow(10, e * this.xLim[0] + f))),
          (b = new GPoint(this.xLim[1], Math.pow(10, e * this.xLim[1] + f))))
        : ((a = new GPoint(this.xLim[0], e * this.xLim[0] + f)),
          (b = new GPoint(this.xLim[1], e * this.xLim[1] + f))));
    var g = this.valueToPlot(a),
      h = this.valueToPlot(b);
    if (g.isValid() && h.isValid()) {
      var i = this.isInside(g),
        j = this.isInside(h);
      if (
        (this.parent.push(),
        this.parent.noFill(),
        this.parent.stroke(c),
        this.parent.strokeWeight(d),
        this.parent.strokeCap(this.parent.SQUARE),
        i && j)
      )
        this.parent.line(g.getX(), g.getY(), h.getX(), h.getY());
      else {
        var k = this.obtainBoxIntersections(g, h);
        i
          ? this.parent.line(
              g.getX(),
              g.getY(),
              this.cuts[0][0],
              this.cuts[0][1]
            )
          : j
          ? this.parent.line(
              this.cuts[0][0],
              this.cuts[0][1],
              h.getX(),
              h.getY()
            )
          : k >= 2 &&
            this.parent.line(
              this.cuts[0][0],
              this.cuts[0][1],
              this.cuts[1][0],
              this.cuts[1][1]
            );
      }
      this.parent.pop();
    }
  }),
  (GLayer.prototype.drawHorizontalLine = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.drawHorizontalLine(): signature not supported");
      (a = arguments[0]), (b = this.lineColor), (c = this.lineWidth);
    }
    var d = this.valueToYPlot(a);
    this.isValidNumber(d) &&
      -d >= 0 &&
      -d <= this.dim[1] &&
      (this.parent.push(),
      this.parent.noFill(),
      this.parent.stroke(b),
      this.parent.strokeWeight(c),
      this.parent.strokeCap(this.parent.SQUARE),
      this.parent.line(0, d, this.dim[0], d),
      this.parent.pop());
  }),
  (GLayer.prototype.drawVerticalLine = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.drawVerticalLine(): signature not supported");
      (a = arguments[0]), (b = this.lineColor), (c = this.lineWidth);
    }
    var d = this.valueToXPlot(a);
    this.isValidNumber(d) &&
      d >= 0 &&
      d <= this.dim[0] &&
      (this.parent.push(),
      this.parent.noFill(),
      this.parent.stroke(b),
      this.parent.strokeWeight(c),
      this.parent.strokeCap(this.parent.SQUARE),
      this.parent.line(d, 0, d, -this.dim[1]),
      this.parent.pop());
  }),
  (GLayer.prototype.drawFilledContour = function (a, b) {
    var c;
    if (
      (a === GPlot.HORIZONTAL
        ? (c = this.getHorizontalShape(b))
        : a === GPlot.VERTICAL && (c = this.getVerticalShape(b)),
      void 0 !== c && c.length > 0)
    ) {
      this.parent.push(),
        this.parent.fill(this.lineColor),
        this.parent.noStroke(),
        this.parent.beginShape();
      for (var d = 0; d < c.length; d++)
        c[d].isValid() && this.parent.vertex(c[d].getX(), c[d].getY());
      this.parent.endShape(this.parent.CLOSE), this.parent.pop();
    }
  }),
  (GLayer.prototype.getHorizontalShape = function (a) {
    for (
      var b, c, d, e = this.plotPoints.length, f = [], g = -1, h = -1, i = 0;
      i < e;
      i++
    )
      if (((b = this.plotPoints[i]), b.isValid())) {
        for (
          c = !1,
            this.inside[i]
              ? (f.push(new GPoint(b.getX(), b.getY(), "normal point")),
                (c = !0))
              : b.getX() >= 0 &&
                b.getX() <= this.dim[0] &&
                (-b.getY() < 0
                  ? (f.push(new GPoint(b.getX(), 0, "projection")), (c = !0))
                  : (f.push(new GPoint(b.getX(), -this.dim[1], "projection")),
                    (c = !0))),
            d = i + 1;
          d < e - 1 && !this.plotPoints[d].isValid();

        )
          d++;
        if (d < e && this.plotPoints[d].isValid())
          for (
            var j = this.obtainBoxIntersections(b, this.plotPoints[d]), k = 0;
            k < j;
            k++
          )
            f.push(new GPoint(this.cuts[k][0], this.cuts[k][1], "cut")),
              (c = !0);
        c && (g < 0 && (g = i), (h = i));
      }
    if (f.length > 0) {
      var l = new GPoint(f[0]);
      if (0 !== l.getX() && l.getX() !== this.dim[0])
        if ("cut" === l.getLabel())
          this.plotPoints[g].getX() < 0
            ? (l.setX(0), l.setLabel("extreme"))
            : (l.setX(this.dim[0]), l.setLabel("extreme"));
        else if (0 !== g) {
          for (var m = g - 1; m > 0 && !this.plotPoints[m].isValid(); ) m--;
          this.plotPoints[m].isValid() &&
            (this.plotPoints[m].getX() < 0
              ? (l.setX(0), l.setLabel("extreme"))
              : (l.setX(this.dim[0]), l.setLabel("extreme")));
        }
      var n = new GPoint(f[f.length - 1]);
      if (0 !== n.getX() && n.getX() !== this.dim[0] && h !== e - 1) {
        for (d = h + 1; d < e - 1 && !this.plotPoints[d].isValid(); ) d++;
        this.plotPoints[d].isValid() &&
          (this.plotPoints[d].getX() < 0
            ? (n.setX(0), n.setLabel("extreme"))
            : (n.setX(this.dim[0]), n.setLabel("extreme")));
      }
      "extreme" === n.getLabel() && f.push(n),
        this.yLog && a <= 0 && (a = Math.min(this.yLim[0], this.yLim[1]));
      var o = this.valueToPlot(1, a);
      -o[1] < 0
        ? (f.push(new GPoint(n.getX(), 0)), f.push(new GPoint(l.getX(), 0)))
        : -o[1] > this.dim[1]
        ? (f.push(new GPoint(n.getX(), -this.dim[1])),
          f.push(new GPoint(l.getX(), -this.dim[1])))
        : (f.push(new GPoint(n.getX(), o[1])),
          f.push(new GPoint(l.getX(), o[1]))),
        "extreme" === l.getLabel() && f.push(l);
    }
    return f;
  }),
  (GLayer.prototype.getVerticalShape = function (a) {
    for (
      var b, c, d, e = this.plotPoints.length, f = [], g = -1, h = -1, i = 0;
      i < e;
      i++
    )
      if (((b = this.plotPoints[i]), b.isValid())) {
        for (
          c = !1,
            this.inside[i]
              ? (f.push(new GPoint(b.getX(), b.getY(), "normal point")),
                (c = !0))
              : -b.getY() >= 0 &&
                -b.getY() <= this.dim[1] &&
                (b.getX() < 0
                  ? (f.push(new GPoint(0, b.getY(), "projection")), (c = !0))
                  : (f.push(new GPoint(this.dim[0], b.getY(), "projection")),
                    (c = !0))),
            d = i + 1;
          d < e - 1 && !this.plotPoints[d].isValid();

        )
          d++;
        if (d < e && this.plotPoints[d].isValid())
          for (
            var j = this.obtainBoxIntersections(b, this.plotPoints[d]), k = 0;
            k < j;
            k++
          )
            f.push(new GPoint(this.cuts[k][0], this.cuts[k][1], "cut")),
              (c = !0);
        c && (g < 0 && (g = i), (h = i));
      }
    if (f.length > 0) {
      var l = new GPoint(f[0]);
      if (0 !== l.getY() && l.getY() !== -this.dim[1])
        if ("cut" === l.getLabel())
          -this.plotPoints[g].getY() < 0
            ? (l.setY(0), l.setLabel("extreme"))
            : (l.setY(-this.dim[1]), l.setLabel("extreme"));
        else if (0 !== g) {
          for (var m = g - 1; m > 0 && !this.plotPoints[m].isValid(); ) m--;
          this.plotPoints[m].isValid() &&
            (-this.plotPoints[m].getY() < 0
              ? (l.setY(0), l.setLabel("extreme"))
              : (l.setY(-this.dim[1]), l.setLabel("extreme")));
        }
      var n = new GPoint(f[f.length - 1]);
      if (0 !== n.getY() && n.getY() !== -this.dim[1] && h !== e - 1) {
        for (d = h + 1; d < e - 1 && !this.plotPoints[d].isValid(); ) d++;
        this.plotPoints[d].isValid() &&
          (-this.plotPoints[d].getY() < 0
            ? (n.setY(0), n.setLabel("extreme"))
            : (n.setY(-this.dim[1]), n.setLabel("extreme")));
      }
      "extreme" === n.getLabel() && f.push(n),
        this.xLog && a <= 0 && (a = Math.min(this.xLim[0], this.xLim[1]));
      var o = this.valueToPlot(a, 1);
      o[0] < 0
        ? (f.push(new GPoint(0, n.getY())), f.push(new GPoint(0, l.getY())))
        : o[0] > this.dim[0]
        ? (f.push(new GPoint(this.dim[0], n.getY())),
          f.push(new GPoint(this.dim[0], l.getY())))
        : (f.push(new GPoint(o[0], n.getY())),
          f.push(new GPoint(o[0], l.getY()))),
        "extreme" === l.getLabel() && f.push(l);
    }
    return f;
  }),
  (GLayer.prototype.drawLabel = function (a) {
    var b = this.valueToXPlot(a.getX()),
      c = this.valueToYPlot(a.getY());
    if (this.isValidNumber(b) && this.isValidNumber(c)) {
      var d = b + this.labelSeparation[0],
        e = c - this.labelSeparation[1],
        f = this.fontSize / 4;
      this.parent.push(),
        this.parent.rectMode(this.parent.CORNER),
        this.parent.noStroke(),
        this.parent.textFont(this.fontName),
        this.parent.textSize(this.fontSize),
        this.parent.textAlign(this.parent.LEFT, this.parent.BOTTOM),
        this.parent.fill(this.labelBgColor),
        this.parent.rect(
          d - f,
          e - this.fontSize - f,
          this.parent.textWidth(a.getLabel()) + 2 * f,
          this.fontSize + 2 * f
        ),
        this.parent.fill(this.fontColor),
        this.parent.text(a.getLabel(), d, e),
        this.parent.pop();
    }
  }),
  (GLayer.prototype.drawLabelAtPlotPos = function (a, b) {
    var c = this.getPointAtPlotPos(a, b);
    void 0 !== c && this.drawLabel(c);
  }),
  (GLayer.prototype.drawHistogram = function () {
    void 0 !== this.hist &&
      this.hist.draw(this.valueToPlot(this.histBasePoint));
  }),
  (GLayer.prototype.drawPolygon = function (a, b) {
    var c;
    if (a.length > 2) {
      var d = this.valueToPlot(a),
        e = 0;
      for (c = 0; c < d.length; c++) d[c].isValid() && ((d[e] = d[c]), e++);
      d.splice(e, Number.MAX_VALUE);
      var f,
        g = d.length,
        h = [];
      for (c = 0; c < g; c++) {
        (f = d[c]),
          this.isInside(f) &&
            h.push(new GPoint(f.getX(), f.getY(), "normal point"));
        var i = c + 1 < g ? c + 1 : 0,
          j = this.obtainBoxIntersections(f, d[i]);
        1 === j
          ? h.push(new GPoint(this.cuts[0][0], this.cuts[0][1], "single cut"))
          : j > 1 &&
            (h.push(new GPoint(this.cuts[0][0], this.cuts[0][1], "double cut")),
            h.push(new GPoint(this.cuts[1][0], this.cuts[1][1], "double cut")));
      }
      g = h.length;
      var k = [];
      for (c = 0; c < g; c++) {
        k.push(h[c]);
        var l = c + 1 < g ? c + 1 : 0,
          m = h[c].getLabel(),
          n = h[l].getLabel();
        if (
          ("single cut" === m && "single cut" === n) ||
          ("single cut" === m && "double cut" === n) ||
          ("double cut" === m && "single cut" === n)
        ) {
          var o = h[c].getX(),
            p = h[c].getY(),
            q = h[l].getX(),
            r = h[l].getY(),
            s = Math.abs(q - o),
            t = Math.abs(r - p);
          if (s > 0 && t > 0 && s !== this.dim[0] && t !== this.dim[1]) {
            var u = 0 === o || o === this.dim[0] ? o : q,
              v = 0 === p || p === -this.dim[1] ? p : r;
            k.push(new GPoint(u, v, "special cut"));
          }
        }
      }
      if (k.length > 2) {
        for (
          this.parent.push(),
            this.parent.fill(b),
            this.parent.noStroke(),
            this.parent.beginShape(),
            c = 0;
          c < k.length;
          c++
        )
          this.parent.vertex(k[c].getX(), k[c].getY());
        this.parent.endShape(this.parent.CLOSE), this.parent.pop();
      }
    }
  }),
  (GLayer.prototype.drawAnnotation = function (a, b, c, d, e) {
    var f = this.valueToXPlot(b),
      g = this.valueToYPlot(c);
    this.isValidNumber(f) &&
      this.isValidNumber(g) &&
      this.isInside(f, g) &&
      (d !== this.parent.CENTER &&
        d !== this.parent.RIGHT &&
        d !== this.parent.LEFT &&
        (d = this.parent.LEFT),
      e !== this.parent.CENTER &&
        e !== this.parent.TOP &&
        e !== this.parent.BOTTOM &&
        (e = this.parent.CENTER),
      e === this.parent.CENTER &&
        ((e = this.parent.BOTTOM), (g += this.fontSize / 2)),
      this.parent.push(),
      this.parent.textFont(this.fontName),
      this.parent.textSize(this.fontSize),
      this.parent.fill(this.fontColor),
      this.parent.textAlign(d, e),
      this.parent.text(a, f, g),
      this.parent.pop());
  }),
  (GLayer.prototype.setDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.setDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a > 0 &&
      b > 0 &&
      ((this.dim[0] = a),
      (this.dim[1] = b),
      this.updatePlotPoints(),
      void 0 !== this.hist &&
        (this.hist.setDim(this.dim), this.hist.setPlotPoints(this.plotPoints)));
  }),
  (GLayer.prototype.setXLim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.setXLim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a !== b &&
      this.isValidNumber(a) &&
      this.isValidNumber(b) &&
      (this.xLog && (a <= 0 || b <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.xLim[0] = a),
          (this.xLim[1] = b),
          this.updatePlotPoints(),
          this.updateInsideList(),
          void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints)));
  }),
  (GLayer.prototype.setYLim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.setYLim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a !== b &&
      this.isValidNumber(a) &&
      this.isValidNumber(b) &&
      (this.yLog && (a <= 0 || b <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.yLim[0] = a),
          (this.yLim[1] = b),
          this.updatePlotPoints(),
          this.updateInsideList(),
          void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints)));
  }),
  (GLayer.prototype.setXYLim = function () {
    var a, b, c, d;
    if (4 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else {
      if (2 !== arguments.length)
        throw new Error("GLayer.setXYLim(): signature not supported");
      (a = arguments[0][0]),
        (b = arguments[0][1]),
        (c = arguments[1][0]),
        (d = arguments[1][1]);
    }
    a !== b &&
      c !== d &&
      this.isValidNumber(a) &&
      this.isValidNumber(b) &&
      this.isValidNumber(c) &&
      this.isValidNumber(d) &&
      (this.xLog && (a <= 0 || b <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.xLim[0] = a), (this.xLim[1] = b)),
      this.yLog && (c <= 0 || d <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.yLim[0] = c), (this.yLim[1] = d)),
      this.updatePlotPoints(),
      this.updateInsideList(),
      void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints));
  }),
  (GLayer.prototype.setLimAndLog = function () {
    var a, b, c, d, e, f;
    if (6 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]),
        (e = arguments[4]),
        (f = arguments[5]);
    else {
      if (4 !== arguments.length)
        throw new Error("GLayer.setLimAndLog(): signature not supported");
      (a = arguments[0][0]),
        (b = arguments[0][1]),
        (c = arguments[1][0]),
        (d = arguments[1][1]),
        (e = arguments[2]),
        (f = arguments[3]);
    }
    a !== b &&
      c !== d &&
      this.isValidNumber(a) &&
      this.isValidNumber(b) &&
      this.isValidNumber(c) &&
      this.isValidNumber(d) &&
      (e && (a <= 0 || b <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.xLim[0] = a), (this.yLim[1] = b), (this.xLog = e)),
      f && (c <= 0 || d <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.yLim[0] = c), (this.yLim[1] = d), (this.yLog = f)),
      this.updatePlotPoints(),
      this.updateInsideList(),
      void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints));
  }),
  (GLayer.prototype.setXLog = function (a) {
    a !== this.xLog &&
      (a &&
        (this.xLim[0] <= 0 || this.xLim[1] <= 0) &&
        (console.log(
          "One of the limits is negative. This is not allowed in logarithmic scale."
        ),
        console.log("Will set horizontal limits to (0.1, 10)"),
        (this.xLim[0] = 0.1),
        (this.xLim[1] = 10)),
      (this.xLog = a),
      this.updatePlotPoints(),
      this.updateInsideList(),
      void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints));
  }),
  (GLayer.prototype.setYLog = function (a) {
    a !== this.yLog &&
      (a &&
        (this.yLim[0] <= 0 || this.yLim[1] <= 0) &&
        (console.log(
          "One of the limits is negative. This is not allowed in logarithmic scale."
        ),
        console.log("Will set horizontal limits to (0.1, 10)"),
        (this.yLim[0] = 0.1),
        (this.yLim[1] = 10)),
      (this.yLog = a),
      this.updatePlotPoints(),
      this.updateInsideList(),
      void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints));
  }),
  (GLayer.prototype.setPoints = function (a) {
    var b,
      c = a.length;
    if (this.points.length > c) this.points.splice(c, Number.MAX_VALUE);
    else for (b = this.points.length; b < c; b++) this.points[b] = new GPoint();
    for (b = 0; b < c; b++) this.points[b].set(a[b]);
    this.updatePlotPoints(),
      this.updateInsideList(),
      void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints);
  }),
  (GLayer.prototype.setPoint = function () {
    var a,
      b,
      c,
      d,
      e = this.points.length;
    if (4 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else if (3 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = a < e ? this.points[a].getLabel() : "");
    else {
      if (2 !== arguments.length)
        throw new Error("GLayer.setPoint(): signature not supported");
      (a = arguments[0]),
        (b = arguments[1].getX()),
        (c = arguments[1].getY()),
        (d = arguments[1].getLabel());
    }
    if (a < e)
      this.points[a].set(b, c, d),
        this.plotPoints[a].set(this.valueToXPlot(b), this.valueToYPlot(c), d),
        (this.inside[a] = this.isInside(this.plotPoints[a]));
    else {
      if (a !== e)
        throw new Error(
          "GLayer.setPoint(): the index position is outside the array size"
        );
      (this.points[a] = new GPoint(b, c, d)),
        (this.plotPoints[a] = new GPoint(
          this.valueToXPlot(b),
          this.valueToYPlot(c),
          d
        )),
        (this.inside[a] = this.isInside(this.plotPoints[a]));
    }
    void 0 !== this.hist && this.hist.setPlotPoint(a, this.plotPoints[a]);
  }),
  (GLayer.prototype.addPoint = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else if (2 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = "");
    else {
      if (1 !== arguments.length)
        throw new Error("GLayer.addPoint(): signature not supported");
      (a = arguments[0].getX()),
        (b = arguments[0].getY()),
        (c = arguments[0].getLabel());
    }
    this.points.push(new GPoint(a, b, c)),
      this.plotPoints.push(
        new GPoint(this.valueToXPlot(a), this.valueToYPlot(b), c)
      ),
      this.inside.push(
        this.isInside(this.plotPoints[this.plotPoints.length - 1])
      ),
      void 0 !== this.hist &&
        this.hist.addPlotPoint(this.plotPoints[this.plotPoints.length - 1]);
  }),
  (GLayer.prototype.addPoints = function (a) {
    for (var b, c = a.length, d = 0; d < c; d++)
      (b = a[d]),
        this.points.push(new GPoint(b)),
        this.plotPoints.push(
          new GPoint(
            this.valueToXPlot(b.getX()),
            this.valueToYPlot(b.getY()),
            b.getLabel()
          )
        ),
        this.inside.push(
          this.isInside(this.plotPoints[this.plotPoints.length - 1])
        );
    void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints);
  }),
  (GLayer.prototype.addPointAtIndexPos = function () {
    var a, b, c, d;
    if (4 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]), (d = "");
    else {
      if (2 !== arguments.length)
        throw new Error("GLayer.addPointAtIndexPos(): signature not supported");
      (a = arguments[0]),
        (b = arguments[1].getX()),
        (c = arguments[1].getY()),
        (d = arguments[1].getLabel());
    }
    a <= this.points.length &&
      (this.points.splice(a, 0, new GPoint(b, c, d)),
      this.plotPoints.splice(
        a,
        0,
        new GPoint(this.valueToXPlot(b), this.valueToYPlot(c), d)
      ),
      this.inside.splice(a, 0, this.isInside(this.plotPoints[a])),
      void 0 !== this.hist && this.hist.setPlotPoints(this.plotPoints));
  }),
  (GLayer.prototype.removePoint = function (a) {
    a < this.points.length &&
      (this.points.splice(a, 1),
      this.plotPoints.splice(a, 1),
      this.inside.splice(a, 1),
      void 0 !== this.hist && this.hist.removePlotPoint(a));
  }),
  (GLayer.prototype.setInside = function (a) {
    a.length === this.inside.length && (this.inside = a.slice());
  }),
  (GLayer.prototype.setPointColors = function (a) {
    a.length > 0 && (this.pointColors = a.slice());
  }),
  (GLayer.prototype.setPointColor = function (a) {
    this.pointColors = [a];
  }),
  (GLayer.prototype.setPointSizes = function (a) {
    a.length > 0 && (this.pointSizes = a.slice());
  }),
  (GLayer.prototype.setPointSize = function (a) {
    this.pointSizes = [a];
  }),
  (GLayer.prototype.setLineColor = function (a) {
    this.lineColor = a;
  }),
  (GLayer.prototype.setLineWidth = function (a) {
    a > 0 && (this.lineWidth = a);
  }),
  (GLayer.prototype.setHistBasePoint = function (a) {
    this.histBasePoint.set(a);
  }),
  (GLayer.prototype.setHistType = function (a) {
    void 0 !== this.hist && this.hist.setType(a);
  }),
  (GLayer.prototype.setHistVisible = function (a) {
    void 0 !== this.hist && this.hist.setVisible(a);
  }),
  (GLayer.prototype.setDrawHistLabels = function (a) {
    void 0 !== this.hist && this.hist.setDrawLabels(a);
  }),
  (GLayer.prototype.setLabelBgColor = function (a) {
    this.labelBgColor = a;
  }),
  (GLayer.prototype.setLabelSeparation = function (a) {
    (this.labelSeparation[0] = a[0]), (this.labelSeparation[1] = a[1]);
  }),
  (GLayer.prototype.setFontName = function (a) {
    this.fontName = a;
  }),
  (GLayer.prototype.setFontColor = function (a) {
    this.fontColor = a;
  }),
  (GLayer.prototype.setFontSize = function (a) {
    a > 0 && (this.fontSize = a);
  }),
  (GLayer.prototype.setFontProperties = function (a, b, c) {
    c > 0 && ((this.fontName = a), (this.fontColor = b), (this.fontSize = c));
  }),
  (GLayer.prototype.setAllFontProperties = function (a, b, c) {
    this.setFontProperties(a, b, c),
      void 0 !== this.hist && this.hist.setFontProperties(a, b, c);
  }),
  (GLayer.prototype.getId = function () {
    return this.id;
  }),
  (GLayer.prototype.getDim = function () {
    return this.dim.slice();
  }),
  (GLayer.prototype.getXLim = function () {
    return this.xLim.slice();
  }),
  (GLayer.prototype.getYLim = function () {
    return this.yLim.slice();
  }),
  (GLayer.prototype.getXLog = function () {
    return this.xLog;
  }),
  (GLayer.prototype.getYLog = function () {
    return this.yLog;
  }),
  (GLayer.prototype.getPoints = function () {
    for (var a = [], b = 0; b < this.points.length; b++)
      a[b] = new GPoint(this.points[b]);
    return a;
  }),
  (GLayer.prototype.getPointsRef = function () {
    return this.points;
  }),
  (GLayer.prototype.getPointColors = function () {
    return this.pointColors.slice();
  }),
  (GLayer.prototype.getPointSizes = function () {
    return this.pointSizes.slice();
  }),
  (GLayer.prototype.getLineColor = function () {
    return this.lineColor;
  }),
  (GLayer.prototype.getLineWidth = function () {
    return this.lineWidth;
  }),
  (GLayer.prototype.getHistogram = function () {
    return this.hist;
  }),
  (GPlot.MAINLAYERID = "main layer"),
  (GPlot.VERTICAL = 0),
  (GPlot.HORIZONTAL = 1),
  (GPlot.BOTH = 2),
  (GPlot.NONE = 0),
  (GPlot.prototype.addLayer = function () {
    var a, b;
    if (2 === arguments.length)
      (a = arguments[0]),
        (b = new GLayer(
          this.parent,
          a,
          this.dim,
          this.xLim,
          this.yLim,
          this.xLog,
          this.yLog
        )),
        b.setPoints(arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.addLayer(): signature not supported");
      (a = arguments[0].getId()), (b = arguments[0]);
    }
    var c = !1;
    if (this.mainLayer.isId(a)) c = !0;
    else
      for (var d = 0; d < this.layerList.length; d++)
        if (this.layerList[d].isId(a)) {
          c = !0;
          break;
        }
    c
      ? console.log(
          "A layer with the same id exists. Please change the id and try to add it again."
        )
      : (b.setDim(this.dim),
        b.setLimAndLog(this.xLim, this.yLim, this.xLog, this.yLog),
        this.layerList.push(b),
        this.includeAllLayersInLim && this.updateLimits());
  }),
  (GPlot.prototype.removeLayer = function (a) {
    for (var b, c = 0; c < this.layerList.length; c++)
      if (this.layerList[c].isId(a)) {
        b = c;
        break;
      }
    void 0 !== b
      ? (this.layerList.splice(b, 1),
        this.includeAllLayersInLim && this.updateLimits())
      : console.log("Couldn't find a layer in the plot with id = " + a);
  }),
  (GPlot.prototype.getPlotPosAt = function (a, b) {
    return [
      a - (this.pos[0] + this.mar[1]),
      b - (this.pos[1] + this.mar[2] + this.dim[1]),
    ];
  }),
  (GPlot.prototype.getScreenPosAtValue = function (a, b) {
    return [
      this.mainLayer.valueToXPlot(a) + (this.pos[0] + this.mar[1]),
      this.mainLayer.valueToYPlot(b) +
        (this.pos[1] + this.mar[2] + this.dim[1]),
    ];
  }),
  (GPlot.prototype.getPointAt = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = this.getLayer(arguments[2]));
    else {
      if (2 !== arguments.length)
        throw new Error("GPlot.getPointAt(): signature not supported");
      (a = arguments[0]), (b = arguments[1]), (c = this.mainLayer);
    }
    var d = this.getPlotPosAt(a, b);
    return c.getPointAtPlotPos(d[0], d[1]);
  }),
  (GPlot.prototype.addPointAt = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else {
      if (2 !== arguments.length)
        throw new Error("GPlot.addPointAt(): signature not supported");
      (a = arguments[0]), (b = arguments[1]), (c = GPlot.MAINLAYERID);
    }
    var d = this.getValueAt(a, b);
    this.addPoint(d[0], d[1], "", c);
  }),
  (GPlot.prototype.removePointAt = function () {
    var a, b, c;
    if (3 === arguments.length)
      (a = arguments[0]), (b = arguments[1]), (c = arguments[2]);
    else {
      if (2 !== arguments.length)
        throw new Error("GPlot.removePointAt(): signature not supported");
      (a = arguments[0]), (b = arguments[1]), (c = GPlot.MAINLAYERID);
    }
    var d = this.getPlotPosAt(a, b),
      e = this.getLayer(c).getPointIndexAtPlotPos(d[0], d[1]);
    void 0 !== e && this.removePoint(e, c);
  }),
  (GPlot.prototype.getValueAt = function (a, b) {
    var c = this.getPlotPosAt(a, b);
    return this.mainLayer.plotToValue(c[0], c[1]);
  }),
  (GPlot.prototype.getRelativePlotPosAt = function (a, b) {
    var c = this.getPlotPosAt(a, b);
    return [c[0] / this.dim[0], -c[1] / this.dim[1]];
  }),
  (GPlot.prototype.isOverPlot = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.isOverPlot(): signature not supported");
      (a = this.parent.mouseX), (b = this.parent.mouseY);
    }
    return (
      a >= this.pos[0] &&
      a <= this.pos[0] + this.outerDim[0] &&
      b >= this.pos[1] &&
      b <= this.pos[1] + this.outerDim[1]
    );
  }),
  (GPlot.prototype.isOverBox = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.isOverBox(): signature not supported");
      (a = this.parent.mouseX), (b = this.parent.mouseY);
    }
    return (
      a >= this.pos[0] + this.mar[1] &&
      a <= this.pos[0] + this.outerDim[0] - this.mar[3] &&
      b >= this.pos[1] + this.mar[2] &&
      b <= this.pos[1] + this.outerDim[1] - this.mar[0]
    );
  }),
  (GPlot.prototype.updateLimits = function () {
    this.fixedXLim ||
      ((this.xLim = this.calculatePlotXLim()),
      this.xAxis.setLim(this.xLim),
      this.topAxis.setLim(this.xLim)),
      this.fixedYLim ||
        ((this.yLim = this.calculatePlotYLim()),
        this.yAxis.setLim(this.yLim),
        this.rightAxis.setLim(this.yLim)),
      this.mainLayer.setXYLim(this.xLim, this.yLim);
    for (var a = 0; a < this.layerList.length; a++)
      this.layerList[a].setXYLim(this.xLim, this.yLim);
  }),
  (GPlot.prototype.calculatePlotXLim = function () {
    var a = this.calculatePointsXLim(this.mainLayer.getPointsRef());
    if (this.includeAllLayersInLim)
      for (var b = 0; b < this.layerList.length; b++) {
        var c = this.calculatePointsXLim(this.layerList[b].getPointsRef());
        void 0 !== c &&
          (void 0 !== a
            ? ((a[0] = Math.min(a[0], c[0])), (a[1] = Math.max(a[1], c[1])))
            : (a = c));
      }
    if (void 0 !== a) {
      var d = 0 === a[0] ? 0.1 : 0.1 * a[0];
      this.xLog
        ? (a[0] !== a[1] &&
            (d = Math.exp(this.expandLimFactor * Math.log(a[1] / a[0]))),
          (a[0] = a[0] / d),
          (a[1] = a[1] * d))
        : (a[0] !== a[1] && (d = this.expandLimFactor * (a[1] - a[0])),
          (a[0] = a[0] - d),
          (a[1] = a[1] + d));
    } else
      a =
        this.xLog && (this.xLim[0] <= 0 || this.xLim[1] <= 0)
          ? [0.1, 10]
          : this.xLim.slice();
    return this.invertedXScale && a[0] < a[1] && (a = [a[1], a[0]]), a;
  }),
  (GPlot.prototype.calculatePlotYLim = function () {
    var a = this.calculatePointsYLim(this.mainLayer.getPointsRef());
    if (this.includeAllLayersInLim)
      for (var b = 0; b < this.layerList.length; b++) {
        var c = this.calculatePointsYLim(this.layerList[b].getPointsRef());
        void 0 !== c &&
          (void 0 !== a
            ? ((a[0] = Math.min(a[0], c[0])), (a[1] = Math.max(a[1], c[1])))
            : (a = c));
      }
    if (void 0 !== a) {
      var d = 0 === a[0] ? 0.1 : 0.1 * a[0];
      this.yLog
        ? (a[0] !== a[1] &&
            (d = Math.exp(this.expandLimFactor * Math.log(a[1] / a[0]))),
          (a[0] = a[0] / d),
          (a[1] = a[1] * d))
        : (a[0] !== a[1] && (d = this.expandLimFactor * (a[1] - a[0])),
          (a[0] = a[0] - d),
          (a[1] = a[1] + d));
    } else
      a =
        this.yLog && (this.yLim[0] <= 0 || this.yLim[1] <= 0)
          ? [0.1, 10]
          : this.yLim.slice();
    return this.invertedYScale && a[0] < a[1] && (a = [a[1], a[0]]), a;
  }),
  (GPlot.prototype.calculatePointsXLim = function (a) {
    for (
      var b = [Number.MAX_VALUE, -Number.MAX_VALUE], c = 0;
      c < a.length;
      c++
    )
      if (a[c].isValid()) {
        var d = a[c].getX(),
          e = a[c].getY(),
          f = !0;
        this.fixedYLim &&
          (f =
            (this.yLim[1] >= this.yLim[0] &&
              e >= this.yLim[0] &&
              e <= this.yLim[1]) ||
            (this.yLim[1] < this.yLim[0] &&
              e <= this.yLim[0] &&
              e >= this.yLim[1])),
          !f ||
            (this.xLog && d <= 0) ||
            (d < b[0] && (b[0] = d), d > b[1] && (b[1] = d));
      }
    return b[1] < b[0] && (b = void 0), b;
  }),
  (GPlot.prototype.calculatePointsYLim = function (a) {
    for (
      var b = [Number.MAX_VALUE, -Number.MAX_VALUE], c = 0;
      c < a.length;
      c++
    )
      if (a[c].isValid()) {
        var d = a[c].getX(),
          e = a[c].getY(),
          f = !0;
        this.fixedXLim &&
          (f =
            (this.xLim[1] >= this.xLim[0] &&
              d >= this.xLim[0] &&
              d <= this.xLim[1]) ||
            (this.xLim[1] < this.xLim[0] &&
              d <= this.xLim[0] &&
              d >= this.xLim[1])),
          !f ||
            (this.yLog && e <= 0) ||
            (e < b[0] && (b[0] = e), e > b[1] && (b[1] = e));
      }
    return b[1] < b[0] && (b = void 0), b;
  });
(GPlot.prototype.moveHorizontalAxesLim = function (a) {
  var b;
  this.xLog
    ? ((b = Math.exp(
        (Math.log(this.xLim[1] / this.xLim[0]) * a) / this.dim[0]
      )),
      (this.xLim[0] *= b),
      (this.xLim[1] *= b))
    : ((b = ((this.xLim[1] - this.xLim[0]) * a) / this.dim[0]),
      (this.xLim[0] += b),
      (this.xLim[1] += b)),
    (this.fixedXLim = !0),
    (this.fixedYLim = !0),
    this.xAxis.moveLim(this.xLim),
    this.topAxis.moveLim(this.xLim),
    this.updateLimits();
}),
  (GPlot.prototype.moveVerticalAxesLim = function (a) {
    var b;
    this.yLog
      ? ((b = Math.exp(
          (Math.log(this.yLim[1] / this.yLim[0]) * a) / this.dim[1]
        )),
        (this.yLim[0] *= b),
        (this.yLim[1] *= b))
      : ((b = ((this.yLim[1] - this.yLim[0]) * a) / this.dim[1]),
        (this.yLim[0] += b),
        (this.yLim[1] += b)),
      (this.fixedXLim = !0),
      (this.fixedYLim = !0),
      this.yAxis.moveLim(this.yLim),
      this.rightAxis.moveLim(this.yLim),
      this.updateLimits();
  }),
  (GPlot.prototype.centerAndZoom = function (a, b, c) {
    var d;
    this.xLog
      ? ((d = Math.exp(Math.log(this.xLim[1] / this.xLim[0]) / (2 * a))),
        (this.xLim = [b / d, b * d]))
      : ((d = (this.xLim[1] - this.xLim[0]) / (2 * a)),
        (this.xLim = [b - d, b + d])),
      this.yLog
        ? ((d = Math.exp(Math.log(this.yLim[1] / this.yLim[0]) / (2 * a))),
          (this.yLim = [c / d, c * d]))
        : ((d = (this.yLim[1] - this.yLim[0]) / (2 * a)),
          (this.yLim = [c - d, c + d])),
      (this.fixedXLim = !0),
      (this.fixedYLim = !0),
      this.xAxis.setLim(this.xLim),
      this.topAxis.setLim(this.xLim),
      this.yAxis.setLim(this.yLim),
      this.rightAxis.setLim(this.yLim),
      this.updateLimits();
  }),
  (GPlot.prototype.zoom = function () {
    var a, b, c;
    if (3 === arguments.length) {
      a = arguments[0];
      var d = arguments[1],
        e = arguments[2],
        f = this.getPlotPosAt(d, e),
        g = this.mainLayer.plotToValue(f[0], f[1]);
      this.xLog
        ? ((b = Math.exp(Math.log(this.xLim[1] / this.xLim[0]) / (2 * a))),
          (c = Math.exp(
            (Math.log(this.xLim[1] / this.xLim[0]) / a) *
              (0.5 - f[0] / this.dim[0])
          )),
          (this.xLim = [(g[0] * c) / b, g[0] * c * b]))
        : ((b = (this.xLim[1] - this.xLim[0]) / (2 * a)),
          (c = 2 * b * (0.5 - f[0] / this.dim[0])),
          (this.xLim = [g[0] + c - b, g[0] + c + b])),
        this.yLog
          ? ((b = Math.exp(Math.log(this.yLim[1] / this.yLim[0]) / (2 * a))),
            (c = Math.exp(
              (Math.log(this.yLim[1] / this.yLim[0]) / a) *
                (0.5 + f[1] / this.dim[1])
            )),
            (this.yLim = [(g[1] * c) / b, g[1] * c * b]))
          : ((b = (this.yLim[1] - this.yLim[0]) / (2 * a)),
            (c = 2 * b * (0.5 + f[1] / this.dim[1])),
            (this.yLim = [g[1] + c - b, g[1] + c + b])),
        (this.fixedXLim = !0),
        (this.fixedYLim = !0),
        this.xAxis.setLim(this.xLim),
        this.topAxis.setLim(this.xLim),
        this.yAxis.setLim(this.yLim),
        this.rightAxis.setLim(this.yLim),
        this.updateLimits();
    } else {
      if (1 !== arguments.length)
        throw new Error("GPlot.zoom(): signature not supported");
      a = arguments[0];
      var h = this.mainLayer.plotToValue(this.dim[0] / 2, -this.dim[1] / 2);
      this.centerAndZoom(a, h[0], h[1]);
    }
  }),
  (GPlot.prototype.shiftPlotPos = function (a, b) {
    var c,
      d = a[0] - b[0],
      e = a[1] - b[1];
    this.xLog
      ? ((c = Math.exp(
          (Math.log(this.xLim[1] / this.xLim[0]) * d) / this.dim[0]
        )),
        (this.xLim = [this.xLim[0] * c, this.xLim[1] * c]))
      : ((c = ((this.xLim[1] - this.xLim[0]) * d) / this.dim[0]),
        (this.xLim = [this.xLim[0] + c, this.xLim[1] + c])),
      this.yLog
        ? ((c = Math.exp(
            (-Math.log(this.yLim[1] / this.yLim[0]) * e) / this.dim[1]
          )),
          (this.yLim = [this.yLim[0] * c, this.yLim[1] * c]))
        : ((c = (-(this.yLim[1] - this.yLim[0]) * e) / this.dim[1]),
          (this.yLim = [this.yLim[0] + c, this.yLim[1] + c])),
      (this.fixedXLim = !0),
      (this.fixedYLim = !0),
      this.xAxis.moveLim(this.xLim),
      this.topAxis.moveLim(this.xLim),
      this.yAxis.moveLim(this.yLim),
      this.rightAxis.moveLim(this.yLim),
      this.updateLimits();
  }),
  (GPlot.prototype.align = function () {
    var a, b, c, d;
    if (4 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else {
      if (3 !== arguments.length)
        throw new Error("GPlot.align(): signature not supported");
      (a = arguments[0][0]),
        (b = arguments[0][1]),
        (c = arguments[1]),
        (d = arguments[2]);
    }
    var e = this.mainLayer.valueToPlot(a, b),
      f = this.getPlotPosAt(c, d);
    this.shiftPlotPos(e, f);
  }),
  (GPlot.prototype.center = function (a, b) {
    var c = this.getPlotPosAt(a, b),
      d = [this.dim[0] / 2, -this.dim[1] / 2];
    this.shiftPlotPos(c, d);
  }),
  (GPlot.prototype.startHistograms = function (a) {
    this.mainLayer.startHistogram(a);
    for (var b = 0; b < this.layerList.length; b++)
      this.layerList[b].startHistogram(a);
  }),
  (GPlot.prototype.defaultDraw = function () {
    this.beginDraw(),
      this.drawBackground(),
      this.drawBox(),
      this.drawXAxis(),
      this.drawYAxis(),
      this.drawTitle(),
      this.drawLines(),
      this.drawPoints(),
      this.endDraw();
  }),
  (GPlot.prototype.beginDraw = function () {
    this.parent.push(),
      this.parent.translate(
        this.pos[0] + this.mar[1],
        this.pos[1] + this.mar[2] + this.dim[1]
      );
  }),
  (GPlot.prototype.endDraw = function () {
    this.parent.pop();
  }),
  (GPlot.prototype.drawBackground = function () {
    this.parent.push(),
      this.parent.rectMode(this.parent.CORNER),
      this.parent.fill(this.bgColor),
      this.parent.noStroke(),
      this.parent.rect(
        -this.mar[1],
        -this.mar[2] - this.dim[1],
        this.outerDim[0],
        this.outerDim[1]
      ),
      this.parent.pop();
  }),
  (GPlot.prototype.drawBox = function () {
    this.parent.push(),
      this.parent.rectMode(this.parent.CORNER),
      this.parent.fill(this.boxBgColor),
      this.parent.stroke(this.boxLineColor),
      this.parent.strokeWeight(this.boxLineWidth),
      this.parent.strokeCap(this.parent.SQUARE),
      this.parent.rect(0, -this.dim[1], this.dim[0], this.dim[1]),
      this.parent.pop();
  }),
  (GPlot.prototype.drawXAxis = function () {
    this.xAxis.draw();
  }),
  (GPlot.prototype.drawYAxis = function () {
    this.yAxis.draw();
  }),
  (GPlot.prototype.drawTopAxis = function () {
    this.topAxis.draw();
  }),
  (GPlot.prototype.drawRightAxis = function () {
    this.rightAxis.draw();
  }),
  (GPlot.prototype.drawTitle = function () {
    this.title.draw();
  }),
  (GPlot.prototype.drawPoints = function () {
    var a;
    if (1 === arguments.length)
      for (
        this.mainLayer.drawPoints(arguments[0]), a = 0;
        a < this.layerList.length;
        a++
      )
        this.layerList[0].drawPoints(arguments[0]);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.drawPoints(): signature not supported");
      for (this.mainLayer.drawPoints(), a = 0; a < this.layerList.length; a++)
        this.layerList[a].drawPoints();
    }
  }),
  (GPlot.prototype.drawPoint = function () {
    if (3 === arguments.length)
      this.mainLayer.drawPoint(arguments[0], arguments[1], arguments[2]);
    else if (2 === arguments.length)
      this.mainLayer.drawPoint(arguments[0], arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.drawPoint(): signature not supported");
      this.mainLayer.drawPoint(arguments[0]);
    }
  }),
  (GPlot.prototype.drawLines = function () {
    this.mainLayer.drawLines();
    for (var a = 0; a < this.layerList.length; a++)
      this.layerList[a].drawLines();
  }),
  (GPlot.prototype.drawLine = function () {
    if (4 === arguments.length)
      this.mainLayer.drawLine(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3]
      );
    else {
      if (2 !== arguments.length)
        throw new Error("GPlot.drawLine(): signature not supported");
      this.mainLayer.drawLine(arguments[0], arguments[1]);
    }
  }),
  (GPlot.prototype.drawHorizontalLine = function () {
    if (3 === arguments.length)
      this.mainLayer.drawHorizontalLine(
        arguments[0],
        arguments[1],
        arguments[2]
      );
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.drawHorizontalLine(): signature not supported");
      this.mainLayer.drawHorizontalLine(arguments[0]);
    }
  }),
  (GPlot.prototype.drawVerticalLine = function () {
    if (3 === arguments.length)
      this.mainLayer.drawVerticalLine(arguments[0], arguments[1], arguments[2]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.drawVerticalLine(): signature not supported");
      this.mainLayer.drawVerticalLine(arguments[0]);
    }
  }),
  (GPlot.prototype.drawFilledContours = function (a, b) {
    this.mainLayer.drawFilledContour(a, b);
    for (var c = 0; c < this.layerList.length; c++)
      this.layerList[c].drawFilledContour(a, b);
  }),
  (GPlot.prototype.drawLabel = function (a) {
    this.mainLayer.drawLabel(a);
  }),
  (GPlot.prototype.drawLabelsAt = function (a, b) {
    var c = this.getPlotPosAt(a, b);
    this.mainLayer.drawLabelAtPlotPos(c[0], c[1]);
    for (var d = 0; d < this.layerList.length; d++)
      this.layerList[d].drawLabelAtPlotPos(c[0], c[1]);
  }),
  (GPlot.prototype.drawLabels = function () {
    this.labelingIsActive &&
      void 0 !== this.mousePos &&
      this.drawLabelsAt(this.mousePos[0], this.mousePos[1]);
  }),
  (GPlot.prototype.drawGridLines = function (a) {
    var b;
    if (
      (this.parent.push(),
      this.parent.noFill(),
      this.parent.stroke(this.gridLineColor),
      this.parent.strokeWeight(this.gridLineWidth),
      this.parent.strokeCap(this.parent.SQUARE),
      a === GPlot.BOTH || a === GPlot.VERTICAL)
    ) {
      var c = this.xAxis.getPlotTicksRef();
      for (b = 0; b < c.length; b++)
        c[b] >= 0 &&
          c[b] <= this.dim[0] &&
          this.parent.line(c[b], 0, c[b], -this.dim[1]);
    }
    if (a === GPlot.BOTH || a === GPlot.HORIZONTAL) {
      var d = this.yAxis.getPlotTicksRef();
      for (b = 0; b < d.length; b++)
        -d[b] >= 0 &&
          -d[b] <= this.dim[1] &&
          this.parent.line(0, d[b], this.dim[0], d[b]);
    }
    this.parent.pop();
  }),
  (GPlot.prototype.drawHistograms = function () {
    this.mainLayer.drawHistogram();
    for (var a = 0; a < this.layerList.length; a++)
      this.layerList[a].drawHistogram();
  }),
  (GPlot.prototype.drawPolygon = function (a, b) {
    this.mainLayer.drawPolygon(a, b);
  }),
  (GPlot.prototype.drawAnnotation = function (a, b, c, d, e) {
    this.mainLayer.drawAnnotation(a, b, c, d, e);
  }),
  (GPlot.prototype.drawLegend = function (a, b, c) {
    var d = 14;
    this.parent.push(),
      this.parent.rectMode(this.parent.CENTER),
      this.parent.noStroke();
    for (var e = 0; e < a.length; e++) {
      var f = [b[e] * this.dim[0], -c[e] * this.dim[1]],
        g = this.mainLayer.plotToValue(f[0] + d, f[1]);
      0 === e
        ? (this.parent.fill(this.mainLayer.getLineColor()),
          this.parent.rect(f[0], f[1], d, d),
          this.mainLayer.drawAnnotation(
            a[e],
            g[0],
            g[1],
            this.parent.LEFT,
            this.parent.CENTER
          ))
        : (this.parent.fill(this.layerList[e - 1].getLineColor()),
          this.parent.rect(f[0], f[1], d, d),
          this.layerList[e - e].drawAnnotation(
            a[e],
            g[0],
            g[1],
            this.parent.LEFT,
            this.parent.CENTER
          ));
    }
    this.parent.pop();
  }),
  (GPlot.prototype.setPos = function () {
    if (2 === arguments.length)
      (this.pos[0] = arguments[0]), (this.pos[1] = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setPos(): signature not supported");
      (this.pos[0] = arguments[0][0]), (this.pos[1] = arguments[0][1]);
    }
  }),
  (GPlot.prototype.setOuterDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setOuterDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    if (a > 0 && b > 0) {
      var c = a - this.mar[1] - this.mar[3],
        d = b - this.mar[0] - this.mar[2];
      if (c > 0 && d > 0) {
        (this.outerDim[0] = a),
          (this.outerDim[1] = b),
          (this.dim[0] = c),
          (this.dim[1] = d),
          this.xAxis.setDim(this.dim),
          this.topAxis.setDim(this.dim),
          this.yAxis.setDim(this.dim),
          this.rightAxis.setDim(this.dim),
          this.title.setDim(this.dim),
          this.mainLayer.setDim(this.dim);
        for (var e = 0; e < this.layerList.lenght; e++)
          this.layerList[e].setDim(this.dim);
      }
    }
  }),
  (GPlot.prototype.setMar = function () {
    var a, b, c, d;
    if (4 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setMar(): signature not supported");
      (a = arguments[0][0]),
        (b = arguments[0][1]),
        (c = arguments[0][2]),
        (d = arguments[0][3]);
    }
    var e = this.dim[0] + b + d,
      f = this.dim[1] + a + c;
    e > 0 &&
      f > 0 &&
      ((this.mar[0] = a),
      (this.mar[1] = b),
      (this.mar[2] = c),
      (this.mar[3] = d),
      (this.outerDim[0] = e),
      (this.outerDim[1] = f));
  }),
  (GPlot.prototype.setDim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setDim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    if (a > 0 && b > 0) {
      var c = a + this.mar[1] + this.mar[3],
        d = b + this.mar[0] + this.mar[2];
      if (c > 0 && d > 0) {
        (this.outerDim[0] = c),
          (this.outerDim[1] = d),
          (this.dim[0] = a),
          (this.dim[1] = b),
          this.xAxis.setDim(this.dim),
          this.topAxis.setDim(this.dim),
          this.yAxis.setDim(this.dim),
          this.rightAxis.setDim(this.dim),
          this.title.setDim(this.dim),
          this.mainLayer.setDim(this.dim);
        for (var e = 0; e < this.layerList.length; e++)
          this.layerList[e].setDim(this.dim);
      }
    }
  }),
  (GPlot.prototype.setXLim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setXLim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a !== b &&
      (this.xLog && (a <= 0 || b <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.xLim[0] = a),
          (this.xLim[1] = b),
          (this.invertedXScale = this.xLim[0] > this.xLim[1]),
          (this.fixedXLim = !0),
          this.xAxis.setLim(this.xLim),
          this.topAxis.setLim(this.xLim),
          this.updateLimits()));
  }),
  (GPlot.prototype.setYLim = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setYLim(): signature not supported");
      (a = arguments[0][0]), (b = arguments[0][1]);
    }
    a !== b &&
      (this.yLog && (a <= 0 || b <= 0)
        ? console.log(
            "One of the limits is negative. This is not allowed in logarithmic scale."
          )
        : ((this.yLim[0] = a),
          (this.yLim[1] = b),
          (this.invertedYScale = this.yLim[0] > this.yLim[1]),
          (this.fixedYLim = !0),
          this.yAxis.setLim(this.yLim),
          this.rightAxis.setLim(this.yLim),
          this.updateLimits()));
  }),
  (GPlot.prototype.setFixedXLim = function (a) {
    (this.fixedXLim = a), this.updateLimits();
  }),
  (GPlot.prototype.setFixedYLim = function (a) {
    (this.fixedYLim = a), this.updateLimits();
  }),
  (GPlot.prototype.setLogScale = function (a) {
    var b = this.xLog,
      c = this.yLog;
    if (
      ("xy" === a || "yx" === a
        ? ((b = !0), (c = !0))
        : "x" === a
        ? ((b = !0), (c = !1))
        : "y" === a
        ? ((b = !1), (c = !0))
        : "" === a && ((b = !1), (c = !1)),
      b !== this.xLog || c !== this.yLog)
    ) {
      (this.xLog = b),
        (this.yLog = c),
        this.xLog &&
          this.fixedXLim &&
          (this.xLim[0] <= 0 || this.xLim[1] <= 0) &&
          (this.fixedXLim = !1),
        this.yLog &&
          this.fixedYLim &&
          (this.yLim[0] <= 0 || this.yLim[1] <= 0) &&
          (this.fixedYLim = !1),
        this.fixedXLim || (this.xLim = this.calculatePlotXLim()),
        this.fixedYLim || (this.yLim = this.calculatePlotYLim()),
        this.xAxis.setLimAndLog(this.xLim, this.xLog),
        this.topAxis.setLimAndLog(this.xLim, this.xLog),
        this.yAxis.setLimAndLog(this.yLim, this.yLog),
        this.rightAxis.setLimAndLog(this.yLim, this.yLog),
        this.mainLayer.setLimAndLog(this.xLim, this.yLim, this.xLog, this.yLog);
      for (var d = 0; d < this.layerList.length; d++)
        this.layerList[d].setLimAndLog(
          this.xLim,
          this.yLim,
          this.xLog,
          this.yLog
        );
    }
  }),
  (GPlot.prototype.setInvertedXScale = function (a) {
    if (a !== this.invertedXScale) {
      this.invertedXScale = a;
      var b = this.xLim[0];
      (this.xLim[0] = this.xLim[1]),
        (this.xLim[1] = b),
        this.xAxis.setLim(this.xLim),
        this.topAxis.setLim(this.xLim),
        this.mainLayer.setXLim(this.xLim);
      for (var c = 0; c < this.layerList.length; c++)
        this.layerList[c].setXLim(this.xLim);
    }
  }),
  (GPlot.prototype.invertXScale = function () {
    this.setInvertedXScale(!this.invertedXScale);
  }),
  (GPlot.prototype.setInvertedYScale = function (a) {
    if (a !== this.invertedYScale) {
      this.invertedYScale = a;
      var b = this.yLim[0];
      (this.yLim[0] = this.yLim[1]),
        (this.yLim[1] = b),
        this.yAxis.setLim(this.yLim),
        this.rightAxis.setLim(this.yLim),
        this.mainLayer.setYLim(this.yLim);
      for (var c = 0; c < this.layerList.length; c++)
        this.layerList[c].setYLim(this.yLim);
    }
  }),
  (GPlot.prototype.invertYScale = function () {
    this.setInvertedYScale(!this.invertedYScale);
  }),
  (GPlot.prototype.setIncludeAllLayersInLim = function (a) {
    a !== this.includeAllLayersInLim &&
      ((this.includeAllLayersInLim = a), this.updateLimits());
  }),
  (GPlot.prototype.setExpandLimFactor = function (a) {
    a >= 0 &&
      a !== this.expandLimFactor &&
      ((this.expandLimFactor = a), this.updateLimits());
  }),
  (GPlot.prototype.setBgColor = function (a) {
    this.bgColor = a;
  }),
  (GPlot.prototype.setBoxBgColor = function (a) {
    this.boxBgColor = a;
  }),
  (GPlot.prototype.setBoxLineColor = function (a) {
    this.boxLineColor = a;
  }),
  (GPlot.prototype.setBoxLineWidth = function (a) {
    a > 0 && (this.boxLineWidth = a);
  }),
  (GPlot.prototype.setGridLineColor = function (a) {
    this.gridLineColor = a;
  }),
  (GPlot.prototype.setGridLineWidth = function (a) {
    a > 0 && (this.gridLineWidth = a);
  }),
  (GPlot.prototype.setPoints = function () {
    if (2 === arguments.length)
      this.getLayer(arguments[1]).setPoints(arguments[0]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.setPoints(): signature not supported");
      this.mainLayer.setPoints(arguments[0]);
    }
    this.updateLimits();
  }),
  (GPlot.prototype.setPoint = function () {
    if (5 === arguments.length)
      this.getLayer(arguments[4]).setPoint(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3]
      );
    else if (4 === arguments.length)
      this.mainLayer.setPoint(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3]
      );
    else if (3 === arguments.length && arguments[1] instanceof GPoint)
      this.getLayer(arguments[2]).setPoint(arguments[0], arguments[1]);
    else if (3 === arguments.length)
      this.mainLayer.setPoint(arguments[0], arguments[1], arguments[2]);
    else {
      if (2 !== arguments.length)
        throw new Error("GPlot.setPoint(): signature not supported");
      this.mainLayer.setPoint(arguments[0], arguments[1]);
    }
    this.updateLimits();
  }),
  (GPlot.prototype.addPoint = function () {
    if (4 === arguments.length)
      this.getLayer(arguments[3]).addPoint(
        arguments[0],
        arguments[1],
        arguments[2]
      );
    else if (3 === arguments.length)
      this.mainLayer.addPoint(arguments[0], arguments[1], arguments[2]);
    else if (2 === arguments.length && arguments[0] instanceof GPoint)
      this.getLayer(arguments[1]).addPoint(arguments[0]);
    else if (2 === arguments.length)
      this.mainLayer.addPoint(arguments[0], arguments[1]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.addPoint(): signature not supported");
      this.mainLayer.addPoint(arguments[0]);
    }
    this.updateLimits();
  }),
  (GPlot.prototype.addPoints = function () {
    if (2 === arguments.length)
      this.getLayer(arguments[1]).addPoints(arguments[0]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.addPoints(): signature not supported");
      this.mainLayer.addPoints(arguments[0]);
    }
    this.updateLimits();
  }),
  (GPlot.prototype.removePoint = function () {
    if (2 === arguments.length)
      this.getLayer(arguments[1]).removePoint(arguments[0]);
    else {
      if (1 !== arguments.length)
        throw new Error("GPlot.removePoint(): signature not supported");
      this.mainLayer.removePoint(arguments[0]);
    }
    this.updateLimits();
  }),
  (GPlot.prototype.addPointAtIndexPos = function () {
    if (5 === arguments.length)
      this.getLayer(arguments[4]).addPointAtIndexPos(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3]
      );
    else if (4 === arguments.length)
      this.mainLayer.addPointAtIndexPos(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3]
      );
    else if (3 === arguments.length && arguments[1] instanceof GPoint)
      this.getLayer(arguments[2]).addPointAtIndexPos(
        arguments[0],
        arguments[1]
      );
    else if (3 === arguments.length)
      this.mainLayer.addPointAtIndexPos(
        arguments[0],
        arguments[1],
        arguments[2]
      );
    else {
      if (2 !== arguments.length)
        throw new Error("GPlot.addPointAtIndexPos(): signature not supported");
      this.mainLayer.addPointAtIndexPos(arguments[0], arguments[1]);
    }
    this.updateLimits();
  }),
  (GPlot.prototype.setPointColors = function (a) {
    this.mainLayer.setPointColors(a);
  }),
  (GPlot.prototype.setPointColor = function (a) {
    this.mainLayer.setPointColor(a);
  }),
  (GPlot.prototype.setPointSizes = function (a) {
    this.mainLayer.setPointSizes(a);
  }),
  (GPlot.prototype.setPointSize = function (a) {
    this.mainLayer.setPointSize(a);
  }),
  (GPlot.prototype.setLineColor = function (a) {
    this.mainLayer.setLineColor(a);
  }),
  (GPlot.prototype.setLineWidth = function (a) {
    this.mainLayer.setLineWidth(a);
  }),
  (GPlot.prototype.setHistBasePoint = function (a) {
    this.mainLayer.setHistBasePoint(a);
  }),
  (GPlot.prototype.setHistType = function (a) {
    this.mainLayer.setHistType(a);
  }),
  (GPlot.prototype.setHistVisible = function (a) {
    this.mainLayer.setHistVisible(a);
  }),
  (GPlot.prototype.setDrawHistLabels = function (a) {
    this.mainLayer.setDrawHistLabels(a);
  }),
  (GPlot.prototype.setLabelBgColor = function (a) {
    this.mainLayer.setLabelBgColor(a);
  }),
  (GPlot.prototype.setLabelSeparation = function (a) {
    this.mainLayer.setLabelSeparation(a);
  }),
  (GPlot.prototype.setTitleText = function (a) {
    this.title.setText(a);
  }),
  (GPlot.prototype.setAxesOffset = function (a) {
    this.xAxis.setOffset(a),
      this.topAxis.setOffset(a),
      this.yAxis.setOffset(a),
      this.rightAxis.setOffset(a);
  }),
  (GPlot.prototype.setTicksLength = function (a) {
    this.xAxis.setTickLength(a),
      this.topAxis.setTickLength(a),
      this.yAxis.setTickLength(a),
      this.rightAxis.setTickLength(a);
  }),
  (GPlot.prototype.setHorizontalAxesNTicks = function (a) {
    this.xAxis.setNTicks(a), this.topAxis.setNTicks(a);
  }),
  (GPlot.prototype.setHorizontalAxesTicksSeparation = function (a) {
    this.xAxis.setTicksSeparation(a), this.topAxis.setTicksSeparation(a);
  }),
  (GPlot.prototype.setHorizontalAxesTicks = function (a) {
    this.xAxis.setTicks(a), this.topAxis.setTicks(a);
  }),
  (GPlot.prototype.setVerticalAxesNTicks = function (a) {
    this.yAxis.setNTicks(a), this.rightAxis.setNTicks(a);
  }),
  (GPlot.prototype.setVerticalAxesTicksSeparation = function (a) {
    this.yAxis.setTicksSeparation(a), this.rightAxis.setTicksSeparation(a);
  }),
  (GPlot.prototype.setVerticalAxesTicks = function (a) {
    this.yAxis.setTicks(a), this.rightAxis.setTicks(a);
  }),
  (GPlot.prototype.setFontName = function (a) {
    this.mainLayer.setFontName(a);
  }),
  (GPlot.prototype.setFontColor = function (a) {
    this.mainLayer.setFontColor(a);
  }),
  (GPlot.prototype.setFontSize = function (a) {
    this.mainLayer.setFontSize(a);
  }),
  (GPlot.prototype.setFontProperties = function (a, b, c) {
    this.mainLayer.setFontProperties(a, b, c);
  }),
  (GPlot.prototype.setAllFontProperties = function (a, b, c) {
    this.xAxis.setAllFontProperties(a, b, c),
      this.topAxis.setAllFontProperties(a, b, c),
      this.yAxis.setAllFontProperties(a, b, c),
      this.rightAxis.setAllFontProperties(a, b, c),
      this.title.setFontProperties(a, b, c),
      this.mainLayer.setAllFontProperties(a, b, c);
    for (var d = 0; d < this.layerList.length; d++)
      this.layerList[d].setAllFontProperties(a, b, c);
  }),
  (GPlot.prototype.getPos = function () {
    return this.pos.slice();
  }),
  (GPlot.prototype.getOuterDim = function () {
    return this.outerDim.slice();
  }),
  (GPlot.prototype.getMar = function () {
    return this.mar.slice();
  }),
  (GPlot.prototype.getDim = function () {
    return this.dim.slice();
  }),
  (GPlot.prototype.getXLim = function () {
    return this.xLim.slice();
  }),
  (GPlot.prototype.getYLim = function () {
    return this.yLim.slice();
  }),
  (GPlot.prototype.getFixedXLim = function () {
    return this.fixedXLim;
  }),
  (GPlot.prototype.getFixedYLim = function () {
    return this.fixedYLim;
  }),
  (GPlot.prototype.getXLog = function () {
    return this.xLog;
  }),
  (GPlot.prototype.getYLog = function () {
    return this.yLog;
  }),
  (GPlot.prototype.getInvertedXScale = function () {
    return this.invertedXScale;
  }),
  (GPlot.prototype.getInvertedYScale = function () {
    return this.invertedYScale;
  }),
  (GPlot.prototype.getMainLayer = function () {
    return this.mainLayer;
  }),
  (GPlot.prototype.getLayer = function (a) {
    var b;
    if (this.mainLayer.isId(a)) b = this.mainLayer;
    else
      for (var c = 0; c < this.layerList.length; c++)
        if (this.layerList[c].isId(a)) {
          b = this.layerList[c];
          break;
        }
    return (
      void 0 === b &&
        console.log("Couldn't find a layer in the plot with id = " + a),
      b
    );
  }),
  (GPlot.prototype.getXAxis = function () {
    return this.xAxis;
  }),
  (GPlot.prototype.getYAxis = function () {
    return this.yAxis;
  }),
  (GPlot.prototype.getTopAxis = function () {
    return this.topAxis;
  }),
  (GPlot.prototype.getRightAxis = function () {
    return this.rightAxis;
  }),
  (GPlot.prototype.getTitle = function () {
    return this.title;
  }),
  (GPlot.prototype.getPoints = function () {
    if (1 === arguments.length) return this.getLayer(arguments[0]).getPoints();
    if (0 === arguments.length) return this.mainLayer.getPoints();
    throw new Error("GPlot.getPoints(): signature not supported");
  }),
  (GPlot.prototype.getPointsRef = function () {
    if (1 === arguments.length)
      return this.getLayer(arguments[0]).getPointsRef();
    if (0 === arguments.length) return this.mainLayer.getPointsRef();
    throw new Error("GPlot.getPointsRef(): signature not supported");
  }),
  (GPlot.prototype.getHistogram = function () {
    if (1 === arguments.length)
      return this.getLayer(arguments[0]).getHistogram();
    if (0 === arguments.length) return this.mainLayer.getHistogram();
    throw new Error("GPlot.getHistogram(): signature not supported");
  }),
  (GPlot.prototype.activateZooming = function () {
    var a, b, c, d, e;
    if (5 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = arguments[3]),
        (e = arguments[4]);
    else if (3 === arguments.length)
      (a = arguments[0]),
        (b = arguments[1]),
        (c = arguments[2]),
        (d = GPlot.NONE),
        (e = GPlot.NONE);
    else if (1 === arguments.length)
      (a = arguments[0]),
        (b = this.parent.LEFT),
        (c = this.parent.RIGHT),
        (d = GPlot.NONE),
        (e = GPlot.NONE);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.activateZooming(): signature not supported");
      (a = 1.3),
        (b = this.parent.LEFT),
        (c = this.parent.RIGHT),
        (d = GPlot.NONE),
        (e = GPlot.NONE);
    }
    (this.zoomingIsActive = !0),
      a > 0 && (this.zoomFactor = a),
      (b !== this.parent.LEFT &&
        b !== this.parent.RIGHT &&
        b !== this.parent.CENTER) ||
        (this.increaseZoomButton = b),
      (c !== this.parent.LEFT &&
        c !== this.parent.RIGHT &&
        c !== this.parent.CENTER) ||
        (this.decreaseZoomButton = c),
      (d !== this.parent.SHIFT &&
        d !== this.parent.CONTROL &&
        d !== this.parent.ALT &&
        d !== GPlot.NONE) ||
        (this.increaseZoomKeyModifier = d),
      (e !== this.parent.SHIFT &&
        e !== this.parent.CONTROL &&
        e !== this.parent.ALT &&
        e !== GPlot.NONE) ||
        (this.decreaseZoomKeyModifier = e);
  }),
  (GPlot.prototype.deactivateZooming = function () {
    this.zoomingIsActive = !1;
  }),
  (GPlot.prototype.activateCentering = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else if (1 === arguments.length) (a = arguments[0]), (b = GPlot.NONE);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.activateCentering(): signature not supported");
      (a = this.parent.LEFT), (b = GPlot.NONE);
    }
    (this.centeringIsActive = !0),
      (a !== this.parent.LEFT &&
        a !== this.parent.RIGHT &&
        a !== this.parent.CENTER) ||
        (this.centeringButton = a),
      (b !== this.parent.SHIFT &&
        b !== this.parent.CONTROL &&
        b !== this.parent.ALT &&
        b !== GPlot.NONE) ||
        (this.centeringKeyModifier = b);
  }),
  (GPlot.prototype.deactivateCentering = function () {
    this.centeringIsActive = !1;
  }),
  (GPlot.prototype.activatePanning = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else if (1 === arguments.length) (a = arguments[0]), (b = GPlot.NONE);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.activatePanning(): signature not supported");
      (a = this.parent.LEFT), (b = GPlot.NONE);
    }
    (this.panningIsActive = !0),
      (a !== this.parent.LEFT &&
        a !== this.parent.RIGHT &&
        a !== this.parent.CENTER) ||
        (this.panningButton = a),
      (b !== this.parent.SHIFT &&
        b !== this.parent.CONTROL &&
        b !== this.parent.ALT &&
        b !== GPlot.NONE) ||
        (this.panningKeyModifier = b);
  }),
  (GPlot.prototype.deactivatePanning = function () {
    (this.panningIsActive = !1), (this.panningReferencePoint = void 0);
  }),
  (GPlot.prototype.activatePointLabels = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else if (1 === arguments.length) (a = arguments[0]), (b = GPlot.NONE);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.activatePointLabels(): signature not supported");
      (a = this.parent.LEFT), (b = GPlot.NONE);
    }
    (this.labelingIsActive = !0),
      (a !== this.parent.LEFT &&
        a !== this.parent.RIGHT &&
        a !== this.parent.CENTER) ||
        (this.labelingButton = a),
      (b !== this.parent.SHIFT &&
        b !== this.parent.CONTROL &&
        b !== this.parent.ALT &&
        b !== GPlot.NONE) ||
        (this.labelingKeyModifier = b);
  }),
  (GPlot.prototype.deactivatePointLabels = function () {
    (this.labelingIsActive = !1), (this.mousePos = void 0);
  }),
  (GPlot.prototype.activateReset = function () {
    var a, b;
    if (2 === arguments.length) (a = arguments[0]), (b = arguments[1]);
    else if (1 === arguments.length) (a = arguments[0]), (b = GPlot.NONE);
    else {
      if (0 !== arguments.length)
        throw new Error("GPlot.activateReset(): signature not supported");
      (a = this.parent.RIGHT), (b = GPlot.NONE);
    }
    (this.resetIsActive = !0),
      (this.xLimReset = void 0),
      (this.yLimReset = void 0),
      (a !== this.parent.LEFT &&
        a !== this.parent.RIGHT &&
        a !== this.parent.CENTER) ||
        (this.resetButton = a),
      (b !== this.parent.SHIFT &&
        b !== this.parent.CONTROL &&
        b !== this.parent.ALT &&
        b !== GPlot.NONE) ||
        (this.resetKeyModifier = b);
  }),
  (GPlot.prototype.deactivateReset = function () {
    (this.resetIsActive = !1),
      (this.xLimReset = void 0),
      (this.yLimReset = void 0);
  }),
  (GPlot.prototype.getButton = function (a) {
    var b;
    return (
      0 === a.button
        ? (b = this.parent.LEFT)
        : 1 === a.button
        ? (b = this.parent.CENTER)
        : 2 === a.button
        ? (b = this.parent.RIGHT)
        : void 0 === a.button && (b = this.parent.LEFT),
      b
    );
  }),
  (GPlot.prototype.getModifier = function (a) {
    return a.altKey
      ? this.parent.ALT
      : a.ctrlKey
      ? this.parent.CONTROL
      : a.shiftKey
      ? this.parent.SHIFT
      : GPlot.NONE;
  }),
  (GPlot.prototype.saveResetLimits = function () {
    (void 0 !== this.xLimReset && void 0 !== this.yLimReset) ||
      ((this.xLimReset = this.xLim.slice()),
      (this.yLimReset = this.yLim.slice()));
  }),
  (GPlot.prototype.clickEvent = function (a) {
    var b = a || window.event;
    if (this.isOverBox()) {
      var c = this.getButton(b),
        d = this.getModifier(b);
      this.zoomingIsActive &&
        (c === this.increaseZoomButton && d === this.increaseZoomKeyModifier
          ? (this.resetIsActive && this.saveResetLimits(),
            this.zoom(this.zoomFactor, this.parent.mouseX, this.parent.mouseY))
          : c === this.decreaseZoomButton &&
            d === this.decreaseZoomKeyModifier &&
            (this.resetIsActive && this.saveResetLimits(),
            this.zoom(
              1 / this.zoomFactor,
              this.parent.mouseX,
              this.parent.mouseY
            ))),
        this.centeringIsActive &&
          c === this.centeringButton &&
          d === this.centeringKeyModifier &&
          (this.resetIsActive && this.saveResetLimits(),
          this.center(this.parent.mouseX, this.parent.mouseY)),
        this.resetIsActive &&
          c === this.resetButton &&
          d === this.resetKeyModifier &&
          void 0 !== this.xLimReset &&
          void 0 !== this.yLimReset &&
          (this.setXLim(this.xLimReset),
          this.setYLim(this.yLimReset),
          (this.xLimReset = void 0),
          (this.yLimReset = void 0));
    }
  }),
  (GPlot.prototype.wheelEvent = function (a) {
    var b = a || window.event;
    if (this.isOverBox()) {
      var c = b.deltaY,
        d = this.parent.CENTER,
        e = this.getModifier(b);
      this.zoomingIsActive &&
        (d === this.increaseZoomButton &&
        e === this.increaseZoomKeyModifier &&
        c > 0
          ? (b.preventDefault(),
            this.resetIsActive && this.saveResetLimits(),
            this.zoom(this.zoomFactor, this.parent.mouseX, this.parent.mouseY))
          : d === this.decreaseZoomButton &&
            e === this.decreaseZoomKeyModifier &&
            c < 0 &&
            (b.preventDefault(),
            this.resetIsActive && this.saveResetLimits(),
            this.zoom(
              1 / this.zoomFactor,
              this.parent.mouseX,
              this.parent.mouseY
            )));
    }
  }),
  (GPlot.prototype.mouseDownEvent = function (a) {
    var b = a || window.event;
    if (this.isOverBox()) {
      var c = !1,
        d = this.getButton(b),
        e = this.getModifier(b);
      this.panningIsActive &&
        d === this.panningButton &&
        e === this.panningKeyModifier &&
        ((c = !0),
        this.resetIsActive && this.saveResetLimits(),
        (this.panningReferencePoint = this.getValueAt(
          this.parent.mouseX,
          this.parent.mouseY
        ))),
        this.labelingIsActive &&
          d === this.labelingButton &&
          e === this.labelingKeyModifier &&
          ((c = !0),
          (this.mousePos = [this.parent.mouseX, this.parent.mouseY])),
        c &&
          (document.addEventListener("mousemove", this.mouseMoveListener, !1),
          document.addEventListener("mouseup", this.mouseUpListener, !1));
    }
  }),
  (GPlot.prototype.mouseMoveEvent = function (a) {
    var b = a || window.event,
      c = this.getButton(b),
      d = this.getModifier(b);
    a.preventDefault(),
      this.panningIsActive &&
        c === this.panningButton &&
        d === this.panningKeyModifier &&
        this.align(
          this.panningReferencePoint,
          this.parent.mouseX,
          this.parent.mouseY
        ),
      this.labelingIsActive &&
        c === this.labelingButton &&
        d === this.labelingKeyModifier &&
        (this.mousePos = [this.parent.mouseX, this.parent.mouseY]);
  }),
  (GPlot.prototype.mouseUpEvent = function (a) {
    var b = a || window.event,
      c = this.getButton(b);
    document.removeEventListener("mousemove", this.mouseMoveListener, !1),
      document.removeEventListener("mouseup", this.mouseUpListener, !1),
      this.panningIsActive &&
        c === this.panningButton &&
        (this.panningReferencePoint = void 0),
      this.labelingIsActive &&
        c === this.labelingButton &&
        (this.mousePos = void 0);
  }),
  (GPlot.prototype.touchStartEvent = function (a) {
    var b = a || window.event;
    if ((this.parent._ontouchstart(b), this.isOverBox())) {
      var c = !1;
      if (
        (this.panningIsActive &&
          ((c = !0),
          (this.panningReferencePoint = this.getValueAt(
            this.parent.mouseX,
            this.parent.mouseY
          ))),
        this.labelingIsActive &&
          ((c = !0),
          (this.mousePos = [this.parent.mouseX, this.parent.mouseY])),
        this.zoomingIsActive && void 0 !== b.touches && 2 === b.touches.length)
      ) {
        c = !0;
        var d = b.touches[0].pageX - b.touches[1].pageX,
          e = b.touches[0].pageY - b.touches[1].pageY;
        (this.zoomStartDistance = Math.sqrt(d * d + e * e)),
          (this.zoomStartPosition = [this.parent.mouseX, this.parent.mouseY]);
      }
      c &&
        (document.addEventListener("touchmove", this.touchMoveListener, {
          passive: !1,
        }),
        document.addEventListener("touchend", this.touchEndListener, !1),
        document.addEventListener("touchcancel", this.touchEndListener, !1));
    }
  }),
  (GPlot.prototype.touchMoveEvent = function (a) {
    var b = a || window.event;
    if (
      (b.preventDefault(),
      this.panningIsActive &&
        this.align(
          this.panningReferencePoint,
          this.parent.mouseX,
          this.parent.mouseY
        ),
      this.labelingIsActive &&
        (this.mousePos = [this.parent.mouseX, this.parent.mouseY]),
      this.zoomingIsActive && void 0 !== b.touches && 2 === b.touches.length)
    ) {
      var c = b.touches[0].pageX - b.touches[1].pageX,
        d = b.touches[0].pageY - b.touches[1].pageY,
        e = Math.sqrt(c * c + d * d);
      this.zoom(
        e / this.zoomStartDistance,
        this.zoomStartPosition[0],
        this.zoomStartPosition[1]
      ),
        (this.zoomStartDistance = e);
    }
  }),
  (GPlot.prototype.touchEndEvent = function (a) {
    document.removeEventListener("touchmove", this.touchMoveListener, !1),
      document.removeEventListener("touchend", this.touchEndListener, !1),
      document.removeEventListener("touchcancel", this.touchEndListener, !1),
      this.panningIsActive && (this.panningReferencePoint = void 0),
      this.labelingIsActive && (this.mousePos = void 0),
      this.zoomingIsActive &&
        ((this.zoomStartDistance = void 0), (this.zoomStartPosition = void 0));
  }),
  (GPlot.prototype.preventDefaultEvent = function (a) {
    var b = a || window.event;
    this.isOverBox() && b.preventDefault();
  }),
  (GPlot.prototype.contextMenuEvent = function (a) {
    var b = a || window.event;
    this.isOverBox() && (b.preventDefault(), this.clickEvent(b));
  }),
  (GPlot.prototype.preventWheelDefault = function () {
    this.parentElt.addEventListener(
      "wheel",
      this.preventDefaultEvent.bind(this),
      !1
    );
  }),
  (GPlot.prototype.preventRightClickDefault = function () {
    this.parentElt.addEventListener(
      "contextmenu",
      this.contextMenuEvent.bind(this),
      !1
    );
  });
