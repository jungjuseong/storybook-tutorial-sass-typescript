/** @jsx jsx */
import Timer from './Timer';
import TimerState from './TimerState';

import { jsx, css } from '@emotion/core';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'components|Timer',
  component: Timer,
  decorators: [withKnobs]
};

const _onTimerComplete = () => {
  console.log('timer complete!');
};


export const timer = () => {
  const timerState: TimerState = new TimerState(60);
  timerState.start();

  const _timerComplete = () => {
    console.log('timer complete!');
  };

  return (
    <Timer
      view={true}
      state={timerState}
      onComplete={_onTimerComplete}
    />
  );
};

timer.story = {
  name: 'Default'
};

// export const primaryTimer = () => {
//   return <Timer>PRIMARY</Timer>;
// };


const timerWrapper = css`
  .description {
    margin-bottom: 0.5rem;
  }
  & > div + div {
    margin-top: 2rem;
  }
`;
