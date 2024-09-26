import { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithLabelAndIcon: Story = {
  args: {
    icon: 'bell',
    label: 'Button',
    shape: 'rect',
    variant: 'secondary',
    disabled: false,
    type: 'button',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Button',
    shape: 'rect',
    variant: 'secondary',
    disabled: false,
    type: 'button',
  },
};

export const WithIcon: Story = {
  args: {
    icon: 'bell',
    shape: 'rect',
    variant: 'secondary',
    disabled: false,
    type: 'button',
  },
};

export const RoundedShape: Story = {
  args: {
    icon: 'bell',
    shape: 'rounded',
    variant: 'secondary',
    disabled: false,
    type: 'button',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Button',
    shape: 'rect',
    variant: 'secondary',
    disabled: true,
    type: 'button',
  },
};

export const Primary: Story = {
  args: {
    label: 'Button',
    shape: 'rect',
    variant: 'primary',
    disabled: false,
    type: 'button',
  },
};

export const Flat: Story = {
  args: {
    label: 'Button',
    shape: 'rect',
    variant: 'flat',
    disabled: false,
    type: 'button',
  },
};

export const AlwaysPressed: Story = {
  args: {
    label: 'Button',
    shape: 'rect',
    variant: 'flat',
    disabled: false,
    isPressed: true,
    type: 'button',
  },
};
