import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { FontAwesome, Entypo } from '@expo/vector-icons'

export default function MyStepper({max, unit, step, value, onIncrement, onDecrement}) {
    return (
        <View>
            <TouchableOpacity onPress={onDecrement}>
                <FontAwesome 
                    color={'black'}
                    name="minus"
                    size={30}
                /> 
            </TouchableOpacity>

            <TouchableOpacity onPress={onIncrement}>
                <FontAwesome 
                    color={'black'}
                    name="plus"
                    size={30}
                /> 
            </TouchableOpacity>
            <Text>{value} {unit}</Text>
        </View>
    )
}