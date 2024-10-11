import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, IconButton, Text, useTheme } from 'react-native-paper';
import { upperFirst } from '../utils';
import { ArrayDataList } from './ArrayDataList';
import { DataMoreBtn } from './DataMoreButton';
import { JSONViewer } from './JsonViewer';

export interface DataItemType {
    name: string,
    data: any
}

export const DataItem = ({ item }: { item: DataItemType }) => {
    const appTheme = useTheme();
    const [expended, setExpended] = useState(false);

    const toggleExpended = useCallback(() => {
        setExpended((prev) => !prev);
    }, []);

    const isArray = useMemo(() => Array.isArray(item.data), [item.data]);

    const Content = useCallback(() => {
        let content: React.ReactNode;

        switch (typeof item.data) {
            case 'object':
                if (isArray) {
                    content = expended
                        ? <ArrayDataList item={item} appTheme={appTheme} />
                        : null;
                } else {
                    content = <JSONViewer data={item.data} />;
                }
                break;

            case 'boolean':
                content = <Text style={styles.dataText}>
                    {item.data.toString()}
                </Text>;
                break;

            case 'undefined':
                content = <Text style={styles.dataText}>
                    empty
                </Text>;
                break;

            default:
                content = <Text style={styles.dataText}>
                    {JSON.stringify(item.data, null, 2)}
                </Text>;
                break;
        }

        return content;
    }, [appTheme, expended, isArray, item]);

    const renderDataAvatar = useCallback((props: any) => (
        <Avatar.Text
            {...props}
            label={item.name[0].toLocaleUpperCase()}
            style={{
                backgroundColor: isArray
                    ? appTheme.colors.tertiary
                    : undefined,
            }}
        />
    ), [appTheme.colors.tertiary, isArray, item.name]);

    const renderMoreButton = useCallback((props: { size: number }) => (
        <DataMoreBtn data={item.data} props={props} />
    ), [item]);

    const renderExpandSwitch = useCallback(() => (
        <IconButton
            icon={expended ? 'chevron-up' : 'chevron-down'}
            onPress={toggleExpended}
        />
    ), [expended, toggleExpended]);

    return (
        <Card
            mode="outlined"
            style={styles.card}
        >
            <Card.Title
                title={item.name}
                subtitle={!isArray
                    ? upperFirst(typeof item.data)
                    : `Array ${item.data.length} item(s)`}
                subtitleStyle={{
                    color: isArray
                        ? appTheme.colors.tertiary
                        : appTheme.colors.primary,
                }}
                left={renderDataAvatar}
                right={isArray ? renderExpandSwitch : renderMoreButton}
            />
            <Content />
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: 'transparent',
    },
    dataText: {
        marginHorizontal: 16,
        marginBottom: 10,
    },
});
