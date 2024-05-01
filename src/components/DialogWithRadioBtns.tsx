import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
    Button,
    Dialog,
    RadioButton,
    Text,
    TouchableRipple
} from 'react-native-paper';

interface BtnItem {
    key: string,
    value: string,
}

type DialogProps = {
    btns: BtnItem[];
    visible: boolean;
    close: () => void;
    setValue: (res: string | null) => void;
};

export const DialogWithRadioBtns = ({
    btns, visible, close, setValue
}: DialogProps) => {
    const highestRes = btns[btns.length - 1].key;
    const [checkedItem, setCheckedItem] = useState(highestRes);

    const renderItem = useCallback(({ item }: { item: BtnItem }) => (
        <TouchableRipple
            onPress={() => setCheckedItem(item.key)}
        >
            <View style={styles.row}>
                <View pointerEvents="none">
                    <RadioButton
                        value={item.key}
                        status={checkedItem === item.key
                            ? 'checked'
                            : 'unchecked'}
                    />
                </View>
                <Text style={styles.btnText}>
                    {item.key}
                </Text>
            </View>
        </TouchableRipple>
    ), [checkedItem]);

    return (
        <Dialog onDismiss={close} visible={visible}>
            <Dialog.Icon icon="video-outline" size={60} />
            <Dialog.Title>Choose resolution</Dialog.Title>

            <Dialog.ScrollArea style={styles.btnsContainer}>
                <FlatList
                    data={btns}
                    renderItem={renderItem}
                />
            </Dialog.ScrollArea>

            <Dialog.Actions>
                <Button onPress={close}>Cancel</Button>
                <Button
                    onPress={() => {
                        setValue(checkedItem);
                        close();
                    }}
                >Ok</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    btnsContainer: {
        paddingHorizontal: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    btnText: {
        paddingLeft: 8,
    },
});
