import { AsyncStorage } from 'react-native'
import { insertAlbum, insertAlbumToWantlist, removeAlbumFromDatabase, fetchAlbums } from '../../helpers/db'

export const ADD_ALBUM = 'ADD_ALBUM'
export const SET_ALBUMS = 'SET_ALBUMS'
export const SET_SORTING = 'SET_SORTING'
export const REMOVE_ALBUM = 'REMOVE_ALBUM'

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Date.now()

interface Props {
    title: string
    artist: {
        name: string
    }
    onPress: () => {}
}

export const addAlbum = (album) => {
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

                const res = await fetch(
                    `https://api.discogs.com/users/paaaaaaaaaaul/collection/folders/1/releases/${id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded',
                            Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                        }
                    }
                )
                const json = await res.json()

                dispatch({
                    type: ADD_ALBUM,
                    albumData: {
                        id,
                        discogsId: id,
                        title: albumTitle,
                        artist: albumArtist,
                        cover_image
                    }
                })
            } else {
                console.log('not connected to discogs')
            }
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

export const removeAlbum = (albumId, instanceId) => {
    return async (dispatch) => {
        const token = await AsyncStorage.getItem('token')
        const secret = await AsyncStorage.getItem('secret')

        if (token !== null && secret !== null) {
            await fetch(
                `https://api.discogs.com/users/paaaaaaaaaaul/collection/folders/1/releases/${albumId}/instances/${instanceId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                }
            )
            dispatch({ type: REMOVE_ALBUM, albumId })
        } else {
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
}

export const setAlbums = () => {
    return async (dispatch) => {
        const token = await AsyncStorage.getItem('token')
        const secret = await AsyncStorage.getItem('secret')

        if (token !== null && secret !== null) {
            const res = await fetch(
                'https://api.discogs.com/users/paaaaaaaaaaul/collection/folders/0/releases?sort=added&sort_order=desc',
                {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                }
            )
            const json = await res.json()
            dispatch({ type: SET_ALBUMS, payload: json.releases })
        } else {
            try {
                const dbResult = await fetchAlbums()
                dispatch({ type: SET_ALBUMS, wantlist: dbResult.rows._array })
            } catch (err) {
                throw err
            }
        }
    }
}

export const setSorting = (sortSettings) => {
    return { type: SET_SORTING, sorting: sortSettings }
}
