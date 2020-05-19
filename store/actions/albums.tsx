import { AsyncStorage } from 'react-native'
import { insertAlbum, insertAlbumToWantlist, removeAlbumFromDatabase, fetchAlbums } from '../../helpers/db'

export const ADD_ALBUM = 'ADD_ALBUM'
export const SET_ALBUMS = 'SET_ALBUMS'
export const SET_SORTING = 'SET_SORTING'
export const REMOVE_ALBUM = 'REMOVE_ALBUM'

interface Props {
    title: string
    artist: {
        name: string
    }
    onPress: () => {}
}

export const addAlbum = (album, from) => {
    console.log('🔥 addAlbum ')
    return async (dispatch) => {
        const { id, title, cover_image } = album
        const artistRegex = /([^-]+)/g
        const titleRegex = /-(.*)/g
        const albumArtistRegex = artistRegex.exec(title)
        const albumTitleRegex = titleRegex.exec(title)
        const albumArtist = albumArtistRegex[0].trim()
        const albumTitle = albumTitleRegex[1].trim()
        const timestamp = new Date().toString()
        let dbResult

        try {
            const token = await AsyncStorage.getItem('token')
            const secret = await AsyncStorage.getItem('secret')
            if (token !== null && secret !== null) {
                console.log('🐛 ', token, secret)
            } else {
                console.log('not connected to discogs')
            }

            if (from === 'colllection') {
                dbResult = await insertAlbum(albumTitle, id, albumArtist, cover_image, timestamp)
            } else if (from === 'wantlist') {
                console.log('insert into wantlist db')
                dbResult = await insertAlbumToWantlist(albumTitle, id, albumArtist, cover_image, timestamp)
            }

            dispatch({
                type: ADD_ALBUM,
                albumData: {
                    id: dbResult.insertId,
                    discogsId: id,
                    addedAt: timestamp,
                    title: albumTitle,
                    artist: albumArtist,
                    cover_image
                }
            })
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

export const removeAlbum = (albumId) => {
    return async (dispatch) => {
        try {
            await removeAlbumFromDatabase(albumId)
            dispatch({
                type: REMOVE_ALBUM,
                albumId
            })
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

export const setAlbums = () => {
    return async (dispatch) => {
        try {
            const dbResult = await fetchAlbums()
            dispatch({ type: SET_ALBUMS, albums: dbResult.rows._array })
        } catch (err) {
            throw err
        }
    }
}

export const setSorting = (sortSettings) => {
    return { type: SET_SORTING, sorting: sortSettings }
}
