import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform,
    YellowBox,
    Alert
} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from '../commonStyles'
import Firebase, { db } from '../../config/Firebase'
import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask'
import { showError } from '../common'
import todayImage from '../../assets/imgs/today.jpg'
import AsyncStorage from '@react-native-community/async-storage';

export default class Agenda extends Component {
    state = {
        uid: '',
        tasks: [],
        samePeriod: false,
        showDoneTasks: true,
        showAddTask: false,
    }

    constructor(props){
        super(props)
        YellowBox.ignoreWarnings(['Setting a timer', 'Warning: componentWillMount is deprecated',
        'Warning: componentWillReceiveProps is deprecated',]);
    }

    addTask = async task => {
        try {
            const taskNew = {
                id: new Date().toISOString(),
                userId: this.state.uid,
                title: task.title,
                description: task.description,
                doneAt: ''
            }

            db.collection('tasks').doc().set(taskNew)
            this.setState({ showAddTask: false, tasks: [...this.state.tasks, taskNew ]})
            Alert.alert('Nova Tarefa', 'Nova Tarefa Salva')
        } catch (err) {
            showError(err)
        }
    }

    deleteTask = async id => {
        try {
            var taskkill_query = await db.collection('tasks').where('id', '==', id);
            taskkill_query.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.delete();                    
                });
            });

            this.setState({tasks: this.state.tasks.filter(function(task) { 
                return task.id !== id 
            })});
            Alert.alert('Tarefa', 'Tarefa Removida')

        } catch (err) {
            showError(err)
        }
    }

    componentDidMount = async () => {               
        const json = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(json) || {}

        this.setState({ uid: userData.uid })
        await this.verifyAccesLast()
        this.lastAccessApp();
        this.loadTasks()
    }

    lastAccessApp = async () => {
        const access = {
            userId: this.state.uid,
            lastAccess: moment().locale('pt-br').format('L')
        }

        db.collection('accessUser').doc(this.state.uid).set(access)
    }

    toggleTask = async id => {
        try {           
            var taskkill_query = await db.collection('tasks').where('id', '==', id);
            taskkill_query.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.update('doneAt', moment().locale('pt-br').format('L'));                    
                });
            });

            this.setState({tasks: this.state.tasks.filter(function(task) { 
                return task.id !== id 
            })});

            Alert.alert('Tarefa', 'Tarefa Realizada')
        } catch (err) {
            showError(err)
        }
    }

    loadTasks = async () => {
        try {
            if(this.state.samePeriod){
                const date = moment().locale('pt-br').format('L')            
                await db.collection('tasks').where('userId', '==', this.state.uid).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if(data.doneAt !== date){
                            this.setState({ tasks: [...this.state.tasks, data ]})
                        }
                    });
                })         
                .catch(err => {
                    showError(err)
                });
            }else{
                await db.collection('tasks').where('userId', '==', this.state.uid).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        this.setState({ tasks: [...this.state.tasks, data ]})
                    });
                })
                .catch(err => {
                    showError(err)
                });
            }
            
            if(this.state.tasks.length === 0){
                Alert.alert('Tarefas', 'Não há Tarefas Pendentes para Hoje!')
            }
        } catch (err) {
            showError(err)
        }
    }

    verifyAccesLast = async () => {
        await db.collection('accessUser').where('userId', '==', this.state.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                const data = doc.data();
                if (moment().locale('pt-br').format('L') === data.lastAccess) {
                    this.setState({ samePeriod: true })                    
                }
                
                });
            })            
            .catch(err => {
                showError(err)
            });
    }

    render() {
        let styleColor = null
        let image = null

        switch(this.props.daysAhead) {
            case 0:
                styleColor = commonStyles.colors.today
                image = todayImage
                break            
            default:
                styleColor = commonStyles.colors.today
                image = todayImage
                break
        }

        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showAddTask: false })} />
                <ImageBackground source={image}
                    style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>                      
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.taksContainer}>
                    <FlatList data={this.state.tasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) => 
                            <Task {...item} onToggleTask={this.toggleTask}
                                onDelete={this.deleteTask} />} />
                </View>
                <ActionButton buttonColor={styleColor}
                    onPress={() => { this.setState({ showAddTask: true }) }} />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taksContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})