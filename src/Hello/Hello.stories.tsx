import React from 'react';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import mdx from './Hello.mdx';

import Hello from './Hello';

export default {
  title: 'components|basic/Hello', // 스토리북에서 보여질 그룹과 경로를 명시
  component: Hello,// 어떤 컴포넌트를 문서화 할지 명시
  decorators: [withKnobs], // 애드온 적용
  parameters: {
    componentSubtitle: '"안녕하세요"라고 보여주는 컴포넌트',
    docs: {
      page: mdx
    }
  }
};

export const hello = () => {
    const big = boolean('big', false);
    const name = text('name', 'storybook');
    return (<Hello
            name={name}
            big={big}
            onHello={action('헬로우 이벤트 처리')}
            onBye={action('onBye')}
        />);
};
hello.story = {
    name: 'Default'
}

export const standard = () => <Hello name="Storybook" />;
export const big = () => <Hello name="Storybook" big />;