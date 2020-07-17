import React, { useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useColorScheme } from 'react-native-appearance'
import { SwipeListView } from 'react-native-swipe-list-view'
import CustomIcon from '../components/CustomIcon'
import AlbumListItem from '../components/AlbumListItem/AlbumListItem'
import * as albumsActions from '../store/actions/albums'

const LibraryScreen = ({ navigation: { navigate } }) => {
    const colorScheme = useColorScheme()
    const albums = useSelector((state) => state.albums.albums)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAlbums = async () => {
            await dispatch(albumsActions.setAlbums())
        }
        fetchAlbums()
    }, [])

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow()
        }
    }

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey)
        const { instance_id } = rowMap[rowKey].props.item
        dispatch(albumsActions.removeAlbum(rowKey, instance_id))
    }

    const onSwipeValueChange = (swipeData) => {
        const { key, value } = swipeData
        if (value < -200) {
            deleteRow({}, key)
        }
    }

    return (
        <View style={colorScheme === 'dark' ? styles.screenDark : styles.screenLight}>
            <SwipeListView
                data={albums}
                closeOnRowPress={true}
                disableRightSwipe={true}
                keyExtractor={(item) => item.id.toString()}
                onSwipeValueChange={onSwipeValueChange}
                renderItem={(data, rowMap) => {
                    const { item, index } = data
                    const { artists, cover_image, title } = item.basic_information
                    return (
                        <AlbumListItem
                            key={index}
                            id={item.id}
                            artist={artists[0].name}
                            title={title}
                            image={cover_image}
                            onPress={() => navigate('Details', { album: item })}
                        />
                    )
                }}
                renderHiddenItem={(data, rowMap) => {
                    return (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                onPress={() => deleteRow(rowMap, data.item.id)}
                            >
                                <CustomIcon name="close" color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    )
                }}
                rightOpenValue={-75}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screenLight: {
        flex: 1
    },
    screenDark: {
        flex: 1,
        backgroundColor: '#000'
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f20',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        right: 0
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnRight: {
        right: 0
    }
})

export default LibraryScreen
