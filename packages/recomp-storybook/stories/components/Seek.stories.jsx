import React from 'react';

import { Seek } from '@recomp/seek';
import '../stories.scss';

import {
  IconSearch,
  IconDoorEnter,
  IconDoorExit,
  IconDeviceFloppy,
  IconNote,
  IconNotes,
} from '@tabler/icons-react';
import { useFuse } from '@recomp/hooks';

export default {
  title: 'Components/Seek',
  component: Seek,
  argTypes: {},
};

const items = [
  {
    name: 'Open Document',
    description: 'Open a new document for editing',
    icon: IconDoorEnter,
  },
  {
    name: 'Close Document',
    description: 'Close the currently opened document',
    icon: IconDoorExit,
  },
  {
    name: 'Save Document',
    description: 'Save the document to file system',
    icon: IconDeviceFloppy,
  },
  {
    name: 'New Document',
    description: 'Create a new document',
    icon: IconNotes,
  },
];

const Template = (args) => {
  const [selected, setSelected] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');
  const search = useFuse(items, { keys: ['name', 'description'] });

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const results = React.useMemo(() => {
    const results = search(searchText);
    setSelectedIndex(0);
    if (results.length > 0) {
      setSelected(results[0].name);
    } else {
      setSelected(null);
    }
    return results;
  }, [searchText]);

  const handleMove = (direction) => {
    if (direction === 'down' && selectedIndex < results.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelected(results[selectedIndex + 1].name);
    } else if (direction === 'up' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelected(results[selectedIndex - 1].name);
    }
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <Seek
        {...args}
        children={results.map((item) => {
          return (
            <Item
              key={item.name}
              icon={item.icon}
              name={item.name}
              selected={item.name === selected}
            >
              {item.description}
            </Item>
          );
        })}
        onChange={handleChange}
        onMove={handleMove}
      />
    </div>
  );
};

const Item = (props) => {
  let icon = null;
  if (props.icon) {
    icon = <props.icon></props.icon>;
  }
  return (
    <Seek.Item selected={props.selected} icon={icon}>
      <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
        {props.name}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(200, 200, 200, 0.9)' }}>
        {props.children}
      </div>
    </Seek.Item>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  icon: <IconSearch></IconSearch>,
};
