import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Appbar, HelperText, TextInput, useTheme } from "react-native-paper";
import {
  HeaderComponent,
  LargeHeaderComponent,
} from "../components/AnimatedHeader";
import { PoweredBy } from "../components/PoweredBy";
import { useAppSelector } from "../hook";
import { selectUser } from "../redux/slices";

const ISSUE_MAX_LENGTH = 200;

export const IssueReport = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const appTheme = useTheme();
  const currentUser = useAppSelector(selectUser);

  const [issue, setIssue] = useState("");
  const [email, setEmail] = useState("");

  const emailHasErrors =
    (!email.includes("@") || !email.includes(".")) && email.length > 0;

  const sendable = issue && !emailHasErrors;

  const report = useCallback(() => {
    Keyboard.dismiss();
    Sentry.captureUserFeedback({
      event_id: Sentry.captureMessage("Report Issue"),
      name: currentUser.username,
      email: email,
      comments: issue,
    });

    HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
    ToastAndroid.show(t("issueReport.toast.success"), ToastAndroid.LONG);
    navigation.goBack();
  }, [currentUser.username, email, issue, navigation, t]);

  const renderLargeHeader = useCallback(
    (props: ScrollLargeHeaderProps) => (
      <LargeHeaderComponent
        {...props}
        title={t("about.contact.issueReport.title")}
      />
    ),
    [t],
  );

  const renderHeader = useCallback(
    (props: ScrollHeaderProps) => (
      <HeaderComponent
        {...props}
        title={t("about.contact.issueReport.title")}
        headerRight={
          <Appbar.Action
            icon={sendable ? "send" : "send-outline"}
            onPress={report}
            disabled={!sendable}
            color={appTheme.colors.primary}
          />
        }
      />
    ),
    [appTheme.colors.primary, report, sendable, t],
  );

  return (
    <ScrollViewWithHeaders
      LargeHeaderComponent={renderLargeHeader}
      HeaderComponent={renderHeader}
      overScrollMode="never"
      scrollToOverflowEnabled={false}
    >
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.inputField}>
          <TextInput
            label={t("issueReport.inputs.description.label")}
            multiline
            numberOfLines={10}
            autoFocus
            value={issue}
            onChangeText={setIssue}
            placeholder={t("issueReport.inputs.description.placeholder")}
            maxLength={ISSUE_MAX_LENGTH}
          />
          <HelperText type="info" visible style={styles.counterHelper}>
            {issue.length} / {ISSUE_MAX_LENGTH}
          </HelperText>
        </View>

        <View style={styles.inputField}>
          <TextInput
            label={t("issueReport.inputs.email.label")}
            value={email}
            onChangeText={setEmail}
            placeholder={t("issueReport.inputs.email.placeholder")}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            error={emailHasErrors}
            selectTextOnFocus
            right={
              email && (
                <TextInput.Icon
                  icon="close"
                  onPress={() => {
                    setEmail("");
                  }}
                />
              )
            }
          />
          <HelperText type="error" visible={emailHasErrors}>
            {t("issueReport.inputs.email.invalid")}
          </HelperText>
        </View>
      </KeyboardAvoidingView>

      <PoweredBy caption={`Powered by Sentry ${Sentry.SDK_VERSION}`} />
    </ScrollViewWithHeaders>
  );
};

const styles = StyleSheet.create({
  inputField: {
    marginHorizontal: 16,
  },
  counterHelper: {
    textAlign: "right",
  },
});
