import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content } from 'native-base';
import DrawerMenucIcon from '../Navigation/DrawerMenuIcon';
import { Entypo } from '@expo/vector-icons';
import Header from './EventScreenComponents/Header';
import EventList from './EventScreenComponents/EventList';
import { loadEvents } from '../Actions/eventActions';
import { connect } from 'react-redux';
import { BallIndicator } from 'react-native-indicators';


class EventScreen extends Component {   
    static navigationOptions = ({screenProps})=> {
        return {
            drawerIcon: (<Entypo name='new' size={25} />),
            title: screenProps.EventScreenTitle,
        }
    }  

    componentDidMount() {
        if (this.props.languageCode) {
            this.props.loadEvents(this.props.languageCode);
        }
    }

    componentDidUpdate(prevProps) {
        if ((!prevProps.languageCode && this.props.languageCode) ||
            (prevProps.languageCode !== this.props.languageCode)) {
            this.props.loadEvents(this.props.languageCode);
        }
    }

    render() {
        if (this.props.isEventLoading || this.props.isLanguageLoading) {
            return (
                <Container style={styles.container}>
                    <DrawerMenuIcon onPressMenuIcon={() => this.props.navigation.openDrawer()} />
                    <Content contentContainerStyle={styles.contentContainer}>
                        <BallIndicator color="#aaa" />
                    </Content>
                </Container>
            );
        }
        else {
            return (
                <Container style={styles.container}>
                    <DrawerMenucIcon onPressMenuIcon={() => this.props.navigation.openDrawer()} />
                    <Content contentContainerStyle={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <Header/>
                    </View>
                    <View style={styles.eventsContainer}>
                        <EventList/>
                    </View>            
                    </Content>
                </Container>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#BFD0D670'
    },
    eventsContainer: {
        flex: 12,
    },
    headerContainer: {
        flex: 1,
        justifyContent: 'center',
        borderColor: '#7154b8',
        borderWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 0,
        borderRadius: 30,
        backgroundColor: '#fff',
    },      
});

const mapStateToProps = state => {
    return {
        languageCode: state.settings.settings.languageCode,
        isEventLoading: state.eventReducer.loading,
        isLanguageLoading: state.settings.loading,
    }
}

const mapDispatchToProps = {
    loadEvents
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);