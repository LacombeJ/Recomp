import React from 'react';

import { FlashCard, useFlashCardState } from '@recomp/flashcard';
import '../stories.scss';

export default {
  title: 'Components/FlashCard',
  component: FlashCard,
  argTypes: {},
};

const Template = (args) => {
  const flashcard = useFlashCardState({
    card: {
      front: 'Flashcard',
      back:
        'A flashcard or flash card (also known as an index card)' +
        ' is a card bearing information on both sides, which is intended' +
        ' to be used as an aid in memorization',
    },
    side: 'front',
  });
  return <FlashCard {...args} {...flashcard.props} />;
};

export const Basic = Template.bind({});
Basic.args = {};
