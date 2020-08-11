import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Dimensions, StyleSheet } from 'react-native'
import Loader from '../components/Loader/Loader'
import Tracklist from '../components/Tracklist/Tracklist'

const screenWidth = Math.round(Dimensions.get('window').width)

const AlbumDetail = ({ route }) => {
    const { id: discogsId } = route.params.album
    if (!discogsId) {
        console.log('🚨 no discogs id')
        return (
            <View>
                <Text>No ID</Text>
            </View>
        )
    }
    const [albumDetail, setAlbumDetail] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAlbumDetails()
    }, [])

    const fetchAlbumDetails = () => {
        fetch(
            `https://api.discogs.com/releases/${discogsId}?key=tILfDjLHXNBVjcVQthxa&secret=KIIXTQskHkIifimxKtedzTKnBSNigSZL`
        )
            .then((response) => {
                if (response.status !== 200) {
                    console.log(`Status Code: ${response.status}`)
                    return
                }

                response.json().then((data) => {
                    setAlbumDetail(data)
                })
                setLoading(false)
            })
            .catch((err) => {
                console.error('Fetch Error', err)
            })
    }

    if (loading) {
        return (<Loader />)
    }

    // console.log('😍 ', albumDetail)
    // console.log('😍 rating ', albumDetail.community.rating)
    // console.log('😍 lowest_price ', albumDetail.lowest_price)
    // console.log('😍 released ', albumDetail.released)

    return (
        <ScrollView>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {albumDetail.images && (
                    <>
                        <View style={styles.backdropImage}>
                            <Image
                                source={{ uri: albumDetail.images[0].uri }}
                                style={{
                                    height: screenWidth - 72,
                                    width: screenWidth - 72,
                                    borderRadius: 4
                                }}
                            />
                        </View>
                        <View style={styles.image}>
                            <Image
                                source={{ uri: albumDetail.images[0].uri }}
                                style={{
                                    height: screenWidth - 56,
                                    width: screenWidth - 56,
                                    borderRadius: 4
                                }}
                            />
                        </View>
                    </>
                )}

                {albumDetail.tracklist && <Tracklist tracklist={albumDetail.tracklist} />}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    backdropImage: {
        marginTop: 32,
        marginBottom: -screenWidth + 88,
        zIndex: -1,
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: -2, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    image: {
        shadowColor: 'rgba(0,0,0, .6)',
        shadowOffset: { height: -2, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    }
})

export default AlbumDetail
