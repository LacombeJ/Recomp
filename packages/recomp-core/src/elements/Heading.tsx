import * as React from 'react';

interface HeadingProps {
  className?: string;
  style?: React.CSSProperties;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

const Heading = (props: HeadingProps) => {
  props = { ...defaultProps, ...props };

  if (!props.level) {
    props.level = 1;
  }

  const className = props.className;
  const style = props.style;
  const HeadingElement = headingMap[props.level];
  return (
    <HeadingElement className={className} style={style}>
      {props.children}
    </HeadingElement>
  );
};

const defaultProps = {
  className: 'recomp-heading',
  style: {},
};

interface HeadingElementProps {
  className: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
}

const headingMap = {
  1: (props: HeadingElementProps) => <h1 {...props} />,
  2: (props: HeadingElementProps) => <h2 {...props} />,
  3: (props: HeadingElementProps) => <h3 {...props} />,
  4: (props: HeadingElementProps) => <h4 {...props} />,
  5: (props: HeadingElementProps) => <h5 {...props} />,
  6: (props: HeadingElementProps) => <h6 {...props} />,
};

export default Heading;
