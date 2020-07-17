import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import AlbumListItem from '../components/AlbumListItem/AlbumListItem'

const Feed = () => {
    const albums = useSelector((state) => state.albums.albums)
    const wantlist = useSelector((state) => state.wantlist)

    const newWantlist = wantlist.albums.map((album) => (album = { ...album, wantlist: true }))
    const feedArray = [...albums, ...newWantlist]
    const sortedFeed = feedArray.sort((a, b) => b.date_added.localeCompare(a.date_added))

    return (
        <ScrollView>
            {sortedFeed.map((album) => (
                <View key={album.date_added} style={styles.itemWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.text}>
                            You added {album.basic_information.title} to{' '}
                            {!album.wantlist && <Text>your collection</Text>}
                            {album.wantlist && <Text>your wantlist</Text>}.
                        </Text>
                    </View>
                    <AlbumListItem
                        id={album.id}
                        artist={album.basic_information.artists[0].name}
                        title={album.basic_information.title}
                        image={album.basic_information.cover_image}
                        onPress={() => {}}
                        // onPress={() => navigate('Details', { album: item })}
                    />
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    itemWrapper: {
        paddingVertical: 8
        // marginBottom: 24,
        // backgroundColor: 'red'
    },
    textWrapper: {
        paddingLeft: 24
    },
    text: {
        fontFamily: 'kulimpark-regular',
        color: '#200740'
    }
})

export default Feed
