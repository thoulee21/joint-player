import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Searchbar, Tooltip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { UserList } from '../components/UserList';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';
import type { Main as UserMain } from '../types/userDetail';

export const SwitchUser = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const currentUser = useAppSelector(selectUser);
  const [showQuery, setShowQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, error, isLoading: isAvatarLoading } = useSWR<UserMain>(
    `https://music.163.com/api/v1/user/detail/${currentUser.id}`,
  );

  const renderAvatar = useCallback((props: any) => {
    if (error || isAvatarLoading) { return null; }

    return (
      <View style={styles.rightBtns}>
        {showQuery && (
          <IconButton
            {...props}
            icon="close"
            onPress={() => {
              setSearchQuery('');
              setShowQuery('');
            }}
          />
        )}
        <Tooltip title={data?.profile.nickname || 'No username'}>
          <Avatar.Image
            {...props}
            size={40}
            source={{ uri: data?.profile.avatarUrl }}
          />
        </Tooltip>
      </View>
    );
  }, [data, error, isAvatarLoading, showQuery]);

  const search = useCallback(() => {
    if (showQuery && searchQuery !== showQuery) {
      setSearchQuery(showQuery);
    }
  }, [searchQuery, showQuery]);

  return (
    <BlurBackground style={{ paddingTop: insets.top }}>
      <Searchbar
        style={[styles.searchbar, {
          backgroundColor: Color(
            appTheme.colors.secondaryContainer
          ).fade(0.3).string(),
        }]}
        placeholder="Search for a user"
        onChangeText={setShowQuery}
        value={showQuery}
        icon="arrow-left"
        right={renderAvatar}
        onIconPress={navigation.goBack}
        onSubmitEditing={search}
        selectTextOnFocus
        blurOnSubmit
        selectionColor={
          appTheme.colors.inversePrimary
        }
        autoFocus
      />

      {searchQuery
        ? <UserList searchQuery={searchQuery} />
        : <LottieAnimation
          caption="Login to use your custom settings"
          animation="rocket"
        />}
    </BlurBackground>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    marginVertical: '1%',
    marginHorizontal: '4%',
  },
  rightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
