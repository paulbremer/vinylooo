import React, { useState, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { OutlinedTextField } from 'react-native-material-textfield'
import AlbumListItem from '../components/AlbumListItem'
import Colors from '../constants/Colors'
import useDebounce from '../hooks/useDebounce'
import * as albumsAction from '../store/actions/albums'

const AddAlbumManually = ({ route, navigation }) => {
    const [searchTerm, setsearchTerm] = useState('')
    const [results, setResults] = useState([])
    const debouncedSearchTerm = useDebounce(searchTerm, 1000)
    const dispatch = useDispatch()
    const from = route.params.from

    useEffect(() => {
        if (debouncedSearchTerm.length > 2) {
            fetchAlbums(debouncedSearchTerm)
        }
    }, [debouncedSearchTerm])

    const fetchAlbums = (searchTerm) => {
        console.log('fetchAlbums', searchTerm)
        fetch(
            `https://api.discogs.com/database/search?q=${searchTerm}&type=release&format=vinyl&key=tILfDjLHXNBVjcVQthxa&secret=KIIXTQskHkIifimxKtedzTKnBSNigSZL`
        )
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status)
                    return
                }

                response.json().then((data) => {
                    setResults(data.results)
                })
            })
            .catch((err) => {
                console.log('Fetch Error', err)
            })
    }

    const AddAlbumToCollection = (album) => {
        console.log('👋🏻 AddAlbumToCollection')
        dispatch(albumsAction.addAlbum(album, from))
        // navigation.navigate('Collection')
    }

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#ff2200" />
            <View style={styles.modal}>
                <View>
                    <OutlinedTextField
                        label="Album"
                        keyboardType="default"
                        onChangeText={(text) => setsearchTerm(text)}
                        textColor="#ffffff"
                        baseColor="#ffffff"
                        tintColor={Colors.primaryColor}
                        labelTextStyle={{
                            fontFamily: 'kulimpark-bold'
                        }}
                        style={{
                            fontFamily: 'kulimpark-bold'
                        }}
                    />
                </View>
                <ScrollView>
                    {results &&
                        results.map((item) => {
                            const { cover_image, title } = item

                            const artistRegex = /([^-]+)/g
                            const titleRegex = /-(.*)/g
                            const albumArtistRegex = artistRegex.exec(title)
                            const albumTitleRegex = titleRegex.exec(title)
                            const albumArtist = albumArtistRegex[0].trim()
                            const albumTitle = albumTitleRegex && albumTitleRegex[1].trim()

                            return (
                                <AlbumListItem
                                    key={item.id}
                                    artist={albumArtist}
                                    title={albumTitle}
                                    image={cover_image}
                                    theme="dark"
                                    onPress={() => AddAlbumToCollection(item)}
                                />
                            )
                        })}
                </ScrollView>
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
        padding: 24
    },
    text: {
        color: '#fff'
    }
})

export default AddAlbumManually
