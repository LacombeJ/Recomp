import * as React from 'react';

import * as prism from 'prismjs';

import * as util from '@recomp/utility/common';

interface PrismProps {
  className?: string;
  classNames?: {
    inline?: string;
    block?: string;
    lineNumbers?: string;
  };
  style?: React.CSSProperties;
  lang?: string;
  inline?: boolean;
  children?: string;
}

const Prism = (props: PrismProps) => {
  props = util.structureUnion(defaultProps, props);

  const { style } = props;

  const className = util.classnames({
    [props.className]: true,
    [prismLang(props.lang)]: true,
  });

  const codeRef: React.MutableRefObject<HTMLElement> = React.useRef();

  React.useEffect(() => {
    if (codeRef.current) {
      prism.highlightElement(codeRef.current);
    }
  });

  let text = props.children;
  if (!text || text === '') text = ' ';

  if (props.inline) {
    return (
      <span className={props.classNames.inline}>
        <code className={props.className} style={style} ref={codeRef}>
          {text}
        </code>
      </span>
    );
  } else {
    return (
      <div className={props.classNames.block}>
        <pre className={props.classNames.lineNumbers}>
          <code className={className} style={style} ref={codeRef}>
            {text}
          </code>
        </pre>
      </div>
    );
  }
};

const defaultProps: PrismProps = {
  className: 'recomp-prism',
  classNames: {
    inline: 'recomp-prism-inline',
    block: 'recomp-prism-block',
    lineNumbers: 'line-numbers',
  },
  inline: false,
  lang: 'js',
};

const prismLang = (lang: string) => {
  return 'language-' + (lang && lang.match(/^[^ \t]+(?=[ \t]|$)/)) || '.';
};

export default Prism;
