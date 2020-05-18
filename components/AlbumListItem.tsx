import React from 'react'
import { TouchableHighlight, View, Text, Image, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native-appearance'

interface Props {
    album: object
    theme: string
    onPress?: () => {}
}

const AlbumListItem = ({ album, theme = 'light', onPress }) => {
    const colorScheme = useColorScheme()

    // console.log('render album', { album })
    const { name } = album.basic_information.artists[0]
    const { cover_image, title } = album.basic_information

    const artistRegex = /([^-]+)/g
    const titleRegex = /-(.*)/g
    const albumArtistRegex = artistRegex.exec(album.title)
    const albumTitleRegex = titleRegex.exec(album.title)
    const albumArtist = albumArtistRegex[0].trim()
    const albumTitle = albumTitleRegex && albumTitleRegex[1].trim()

    return (
        <TouchableHighlight
            onPress={onPress}
            underlayColor="#f2f2f2"
            style={{
                borderBottomColor: theme === 'light' ? '#f5f5f5' : '#8D819D',
                backgroundColor: theme === 'light' ? '#fff' : 'transparent'
            }}
        >
            <View style={styles.listItem}>
                <View>
                    <Image
                        source={{
                            uri: album
                                ? cover_image
                                : 'https://media.pitchfork.com/photos/5e21f772d7f8cd0008150e31/1:1/w_320/Mac-Miller-FACES.jpg'
                        }}
                        style={styles.coverArt}
                    />
                </View>
                <View>
                    <Text
                        style={{
                            ...styles.title,
                            ...{ color: theme === 'light' ? '#200740' : '#fff' }
                        }}
                    >
                        {albumTitle ? albumTitle : title}
                    </Text>
                    <Text style={colorScheme === 'dark' ? styles.artistDark : styles.artistLight}>
                        {album.artistName ? album.artistName : name}
                        {/* -- {album.addedAt} */}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    listItem: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 16,
        // paddingHorizontal: 24,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1
    },
    coverArt: {
        width: 40,
        height: 40,
        marginRight: 16
    },
    title: {
        fontFamily: 'kulimpark-bold',
        color: '#200740'
    },
    artistLight: {
        fontFamily: 'kulimpark-regular',
        color: '#8D819D'
    },
    artistDark: {
        fontFamily: 'kulimpark-regular',
        color: '#fff'
    }
})

export default AlbumListItem
