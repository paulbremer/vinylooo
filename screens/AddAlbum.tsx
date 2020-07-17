import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../constants/Colors'
import CustomIcon from '../components/CustomIcon'
import CameraOverlay from '../components/CameraOverlay/CameraOverlay'
import * as albumsAction from '../store/actions/albums'
import * as wantlistAction from '../store/actions/wantlist'

const AddAlbum = ({ route, navigation }) => {
    const [hasPermission, setHasPermission] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const from = route.params.from

    useEffect(() => {
        ;(async () => {
            const { status } = await Camera.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    const AddAlbumToCollection = (album) => {
        if (from === 'collection') {
            dispatch(albumsAction.addAlbum(album))
            navigation.navigate('Collection')
        } else {
            dispatch(wantlistAction.addAlbum(album))
            navigation.navigate('Wantlist')
        }
    }

    const onBarCodeScanned = (barCode) => {
        console.log('onBarCodeScanned', barCode.data)
        setLoading(true)

        fetch(
            `https://api.discogs.com/database/search?barcode=${barCode.data}&type=release&format=vinyl&key=tILfDjLHXNBVjcVQthxa&secret=KIIXTQskHkIifimxKtedzTKnBSNigSZL`
        )
            .then((response) => {
                if (response.status !== 200) {
                    console.log(`Status Code: ${response.status}`)
                    return
                }

                response.json().then((data) => {
                    AddAlbumToCollection(data.results[0])
                })
            })
            .catch((err) => {
                console.log('Fetch Error', err)
            })
    }

    if (hasPermission === null) {
        return <View />
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#ff2200" />
            <View style={styles.modal}>
                <Camera
                    style={{ flex: 1 }}
                    type={Camera.Constants.Type.back}
                    onBarCodeScanned={(barcode) => onBarCodeScanned(barcode)}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            margin: 30
                        }}
                    >
                        <CameraOverlay loading={loading} />
                    </View>
                </Camera>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('AddAlbumManually', { from })}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontFamily: 'kulimpark-bold',
                                    fontSize: 16,
                                    padding: 24
                                }}
                            >
                                Add manually
                            </Text>
                            <CustomIcon name="link" color="#ffffff" style={{ marginRight: 24 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.purple
    },
    modal: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 8
    },
    text: {
        color: '#fff'
    }
})

export default AddAlbum
