import { AsyncStorage } from 'react-native'
import { fetchWantlist, insertAlbumToWantlist, removeAlbumFromWantlistDatabase } from '../../helpers/db'

export const ADD_ALBUM_TO_WANTLIST = 'ADD_ALBUM_TO_WANTLIST'
export const SET_WANTLIST = 'SET_WANTLIST'
export const SET_SORTING = 'SET_SORTING'
export const REMOVE_ALBUM_FROM_WANTLIST = 'REMOVE_ALBUM_FROM_WANTLIST'

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Math.round(new Date().getTime() / 1000)

function makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

interface Props {
    title: string
    artist: {
        name: string
    }
    onPress: () => {}
}

export const addAlbum = (album) => {
    // console.log('🔥 addAlbum wantlist ', album)
    return async (dispatch) => {
        const { id, title, cover_image } = album
        const artistRegex = /([^-]+)/g
        const titleRegex = /-(.*)/g
        const albumArtistRegex = artistRegex.exec(title)
        const albumTitleRegex = titleRegex.exec(title)
        const albumArtist = albumArtistRegex[0].trim()
        const albumTitle = albumTitleRegex[1].trim()

        try {
            const token = await AsyncStorage.getItem('token')
            const secret = await AsyncStorage.getItem('secret')

            if (token !== null && secret !== null) {
                console.log('🐛 ', token, secret, timestamp)

                const res = await fetch(`https://api.discogs.com/users/paaaaaaaaaaul/wants/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="${makeid(
                            10
                        )}", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                })

                const json = await res.json()

                dispatch({
                    type: ADD_ALBUM_TO_WANTLIST,
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

                const dbResult = await insertAlbumToWantlist(albumTitle, id, albumArtist, cover_image, timestamp)

                dispatch({
                    type: ADD_ALBUM_TO_WANTLIST,
                    albumData: {
                        id: dbResult.insertId,
                        discogsId: id,
                        addedAt: timestamp,
                        title: albumTitle,
                        artist: albumArtist,
                        cover_image
                    }
                })
            }
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

export const removeAlbum = (albumId) => {
    return async (dispatch) => {
        try {
            const token = await AsyncStorage.getItem('token')
            const secret = await AsyncStorage.getItem('secret')

            if (token !== null && secret !== null) {
                console.log('🐛 ', token, secret)

                await fetch(`https://api.discogs.com/users/paaaaaaaaaaul/wants/${albumId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                })

                dispatch({
                    type: REMOVE_ALBUM_FROM_WANTLIST,
                    albumId
                })
            } else {
                await removeAlbumFromWantlistDatabase(albumId)
                dispatch({
                    type: REMOVE_ALBUM_FROM_WANTLIST,
                    albumId
                })
            }
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

export const setWantlist = () => {
    return async (dispatch) => {
        const token = await AsyncStorage.getItem('token')
        const secret = await AsyncStorage.getItem('secret')

        if (token !== null && secret !== null) {
            console.log('token not null fetching from url')

            const res = await fetch('https://api.discogs.com/users/paaaaaaaaaaul/wants', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                }
            })
            const json = await res.json()

            dispatch({ type: SET_WANTLIST, payload: json.wants })
        } else {
            try {
                const dbResult = await fetchWantlist()
                dispatch({ type: SET_WANTLIST, wantlist: dbResult.rows._array })
            } catch (err) {
                throw err
            }
        }
    }
}

export const setSorting = (sortSettings) => {
    return { type: SET_SORTING, sorting: sortSettings }
}
