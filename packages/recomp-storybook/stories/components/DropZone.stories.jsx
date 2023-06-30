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
        console.log('Begin Items------------');
        for (const item of items) {
          if (item.file) {
            console.log(item.file);
          } else {
            console.log(item.data);
          }
        }
        console.log('End Items------------');

        transfer
          .collectTransferList(items)
          .then((transferItems) => {
            console.log('resulting transfer items:');
            console.log(transferItems);
            transfer.findTransferItemAsImage(transferItems).then((item) => {
              console.log('as image?: ', item);
            }).catch((err) => {
              console.error(err);
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
