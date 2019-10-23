import React, { Component } from 'react'
import axios from 'axios'
import {
    View,
    ActivityIndicator,
    StyleSheet,
    YellowBox
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthOrApp extends Component {

    constructor(){
        super()

        YellowBox.ignoreWarnings(['Setting a timer', 'Warning: componentWillMount is deprecated',
        'Warning: componentWillReceiveProps is deprecated',]);
    }
    
    componentDidMount = async () => {
        const json = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(json) || {}
        if (userData.uid) {            
            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    }
})