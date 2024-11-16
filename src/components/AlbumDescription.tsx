import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export const AlbumDescription = (
  { description }: { description?: string }
) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    if (description) {
      setDialogVisible(true);
    }
  }, [description]);

  const hideDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  if (!description) { return null; }

  return (
    <>
      <TouchableOpacity onPress={showDialog}>
        <Text
          style={styles.desc}
          numberOfLines={3}
        >
          {description}
        </Text>
      </TouchableOpacity>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title>Album Description</Dialog.Title>
          <ScrollView
            contentContainerStyle={styles.biggerPadding}
          >
            <Text selectable>{description}</Text>
          </ScrollView>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  desc: {
    marginHorizontal: '6%',
  },
  dialog: {
    maxHeight: '80%',
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
