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
  language?: string | object;
  /** Shiki code theme */
  theme?: string;
  /** If undefined, block if source has newline chars, inline otherwise */
  display?: 'inline' | 'block';
  /** If true, line numbers will be shown (defaults to true if undefined) */
  lineNumbers?: boolean;
  /** Source code text to display */
  children?: string;
}

type HighlighterMode = 'built-in' | 'custom';

/**
 * A class to help simplify highlighter usage. This will try to do what shiki
 * already does with their shorthand functions but add support for custom
 * languages and themes dynamically. This will be static instanced like the
 * default unexposed highlighter.
 */
class HighlighterHelper {
  highlighter: shiki.Highlighter | null = null;
  mode: HighlighterMode = 'built-in';
  customLangs: Record<string, object> = {};

  /**
   * Gets the name of the provided language and creates a record of the language object
   * if a custom language was provided. If this is a built-in language and the language
   * is not found, will return "text".
   */
  language(lang: string | object | undefined): string {
    if (!lang) return 'text';

    if (typeof lang === 'string') {
      if (translations[lang]) {
        lang = translations[lang] as string;
      }
      if (!shiki.bundledLanguages[lang]) {
        return 'text';
      }
      return lang;
    } else {
      const name = lang['name'] as string;
      if (!name) return 'text';
      this.customLangs[name] = lang;
      return name;
    }
  }

  async codeToHtml(
    code: string,
    lang: string,
    theme: string,
    transformers?: shiki.ShikiTransformer[]
  ): Promise<string> {
    if (this.customLangs[lang]) {
      this.mode = 'custom';
    }

    if (this.mode === 'built-in') {
      return await shiki.codeToHtml(code, { lang, theme, transformers });
    } else {
      if (this.highlighter === null) {
        this.highlighter = await shiki.createHighlighter({
          langs: ['text'],
          themes: [],
        });
      }

      const loadedLangs = this.highlighter.getLoadedLanguages();
      const loadedThemes = this.highlighter.getLoadedThemes();

      if (!loadedLangs.includes(lang)) {
        if (this.customLangs[lang]) {
          await this.highlighter.loadLanguage(this.customLangs[lang] as any);
        } else {
          await this.highlighter.loadLanguage(lang as any);
        }
      }

      if (!loadedThemes.includes(theme)) {
        await this.highlighter.loadTheme(theme as any);
      }

      return this.highlighter.codeToHtml(code, { lang, theme, transformers });
    }
  }
}
const highligher = new HighlighterHelper();

/**
 * Shiki react component
 */
const Shiki = (props: ShikiProps) => {
  props = propUnion(defaultProps, props);

  const { style } = props;

  const lang = highligher.language(props.language);

  const theme = props.theme ? props.theme : (defaultProps.theme as string);

  let text: string = props.children ?? ' ';

  const [content, setContent] = React.useState({ text, isHTML: false });

  const display = determineDisplay(text, props.display);
  const inline = display === 'inline';

  const className = classnamesEXP(
    [props.className, true],
    [props.classNames?.inline, inline],
    [props.classNames?.block, !inline],
    [props.classNames?.lineNumbers, !inline && !!props.lineNumbers]
  );

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
        html = updateBackground(html, theme);
        html = removeAdditionalLine(html, lang);
        html = applyCodeStyle(html, style);

        return html;
      },
    },
  ];

  // TODO: Create shiki highlighter for custom themes
  React.useEffect(() => {
    const displayError = (err: any, text: string) => {
      console.error(err);
      setContent({ text, isHTML: false });
    };

    // Shiki line numbers handled with: https://github.com/shikijs/shiki/issues/3

    highligher
      .codeToHtml(text, lang, theme, transformers(lang))
      .then((html) => {
        setContent({ text: html, isHTML: true });
      })
      .catch((err) => {
        displayError(err, text);
      });
  }, [text, lang, theme, inline, highligher]);

  if (content.isHTML) {
    return (
      <span
        dangerouslySetInnerHTML={
          content.isHTML ? { __html: content.text } : undefined
        }
      ></span>
    );
  }

  // Code class and style is controlled by shiki, no point in adding here
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

const updateBackground = (html: string, theme: string): string => {
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

  return html;
};

const removeAdditionalLine = (html: string, lang: string): string => {
  return modifyHTML(html, (div) => {
    // The scss solution to hide extra last line works except for plaintext
    // With the "text" language, peform an extra check here.
    if (lang !== 'text' && lang !== 'plain' && lang !== 'plaintext')
      return false;

    const code = div.getElementsByTagName('code').item(0);
    if (code) {
      const last = code.children.item(code.children.length - 1);
      if (last?.tagName === 'SPAN' && last?.classList.contains('line')) {
        if (last.children.length === 1) {
          const inner = last.children.item(0);
          if (inner?.childNodes.length === 0) {
            code.removeChild(last);
            return true;
          }
        }
      }
    }

    return false;
  });
};

const applyCodeStyle = (
  html: string,
  codeStyle: React.CSSProperties | undefined
): string => {
  return modifyHTML(html, (div) => {
    if (!codeStyle) return false;

    const code = div.getElementsByTagName('code').item(0);
    if (code) {
      Object.assign(code.style, codeStyle);
      return true;
    }

    return false;
  });
};

const modifyHTML = (
  html: string,
  modifier: (div: HTMLDivElement) => boolean
): string => {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  if (modifier(temp)) {
    const content = temp.innerHTML || temp.textContent;
    if (content) {
      return content;
    }
  }

  return html;
};

// Additional translations
const translations = {
  nasm: 'asm',
};

export default Shiki;
