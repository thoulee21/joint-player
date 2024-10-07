import { Base16Theme, google } from 'base16';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import JSONTree from 'react-native-json-tree';
import { useTheme } from 'react-native-paper';

export const JSONViewer = ({ data }: { data: any }) => {
    const appTheme = useTheme();
    const showingData = data || { info: 'No data to show' };

    const myBase16Theme: Base16Theme = {
        ...google,
        base00: 'transparent',
    };

    return (
        <ScrollView
            horizontal
            style={[styles.jsonView, {
                borderRadius: appTheme.roundness,
            }]}
        >
            <JSONTree
                data={showingData}
                hideRoot
                theme={myBase16Theme}
                invertTheme={false}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    jsonView: {
        marginBottom: 10,
        height: 'auto',
        width: '100%',
    },
});
