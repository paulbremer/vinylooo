import React from 'react'
import { TouchableHighlight, View, Text, Image, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native-appearance'

interface Props {
    album: object
    theme: string
    onPress?: () => {}
}

const AlbumListItem = ({ id, artist, title, image, theme = 'light', onPress }) => {
    const colorScheme = useColorScheme()

    // console.log('render album', { album })

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
                    <Image source={{ uri: image }} style={styles.coverArt} />
                </View>
                <View>
                    <Text
                        style={{
                            ...styles.title,
                            ...{ color: theme === 'light' ? '#200740' : '#fff' }
                        }}
                    >
                        {title}
                    </Text>
                    <Text style={colorScheme === 'dark' ? styles.artistDark : styles.artistLight}>
                        {artist}
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
