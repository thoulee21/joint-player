import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { LottieAnimation } from '../components/LottieAnimation';

jest.mock('lottie-react-native', () => 'LottieView');

describe('LottieAnimation', () => {
  it('renders correctly with given animation and caption', () => {
    const { getByText, getByTestId } = render(
      <LottieAnimation animation="welcome" caption="Welcome Animation">
        <Text>Child Component</Text>
      </LottieAnimation>
    );

    expect(getByText('Welcome Animation')).toBeTruthy();
    expect(getByText('Child Component')).toBeTruthy();
    expect(getByTestId('LottieView')).toBeTruthy();
  });

  it('applies color filters correctly', () => {
    const { getByTestId } = render(
      <LottieAnimation animation="breathe" caption="Breathe Animation" />
    );

    const lottieView = getByTestId('LottieView');
    expect(lottieView.props.colorFilters).toEqual([
      { keypath: 'Breathe out', color: 'rgba(28, 27, 31, 1)' },
      { keypath: 'Breathe in', color: 'rgba(28, 27, 31, 1)' },
    ]);
  });
});
