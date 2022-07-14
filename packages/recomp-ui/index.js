const Recomp = {};

// ----------------------------------------------------------------------------

import Root from './src/elements/Root';
export { Root }
Recomp.Root = Root;

import Stack from './src/elements/Stack';
export { Stack }
Recomp.Stack = Stack;

// ----------------------------------------------------------------------------

import ScrollPane from './src/widgets/ScrollPane';
export { ScrollPane }
Recomp.ScrollPane = ScrollPane;

import Split from './src/widgets/Split';
export { Split }
Recomp.Split = Split;

// ----------------------------------------------------------------------------

import { Button } from './src/Button';
import { Header } from './src/Header';
import { Page } from './src/Page'

export { Button, Header, Page };

export default Recomp;