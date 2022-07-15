const Recomp = {};

// ----------------------------------------------------------------------------

// Fragments

import Delay from "./src/fragments/Delay";
export { Delay };
Recomp.Delay = Delay;

import ErrorBoundary from "./src/fragments/ErrorBoundary";
export { ErrorBoundary };
Recomp.ErrorBoundary = ErrorBoundary;

import Page from "./src/fragments/Page";
export { Page };
Recomp.Page = Page;

import ZeroWidth from "./src/fragments/ZeroWidth";
export { ZeroWidth };
Recomp.ZeroWidth = ZeroWidth;

// ----------------------------------------------------------------------------

// Elements

import Root from "./src/elements/Root";
export { Root };
Recomp.Root = Root;

import Stack from "./src/elements/Stack";
export { Stack };
Recomp.Stack = Stack;

// ----------------------------------------------------------------------------

// Widgets

import DropCard from "./src/widgets/DropCard";
export { DropCard };
Recomp.DropCard = DropCard;

import ScrollPane from "./src/widgets/ScrollPane";
export { ScrollPane };
Recomp.ScrollPane = ScrollPane;

import Split from "./src/widgets/Split";
export { Split };
Recomp.Split = Split;

// ----------------------------------------------------------------------------

export default Recomp;
