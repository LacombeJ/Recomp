import React from 'react';

import { DropZone, transfer } from '@recomp/dropzone';
import '../stories.scss';

export default {
  title: 'Components/DropZone',
  component: DropZone,
  argTypes: {},
};

const Template = (args) => {
  return (
    <DropZone
      {...args}
      onDrop={(items) => {
        console.log(items);

        for (const item of items) {
          if (item.kind === 'string') {
            item.item.getAsString((text) => {
              console.log(text);
            });
          }
        }

        transfer
          .parseTransferList(items)
          .then((item) => {
            console.log('resulting transfer:');
            console.log(item);
            transfer.getTransferItemAsImage(item).then((item) => {
              console.log('as image?: ', item);
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

const TemplateContext = (args) => {
  return (
    <div>
      <DropZone.Context />
      {/* <div
        style={{ position: 'fixed', inset: '0', backgroundColor: 'blue' }}
      ></div> */}
      This is a drop zone context. Drop anywhere.
    </div>
  );
};

export const Context = TemplateContext.bind({});
Context.args = {};
