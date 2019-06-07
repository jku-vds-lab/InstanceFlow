"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lineupjs_1 = require("lineupjs");
require("./CategoricalArrayHeatmapCellRenderer.css");
var GUESSED_HEIGHT = 20;
var CANVAS_HEIGHT = 20;
// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
var CategoricalArrayHeatmapCellRenderer = /** @class */ (function () {
    function CategoricalArrayHeatmapCellRenderer() {
        this.title = 'Categorical Heatmap';
        this.groupTitle = 'Categorical Histogram';
        this.summaryTitle = 'Categorical Histogram';
    }
    CategoricalArrayHeatmapCellRenderer.prototype.canRender = function (col, mode) {
        return lineupjs_1.isArrayColumn(col) && Boolean(col.dataLength) && col.desc.type === "categoricals";
    };
    CategoricalArrayHeatmapCellRenderer.prototype.createContext = function (col, context, _hist, imposer) {
        var width = context.colWidth(col);
        var cellDimension = width / col.dataLength;
        var labels = col.labels;
        var categories = col.categories.reduce(function (acc, cur) {
            acc.set(cur.name, cur);
            return acc;
        }, new Map());
        var render = function (ctx, data, item, height) {
            data.forEach(function (d, j) {
                var x = j * cellDimension;
                if (lineupjs_1.isMissingValue(d)) {
                    //renderMissingValue(ctx, cellDimension, height, x, 0);
                    return;
                }
                ctx.fillStyle = categories.get(d).color;
                ctx.fillRect(x, 0, cellDimension, height);
            });
        };
        return {
            template: "<canvas height=\"" + GUESSED_HEIGHT + "\" title=\"\" />",
            render: render,
            width: width,
            mover: function (n, values) { return function (evt) {
                var percent = evt.offsetX / width;
                var index = Math.max(0, Math.min(col.dataLength - 1, Math.floor(percent * (col.dataLength - 1) + 0.5)));
                n.title = labels[index] + ": " + values[index];
            }; }
        };
    };
    CategoricalArrayHeatmapCellRenderer.prototype.create = function (col, context, _hist, imposer) {
        var _a = this.createContext(col, context, _hist, imposer), template = _a.template, render = _a.render, mover = _a.mover, width = _a.width;
        return {
            template: template,
            update: function (n, d) {
                var ctx = n.getContext('2d');
                ctx.canvas.width = width;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                //if (renderMissingDOM(n, col, d)) {
                //    return;
                //}
                var values = col.getValues(d);
                n.onmousemove = mover(n, values);
                n.onmouseleave = function () { return n.title = ''; };
                render(ctx, values, d, GUESSED_HEIGHT);
            },
            render: function (ctx, d) {
                var values = col.getValues(d);
                render(ctx, values, d, CANVAS_HEIGHT);
            }
        };
    };
    CategoricalArrayHeatmapCellRenderer.prototype.createGroup = function (col, _context, globalHist) {
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
    CategoricalArrayHeatmapCellRenderer.prototype.createSummary = function (col, ctx, interactive) {
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
    CategoricalArrayHeatmapCellRenderer.prototype.computeHist = function (rows, col) {
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
    return CategoricalArrayHeatmapCellRenderer;
}());
exports.default = CategoricalArrayHeatmapCellRenderer;
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
