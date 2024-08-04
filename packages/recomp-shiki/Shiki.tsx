import * as React from 'react';

import * as shiki from 'shiki';

import { classnamesEXP } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

interface ShikiProps {
  className?: string;
  classNames?: {
    inline?: string;
    block?: string;
    lineNumbers?: string;
  };
  style?: React.CSSProperties;
  /** Code language accepting short and full names (ex: `js` or `javascript`) */
  language?: string;
  /** Shiki code theme */
  theme?: string;
  /** If undefined, block if source has newline chars, inline otherwise */
  display?: 'inline' | 'block';
  /** If true, line numbers will be shown (defaults to true if undefined) */
  lineNumbers?: boolean;
  /** Source code text to display */
  children?: string;
}

const Shiki = (props: ShikiProps) => {
  props = propUnion(defaultProps, props);

  const { style } = props;

  let lang = props.language ? props.language : 'text'; // text if lang not provided
  if (translations[lang]) {
    lang = translations[lang];
  }

  const theme = props.theme ? props.theme : (defaultProps.theme as string);

  let text: string = props.children ?? ' ';

  const [content, setContent] = React.useState({ text, isHTML: false });

  const display = determineDisplay(text, props.display);
  const inline = display === 'inline';

  // TODO: Create shiki highlighter for custom themes
  React.useEffect(() => {
    const transformers = (lang: string): shiki.ShikiTransformer[] => [
      {
        pre(node) {
          if (inline) node.tagName = 'span';
          this.addClassToHast(node, className);

          if (lang === 'text') {
            this.addClassToHast(node, 'language-none');
          } else {
            this.addClassToHast(node, `language-${lang}`);
          }
        },
        postprocess(html, options) {
          // Note: This "postprocess" hook is only called when calling `codeToHTML`
          let result = updateBackground(html, theme);
          if (result) html = result;

          result = removeAdditionalLine(html, lang);
          if (result) html = result;

          return html;
        },
      },
    ];

    const displayError = (err: any, text: string) => {
      console.error(err);
      setContent({ text, isHTML: false });
    };

    // Shiki line numbers handled with: https://github.com/shikijs/shiki/issues/3
    shiki
      .codeToHtml(text, { lang, theme, transformers: transformers(lang) })
      .then((html) => {
        setContent({ text: html, isHTML: true });
      })
      .catch((err) => {
        if (!shiki.bundledLanguages[lang]) {
          // Text fallback
          shiki
            .codeToHtml(text, {
              lang: 'text',
              theme,
              transformers: transformers('text'),
            })
            .then((html) => {
              setContent({ text: html, isHTML: true });
            })
            .catch((err) => {
              displayError(err, text);
            });
        } else {
          displayError(err, text);
        }
      });
  }, [text, lang, theme, inline]);

  const className = classnamesEXP(
    [props.className, true],
    [props.classNames?.inline, inline],
    [props.classNames?.block, !inline],
    [props.classNames?.lineNumbers, !inline && !!props.lineNumbers]
  );

  if (content.isHTML) {
    return (
      <div
        dangerouslySetInnerHTML={
          content.isHTML ? { __html: content.text } : undefined
        }
      ></div>
    );
  }

  const inner = <code style={style}>{content.text}</code>;

  if (inline) {
    return <span className={className}>{inner}</span>;
  } else {
    return <pre className={className}>{inner}</pre>;
  }
};

const defaultProps: ShikiProps = {
  className: 'recomp-shiki',
  classNames: {
    inline: 'inline',
    block: 'block',
    lineNumbers: 'line-numbers',
  },
  language: 'javascript',
  theme: 'dark-plus',
  lineNumbers: true,
};

type Display = 'inline' | 'block';

const determineDisplay = (text: string, display?: Display): Display => {
  if (display) return display;
  return /\r?\n/.test(text) ? 'block' : 'inline';
};

const updateBackground = (html: string, theme: string): string | void => {
  // Not sure best way to update background style. For vs-dark, I want the
  // background to be a bit darker.

  if (theme === 'dark-plus') {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const pre = temp
      .getElementsByClassName('recomp-shiki')
      .item(0) as HTMLElement;
    if (pre) {
      pre.style.backgroundColor = '#141414';

      const content = temp.innerHTML || temp.textContent;
      if (content) {
        return content;
      }
    }
  }
};

const removeAdditionalLine = (html: string, lang: string): string | void => {
  // The scss solution to hide extra last line works except for plaintext
  // With the "text" language, peform an extra check here.
  if (lang !== 'text') return;
  let modified = false;

  const temp = document.createElement('div');
  temp.innerHTML = html;

  const code = temp.getElementsByTagName('code').item(0);
  if (code) {
    const last = code.children.item(code.children.length - 1);
    if (last?.tagName === 'SPAN' && last?.classList.contains('line')) {
      if (last.children.length === 1) {
        const inner = last.children.item(0);
        if (inner?.childNodes.length === 0) {
          code.removeChild(last);
          modified = true;
        }
      }
    }
  }

  if (modified) {
    const content = temp.innerHTML || temp.textContent;
    if (content) {
      return content;
    }
  }
};

// Additional translations
const translations = {
  nasm: 'asm',
};

export default Shiki;
