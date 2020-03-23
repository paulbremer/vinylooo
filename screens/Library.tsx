import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useColorScheme } from "react-native-appearance";
import { SwipeListView } from "react-native-swipe-list-view";
import CustomIcon from "../components/CustomIcon";
import AlbumListItem from "../components/AlbumListItem";
import * as albumsActions from "../store/actions/albums";

const LibraryScreen = ({ navigation: { navigate } }) => {
    const colorScheme = useColorScheme();
    const albums = useSelector(state => state.albums.albums);
    const sorting = useSelector(state => state.albums.sorting);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAlbums = async () => {
            await dispatch(albumsActions.setAlbums());
        };
        fetchAlbums();
    }, []);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        dispatch(albumsActions.removeAlbum(rowKey));
    };

    const onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
        if (value < -200) {
            deleteRow({}, key);
        }
    };

    return (
        <View
            style={
                colorScheme === "dark" ? styles.screenDark : styles.screenLight
            }>
            <SwipeListView
                data={albums}
                closeOnRowPress={true}
                disableRightSwipe={true}
                keyExtractor={item => item.id.toString()}
                onSwipeValueChange={onSwipeValueChange}
                renderItem={(data, rowMap) => {
                    const { item, index } = data;
                    return (
                        <AlbumListItem
                            key={index}
                            album={item}
                            onPress={() => navigate("Details", { album: item })}
                        />
                    );
                }}
                renderHiddenItem={(data, rowMap) => {
                    return (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={[
                                    styles.backRightBtn,
                                    styles.backRightBtnRight
                                ]}
                                onPress={() => deleteRow(rowMap, data.item.id)}>
                                <CustomIcon name="close" color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    );
                }}
                rightOpenValue={-75}
                style={{ paddingLeft: 24 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screenLight: {
        flex: 1
    },
    screenDark: {
        flex: 1,
        marginHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: "#000"
    },
    rowBack: {
        alignItems: "center",
        backgroundColor: "#f20",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        right: 0
    },
    backRightBtn: {
        alignItems: "center",
        bottom: 0,
        justifyContent: "center",
        position: "absolute",
        top: 0,
        width: 75
    },
    backRightBtnRight: {
        right: 0
    }
});

export default LibraryScreen;
