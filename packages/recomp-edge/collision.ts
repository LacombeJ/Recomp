import {
  CollisionDetection,
  ClientRect,
  closestCenter,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { Active, DroppableContainer, RectMap } from '@dnd-kit/core/dist/store';
import { Coordinates } from '@dnd-kit/utilities';

/**
 * Calls closestCenter with calculations after adjusting each
 * droppable container size to the size of the active dragging
 * collision rect. This is "expands" the size of droppable slots
 * to fit the current active container and does the math for this.
 * (currently only works for vertical sortable lists)
 */
export const closestAdjustedCenter: CollisionDetection = (args) => {
  const droppableRects = closestAdjustedCenterRects(args);
  return closestCenter({
    ...args,
    droppableRects,
    collisionRect: {
      ...args.collisionRect,
    },
  });
};

/**
 * For closest center calculations but after adjusting each
 * droppable container size to the size of the active dragging
 * collision rect. This calculation does this by calculating how
 * every droppable container will change after sorting.
 */
export const closestAdjustedCenterRects = (args: {
  active: Active;
  collisionRect: ClientRect;
  droppableRects: RectMap;
  droppableContainers: DroppableContainer[];
  pointerCoordinates: Coordinates;
}): RectMap => {
  const droppableRects: RectMap = new Map();

  const collisionRect = args.collisionRect;
  let accumulatedSpace = 0; // adding droppable space, ignoring active item

  let lastBottom = 0;
  let activeFound = false;

  // Creating a sorted droppable container array
  const droppableContainers: { id: UniqueIdentifier; rect: ClientRect }[] = [];
  for (const droppableContainer of args.droppableContainers) {
    const droppableRect = args.droppableRects.get(droppableContainer.id);
    droppableContainers.push({
      id: droppableContainer.id,
      rect: { ...droppableRect },
    });
  }
  droppableContainers.sort(topPositionComparator);

  // Now perform calculations in sorted order from top -> down
  for (const droppableContainer of droppableContainers) {
    const droppableRect = droppableContainer.rect;

    const spacingBetween = droppableRect.top - lastBottom;
    const droppableHeight = droppableRect.height;
    lastBottom = droppableRect.bottom;

    accumulatedSpace += spacingBetween;

    // Now we will adjust the current droppable container to be the size
    // of the active dragging collision rect. But to position it correctly,
    // we will use the accumulated space substituting the active rect
    // (if already found before this item) with the position of the
    // current droppable container rect
    let top = accumulatedSpace;
    if (activeFound) {
      // instead of using size of active dragging, use size of current
      //
      // even though we are moving elements one by one instead
      // of swapping, because all other sizes of items before this one
      // has already been added, we can simply just adjust the top like this
      top += droppableHeight;
    }

    const adjustedRect: ClientRect = {
      ...droppableRect,

      top: top,
      height: collisionRect.height,
      bottom: top + collisionRect.height,
    };

    droppableRects.set(droppableContainer.id, adjustedRect);

    // Accumulate
    if (droppableContainer.id !== args.active.id) {
      accumulatedSpace += droppableHeight;
    } else {
      activeFound = true;
    }
  }

  return droppableRects;
};

const topPositionComparator = (
  a: { id: UniqueIdentifier; rect: ClientRect },
  b: { id: UniqueIdentifier; rect: ClientRect }
) => {
  return a.rect.top - b.rect.top;
};
