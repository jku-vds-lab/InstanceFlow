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
    CategoricalArrayHeatmapCellRenderer.createHistogramContext = function (col, summary) {
        var categories = col.categories;
        var templateRows = '';
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var cat = categories_1[_i];
            templateRows += "<div title=\"" + cat.label + "\" data-title=\"" + (summary ? cat.label : "") + "\" style=\"background-color: " + cat.color + "\"></div>";
        }
        return {
            templateRow: templateRows,
            render: function (node, values) {
                var max = Math.max.apply(Math, Object.values(values)) || 1;
                Array.from(node.children).forEach(function (c, i) {
                    var category = categories[i];
                    var value = values[category.label] || 0;
                    c.style.height = value / max * 100 + "%";
                    c.title = category.label + ": " + value;
                });
            }
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
    CategoricalArrayHeatmapCellRenderer.prototype.createGroup = function (col, context, _hist, imposer) {
        var _a = CategoricalArrayHeatmapCellRenderer.createHistogramContext(col, false), templateRow = _a.templateRow, render = _a.render;
        return {
            template: "<div>" + templateRow + "</div>",
            update: function (node, group, rows) {
                var values = rows.map(function (row) { return col.splicer.splice(row.v[col.desc.column]); }).flat().reduce(function (acc, curr) {
                    acc[curr] = (acc[curr] || 0) + 1;
                    return acc;
                }, {});
                render(node, values);
            }
        };
    };
    CategoricalArrayHeatmapCellRenderer.prototype.createSummary = function (col, context, interactive, imposer) {
        var _a = CategoricalArrayHeatmapCellRenderer.createHistogramContext(col, !interactive), templateRow = _a.templateRow, render = _a.render;
        return {
            template: "<div>" + templateRow + "</div>",
            update: function (node, hist) {
                var ranking = context.provider.getRankings()[0];
                var rows = context.provider.view(ranking.getOrder());
                var values = rows.map(function (row) { return col.splicer.splice(row[col.desc.column]); }).flat().reduce(function (acc, curr) {
                    acc[curr] = (acc[curr] || 0) + 1;
                    return acc;
                }, {});
                render(node, values);
            }
        };
    };
    return CategoricalArrayHeatmapCellRenderer;
}());
exports.default = CategoricalArrayHeatmapCellRenderer;
