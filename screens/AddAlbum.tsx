import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../constants/Colors'
import CustomIcon from '../components/CustomIcon/CustomIcon'
import CameraOverlay from '../components/CameraOverlay/CameraOverlay'
import * as albumsAction from '../store/actions/albums'
import * as wantlistAction from '../store/actions/wantlist'

const AddAlbum = ({ route, navigation }) => {
    const [hasPermission, setHasPermission] = useState(null)
    const [loading, setLoading] = useState(false)
    const [barcode, setBarcode] = useState(null)
    const dispatch = useDispatch()
    // const from = route.params.from

    // console.log(route);

    useEffect(() => {
        ;(async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    useEffect(() => {
        console.log('barcode changed! ', barcode)
        fetchAlbumData(barcode)
    }, [barcode])

    const AddAlbumToCollection = (album) => {
        dispatch(albumsAction.addAlbum(album))
        navigation.goBack()
        // if (from === 'collection') {
        //     dispatch(albumsAction.addAlbum(album))
        //     navigation.navigate('Collection')
        // } else {
        //     dispatch(wantlistAction.addAlbum(album))
        //     navigation.navigate('Wantlist')
        // }
    }

    const onBarCodeScanned = (barCode) => {
        setBarcode(barCode.data)
    }
    
    const fetchAlbumData = async (barcode) => {
        console.log('fetchAlbumData', barcode)
        if (!barcode) return
        setLoading(true)
        const response = await fetch(`https://api.discogs.com/database/search?barcode=${barcode}&type=release&format=vinyl&key=tILfDjLHXNBVjcVQthxa&secret=KIIXTQskHkIifimxKtedzTKnBSNigSZL`)

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        if (response.status !== 200) {
            console.log(`Status Code: ${response.status}`)
            return
        }

        const searchResults = await response.json()

        console.log(searchResults.results[0])

        AddAlbumToCollection(searchResults.results[0])

        setTimeout(() => {
            setLoading(false)
        }, 2000);
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
                    <TouchableOpacity onPress={() => navigation.navigate('AddAlbumManually')}>
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
