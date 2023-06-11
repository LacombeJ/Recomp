import React from 'react';

import { Alert } from '@recomp/core';
import '../stories.scss';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';

export default {
  title: 'Elements/Alert',
  component: Alert,
  argTypes: {},
};

const Template = (args) => <Alert {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'Alert!',
  icon: <IconAlertTriangle size={28}></IconAlertTriangle>,
  children: 'Attention, this is an alert notification.',
  closeable: true,
};

const TemplateVariants = (args) => (
  <div>
    <Alert
      {...args}
      title="Alert Default"
      children="Default variant non-closeable alert with no icon"
    />
    <Alert
      {...args}
      title="Alert Primary"
      children="Primary variant non-closeable alert with no icon"
      variant="primary"
    />
    <Alert
      {...args}
      title="Alert Success"
      children="Success variant alert"
      icon={<IconCircleCheck size={28}></IconCircleCheck>}
      variant="success"
      closeable
    />
    <Alert
      {...args}
      title="Alert Warn"
      children="Warn variant alert"
      icon={<IconAlertTriangle size={28}></IconAlertTriangle>}
      variant="warn"
      closeable
    />
    <Alert
      {...args}
      title="Alert Danger"
      children="Danger variant alert"
      icon={<IconCircleX size={28}></IconCircleX>}
      variant="danger"
      closeable
    />
  </div>
);

export const Variants = TemplateVariants.bind({});
Variants.args = {
  style: { margin: '16px' },
};

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut etiam sit amet nisl purus in mollis. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Ac turpis egestas integer eget aliquet. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Suspendisse sed nisi lacus sed. Libero volutpat sed cras ornare arcu dui vivamus. Enim lobortis scelerisque fermentum dui faucibus. Purus sit amet luctus venenatis lectus. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed. Pretium viverra suspendisse potenti nullam ac tortor vitae purus. Augue eget arcu dictum varius duis at consectetur lorem donec. Neque laoreet suspendisse interdum consectetur libero. Non odio euismod lacinia at quis risus sed vulputate. Accumsan sit amet nulla facilisi morbi. Auctor augue mauris augue neque gravida in fermentum et sollicitudin.

Nisi vitae suscipit tellus mauris. Amet nulla facilisi morbi tempus iaculis. Volutpat odio facilisis mauris sit. Dolor sed viverra ipsum nunc. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Sit amet mattis vulputate enim nulla aliquet. Nec feugiat in fermentum posuere urna. Justo nec ultrices dui sapien eget mi proin sed. Quisque id diam vel quam elementum pulvinar etiam non. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Pellentesque sit amet porttitor eget dolor morbi non arcu risus. Morbi tristique senectus et netus. Faucibus purus in massa tempor nec. Varius vel pharetra vel turpis.

Et ligula ullamcorper malesuada proin libero nunc consequat interdum varius. At lectus urna duis convallis convallis tellus. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Porta lorem mollis aliquam ut porttitor. Ut sem nulla pharetra diam. Massa eget egestas purus viverra accumsan. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Eget nullam non nisi est sit. Purus faucibus ornare suspendisse sed nisi lacus. Fames ac turpis egestas maecenas pharetra convallis posuere. Nunc non blandit massa enim nec. Eros donec ac odio tempor. Malesuada fames ac turpis egestas sed tempus urna et pharetra. Aenean euismod elementum nisi quis. Molestie at elementum eu facilisis sed odio morbi quis. Facilisis sed odio morbi quis commodo. Nisl vel pretium lectus quam. Tincidunt vitae semper quis lectus nulla. Ac tortor dignissim convallis aenean et tortor.

Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Elit pellentesque habitant morbi tristique. Et netus et malesuada fames. Duis tristique sollicitudin nibh sit. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Eget felis eget nunc lobortis mattis aliquam. Massa id neque aliquam vestibulum morbi blandit. Libero enim sed faucibus turpis in eu. Nulla facilisi morbi tempus iaculis urna id. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec. Fames ac turpis egestas sed.

Tristique et egestas quis ipsum suspendisse. Eget nulla facilisi etiam dignissim diam quis enim lobortis. Rhoncus dolor purus non enim praesent elementum facilisis leo. Mi sit amet mauris commodo quis. Fames ac turpis egestas sed tempus. Rhoncus urna neque viverra justo nec ultrices dui. Diam ut venenatis tellus in. Turpis egestas maecenas pharetra convallis posuere morbi leo. Mauris commodo quis imperdiet massa tincidunt. Pellentesque nec nam aliquam sem et tortor consequat id porta. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim. Habitant morbi tristique senectus et netus et malesuada. Lectus mauris ultrices eros in cursus turpis massa. Sapien pellentesque habitant morbi tristique senectus et netus et malesuada. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Risus feugiat in ante metus dictum. Nec feugiat in fermentum posuere. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Mattis ullamcorper velit sed ullamcorper morbi. Neque egestas congue quisque egestas diam in.
`;

const TemplateLong = (args) => (
  <div>
    <Alert
      {...args}
      title="Error: text is too long"
      children={lorem}
      variant="danger"
      icon={<IconAlertTriangle size={28}></IconAlertTriangle>}
      closeable
    />
    <Alert
      {...args}
      title="@@@"
      children="@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
      variant="primary"
      closeable
    />
  </div>
);

export const LongText = TemplateLong.bind({});
LongText.args = {};
