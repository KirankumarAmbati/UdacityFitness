import React, {Component} from 'react'
import {Text, View, TouchableOpacity, Platform, StyleSheet} from 'react-native'
import {getMetricMetaInfo, getDailyReminderValue, timeToString} from '../util/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './DateHeader'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../util/api'
import {connect} from 'react-redux'
import {addEntry} from '../actions'
import { purple, white } from '../utils/colors'

function SubmitButton({onPress}) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}
        >
            <Text style={styles.submitBtnText}>submit</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    andriodSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
})

class AddEntry extends Component {
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

        this.props.addEntry({
            [key]: entry
        })

        submitEntry({key, entry})

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

        this.props.addEntry({
            [key]: getDailyReminderValue()
        })

        //Route to Home

        removeEntry(key)
    }
    render() {
        if(this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
                        size={100}
                    />

                    <Text>You have already logged your information for today ! </Text>
                    <TextButton style={{padding: 10}} onPress={this.reset}>reset</TextButton>
                </View>
            )
        }
        const metaInfo = getMetricMetaInfo()
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>

                {Object.keys(metaInfo).map(key => {
                    const {getIcon, type, ...rest} = metaInfo[key]

                    const value = this.state[key]
                    
                    return (
                        <View  style={styles.row}>
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

function mapStateToProps(state) {
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}
export default connect(mapStateToProps, {addEntry})(AddEntry)