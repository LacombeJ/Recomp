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
import { useSearch, highlightRanges } from '@recomp/hooks';

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

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const results = useSearch(searchText, items, {
    keys: ['name', 'description'],
  });

  const highlightText = (text, ranges) => {
    return highlightRanges(text, ranges, (substring, index, match) => {
      return (
        <div
          key={index}
          style={{
            color: match ? 'rgb(90, 200, 230)' : 'rgb(210, 210, 210)',
            display: 'inline',
          }}
        >
          {substring}
        </div>
      );
    });
  };

  const highlighted = React.useMemo(() => {
    const highlighted = [];

    for (const result of results) {
      const { item, ranges } = result;
      // Not sure why I have to wrap in div, this freezes if I don't...
      // specifically the name property, can't React node arrays be passed as a
      // property?
      highlighted.push({
        key: item.name,
        name: <div>{highlightText(item.name, ranges.name)}</div>,
        description: (
          <div>{highlightText(item.description, ranges.description)}</div>
        ),
        icon: item.icon,
      });
    }

    // Whenever rendered results change, set selected index to first item
    // (if in its own separate useEffect, rendered change will be slightly delayed)
    setSelectedIndex(0);
    if (results.length > 0) {
      setSelected(results[0].item.name);
    }

    return highlighted;
  }, [results]);

  React.useEffect(() => {}, [results]);

  const handleMove = (direction) => {
    if (direction === 'down' && selectedIndex < results.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelected(results[selectedIndex + 1].item.name);
    } else if (direction === 'up' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelected(results[selectedIndex - 1].item.name);
    }
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <Seek
        {...args}
        children={highlighted.map((item) => {
          return (
            <Item
              key={item.key}
              icon={item.icon}
              name={item.name}
              selected={item.key === selected}
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
