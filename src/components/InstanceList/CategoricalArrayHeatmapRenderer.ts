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
    CategoricalsColumn, IStatistics, ISummaryRenderer, IGroupCellRenderer, ICellRenderer,
} from 'lineupjs';

const GUESSED_HEIGHT = 20;
const CANVAS_HEIGHT = 20;

// https://github.com/lineupjs/lineupjs/blob/790a0bbd36906539c27bae08ce517c27885ae56a/src/renderer/HeatmapCellRenderer.ts
export default class CategoricalArrayHeatmapRenderer implements ICellRendererFactory {
    readonly title = 'Categorical Heatmap';

    canRender(col: CategoricalsColumn, mode: ERenderMode) {
        return isArrayColumn(col) && Boolean(col.dataLength) && col.desc.type === "categoricals" && mode === ERenderMode.CELL;
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

    create(col: CategoricalsColumn, context: IRenderContext, _hist: any, imposer?: IImposer): ICellRenderer {
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

    createGroup(col: CategoricalsColumn, context: IRenderContext, hist: IStatistics | ICategoricalStatistics | null, imposer?: IImposer): IGroupCellRenderer {
        return {
            template: '<div></div>',
            update: (node: HTMLElement, group: IGroup, rows: IDataRow[]) => {
            }
        };
    }

    createSummary(col: CategoricalsColumn, context: IRenderContext, interactive: boolean, imposer?: IImposer): ISummaryRenderer {
        return {
            template: '<div></div>',
            update: (node: HTMLElement, hist: IStatistics | ICategoricalStatistics | null) => {
            }
        };
    }
}