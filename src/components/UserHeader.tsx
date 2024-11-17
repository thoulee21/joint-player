import {
  useNavigation
} from '@react-navigation/native';
import React, { type PropsWithChildren } from 'react';
import {
  Alert,
  StyleSheet,
  useWindowDimensions,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Avatar,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import {
  selectDevModeEnabled,
  selectUser,
} from '../redux/slices';
import { Main } from '../types/userDetail';
import { ImageBlur } from './ImageBlur';
import { placeholderImg } from './TrackInfo';

export const UserInfo = ({ userId, style }: {
  userId?: number, style?: StyleProp<ViewStyle>
}) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const currentUser = useAppSelector(selectUser);
  const isDev = useAppSelector(selectDevModeEnabled);

  const { data } = useSWR<Main>(
    `https://music.163.com/api/v1/user/detail/${userId || currentUser.id}`,
  );

  const viewAvatar = () => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectDoubleClick
    );
    if (data) {
      //@ts-expect-error
      navigation.push('WebView', {
        url: data?.profile.avatarUrl,
        title: 'Avatar',
      });
    }
  };

  const goUser = () => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
    //@ts-expect-error
    navigation.navigate('UserDetail');
  };

  const debugPrint = () => {
    if (isDev) {
      Alert.alert(
        'User Info',
        JSON.stringify(
          data, null, 2
        ),
      );
    }
  };

  return (
    <View style={[styles.info, style]}>
      <TouchableRipple
        borderless
        style={styles.avatar}
        onPress={goUser}
        onLongPress={viewAvatar}
      >
        <Avatar.Image
          size={70}
          source={{ uri: data?.profile.avatarUrl }}
        />
      </TouchableRipple>

      <Text variant="labelLarge" onPress={debugPrint}>
        {data?.profile.nickname}
      </Text>
      <Text
        variant="labelMedium"
        style={[styles.signature, {
          color: appTheme.dark
            ? appTheme.colors.onSurfaceDisabled
            : appTheme.colors.backdrop,
        }]}
      >
        {data?.profile.signature}
      </Text>
    </View>
  );
};

export const UserBackground = ({
  userId, children, style
}: PropsWithChildren<{
  userId?: number, style?: StyleProp<ImageStyle>
}>) => {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const appTheme = useTheme();

  const currentUser = useAppSelector(selectUser);
  const { data, error, isLoading } = useSWR<Main>(
    `https://music.163.com/api/v1/user/detail/${userId || currentUser.id}`,
  );

  if (isLoading) {
    return (
      <View style={[
        styles.loading,
        style, {
          height: window.height * 0.3,
        }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <Text style={[styles.errMsg, {
        color: appTheme.colors.error,
        marginTop: insets.top
      }]}>
        Error: {error.message}
      </Text>
    );
  }

  return (
    <ImageBlur
      aspectRatio="landscape"
      src={data?.profile.backgroundUrl ||
        placeholderImg}
      resizeMode="cover"
      blurChildren={children}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
  },
  errMsg: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  loading: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  signature: {
    marginTop: '1%',
  },
  info: {
    alignSelf: 'center',
    marginTop: '45%',
    alignItems: 'center',
  }
});
