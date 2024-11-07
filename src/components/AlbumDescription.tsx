import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export const AlbumDescription = (
  { description }: { description?: string }
) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    if (description) {
      if (description.length > 100) {
        setDialogVisible(true);
      }
    }
  }, [description]);

  const hideDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  if (!description) { return null; }

  return (
    <>
      <View style={styles.root}>
        <TouchableOpacity onPress={showDialog}>
          <Text
            style={styles.scrollView}
            numberOfLines={2}
          >
            {description}
          </Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title>Album Description</Dialog.Title>
          <Dialog.ScrollArea style={styles.smallPadding}>
            <ScrollView
              contentContainerStyle={styles.biggerPadding}
            >
              <Text selectable>{description}</Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 50,
  },
  scrollView: {
    marginHorizontal: '6%',
  },
  dialog: {
    maxHeight: '80%',
  },
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
