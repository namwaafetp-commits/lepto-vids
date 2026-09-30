import type {ReactNode} from 'react';

export type IconGridProps = Readonly<{
  count: number;
  columns: number;
  cellSize: number;
  gap?: number;
  renderCell: (index: number, column: number, row: number) => ReactNode;
}>;

/** Pure layout for "1 in N" style grids; the scene owns each cell's state over time. */
export const IconGrid = ({count, columns, cellSize, gap = 8, renderCell}: IconGridProps) => {
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const cols = Math.max(1, Math.floor(columns));
  const rows = Math.ceil(total / cols);

  return (
    <div
      style={{
        position: 'relative',
        width: cols * cellSize + (cols - 1) * gap,
        height: rows * cellSize + Math.max(0, rows - 1) * gap,
      }}
    >
      {Array.from({length: total}, (_, index) => {
        const column = index % cols;
        const row = Math.floor(index / cols);
        return (
          <div
            key={index}
            data-cell={index}
            style={{
              position: 'absolute',
              left: column * (cellSize + gap),
              top: row * (cellSize + gap),
              width: cellSize,
              height: cellSize,
            }}
          >
            {renderCell(index, column, row)}
          </div>
        );
      })}
    </div>
  );
};
