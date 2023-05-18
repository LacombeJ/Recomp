import * as React from 'react';

import * as util from '@recomp/utility/common';
import { ZeroWidth } from '../fragments/ZeroWidth';
import { useNestedProps } from '@recomp/hooks';
import { NestBreak } from '../fragments/NestBreak';

interface ListProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'unordered' | 'ordered';
  bullet?: Bullet;
  customBullet?: any;
  position?: 'outside' | 'inside';
  level?: number;
  nesting?: Nesting;
  children?: React.ReactNode;
}

export const List = (props: ListProps) => {
  props = util.structureUnion(defaultProps, props);
  const { className } = props;

  const bulletList = bulletsMap[props.type];
  const ListElement = tagMap[props.type];

  if (props.nesting === 'bullet' || props.nesting === 'both') {
    props.bullet = bulletList[props.level] as Bullet;
  }

  const style = {
    ...props.style,
    listStyleType: bullet(props.bullet, props.type, props.customBullet),
    listStylePosition: props.position,
  };

  const [nest] = useNestedProps((child: any) => {
    if (props.nesting === 'none') {
      return { break: true };
    }

    if (child && child.type && child.type.identifier === NestBreak.identifier) {
      return { break: true };
    }

    // List item
    if (child && child.type && child.type.identifier === List.Item.identifier) {
      const itemProps: any = {
        nesting: props.nesting === 'color' || props.nesting === 'both',
      };
      if (props.level !== undefined) {
        itemProps.level = props.level;
      }
      if (props.customBullet) {
        itemProps.customBullet = props.customBullet;
      }
      return { props: itemProps };
    }

    // Sublist
    if (child && child.type && child.type.identifier === List.identifier) {
      return {
        props: {
          nesting: props.nesting,
          level: (props.level + 1) % 3,
        },
        break: true, // break because sublist will call this again anyway
      };
    }
  });

  return (
    <ListElement className={className} style={style}>
      {nest(props.children)}
    </ListElement>
  );
};
List.identifier = 'recomp-list';

const defaultProps: ListProps = {
  className: 'recomp-list',
  type: 'unordered',
  bullet: 'default',
  position: 'outside',
  level: 0,
  nesting: 'none',
};

const ulBullets = ['disc', 'circle', 'square'];
const olBullets = ['decimal', 'lower-roman', 'lower-alpha'];

const tagMap = {
  unordered: (props: any) => <ul {...props} />,
  ordered: (props: any) => <ol {...props} />,
};

const bulletsMap = {
  unordered: ulBullets,
  ordered: olBullets,
};

const bullet = (
  bullet: Bullet,
  type: 'unordered' | 'ordered',
  content: any
) => {
  if (content) {
    return 'none';
  }
  if (bullet === 'default') {
    return type === 'ordered' ? 'decimal' : 'disc';
  }
  return bullet;
};

type Bullet =
  | 'default'
  | 'disc'
  | 'circle'
  | 'decimal'
  | 'decimal-leading-zero'
  | 'lower-alpha'
  | 'lower-greek'
  | 'lower-roman'
  | 'none'
  | 'square'
  | 'upper-alpha'
  | 'upper-greek'
  | 'upper-latin'
  | 'upper-roman'
  | 'initial'
  | 'inherit';

type Nesting = 'none' | 'color' | 'bullet' | 'both';

// ----------------------------------------------------------------------------

interface ItemProps {
  className?: string;
  classNames?: {
    content?: string;
    level?: string;
  };
  style?: React.CSSProperties;
  customBullet?: any;
  level?: number;
  nesting?: boolean;
  children?: React.ReactNode;
}

const Item = (props: ItemProps) => {
  props = util.structureUnion(itemDefaultProps, props);
  // const { className } = props;

  const className = util.classnames({
    [props.className]: true,
    [`${props.classNames.level}-${props.level + 1}`]: props.nesting,
  });

  const style = {
    ...props.style,
    listStyleType: props.customBullet ? 'none' : undefined,
  };

  let children = props.children;
  if (util.isNullOrWhitespace(children)) {
    children = <ZeroWidth />;
  }

  if (props.customBullet) {
    return (
      <li className={className} style={style}>
        <span className={props.classNames.content} style={{}}>
          {props.customBullet}
        </span>
        {children}
      </li>
    );
  } else {
    return (
      <li className={className} style={style}>
        {children}
      </li>
    );
  }
};
Item.identifier = 'recomp-list-item';
List.Item = Item;

const itemDefaultProps: ItemProps = {
  className: 'recomp-list-item',
  classNames: {
    content: 'content',
    level: 'level',
  },
  level: 0,
  nesting: false,
};
