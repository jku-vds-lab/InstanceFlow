import {
    ICellRendererFactory,
    Column,
    IArrayColumn,
    ICategoricalColumn,
    IRenderContext,
    IImposer,
    IDataRow,
    isMissingValue,
    IStatistics,
    ICategoricalStatistics,
    IGroup,
    ERenderMode,
    isMapColumn,
    isSetColumn,
    isArrayColumn, DENSE_HISTOGRAM, ICategoricalBin, ICategory,
} from 'lineupjs';
import "./CategoricalArrayHeatmapCellRenderer.css";

const GUESSED_HEIGHT = 20;
const CANVAS_HEIGHT = 20;

// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
export default class CategoricalArrayHeatmapCellRenderer implements ICellRendererFactory {
    readonly title = 'Categorical Heatmap';
    readonly groupTitle = 'Categorical Histogram';
    readonly summaryTitle = 'Categorical Histogram';

    canRender(col: Column, mode: ERenderMode) {
        return isArrayColumn(col) && Boolean(col.dataLength) && col.desc.type === "categoricals";
    }

    private createContext(col: ICategoricalColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
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

    private static createHistogramContext(col: ICategoricalColumn, summary: boolean) {
        const categories = col.categories;
        let templateRows = '';
        for (const cat of categories) {
            templateRows += `<div title="${cat.label}" data-title="${summary ? cat.label : ""}" style="background-color: ${cat.color}"></div>`;
        }
        return {
            templateRow: templateRows,
            render: (node: HTMLElement, values: {[key: string]: number}) => {
                const max = Math.max(...Object.values(values)) || 1;
                (<HTMLElement[]>Array.from(node.children)).forEach((c, i) => {
                    const category = categories[i];
                    const value = values[category.label] || 0 ;
                    c.style.height = `${value / max * 100}%`;
                    c.title = `${category.label}: ${value}`
                });
            }
        };
    }


    create(col: ICategoricalColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
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

    createGroup(col: ICategoricalColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
        const {templateRow, render} = CategoricalArrayHeatmapCellRenderer.createHistogramContext(col, false);
        return {
            template: `<div>${templateRow}</div>`,
            update(node: HTMLElement, group: IGroup, rows: IDataRow[]) {
                const values = rows.map(row => col.splicer.splice(row.v[col.desc.column])).flat().reduce((acc, curr) => {
                    acc[curr] = (acc[curr] || 0) + 1;
                    return acc;
                }, {});
                render(node, values);
            }
        }
    }

    createSummary(col: ICategoricalColumn, context: IRenderContext, interactive: boolean, imposer?: IImposer) {
        const {templateRow, render} = CategoricalArrayHeatmapCellRenderer.createHistogramContext(col, !interactive);

        return {
            template: `<div>${templateRow}</div>`,
            update(node: HTMLElement, hist: IStatistics | ICategoricalStatistics | null) {
                const ranking = context.provider.getRankings()[0];
                const rows = context.provider.view(ranking.getOrder());
                const values = rows.map(row => col.splicer.splice(row[col.desc.column])).flat().reduce((acc, curr) => {
                    acc[curr] = (acc[curr] || 0) + 1;
                    return acc;
                }, {});

                render(node, values);
            }
        }
    }
}