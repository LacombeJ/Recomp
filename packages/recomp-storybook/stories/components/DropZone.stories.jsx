import React from 'react';

import { DropZone, findImageItem } from '@recomp/dropzone';
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

        findImageItem(items)
          .then((imageItem) => {
            console.log(imageItem);
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
