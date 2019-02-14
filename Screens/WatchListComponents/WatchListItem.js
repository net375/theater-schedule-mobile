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
import { deleteFromWatchlist, addToWatchlist } from 'TheaterSchedule/Actions/WatchListActions/WatchListActionCreators';
import { changePerformanceStatus } from 'TheaterSchedule/Actions/ScheduleActions/ScheduleActionCreators';
import CheckBox from 'react-native-check-box';
import LocalizedComponent from 'TheaterSchedule/Localization/LocalizedComponent'
import moment from 'moment';
import 'moment/locale/uk';

class WatchListItem extends LocalizedComponent {
    constructor(props) {
        super(props);
    }

    pressedDetailsHandler = () => {
        // TODO - redirect to detailed information
        alert('redirect to details page');
    }

    convertToReadableTime = date => {
        return moment(date).format("HH:mm");
    }

    convertToReadableDate = date => {
        return moment(date).format("dddd, Do MMMM");
    }

    deletefromwatchlist = (item, index) => {
        if (this.props.isChecked == true){
            this.props.changePerformanceStatus(item.scheduleId);
            this.props.deleteFromWatchlist(index);
        }
    }

    render() {
        let base64Image = `data:image/png;base64,${this.props.chosenperformance.mainImage}`;

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
                    <Text style={styles.title}>{this.props.chosenperformance.title}</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.additionalInfo}>
                            {this.t('Date')}: {this.convertToReadableDate(this.props.chosenperformance.beginning)}
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
                                {this.convertToReadableTime(this.props.chosenperformance.beginning)}
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
                            onClick={() => this.deletefromwatchlist(this.props.chosenperformance,this.props.index)}
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
        borderRadius: 50,
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
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 17,
        color: '#7154b8',
        margin: 2,
        justifyContent: 'center',
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
        schedule: state.scheduleReducer.schedule.map((chosenperformance, index) => { return { ...chosenperformance, index: index.toString() } }),
    };
}

const mapDispatchToProps = {
    deleteFromWatchlist,
    addToWatchlist,
    changePerformanceStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchListItem);
