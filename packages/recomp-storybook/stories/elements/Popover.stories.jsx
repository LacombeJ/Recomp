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
            model={model}
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

const TemplateScroll = (args) => {
  const popover1 = usePopover();
  const popover2 = usePopover();
  return (
    <div style={{ }}>
      <Popover
        {...args}
        visible={popover1.visible}
        position={popover1.position}
        setContainerRef={popover1.setContainerRef}
      >
        <div style={{ padding: '4px 16px 4px 16px' }}>
          <h3>Popover (1)</h3>
        </div>
      </Popover>
      <Popover
        {...args}
        visible={popover2.visible}
        position={popover2.position}
        setContainerRef={popover2.setContainerRef}
      >
        <div style={{ padding: '4px 16px 4px 16px' }}>
          <h3>Popover (2)</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>...</h3>
          <h3>End.</h3>
        </div>
      </Popover>
      <Button onClick={() => popover1.setVisible(true)} setRef={popover1.setAnchorRef}>
        Open first popover
      </Button>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <Button onClick={() => popover2.setVisible(true)} setRef={popover2.setAnchorRef}>
        Open second popover
      </Button>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
      <div>Text here</div>
    </div>
  );
};

export const WithinScrollable = TemplateScroll.bind({});
WithinScrollable.args = {
  children: <div>Popover</div>,
};