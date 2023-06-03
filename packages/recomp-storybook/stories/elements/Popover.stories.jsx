import React from 'react';

import { usePopover, Popover, Button, Entry } from '@recomp/core';
import { Folder, createModel } from '@recomp/folder';

import { IconX } from '@tabler/icons-react';
import '../stories.scss';

export default {
  title: 'Elements/Popover',
  component: Popover,
  argTypes: {},
};

const Template = (args) => {
  const { visible, setContainerRef, setAnchorRef, setVisible, position } =
    usePopover();
  return (
    <div>
      <Popover
        {...args}
        visible={visible}
        position={position}
        setContainerRef={setContainerRef}
      >
        <div style={{ padding: '4px 16px 4px 16px' }}>
          <h3>Popover</h3>
        </div>
      </Popover>
      <Button onClick={() => setVisible(true)} setRef={setAnchorRef}>
        Open
      </Button>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  children: <div>Popover</div>,
};

const testFolderModel = [
  {
    id: '.git',
    items: ['index'],
  },
  {
    id: 'node_modules',
    items: ['.cache'],
  },
  {
    id: 'src',
    items: [
      {
        id: 'app',
        items: ['App.tsx', 'App.scss'],
      },
      'index.ts',
      'index.html',
    ],
  },
  'package.json',
  'README.md',
];

const CustomEntryTemplate = (args) => {
  const [selected, setSelected] = React.useState(null);

  const model = React.useMemo(() => {
    return createModel(testFolderModel);
  }, [testFolderModel]);

  const pathMap = React.useMemo(() => {
    const pathMap = {};

    const findPaths = (id, pathMap, current) => {
      const item = model.byId[id];
      const fullPath = `${current} / ${id}`;
      pathMap[id] = fullPath;
      for (const childId of item.items) {
        findPaths(childId, pathMap, fullPath);
      }
    };
    for (const rootId of model.rootIds) {
      findPaths(rootId, pathMap, '');
    }

    return pathMap;
  }, [testFolderModel]);

  const path = pathMap[selected];

  const popover = usePopover();

  const handleOnEntryFocus = (focus) => {
    if (focus) {
      // Since focus might be lost in popover element, only set visible
      // when it is focused, otherwise let popover element control when
      // to turn invisible
      popover.setVisible(true);
    }
  };

  const setEntryRef = (element) => {
    popover.setAnchorRef(element);
    popover.setFocusableRef(element);
  };

  const handleSelect = (id) => {
    setSelected(id);
  };

  return (
    <div>
      <Entry setRef={setEntryRef} onFocus={handleOnEntryFocus}>
        {path}
      </Entry>
      <Popover
        visible={popover.visible}
        setContainerRef={popover.setContainerRef}
        position={popover.position}
        containerStyle={{
          width: `${popover.dimensions.width}px`,
        }}
      >
        <div style={{ padding: '8px' }}>
          <Folder
            defaultModel={model}
            selectable={true}
            selected={selected}
            onSelect={handleSelect}
          ></Folder>
        </div>
      </Popover>
    </div>
  );
};

export const CustomEntry = CustomEntryTemplate.bind({});
CustomEntry.args = {};
