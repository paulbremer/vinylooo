import { SET_ALBUMS, ADD_ALBUM, REMOVE_ALBUM, SET_SORTING } from '../actions/albums'

const initialState = {
    albums: [],
    sortedAlbums: [],
    sorting: 'date'
}

const timestamp = Math.round(new Date().getTime() / 1000)

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ALBUMS:
            let setSortedAlbums = action.payload
            if (setSortedAlbums && state.sorting === 'date') {
                setSortedAlbums = setSortedAlbums.sort((a, b) => b.date_added.localeCompare(a.date_added))
                return {
                    ...state,
                    albums: setSortedAlbums
                }
            } else {
                return { ...state }
            }
        case ADD_ALBUM:
            const newAlbum = [
                {
                    id: action.albumData.id.toString(),
                    discogsId: action.albumData.discogsId,
                    basic_information: {
                        title: action.albumData.title,
                        artists: [{ name: action.albumData.artist }],
                        cover_image: action.albumData.cover_image
                    },
                    date_added: timestamp
                }
            ]
            console.log('😅 ', timestamp)
            console.log('🔥 ', new Date(timestamp))
            let newAlbumArray
            if (state.sorting === 'date') {
                newAlbumArray = newAlbum.concat(state.albums)
            } else {
                newAlbumArray = state.albums.concat(newAlbum)
            }

            return {
                ...state,
                albums: newAlbumArray
            }
        case REMOVE_ALBUM:
            return {
                ...state,
                albums: state.albums.filter((album) => album.id !== action.albumId)
            }
        case SET_SORTING:
            const appliedSorting = action.sorting
            let sortedAlbums = state.albums

            switch (appliedSorting) {
                case 'date':
                    sortedAlbums = state.albums.sort((a, b) => new Date(b.date_added) - new Date(a.date_added))
                    break
                case 'artist':
                    sortedAlbums = state.albums.sort((a, b) =>
                        a.basic_information.artists[0].name.localeCompare(b.basic_information.artists[0].name)
                    )
                    break
                case 'title':
                    sortedAlbums = state.albums.sort((a, b) =>
                        a.basic_information.title.localeCompare(b.basic_information.title)
                    )
                    break
                default:
                    sortedAlbums = state.albums
            }
            return {
                ...state,
                sorting: appliedSorting,
                albums: sortedAlbums
            }
        default:
            return state
    }
}
