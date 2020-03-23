import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as albumsActions from "../store/actions/albums";

const Discover = () => {
    const albums = useSelector(state => state.albums.albums);
    const dispatch = useDispatch();
    let randomArtist;

    useEffect(() => {
        dispatch(albumsActions.setAlbums());
    }, [dispatch]);

    if (albums.length > 0) {
        randomArtist =
            albums[Math.floor(Math.random() * albums.length)].artistName;
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
            }}>
            {randomArtist && <Text>Because you liked {randomArtist}</Text>}
        </View>
    );
};

export default Discover;
