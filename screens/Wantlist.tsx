import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, AsyncStorage, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useColorScheme } from 'react-native-appearance'
import { SwipeListView } from 'react-native-swipe-list-view'
import CustomIcon from '../components/CustomIcon'
import AlbumListItem from '../components/AlbumListItem'
import useAuthFetch from '../hooks/useAuthFetch'
import * as wantlistActions from '../store/actions/wantlist'

const WantlistScreen = ({ navigation: { navigate } }) => {
    const colorScheme = useColorScheme()
    const albums = useSelector((state) => state.albums.albums)
    const sorting = useSelector((state) => state.albums.sorting)
    const [wantlist, setWantlist] = useState([])
    const dispatch = useDispatch()

    const fetchedWantlist = useAuthFetch('https://api.discogs.com/users/paaaaaaaaaaul/wants', {})

    useEffect(() => {
        if (fetchedWantlist.response) {
            setWantlist(fetchedWantlist.response.wants)
        }
    }, [fetchedWantlist])

    useEffect(() => {
        const fetchWantlist = async () => {
            await dispatch(wantlistActions.setWantlist())
        }
        fetchWantlist()
    }, [])

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow()
        }
    }

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey)
        dispatch(albumsActions.removeAlbum(rowKey))
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
                data={wantlist}
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
                            artist={artists[0].name}
                            title={title}
                            image={cover_image}
                            onPress={() => navigate('AlbumDetailScreen', { album: item })}
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
                style={{ paddingLeft: 24 }}
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
        marginHorizontal: 24,
        paddingVertical: 16,
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

export default WantlistScreen
