import React from 'react';

import { DropZone, findImageItem } from '@recomp/dropzone';
import '../stories.scss';

export default {
  title: 'Components/DropZone',
  component: DropZone,
  argTypes: {},
};

const Template = (args) => <DropZone {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  onDrop: (items) => {
    console.log(items);
    findImageItem(items)
      .then((imageItem) => {
        console.log(imageItem);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
