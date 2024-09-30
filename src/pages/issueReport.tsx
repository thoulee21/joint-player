import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { UserFeedback } from '@sentry/react-native';
import Color from 'color';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Appbar, HelperText, TextInput, useTheme } from 'react-native-paper';
import { BlurBackground } from '../components';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';

export const IssueReport = () => {
    const ISSUE_MAX_LENGTH = 200;

    const navigation = useNavigation();
    const appTheme = useTheme();
    const currentUser = useAppSelector(selectUser);

    const [issue, setIssue] = useState('');
    const [email, setEmail] = useState('');

    const sentryId = Sentry.lastEventId() || Sentry.captureMessage('Report Issue');
    const emailHasErrors = (!email.includes('@') || !email.includes('.')) && email.length > 0;
    const sendable = issue && !emailHasErrors;

    const report = () => {
        const feedback: UserFeedback = {
            event_id: sentryId,
            name: currentUser.username,
            email: email,
            comments: issue,
        };
        Sentry.captureUserFeedback(feedback);

        HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
        ToastAndroid.show('Issue reported', ToastAndroid.SHORT);
    };

    const inputBackgroundColor = Color(appTheme.colors.secondaryContainer).fade(0.7).string();

    const IssueField = () => {
        return (
            <View style={styles.inputField}>
                <TextInput
                    label="Issue Description"
                    multiline
                    numberOfLines={10}
                    value={issue}
                    onChangeText={setIssue}
                    placeholder="Please describe the issue you encountered"
                    maxLength={ISSUE_MAX_LENGTH}
                    right={<TextInput.Affix
                        text={`${issue.length}/${ISSUE_MAX_LENGTH}`}
                    />}
                    style={{ backgroundColor: inputBackgroundColor }}
                />
                <HelperText
                    type="info"
                    onLongPress={() => {
                        Clipboard.setString(sentryId);
                        ToastAndroid.show('Event ID copied', ToastAndroid.SHORT);
                        HapticFeedback.trigger(HapticFeedbackTypes.effectDoubleClick);
                    }}
                >
                    Event ID: {sentryId}
                </HelperText>
            </View>
        );
    };

    const EmailField = () => {
        return (
            <View style={styles.inputField}>
                <TextInput
                    label="Email (Optional)"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Please enter your email address"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    error={emailHasErrors}
                    right={email && <TextInput.Icon
                        icon="close"
                        onPress={() => { setEmail(''); }}
                    />}
                    style={{ backgroundColor: inputBackgroundColor }}
                />
                <HelperText type="error" visible={emailHasErrors}>
                    Email address is invalid!
                </HelperText>
            </View>
        );
    };

    return (
        <BlurBackground>
            <Appbar.Header style={styles.appbar} mode="large">
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Report Issue" />
                <Appbar.Action
                    icon={sendable ? 'send' : 'send-outline'}
                    onPress={report}
                    disabled={!sendable}
                    color={appTheme.colors.primary}
                />
            </Appbar.Header>

            <KeyboardAvoidingView behavior="padding">
                <ScrollView>
                    <IssueField />
                    <EmailField />
                </ScrollView>
            </KeyboardAvoidingView>
        </BlurBackground>
    );


};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
    inputField: {
        marginHorizontal: 16,
        marginVertical: 4,
    },
});
