import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
    type MutableRefObject,
} from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import DraggableFlatList, {
    type RenderItemParams,
} from 'react-native-draggable-flatlist';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWRInfinite from 'swr/infinite';
import { BlurBackground } from '../components/BlurBackground';
import { DraggableItem } from '../components/DraggableSongItem';
import { LottieAnimation } from '../components/LottieAnimation';
import { AddToQueueButton } from '../components/QuickActions';
import { SongItem } from '../components/SongItem';
import { SwipeableUnderlay } from '../components/SwipeableUnderlay';
import type { TrackType } from '../services/GetTracksService';
import type { Main, Song } from '../types/searchSongs';
import { fetchTrackDetails } from '../utils';
import { Storage } from '../utils/storage';
import { StorageKeys } from '../utils/storageKeys';

const SearchSongItem = forwardRef(({ index, item }: {
    index: number, item: Song
}, ref: React.ForwardedRef<any>
) => {
    const appTheme = useTheme();
    const [trackItem, setTrackItem] = useState<TrackType | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const details = await fetchTrackDetails(item.id.toString());
            setTrackItem(details as TrackType);
        };
        fetchDetails();
    }, [item.id]);

    const renderUnderlayLeft = useCallback(() => (
        <SwipeableUnderlay
            mode="left"
            backgroundColor={Color(
                appTheme.colors.surfaceVariant
            ).fade(0.5).string()}
        >
            <AddToQueueButton />
        </SwipeableUnderlay>
    ), [appTheme]);

    if (trackItem) {
        return (
            <DraggableItem
                item={trackItem}
                itemRefs={ref as MutableRefObject<any>}
                renderUnderlayLeft={renderUnderlayLeft}
            >
                <SongItem
                    index={index}
                    item={trackItem}
                    style={styles.songItem}
                    showAlbum
                    showIndex
                />
            </DraggableItem>
        );
    }
    return null;
});

export const Search = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const appTheme = useTheme();

    const [keyword, setKeyword] = useState('');
    const [placeholderKeyword, setPlaceholderKeyword] = useState('');
    const [showQuery, setShowQuery] = useState('');

    const itemsRefs = useRef(new Map());

    const {
        data, error, isLoading, isValidating, mutate, setSize,
    } = useSWRInfinite<Main>((index) => {
        const Type = 1;
        const itemsPerPage = 10;
        const Offset = index * itemsPerPage;
        const Limit = itemsPerPage;

        if (!keyword) { return []; }
        return (
            `https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=${Type}&offset=${Offset}&total=true&limit=${Limit}`
        );
    });

    useEffect(() => {
        const restoreInitKeyword = async () => {
            const storedKeyword = await Storage.get(StorageKeys.Keyword);
            if (storedKeyword) {
                setPlaceholderKeyword(storedKeyword);
            }
        };

        restoreInitKeyword();
    }, []);

    const searchSongs = useCallback(async () => {
        if (showQuery) {
            Storage.set(StorageKeys.Keyword, showQuery);
            setKeyword(showQuery);
        } else if (placeholderKeyword) {
            setShowQuery(placeholderKeyword);
            setKeyword(placeholderKeyword);
        }
    }, [placeholderKeyword, showQuery]);

    const pressRightBtn = useCallback(() => {
        // Clear keyword if it's not empty, otherwise search
        if (showQuery) { setShowQuery(''); }
        else { searchSongs(); }

        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
    }, [searchSongs, showQuery]);

    // Render clear or search icon
    const renderRightIcon = useCallback((props: any) => (
        <IconButton
            {...props}
            icon={showQuery ? 'close' : 'magnify'}
            animated
            loading={isLoading}
            onPress={pressRightBtn}
        />
    ), [showQuery, isLoading, pressRightBtn]);

    const renderItem = useCallback((
        { getIndex, item }: RenderItemParams<Song>
    ) => {
        const index = getIndex() || 0;
        return (
            <SearchSongItem
                index={index}
                item={item}
                ref={itemsRefs}
            />
        );
    }, []);

    return (
        <BlurBackground style={{ paddingTop: insets.top }}>
            <Searchbar
                placeholder={placeholderKeyword || 'Search for songs'}
                placeholderTextColor={appTheme.dark
                    ? appTheme.colors.onSurfaceDisabled
                    : appTheme.colors.backdrop}
                style={styles.searchbar}
                inputStyle={{ color: appTheme.colors.onSurface }}
                onChangeText={setShowQuery}
                value={showQuery}
                onSubmitEditing={searchSongs}
                icon="arrow-left"
                iconColor={appTheme.colors.onSurface}
                onIconPress={navigation.goBack}
                right={renderRightIcon}
                onPress={() => {
                    navigation.navigate('Search' as never);
                }}
                blurOnSubmit
                selectTextOnFocus
                selectionColor={
                    Color(appTheme.colors.inversePrimary)
                        .fade(0.5).string()
                }
            />
            {(showQuery && !error) ? (
                <DraggableFlatList
                    data={data?.flatMap(
                        (item) => item.result.songs
                    ) || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => setSize(prev => prev + 1)}
                    refreshing={isValidating}
                    onRefresh={() => mutate()}
                    fadingEdgeLength={100}
                    refreshControl={
                        <RefreshControl
                            refreshing={isValidating}
                            onRefresh={() => mutate()}
                            colors={[appTheme.colors.primary]}
                            progressBackgroundColor={appTheme.colors.surface}
                        />
                    }
                    activationDistance={20}
                />
            ) : (
                <LottieAnimation
                    caption="Search for songs"
                    animation="rocket"
                />
            )}
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        marginVertical: '1%',
        marginHorizontal: '4%',
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'transparent',
    },
    songItem: {
        backgroundColor: 'transparent',
    },
});
