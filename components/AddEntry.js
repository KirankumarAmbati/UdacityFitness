import React, {Component} from 'react'
import {Text, View, TouchableOpacity} from 'react-native'
import {getMetricMetaInfo, timeToString} from '../util/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './DateHeader'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'

function SubmitButton({onPress}) {
    return (
        <TouchableOpacity
            onPress={onPress}>
            <Text>submit</Text>
        </TouchableOpacity>
    )
}

export default class AddEntry extends Component {
    state = {
        run:0,
        bike:0,
        swim:0,
        eat:0,
        sleep:0
    }

    increment = (metric)=> {
        const {max, step} = getMetricMetaInfo(metric)

        this.setState((state) => {
            const count = state[metric] + step

            return {
                ...state,
                [metric]: count > max ? max: count
            }
        })
    }

    decrement = (metric) => {
        const count = this.state[metric] - getMetricMetaInfo(metric).step

        this.setState(() => ({
            [metric]: count < 0 ? 0 : count
        }))
    }

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }

    submit = () => {
        const key = timeToString()
        const entry = this.state

        //Update the Redux

        this.setState(() => ({
            run:0,
            bike:0,
            swim:0,
            eat:0,
            sleep:0
        }))


    }

    reset = () => {
        const key = timeToString()

        //Update Redux

        //Route to Home

        //Update "DB"
    }
    render() {
        if(this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name='ios-happy-outline'
                        size={100}
                    />

                    <Text>You have already logged your information for today ! </Text>
                    <TextButton onPress={this.reset}>reset</TextButton>
                </View>
            )
        }
        const metaInfo = getMetricMetaInfo()
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>

                <Text>{JSON.stringify(this.state)}</Text>

                {Object.keys(metaInfo).map(key => {
                    const {getIcon, type, ...rest} = metaInfo[key]

                    const value = this.state[key]
                    
                    return (
                        <View>
                            <Text>{metaInfo[key].displayName}</Text>
                            
                            {getIcon()}

                            {type === 'slider'
                                ? <MySlider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                                : <MyStepper
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />
                            }
                        </View>
                    )
                })}

                <SubmitButton 
                    onPress={this.submit}
                />
            </View>
        )
    }
}