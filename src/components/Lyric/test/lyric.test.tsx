import { render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Lyric from '../components/lyric';
import type { LyricLine } from '../lyric';

const mockLrc = `[00:12.00]Line 1
[00:17.20]Line 2
[00:21.10]Line 3`;

const mockLineRenderer = ({
  lrcLine,
  index,
  active,
}: {
  lrcLine: LyricLine;
  index: number;
  active: boolean;
}) => (
  <Text testID={`line-${index}`} style={active ? styles.red : styles.black}>
    {lrcLine.content}
  </Text>
);

describe('Lyric', () => {
  it('renders lyrics correctly', () => {
    const { getByText } = render(
      <Lyric lrc={mockLrc} lineRenderer={mockLineRenderer} style={{}} />
    );

    expect(getByText('Line 1')).toBeTruthy();
    expect(getByText('Line 2')).toBeTruthy();
    expect(getByText('Line 3')).toBeTruthy();
  });

  it('scrolls to the current line', () => {
    const { getByTestId } = render(
      <Lyric lrc={mockLrc} lineRenderer={mockLineRenderer} style={{}} currentTime={17200} />
    );

    const line = getByTestId('line-1');
    expect(line.props.style.color).toBe('red');
  });
});

const styles = StyleSheet.create({
  red: {
    color: 'red'
  },
  black: {
    color: 'black'
  }
});
