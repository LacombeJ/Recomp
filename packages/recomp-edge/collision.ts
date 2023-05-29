import {
  CollisionDetection,
  ClientRect,
  closestCenter,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { DroppableContainer, RectMap } from '@dnd-kit/core/dist/store';

export type CDParameters = Parameters<CollisionDetection>[0];
export type CDReturn = ReturnType<CollisionDetection>;

/**
 * Calls closestCenter with calculations after adjusting each
 * droppable container size to the size of the active dragging
 * collision rect. This "expands" the size of droppable slots
 * to fit the current active container and does the math for this.
 * (currently only works for vertical sortable lists)
 */
export const closestAdjustedCenter: CollisionDetection = (args) => {
  const droppableRects = closestAdjustedCenterRects(args);
  return closestCenter({
    ...args,
    droppableRects,
  });
};

/**
 * For closest center calculations but after adjusting each
 * droppable container size to the size of the active dragging
 * collision rect. This calculation does this by calculating how
 * every droppable container will change after sorting.
 */
export const closestAdjustedCenterRects = (args: CDParameters): RectMap => {
  const droppableRects: RectMap = new Map();

  const collisionRect = args.collisionRect;

  // adding droppable space, ignoring active item
  let accumulatedSpace = 0;

  let lastBottom = 0;
  let activeFound = false;

  // Creating a sorted droppable container array
  const droppableContainers = getSortedDroppableList(
    args.droppableContainers,
    args.droppableRects
  );

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
    // (if already found before this item) with the size of the
    // current droppable container rect
    //
    // If active hasn't been found yet, the accumulatedSpace would already
    // contain that height
    let top = accumulatedSpace;
    if (activeFound) {
      // Basically, while iterating list from top to bottom we added
      // heights of all items that were NOT the active item. If the active
      // item is to be dropped where the current droppable is now, the current
      // droppable would have been "swapped" or just moved up, so add that
      // value to the top

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

// ----------------------------------------------------------------------------

const topPositionComparator = (a: Droppable, b: Droppable) => {
  return a.rect.top - b.rect.top;
};

const getSortedDroppableList = (
  containers: DroppableContainer[],
  map: RectMap
) => {
  const droppableContainers: Droppable[] = [];
  for (const droppableContainer of containers) {
    const droppableRect = map.get(droppableContainer.id);
    droppableContainers.push({
      id: droppableContainer.id,
      rect: { ...droppableRect },
    });
  }
  droppableContainers.sort(topPositionComparator);
  return droppableContainers;
};

// ----------------------------------------------------------------------------

interface Droppable {
  id: UniqueIdentifier;
  rect: ClientRect;
}
