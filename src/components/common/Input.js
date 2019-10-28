import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder,secureTextEntry, style }) => {
    const { inputStyle, labelStyle, containerStyle } = styles;
    return (
        <View style={[containerStyle, style]}>            
            <Text style={labelStyle}>{label}</Text>
            <TextInput                 
                style={inputStyle}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles={
    inputStyle: {
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        lineHeight: 1,
        flex: 2.4,
        height: 40,
        width: 100
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 5,
        flex: 1,
        width: 100
    },
    containerStyle: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
}

export { Input };