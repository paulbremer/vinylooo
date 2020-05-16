import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";

const DiscoverAlbum = ({ albumId }) => {
    const [album, setAlbum] = useState({});
    const [albumImage, setAlbumImage] = useState({});

    useEffect(() => {
        fetchAlbumDetails(albumId);
    }, []);

    const fetchAlbumDetails = async albumId => {
        let response = await fetch(
            `http://api.napster.com/v2.2/albums/${albumId}?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4`
        );
        let data = await response.json();
        setAlbum(data.albums[0]);

        let responseImages = await fetch(
            `http://api.napster.com/v2.2/albums/${albumId}/images?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4`
        );
        let images = await responseImages.json();
        if (images.images) {
            const foundImage = images.images.find(image => (image.width = 300));
            setAlbumImage(foundImage);
        }
    };

    return (
        <View
            style={{
                flexDirection: "column",
                maxWidth: 150,
                marginRight: 16,
                marginVertical: 16
            }}>
            <Image
                source={{ uri: albumImage.url }}
                style={{ width: 150, height: 150 }}
            />
            <Text numberOfLines={1} style={{ marginTop: 4 }}>
                {album.name}
            </Text>
            <Text numberOfLines={1} style={{ marginTop: 4 }}>
                {album.artistName}
            </Text>
            {/* <Text>{album.upc}</Text> */}
        </View>
    );
};

export default DiscoverAlbum;
