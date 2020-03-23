import React, { useEffect, useRef } from "react";
import { Animated, View, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

const usePulse = (startDelay = 500) => {
    const scale = useRef(new Animated.Value(1)).current;

    const pulse = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 1.3 }),
            Animated.timing(scale, { toValue: 0.8 })
        ]).start(() => pulse());
    };

    useEffect(() => {
        const timeout = setTimeout(() => pulse(), startDelay);
        return () => clearTimeout(timeout);
    }, []);

    return scale;
};

const CameraOverlay = ({ loading }) => {
    const scale = usePulse();

    return (
        <View style={{ justifyContent: "space-between" }}>
            <View>
                <View
                    style={{
                        width: screenWidth - 60,
                        flexDirection: "row",
                        alignContent: "space-between",
                        justifyContent: "space-between"
                    }}>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            width: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            width: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                </View>
                <View
                    style={{
                        width: screenWidth - 60,
                        flexDirection: "row",
                        alignContent: "space-between",
                        justifyContent: "space-between"
                    }}>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            height: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            height: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Animated.View
                    style={[
                        {
                            width: 150,
                            height: 150,
                            borderRadius: 100,
                            borderWidth: 16,
                            borderColor: "#fff",
                            opacity: 0.6,
                            transform: loading ? [{ scale }] : []
                        }
                    ]}
                />
            </View>
            <View>
                <View
                    style={{
                        width: screenWidth - 60,
                        flexDirection: "row",
                        alignContent: "space-between",
                        justifyContent: "space-between"
                    }}>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            height: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            height: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                </View>
                <View
                    style={{
                        width: screenWidth - 60,
                        flexDirection: "row",
                        alignContent: "space-between",
                        justifyContent: "space-between"
                    }}>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            width: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#fff",
                            width: screenWidth / 2 - 100,
                            opacity: 0.6
                        }}></View>
                </View>
            </View>
        </View>
    );
};

export default CameraOverlay;
