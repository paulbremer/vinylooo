import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Image,
    Easing,
    Animated,
    ScrollView,
    Dimensions,
    StyleSheet
} from "react-native";
import Tracklist from "../components/Tracklist";
import CustomIcon from "../components/CustomIcon";
import colors from "../constants/Colors";

const screenWidth = Math.round(Dimensions.get("window").width);

const AlbumDetail = ({ route }) => {
    const { discogsId } = route.params.album;
    const [albumDetail, setAlbumDetail] = useState({});
    const [loading, setLoading] = useState(true);

    const rotate = useRef(new Animated.Value(1)).current;
    const RotateData = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "720deg"]
    });

    useEffect(() => {
        fetchAlbumDetails();

        rotate.setValue(0);
        Animated.timing(rotate, {
            toValue: 2,
            duration: 2000,
            easing: Easing.linear
        }).start(() => {});
    }, []);

    const fetchAlbumDetails = () => {
        fetch(
            `https://api.discogs.com/releases/${discogsId}?key=tILfDjLHXNBVjcVQthxa&secret=KIIXTQskHkIifimxKtedzTKnBSNigSZL`
        )
            .then(response => {
                if (response.status !== 200) {
                    console.log(`Status Code: ${response.status}`);
                    return;
                }

                response.json().then(data => setAlbumDetail(data));
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error", err);
            });
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Animated.View
                    style={[
                        {
                            borderRadius: 100,
                            borderWidth: 16,
                            borderColor: "#fff",
                            opacity: 0.6,
                            transform: [{ rotate: RotateData }]
                        }
                    ]}>
                    <CustomIcon
                        name="lp"
                        color={colors.primaryColor}
                        style={{ fontSize: 128 }}
                    />
                </Animated.View>
            </View>
        );
    }

    // console.log(albumDetail);

    return (
        <ScrollView>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                {albumDetail.images && (
                    <>
                        <View style={styles.backdropImage}>
                            <Image
                                source={{ uri: albumDetail.images[0].uri }}
                                style={{
                                    height: screenWidth - 72,
                                    width: screenWidth - 72,
                                    borderRadius: 4
                                }}
                            />
                        </View>
                        <View style={styles.image}>
                            <Image
                                source={{ uri: albumDetail.images[0].uri }}
                                style={{
                                    height: screenWidth - 56,
                                    width: screenWidth - 56,
                                    borderRadius: 4
                                }}
                            />
                        </View>
                    </>
                )}

                {albumDetail.tracklist && (
                    <Tracklist tracklist={albumDetail.tracklist} />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    backdropImage: {
        marginTop: 32,
        marginBottom: -screenWidth + 88,
        zIndex: -1,
        shadowColor: "rgba(0,0,0, .4)",
        shadowOffset: { height: -2, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    image: {
        shadowColor: "rgba(0,0,0, .6)",
        shadowOffset: { height: -2, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    }
});

export default AlbumDetail;
