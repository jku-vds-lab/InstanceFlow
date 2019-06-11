"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lineupjs_1 = require("lineupjs");
require("./CategoricalArrayHistogramRenderer.css");
var CANVAS_HEIGHT = 20;
// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
var CategoricalArrayHistogramRenderer = /** @class */ (function () {
    function CategoricalArrayHistogramRenderer() {
        this.title = 'Categorical Histogram';
        this.groupTitle = 'Categorical Histogram';
        this.summaryTitle = 'Categorical Histogram';
    }
    CategoricalArrayHistogramRenderer.prototype.canRender = function (col, mode) {
        return lineupjs_1.isArrayColumn(col) && Boolean(col.dataLength) && col.desc.type === "categoricals";
    };
    CategoricalArrayHistogramRenderer.prototype.create = function (col, context, _hist, imposer) {
        var _this = this;
        var _a = hist(col, false), template = _a.template, update = _a.update;
        return {
            template: template,
            update: function (n, row) {
                var _a = _this.computeHist([row], col), maxBin = _a.maxBin, hist = _a.hist;
                update(n, maxBin, hist);
            },
            render: function (ctx, row) {
                var width = context.colWidth(col);
                var cats = col.categories;
                if (lineupjs_1.renderMissingCanvas(ctx, col, row, width)) {
                    return;
                }
                var cellDimension = width / cats.length;
                var _a = _this.computeHist([row], col), maxBin = _a.maxBin, hist = _a.hist;
                ctx.save();
                cats.forEach(function (d, j) {
                    var posx = (j * cellDimension);
                    ctx.fillStyle = d.color;
                    ctx.fillRect(posx, 0, cellDimension, CANVAS_HEIGHT * (hist[j].y / maxBin));
                });
                ctx.restore();
            }
        };
    };
    CategoricalArrayHistogramRenderer.prototype.createGroup = function (col, _context, globalHist) {
        var _this = this;
        var _a = hist(col, false), template = _a.template, update = _a.update;
        return {
            template: template + "</div>",
            update: function (n, _group, rows) {
                var _a = _this.computeHist(rows, col), maxBin = _a.maxBin, hist = _a.hist;
                update(n, maxBin, hist);
            }
        };
    };
    CategoricalArrayHistogramRenderer.prototype.createSummary = function (col, ctx, interactive) {
        var _this = this;
        var _a = hist(col, interactive), template = _a.template, update = _a.update;
        return {
            template: template + "</div>",
            update: function (n, hist2) {
                // Manually compute histogram
                var ranking = ctx.provider.getRankings()[0];
                var rows = ctx.provider.viewRawRows(ranking.getOrder());
                var _a = _this.computeHist(rows, col), maxBin = _a.maxBin, hist = _a.hist;
                n.classList.toggle('lu-missing', !hist);
                if (!hist) {
                    return;
                }
                update(n, maxBin, hist);
            }
        };
    };
    CategoricalArrayHistogramRenderer.prototype.computeHist = function (rows, col) {
        var values = rows
            .map(function (row) { return col.getSplicer().splice(row.v[col.desc.column]); })
            .flat()
            .reduce(function (acc, curr) {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
        return {
            maxBin: Math.max.apply(Math, Object.values(values)),
            hist: col.categories.map(function (cat) { return ({ cat: cat.name, y: values[cat.name] | 0 }); }),
            missing: 0
        };
    };
    return CategoricalArrayHistogramRenderer;
}());
exports.default = CategoricalArrayHistogramRenderer;
// TODO: Reuse from CategoricalColumn
function hist(col, showLabels) {
    var bins = col.categories.map(function (c) { return "<div title=\"" + c.label + ": 0\" data-cat=\"" + c.name + "\" " + (showLabels ? "data-title=\"" + c.label + "\"" : '') + "><div style=\"height: 0; background-color: " + c.color + "\"></div></div>"; }).join('');
    return {
        template: "<div" + (col.dataLength > lineupjs_1.DENSE_HISTOGRAM ? 'class="lu-dense"' : '') + ">" + bins,
        update: function (node, maxBin, hist) {
            Array.from(node.querySelectorAll('[data-cat]')).forEach(function (d, i) {
                var y = hist[i].y;
                d.title = col.categories[i].label + ": " + y;
                var inner = d.firstElementChild;
                inner.style.height = Math.round(y * 100 / maxBin) + "%";
            });
        }
    };
}
