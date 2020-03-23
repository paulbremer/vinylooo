import React from "react";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import icomoonConfig from "../assets/selection.json";
const Icon = createIconSetFromIcoMoon(icomoonConfig);

interface Props {
    name?: string;
    color?: string;
    size?: number;
    style?: object;
    onPress?: () => {};
}

const CustomIcon: React.FC<Props> = ({
    name,
    color,
    size = 24,
    style,
    onPress
}) => {
    return (
        <Icon
            name={name}
            size={size}
            color={color}
            style={{ ...style }}
            onPress={onPress}
        />
    );
};

export default CustomIcon;
