import { fetchWantlist } from '../../helpers/db'

export const ADD_ALBUM = 'ADD_ALBUM'
export const SET_WANTLIST = 'SET_WANTLIST'
export const SET_SORTING = 'SET_SORTING'
export const REMOVE_ALBUM = 'REMOVE_ALBUM'

interface Props {
    title: string
    artist: {
        name: string
    }
    onPress: () => {}
}

export const addAlbum = (album) => {
    // console.log("🔥 addAlbum ", album);
    return async (dispatch) => {
        const { id, title, cover_image } = album
        const artistRegex = /([^-]+)/g
        const titleRegex = /-(.*)/g
        const albumArtistRegex = artistRegex.exec(title)
        const albumTitleRegex = titleRegex.exec(title)
        const albumArtist = albumArtistRegex[0].trim()
        const albumTitle = albumTitleRegex[1].trim()
        const timestamp = new Date().toString()

        try {
            const dbResult = await insertAlbum(albumTitle, id, albumArtist, cover_image, timestamp)

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

export const setWantlist = () => {
    return async (dispatch) => {
        try {
            const dbResult = await fetchWantlist()
            dispatch({ type: SET_WANTLIST, wantlist: dbResult.rows._array })
        } catch (err) {
            throw err
        }
    }
}

export const setSorting = (sortSettings) => {
    return { type: SET_SORTING, sorting: sortSettings }
}
