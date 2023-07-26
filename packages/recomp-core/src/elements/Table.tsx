import * as React from 'react';

import { propUnion } from '@recomp/props';

interface TableProps {
  className?: string;
  classNames?: {
    table?: string;
    thead?: string;
    tbody?: string;
    tr?: string;
    th?: string;
    td?: string;
  };
  style?: React.CSSProperties;
  data: TableData;
  root?: ({
    className,
    style,
    children,
  }: {
    className: string;
    style: React.CSSProperties;
    children: React.ReactNode;
  }) => React.ReactElement;
  table?: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
  thead?: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
  tbody?: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
  tr?: ({
    row,
    className,
    children,
  }: {
    row: number;
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
  th?: ({
    col,
    className,
    children,
  }: {
    col: number;
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
  td?: ({
    row,
    col,
    className,
    children,
  }: {
    row: number;
    col: number;
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
}

interface TableData {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
}

export const Table = (props: TableProps) => {
  props = propUnion(defaultProps, props);

  return (
    <props.root className={props.className} style={props.style}>
      <props.table className={props.classNames.table}>
        <props.thead className={props.classNames.thead}>
          <props.tr row={0} className={props.classNames.tr}>
            {props.data.headers.map((header, colIndex) => (
              <props.th
                key={colIndex}
                col={colIndex}
                className={props.classNames.th}
              >
                {header}
              </props.th>
            ))}
          </props.tr>
        </props.thead>
        <props.tbody className={props.classNames.tbody}>
          {props.data.rows.map((rowData, rowIndex) => (
            <props.tr
              key={rowIndex}
              row={rowIndex + 1}
              className={props.classNames.tr}
            >
              {rowData.map((cellData, colIndex) => (
                <props.td
                  key={colIndex}
                  row={rowIndex + 1}
                  col={colIndex}
                  className={props.classNames.td}
                >
                  {cellData}
                </props.td>
              ))}
            </props.tr>
          ))}
        </props.tbody>
      </props.table>
    </props.root>
  );
};

const defaultProps = {
  className: 'recomp-table',
  classNames: {
    table: 'table',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    th: 'th',
    td: 'td',
  },
  root: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <div className={className}>{children}</div>,
  table: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <table className={className}>{children}</table>,
  thead: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <thead className={className}>{children}</thead>,
  tbody: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <tbody className={className}>{children}</tbody>,
  tr: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <tr className={className}>{children}</tr>,
  th: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <th className={className}>{children}</th>,
  td: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <td className={className}>{children}</td>,
};
