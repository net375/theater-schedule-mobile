import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content } from 'native-base';
import DrawerMenuIcon from '../../Navigation/DrawerMenuIcon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import PerformanceList from './Components/PerformanceList'

import DateFilter from './Components/DateFilter';

class ScheduleScreen extends Component {
    static navigationOptions = {
        drawerIcon: <MaterialCommunityIcons name='calendar-clock' size={25} />
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <DrawerMenuIcon onPressMenuIcon={() => this.props.navigation.openDrawer()} />
                <Content contentContainerStyle={styles.contentContainer}>
                    <View style={styles.filterContainer}>
                        <DateFilter
                            startDate={this.props.startDate}
                            endDate={this.props.endDate} />
                    </View>
                    <View style={styles.performancesContainer}>
                        <PerformanceList
                            performances={this.props.performances}
                        />
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'stretch',
        flex: 1,
    },
    filterContainer: {
        flex: 1,
        justifyContent: 'center',
        borderColor: '#eee',
        borderWidth: 2,
        margin: 5,
        borderRadius: 50,
    },
    performancesContainer: {
        flex: 12,
    },
});

const mapStateToProps = state => {
    return {
        performances: state.scheduleReducer.performances,
    };
}

export default connect(mapStateToProps)(ScheduleScreen);