import React, { useEffect, useState } from 'react'
import { Button, Linking, View, Text, Image, ScrollView, Dimensions, StyleSheet } from 'react-native'
import Loader from '../components/Loader/Loader'
import Tracklist from '../components/Tracklist/Tracklist'

const screenWidth = Math.round(Dimensions.get('window').width)

const AlbumDetail = ({ route }) => {
    const { id: discogsId } = route.params.album

    if (!discogsId) {
        console.log('🚨 no discogs id')
        return (<View><Text>No ID</Text></View>)
    }

    const [albumDetail, setAlbumDetail] = useState({})
    const [loading, setLoading] = useState(true)
    const [spotifyUrl, setSpotifyUrl] = useState()

    useEffect(() => {
        fetchAlbumDetails()
    }, [])

    const fetchSpotifyLink = async (artist, album) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer BQC4jdwG3G41_ie0ZROOB5VsThMN9EtfzB033N_E6pWxRQISX2HkYYvUETT-_mr_bHRWyKe2N2py5NSdgD67HDJcUK2kLxStJqS4GlhAayHgExxQI0yEyieOuiGdPQ7-DKC04ZbfGHwuJPM");

        const response = await fetch(
            `https://api.spotify.com/v1/search?q=album:${encodeURIComponent(album)}%20artist:${encodeURIComponent(artist)}&type=album&limit=1`, {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        const spotifyData = await response.json();
        const { name, uri } = spotifyData.albums.items[0];
        console.log('name', name)
        console.log('uri', uri)
        return uri;
    }

    const fetchAlbumDetails = () => {
        fetch(
            `https://api.discogs.com/releases/${discogsId}?key=tILfDjLHXNBVjcVQthxa&secret=KIIXTQskHkIifimxKtedzTKnBSNigSZL`
        )
            .then((response) => {
                if (response.status !== 200) {
                    console.log(`Status Code: ${response.status}`)
                    return
                }

                response.json().then(async (data) => {
                    setAlbumDetail(data)
                    if (data.artists.length > 0) {
                        const url = await fetchSpotifyLink(data.artists[0].name, data.title)
                        setSpotifyUrl(url)
                    }
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

                {spotifyUrl && <Button
                    title={`Open ${spotifyUrl}`}
                    onPress={() => Linking.openURL(spotifyUrl)}
                />}

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
