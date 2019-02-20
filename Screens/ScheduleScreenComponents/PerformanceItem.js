import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import CheckBox from 'react-native-check-box';
import { addToWatchlist } from 'TheaterSchedule/Actions/WatchListActions/WatchListActionCreators';
import { changeStatusFromSchedule, deleteFromSchedule } from 'TheaterSchedule/Actions/ScheduleActions/ScheduleActionCreators';
import moment from 'moment';
import 'moment/locale/uk';

import LocalizedComponent from 'TheaterSchedule/Localization/LocalizedComponent'

class PerformanceItem extends LocalizedComponent {
    constructor(props) {
        super(props);
    }

    togglewatchlist = (item, index) => {
        if (this.props.isChecked == undefined || this.props.isChecked == false) {
            this.props.addToWatchlist(item);   
            this.props.changeStatusFromSchedule(index);
        } else {  
            this.props.deleteFromSchedule(item.scheduleId);
            this.props.changeStatusFromSchedule(index);
        }
    }

        pressedDetailsHandler = () => {
            this.props.navigation.navigate("performanceStack", { performance: this.props.performance.performanceId});
        }
    


convertToReadableTime = date => {
    return moment(date).format("HH:mm");
}

convertToReadableDate = date => {
    return moment(date).format("dddd, Do MMMM");
}

render() {
    let base64Image = `data:image/png;base64,${this.props.performance.mainImage}`;

    return (
        <View style={styles.performanceContainer}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    resizeMode='contain'
                    source={{ uri: base64Image }}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{this.props.performance.title}</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.additionalInfo}>
                        {this.t('Date')}: {this.convertToReadableDate(this.props.performance.beginning)}
                    </Text>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.additionalInfo}>
                        {this.t('Beginning')}:
                        </Text>
                    <TouchableOpacity>
                        <Text
                            style={[styles.additionalInfo, { borderBottomWidth: 2, borderBottomColor: '#7154b8' }]}
                        >
                            {this.convertToReadableTime(this.props.performance.beginning)}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.starContainer}>
                    <TouchableOpacity onPress={this.pressedDetailsHandler}>
                        <View style={styles.detailsButton}>
                            <Text style={styles.buttonText}>
                                {this.t('Details')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <CheckBox
                        onClick={() => this.togglewatchlist(this.props.performance, this.props.index)}
                        isChecked={this.props.isChecked}
                        checkedImage={<Image source={require('./Images/checked-star.png')} style={styles.imagestyle} />}
                        unCheckedImage={<Image source={require('./Images/unchecked-star.png')} style={styles.imagestyle} />}
                    />
                </View>
            </View>
        </View >
    );
}
}

const QUARTER_OF_WINDOW_HEIGHT = Dimensions.get('window').height * 0.25;

const styles = StyleSheet.create({
    performanceContainer: {
        height: QUARTER_OF_WINDOW_HEIGHT,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderColor: '#7154b8',
        borderWidth: 1,
        borderRadius: 30,
        margin: 5,
    },
    starContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    imageContainer: {
        flex: 1,
        margin: 2,
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 30,
    },
    infoContainer: {
        flex: 2,
        borderLeftColor: '#7154b8',
        borderLeftWidth: 1,
        margin: 2,
        justifyContent: 'space-between',
    },
    detailsContainer: {
        flex: 2,
        flexDirection: 'row',
        width: '100%',
    },
    title: {
        color: '#7154b8',
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 2,
        margin: 4,
        borderBottomWidth: 2,
        borderBottomColor: '#7154b8',
    },
    imagestyle: {
        width: 25,
        height: 25,
    },
    additionalInfo: {
        fontSize: 15,
        color: '#7154b8',
        margin: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 2,
    },
    detailsButton: {
        marginTop: 5,
        backgroundColor: '#7154b8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        width: 100
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    }
});

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispatchToProps = {
    addToWatchlist,
    changeStatusFromSchedule,
    deleteFromSchedule
}

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceItem);
