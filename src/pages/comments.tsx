import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CommentList } from '../components/CommentList';

export function Comments(): React.JSX.Element {
  const { commentThreadId } = useRoute().params as {
    commentThreadId: string
  };

  return (
    <View style={styles.root}>
      <CommentList commentThreadId={commentThreadId} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
  },
});
