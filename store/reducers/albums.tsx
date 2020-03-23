import {
    SET_ALBUMS,
    ADD_ALBUM,
    REMOVE_ALBUM,
    SET_SORTING
} from "../actions/albums";

interface Album {
    id: string;
    discogsId: number;
    title: string;
    cover_image: string;
    artistName: string;
}

const initialState = {
    albums: [],
    sortedAlbums: [],
    sorting: "date"
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ALBUMS:
            let setSortedAlbums = action.albums;
            if (state.sorting === "date") {
                setSortedAlbums = action.albums.sort((a, b) =>
                    b.addedAt.localeCompare(a.addedAt)
                );
            }
            return {
                ...state,
                albums: setSortedAlbums
            };
        case ADD_ALBUM:
            const newAlbum = [
                {
                    id: action.albumData.id.toString(),
                    discogsId: action.albumData.discogsId,
                    addedAt: action.albumData.addedAt,
                    title: action.albumData.title,
                    cover_image: action.albumData.cover_image,
                    artistName: action.albumData.artist
                }
            ];
            let newAlbumArray;
            if (state.sorting === "date") {
                newAlbumArray = newAlbum.concat(state.albums);
            } else {
                newAlbumArray = state.albums.concat(newAlbum);
            }

            return {
                ...state,
                albums: newAlbumArray
            };
        case REMOVE_ALBUM:
            return {
                ...state,
                albums: state.albums.filter(
                    album => album.id !== action.albumId
                )
            };
        case SET_SORTING:
            const appliedSorting = action.sorting;
            let sortedAlbums = state.albums;
            switch (appliedSorting) {
                case "date":
                    sortedAlbums = state.albums.sort(
                        (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
                    );
                    break;
                case "artist":
                    sortedAlbums = state.albums.sort((a, b) =>
                        a.artistName.localeCompare(b.artistName)
                    );
                    break;
                case "title":
                    sortedAlbums = state.albums.sort((a, b) =>
                        a.title.localeCompare(b.title)
                    );
                    break;
                default:
                    sortedAlbums = state.albums;
            }
            return {
                ...state,
                sorting: appliedSorting,
                albums: sortedAlbums
            };
        default:
            return state;
    }
};
