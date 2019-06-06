"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lineupjs_1 = require("lineupjs");
require("./CategoricalArrayHeatmapCellRenderer.css");
var GUESSED_HEIGHT = 20;
var CANVAS_HEIGHT = 20;
// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
var CategoricalArrayHeatmapCellRenderer = /** @class */ (function () {
    function CategoricalArrayHeatmapCellRenderer() {
        this.title = 'Distribution2';
    }
    CategoricalArrayHeatmapCellRenderer.prototype.canRender = function (col) {
        return lineupjs_1.isCategoricalColumn(col) && lineupjs_1.isArrayColumn(col) && Boolean(col.dataLength);
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
                render(ctx, col.getValues(d), d, CANVAS_HEIGHT);
            }
        };
    };
    CategoricalArrayHeatmapCellRenderer.prototype.createGroup = function (col, context, _hist, imposer) {
        return {
            template: "<div></div>",
            update: function (node) {
            }
        };
    };
    CategoricalArrayHeatmapCellRenderer.prototype.createSummary = function (col) {
        return {
            template: "<div></div>",
            update: function (node) {
            }
        };
    };
    return CategoricalArrayHeatmapCellRenderer;
}());
exports.default = CategoricalArrayHeatmapCellRenderer;
