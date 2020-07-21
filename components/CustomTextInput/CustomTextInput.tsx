import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Colors from '../../constants/Colors'

interface Props {
    label: string
    style?: object
    onChangeText: () => {}
}

const CustomTextInput: React.FC<Props> = ({ label, style, onChangeText }) => {
    const [isFocused, setFocused] = useState(false)

    const handleFocus = () => {
        setFocused(true)
    }

    const handleBlur = () => {
        setFocused(false)
    }

    return (
        <View
            style={{
                ...styles.textInputWrapper,
                ...{ borderColor: isFocused ? Colors.primaryColor : '#ffffff' }
            }}
        >
            <Text style={styles.textLabel}>
                <Text
                    style={{
                        ...styles.textLabelInner,
                        ...{
                            color: isFocused ? Colors.primaryColor : '#ffffff'
                        }
                    }}
                >
                    {label}
                </Text>
            </Text>
            <TextInput
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={onChangeText}
                style={{ ...styles.textInput, ...style }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    textInputWrapper: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 4,
        marginBottom: 20
    },
    textLabel: {
        backgroundColor: Colors.purple,
        position: 'absolute',
        left: 0,
        top: -8,
        marginHorizontal: 12,
        paddingHorizontal: 4,
        color: '#000'
    },
    textLabelInner: {
        backgroundColor: Colors.purple,
        color: '#ffffff',
        fontSize: 12
    },
    textInput: {
        color: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 16
    }
})

export default CustomTextInput
