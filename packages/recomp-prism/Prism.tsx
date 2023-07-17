import * as React from 'react';

import * as prism from 'prismjs';

import 'prismjs/plugins/line-numbers/prism-line-numbers';

import * as util from '@recomp/utility/common';

interface PrismProps {
  className?: string;
  classNames?: {
    inline?: string;
    block?: string;
    lineNumbers?: string;
  };
  style?: React.CSSProperties;
  /** Code language accepting short and full names (ex: `js` or `javascript`) */
  language?: string;
  /** If undefined, block if source has newline chars, inline otherwise */
  display?: 'inline' | 'block';
  /** If true, line numbers will be shown (defaults to true if undefined) */
  lineNumbers?: boolean;
  /** Source code text to display */
  children?: string;
}

const Prism = (props: PrismProps) => {
  props = util.propUnion(defaultProps, props);

  const { style } = props;

  let text = props.children;
  if (!text || text === '') text = ' ';

  // If display not defined, determine display from children
  const display = determineDisplay(text, props.display);
  const inline = display === 'inline';

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.inline]: inline,
    [props.classNames.block]: !inline,
    [props.classNames.lineNumbers]: !inline && props.lineNumbers,
  });

  const codeClassName = util.classnames({
    [prismLang(props.language)]: !!props.language,
  });

  const codeRef: React.MutableRefObject<HTMLElement> = React.useRef();

  React.useEffect(() => {
    if (codeRef.current) {
      prism.highlightElement(codeRef.current);
    }
  });

  const inner = (
    <code className={codeClassName} style={style} ref={codeRef}>
      {text}
    </code>
  );

  if (inline) {
    return <span className={className}>{inner}</span>;
  } else {
    return <pre className={className}>{inner}</pre>;
  }
};

const defaultProps: PrismProps = {
  className: 'recomp-prism',
  classNames: {
    inline: 'inline',
    block: 'block',
    lineNumbers: 'line-numbers',
  },
  language: 'javascript',
  lineNumbers: true,
};

const prismLang = (lang: string) => {
  return 'language-' + (lang && lang.match(/^[^ \t]+(?=[ \t]|$)/)) || '.';
};

const determineDisplay = (
  text: string,
  display?: 'inline' | 'block'
): 'inline' | 'block' => {
  if (!display) {
    if (/\r?\n/.test(text)) {
      return 'block';
    } else {
      return 'inline';
    }
  } else {
    return display;
  }
};

export default Prism;
