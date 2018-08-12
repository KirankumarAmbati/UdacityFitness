import React from 'react'
import {View, Text, Slider} from 'react-native'

export default function MySlider({max, unit, value, step, onChange}) {
    return (
        <View>
            <Slider
                minimumValue={0}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={onChange}
            />
            
            <Text>{value} {unit}</Text>
        </View>
    )
}