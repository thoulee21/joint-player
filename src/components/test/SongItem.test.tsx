import { cleanup, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../redux/store';
import { TrackType } from '../../services/GetTracksService';
import { SongItem } from '../SongItem';

jest.mock('react-native-track-player', () => ({
  play: jest.fn(),
}));

jest.mock('../../hook/reduxHooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

const mockTrack: TrackType = {
  id: '1',
  url: 'https://example.com/song.mp3',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  artwork: 'https://example.com/artwork.jpg',
  duration: 300,
  artists: [{
    id: 1,
    name: 'Test Artist',
    picId: 0,
    img1v1Id: 0,
    briefDesc: '',
    picUrl: '',
    img1v1Url: '',
    albumSize: 0,
    alias: [],
    trans: '',
    musicSize: 0,
    topicPerson: 0,
  }],
  albumRaw: {
    id: 1,
    name: 'Test Album',
    picUrl: '',
    picId: 0,
    briefDesc: '',
    alias: [],
    publishTime: 0,
    size: 0,
    copyrightId: 0,
    status: 0,
    pic: 0,
    mark: 0,
    songs: [],
    paid: false,
    onSale: false,
    companyId: 0,
    blurPicUrl: '',
    commentThreadId: '',
    description: '',
    tags: '',
    artist: {
      id: 0,
      name: '',
      picUrl: '',
      alias: [],
      albumSize: 0,
      picId: 0,
      img1v1Url: '',
      img1v1Id: 0,
      trans: '',
      musicSize: 0,
      topicPerson: 0,
      followed: false,
      briefDesc: '',
      img1v1Id_str: '',
    },
    company: '',
    subType: '',
    picId_str: '',
    awardTags: null,
    artists: [],
    type: '',
  },
  mvid: 0,
};

describe('SongItem', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <ReduxProvider store={store}>
        <PaperProvider>
          <SongItem item={mockTrack} index={0} />
        </PaperProvider>
      </ReduxProvider>
    );

    expect(getByText('Test Song')).toBeTruthy();
    expect(getByText('Test Artist')).toBeTruthy();
  });

  it('renders index if showIndex is true', () => {
    const { getByText } = render(
      <ReduxProvider store={store}>
        <PaperProvider>
          <SongItem item={mockTrack} index={1} showIndex />
        </PaperProvider>
      </ReduxProvider>
    );

    expect(getByText('2')).toBeTruthy();
  });

  it('triggers drag function on long press', () => {
    const mockDrag = jest.fn();

    const { getByTestId } = render(
      <ReduxProvider store={store}>
        <PaperProvider>
          <SongItem item={mockTrack} index={0} drag={mockDrag} />
        </PaperProvider>
      </ReduxProvider>
    );

    fireEvent(getByTestId('drag-handle'), 'onLongPress');
    expect(mockDrag).toHaveBeenCalled();
  });
});
