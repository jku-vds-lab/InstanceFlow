import {
    ICellRendererFactory,
    Column,
    IArrayColumn,
    isArrayColumn, isCategoricalColumn,
    ICategoricalColumn,
    IRenderContext,
    IImposer,
    IDataRow,
    isMissingValue
} from 'lineupjs';
import "./CategoricalArrayHeatmapCellRenderer.css";

const GUESSED_HEIGHT = 20;
const CANVAS_HEIGHT = 20;

// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
export default class CategoricalArrayHeatmapCellRenderer implements ICellRendererFactory {
    readonly title = 'Distribution';

    canRender(col: Column) {
        return isCategoricalColumn(col) && isArrayColumn(col) && Boolean(col.dataLength);
    }

    private createContext(col: ICategoricalColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
        const width = context.colWidth(col);
        const cellDimension = width / col.dataLength!;
        const labels = col.labels;

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
                const values = (<IArrayColumn<any>>col).getValues(d);
                n.onmousemove = mover(n, values);
                n.onmouseleave = () => n.title = '';
                render(ctx, values, d, GUESSED_HEIGHT);
            },
            render: (ctx: CanvasRenderingContext2D, d: IDataRow) => {
                render(ctx, (<IArrayColumn<any>>col).getValues(d), d, CANVAS_HEIGHT);
            }
        };
    }

    createGroup(col: ICategoricalColumn, context: IRenderContext, _hist: any, imposer?: IImposer) {
        return {
            template: `<div></div>`,
            update(node: HTMLElement) {
            }
        }
    }

    createSummary(col: ICategoricalColumn) {
        return {
            template: `<div></div>`,
            update(node: HTMLElement) {
            }
        }
    }
}
