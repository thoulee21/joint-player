import { useState } from 'react';
import { Menu, IconButton } from 'react-native-paper';
import React from 'react';

export const MvArgsMenu = ({ setDialogVisible, size }:
    {
        setDialogVisible: (visible: boolean) => void;
        size: number;
    }
) => {
    const [visible, setVisible] = useState(false);

    const ChooseRes = () => (
        <Menu.Item
            title="Resolutions"
            leadingIcon="video-switch-outline"
            onPress={() => {
                setVisible(false);
                setDialogVisible(true);
            }}
        />
    );

    return (
        <Menu
            elevation={1}
            visible={visible}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    size={size}
                    onPress={() => setVisible(true)}
                />
            }
            onDismiss={() => setVisible(false)}
        >
            <ChooseRes />
        </Menu>
    );
};
