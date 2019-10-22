import React from 'react'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import AuthOrApp from './screens/AuthOrApp'
import Menu from './screens/Menu'
import Agenda from './screens/Agenda'
import Auth from './screens/Auth'
import commonStyles from './commonStyles'

const MenuRoutes = {
    Today: {
        name: 'Today',
        screen: props =>
        <Agenda title = 'Hoje' daysAhead = { 0 } {...props }/>,
        navigationOptions: {
            title: 'Hoje'
        }
    }
}

const MenuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080',
        }
    }
}

const MenuNavigator = createDrawerNavigator(MenuRoutes, MenuConfig)

const MainRoutes = {
    Loading: {
        name: 'Loading',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: MenuNavigator
    }
}

const MainNavigator = createAppContainer(createSwitchNavigator(MainRoutes, {
    initialRouteName: 'Loading'
}))
export default MainNavigator