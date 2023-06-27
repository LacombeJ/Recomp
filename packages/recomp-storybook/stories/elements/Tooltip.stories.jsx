import React from 'react';

import { Button, Tooltip, useTooltip } from '@recomp/core';
import '../stories.scss';
import { useMouseHover } from '@recomp/hooks';

export default {
  title: 'Elements/Tooltip',
  component: Tooltip,
  argTypes: {},
};

const Template = (args) => <Tooltip {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Tooltip - For hover descriptions',
};

const TemplateContext = (args) => {
  const tooltip = useTooltip();
  return (
    <div>
      <Tooltip.Context {...tooltip.contextProps}></Tooltip.Context>

      <div
        {...tooltip.contentProps('This is a div')}
        style={{
          border: '1px solid white',
          padding: '8px',
          width: '200px',
          marginBottom: '32px',
        }}
      >
        Hover over div for tooltip
      </div>
      <CustomButton onHover={tooltip.content('This is a button')}>
        Hover over button for toolip
      </CustomButton>
    </div>
  );
};

const CustomButton = (props) => {
  const hover = useMouseHover({
    onHover: (hover, position) => {
      console.log('custom hover?', hover, position);
      props.onHover(hover, position);
    },
  });
  return (
    <div style={{ display: 'inline' }} {...hover.itemProps}>
      <Button {...props}></Button>
    </div>
  );
};

export const Context = TemplateContext.bind({});
Context.args = {};
