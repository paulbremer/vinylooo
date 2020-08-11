import React, { useRef, useEffect } from 'react'
import { View, Animated, Easing } from 'react-native'
import CustomIcon from '../CustomIcon/CustomIcon'
import colors from '../../constants/Colors'

const Loader = () => {
    useEffect(() => {
        rotate.setValue(0)
        Animated.timing(rotate, {
            toValue: 2,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => { })
    }, [])

    const rotate = useRef(new Animated.Value(1)).current
    const RotateData = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg']
    })

    return <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <Animated.View
            style={[
                {
                    borderRadius: 100,
                    borderWidth: 16,
                    borderColor: '#fff',
                    opacity: 0.6,
                    transform: [{ rotate: RotateData }]
                }
            ]}
        >
            <CustomIcon name="lp" color={colors.primaryColor} style={{ fontSize: 128 }} />
        </Animated.View>
    </View>
}

export default Loader
