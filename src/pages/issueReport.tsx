import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { UserFeedback } from '@sentry/react-native';
import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  ToastAndroid,
  useWindowDimensions,
  View,
} from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Appbar, HelperText, TextInput, useTheme } from 'react-native-paper';
import { HeaderComponent, LargeHeaderComponent } from '../components/AnimatedHeader';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';
import { PoweredBy } from '../components/PoweredBy';

const ISSUE_MAX_LENGTH = 200;

export const IssueReport = () => {
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const appTheme = useTheme();
  const currentUser = useAppSelector(selectUser);

  const [issue, setIssue] = useState('');
  const [email, setEmail] = useState('');

  const emailHasErrors = (
    !email.includes('@')
    || !email.includes('.')
  ) && email.length > 0;

  const sendable = issue && !emailHasErrors;

  const report = useCallback(() => {
    const feedback: UserFeedback = {
      event_id: Sentry.captureMessage('Report Issue'),
      name: currentUser.username,
      email: email,
      comments: issue,
    };

    Keyboard.dismiss();
    HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
    Sentry.captureUserFeedback(feedback);

    ToastAndroid.show('Issue reported', ToastAndroid.LONG);
    navigation.goBack();
  }, [currentUser.username, email, issue, navigation]);

  const renderLargeHeader = useCallback((
    props: ScrollLargeHeaderProps
  ) => (
    <LargeHeaderComponent {...props} title="Report Issue" />
  ), []);

  const renderHeader = useCallback((props: ScrollHeaderProps) => (
    <HeaderComponent
      {...props}
      title="Report Issue"
      headerRight={
        <Appbar.Action
          icon={sendable ? 'send' : 'send-outline'}
          onPress={report}
          disabled={!sendable}
          color={appTheme.colors.primary}
        />
      }
    />
  ), [appTheme.colors.primary, report, sendable]);

  return (
    <ScrollViewWithHeaders
      LargeHeaderComponent={renderLargeHeader}
      HeaderComponent={renderHeader}
      overScrollMode="never"
      scrollToOverflowEnabled={false}
    >
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          label="Issue Description"
          multiline
          numberOfLines={10}
          autoFocus
          value={issue}
          onChangeText={setIssue}
          placeholder="Please describe the issue you encountered"
          maxLength={ISSUE_MAX_LENGTH}
          right={
            <TextInput.Affix
              text={`${issue.length}/${ISSUE_MAX_LENGTH}`}
            />
          }
          style={styles.inputField}
        />

        <View style={styles.inputField}>
          <TextInput
            label="Email (Optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="Please enter your email address"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            error={emailHasErrors}
            right={email && <TextInput.Icon
              icon="close"
              onPress={() => { setEmail(''); }}
            />}
          />
          <HelperText type="error" visible={emailHasErrors}>
            Email address is invalid!
          </HelperText>
        </View>
      </KeyboardAvoidingView>

      <PoweredBy caption="Powered by Sentry" />
      <View style={{ height: window.height * 0.25 }} />
    </ScrollViewWithHeaders>
  );
};

const styles = StyleSheet.create({
  inputField: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
});
