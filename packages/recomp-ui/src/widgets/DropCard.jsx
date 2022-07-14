import React from "react";
import PropTypes from "prop-types";
import stylePropType from "react-style-proptype";

import { classnames } from "@recomp/utils";
import { Collapse, Expand } from "@recomp/icons";
import { useStateOrProps, useHover } from "@recomp/hooks";

/**
 * Collapsible name dropcard / card
 * @param {DropCard.defaultProps} props
 */
const DropCard = (props) => {
  const { style } = props;

  const [hover, handleMouseEnter, handleMouseLeave] = useHover();

  const [expanded, setExpanded] = useStateOrProps(
    props.defaultExpanded,
    props.expanded,
    props.onCollapse
  );

  const classNames = {
    ...DropCard.defaultProps.classNames,
    ...props.classNames,
  };

  const className = classnames({
    [props.className]: true,
    expanded,
    hover,
  });

  const handleClick = (e) => {
    setExpanded(!expanded);
  };

  return (
    <div className={className} style={style}>
      <div
        className={classNames.head}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={classNames.icon}>{props.icon}</span>
        <div className={classNames.label}>
          <span className={classNames.title}>{props.title}</span>
          <span className={classNames.subtitle}>{props.subtitle}</span>
        </div>
        <span className={classNames.control}>
          {props.controlIcon(expanded)}
        </span>
      </div>
      {expanded ? (
        <div className={classNames.body}>{props.children}</div>
      ) : null}
    </div>
  );
};

const controlIconCallback = (expanded) => {
  if (expanded) {
    return <Collapse></Collapse>;
  } else {
    return <Expand></Expand>;
  }
};

DropCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classNames: PropTypes.shape({
    head: PropTypes.string,
    control: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    body: PropTypes.string,
    hover: PropTypes.string,
  }),
  style: stylePropType,
  defaultExpanded: PropTypes.bool,
  expanded: PropTypes.bool,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
  controlIcon: PropTypes.func,
  onCollapse: PropTypes.func,
};

DropCard.defaultProps = {
  /** @type {import('react').ReactNode} */
  children: undefined,
  className: "recomp-dropcard",
  classNames: {
    head: "head",
    control: "control",
    icon: "icon",
    label: "label",
    title: "title",
    subtitle: "subtitle",
    body: "body",
  },
  /** @type {React.CSSProperties} */
  style: {},
  /** @type  {boolean} */
  defaultExpanded: undefined,
  /** @type  {boolean} */
  expanded: undefined,
  /** @type {import('react').ReactNode} */
  icon: undefined,
  /** @type {import('react').ReactNode} */
  title: undefined,
  /** @type {import('react').ReactNode} */
  subtitle: undefined,
  controlIcon: controlIconCallback,
  onCollapse: () => {},
};

export default DropCard;
