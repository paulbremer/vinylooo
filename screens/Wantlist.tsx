import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, AsyncStorage, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useColorScheme } from 'react-native-appearance'
import { SwipeListView } from 'react-native-swipe-list-view'
import CustomIcon from '../components/CustomIcon'
import AlbumListItem from '../components/AlbumListItem'
import * as wantlistActions from '../store/actions/wantlist'

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Date.now()

const WantlistScreen = ({ navigation: { navigate } }) => {
    const colorScheme = useColorScheme()
    const albums = useSelector((state) => state.albums.albums)
    const sorting = useSelector((state) => state.albums.sorting)
    const [wantlist, setWantlist] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const getWantlist = async () => {
            const token = await AsyncStorage.getItem('token')
            const secret = await AsyncStorage.getItem('secret')
            if (token !== null && secret !== null) {
                console.log('🐛 ', token, secret)

                fetch('https://api.discogs.com/users/paaaaaaaaaaul/wants', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                })
                    .then(async (data) => {
                        let json = await data.json()
                        // console.log(json)
                        setWantlist(json.wants)
                    })
                    .catch((err) => console.log(err))
            } else {
                const fetchWantlist = async () => {
                    await dispatch(wantlistActions.setWantlist())
                }
                fetchWantlist()
            }
        }
        getWantlist()
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
                    console.log('🥳 ', item)
                    return (
                        <AlbumListItem key={index} album={item} onPress={() => navigate('Details', { album: item })} />
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
