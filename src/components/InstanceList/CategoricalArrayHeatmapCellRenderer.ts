import {
    ICellRendererFactory,
    IArrayColumn,
    IRenderContext,
    IImposer,
    IDataRow,
    isMissingValue,
    ICategoricalStatistics,
    IGroup,
    ERenderMode,
    isArrayColumn,
    DENSE_HISTOGRAM,
    ICategoricalBin,
    CategoricalsColumn,
} from 'lineupjs';
import "./CategoricalArrayHeatmapCellRenderer.css";

const GUESSED_HEIGHT = 20;
const CANVAS_HEIGHT = 20;

// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
export default class CategoricalArrayHeatmapCellRenderer implements ICellRendererFactory {
    readonly title = 'Categorical Heatmap';
    readonly groupTitle = 'Categorical Histogram';
    readonly summaryTitle = 'Categorical Histogram';

    canRender(col: CategoricalsColumn, mode: ERenderMode) {
        return isArrayColumn(col) && Boolean(col.dataLength) && col.desc.type === "categoricals";
    }

    private createContext(col: CategoricalsColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
        const width = context.colWidth(col);

        const cellDimension = width / col.dataLength!;
        const labels = col.labels!;

        const categories = col.categories.reduce((acc, cur) => {
            acc.set(cur.name, cur);
            return acc;
        }, new Map());

        const render = (ctx: CanvasRenderingContext2D, data: string[], item: IDataRow, height: number) => {
            data.forEach((d: string, j: number) => {
                const x = j * cellDimension;
                if (isMissingValue(d)) {
                    //renderMissingValue(ctx, cellDimension, height, x, 0);
                    return;
                }
                ctx.fillStyle = categories.get(d).color;
                ctx.fillRect(x, 0, cellDimension, height);
            });
        };
        return {
            template: `<canvas height="${GUESSED_HEIGHT}" title="" />`,
            render,
            width,
            mover: (n: HTMLElement, values: string[]) => (evt: MouseEvent) => {
                const percent = evt.offsetX / width;
                const index = Math.max(0, Math.min(col.dataLength! - 1, Math.floor(percent * (col.dataLength! - 1) + 0.5)));
                n.title = `${labels[index]}: ${values[index]}`;
            }
        };
    }

    create(col: CategoricalsColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
        const {template, render, mover, width} = this.createContext(col, context, _hist, imposer);
        return {
            template,
            update: (n: HTMLElement, d: IDataRow) => {
                const ctx = (<HTMLCanvasElement>n).getContext('2d')!;
                ctx.canvas.width = width;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                //if (renderMissingDOM(n, col, d)) {
                //    return;
                //}
                let values = (<IArrayColumn<any>>col).getValues(d);
                n.onmousemove = mover(n, values);
                n.onmouseleave = () => n.title = '';
                render(ctx, values, d, GUESSED_HEIGHT);
            },
            render: (ctx: CanvasRenderingContext2D, d: IDataRow) => {
                let values = (<IArrayColumn<any>>col).getValues(d);
                render(ctx, values, d, CANVAS_HEIGHT);
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
                const rows = ctx.provider.viewRawRows(ranking.getOrder());
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