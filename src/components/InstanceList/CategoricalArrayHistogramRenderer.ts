import {
    ICellRendererFactory,
    IRenderContext,
    IImposer,
    IDataRow,
    ICategoricalStatistics,
    IGroup,
    ERenderMode,
    isArrayColumn,
    DENSE_HISTOGRAM,
    ICategoricalBin,
    CategoricalsColumn, LocalDataProvider, renderMissingCanvas,
} from 'lineupjs';
import "./CategoricalArrayHistogramRenderer.css";

const CANVAS_HEIGHT = 20;

// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
export default class CategoricalArrayHistogramRenderer implements ICellRendererFactory {
    readonly title = 'Categorical Histogram';
    readonly groupTitle = 'Categorical Histogram';
    readonly summaryTitle = 'Categorical Histogram';

    canRender(col: CategoricalsColumn, mode: ERenderMode) {
        return isArrayColumn(col) && Boolean(col.dataLength) && col.desc.type === "categoricals";
    }

    create(col: CategoricalsColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
        const {template, update} = hist(col, false);
        return {
            template,
            update: (n: HTMLElement, row: IDataRow) => {
                const {maxBin, hist} = this.computeHist([row], col);
                update(n, maxBin, hist);
            },
            render: (ctx: CanvasRenderingContext2D, row: IDataRow) => {
                const width = context.colWidth(col);
                const cats = col.categories;
                if (renderMissingCanvas(ctx, col, row, width)) {
                    return;
                }
                const cellDimension = width / cats.length;
                const {maxBin, hist} = this.computeHist([row], col);

                ctx.save();
                cats.forEach((d, j) => {
                    const posx = (j * cellDimension);
                    ctx.fillStyle = d.color;
                    ctx.fillRect(posx, 0, cellDimension, CANVAS_HEIGHT * (hist[j].y / maxBin));
                });
                ctx.restore();
            }
        };
    }

    createGroup(col: CategoricalsColumn, _context: IRenderContext, globalHist: ICategoricalStatistics | null) {
        const {template, update} = hist(col, false);
        return {
            template: `${template}</div>`,
            update: (n: HTMLElement, _group: IGroup, rows: IDataRow[]) => {
                const {maxBin, hist} = this.computeHist(rows, col);
                update(n, maxBin, hist);
            }
        };
    }

    createSummary(col: CategoricalsColumn, ctx: IRenderContext, interactive: boolean) {
        const {template, update} = hist(col, interactive);
        return {
            template: `${template}</div>`,
            update: (n: HTMLElement, hist2: ICategoricalStatistics | null) => {
                // Manually compute histogram
                const ranking = ctx.provider.getRankings()[0];
                const rows = (<LocalDataProvider>ctx.provider).viewRawRows(ranking.getOrder());
                const {maxBin, hist} = this.computeHist(rows, col);

                n.classList.toggle('lu-missing', !hist);
                if (!hist) {
                    return;
                }
                update(n, maxBin, hist);
            }
        };
    }

    computeHist(rows: IDataRow[], col: CategoricalsColumn): ICategoricalStatistics {
        const values = <{ string: number }>rows
            .map(row => col.getSplicer().splice(row.v[col.desc.column]))
            .flat()
            .reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

        return {
            maxBin: Math.max(...Object.values(values)),
            hist: col.categories.map(cat => ({cat: cat.name, y: values[cat.name] | 0})),
            missing: 0
        }
    }
}

// TODO: Reuse from CategoricalColumn
function hist(col: CategoricalsColumn, showLabels: boolean) {
    const bins = col.categories.map((c) => `<div title="${c.label}: 0" data-cat="${c.name}" ${showLabels ? `data-title="${c.label}"` : ''}><div style="height: 0; background-color: ${c.color}"></div></div>`).join('');

    return {
        template: `<div${col.dataLength! > DENSE_HISTOGRAM ? 'class="lu-dense"' : ''}>${bins}`, // no closing div to be able to append things
        update: (node: HTMLElement, maxBin: number, hist: ICategoricalBin[]) => {
            Array.from(node.querySelectorAll('[data-cat]')).forEach((d: HTMLElement, i) => {
                const {y} = hist[i];
                d.title = `${col.categories[i].label}: ${y}`;
                const inner = <HTMLElement>d.firstElementChild!;
                inner.style.height = `${Math.round(y * 100 / maxBin)}%`;
            });
        }
    };
}