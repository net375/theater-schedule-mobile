import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Container, Content } from 'native-base';
import DrawerMenuIcon from '../Navigation/DrawerMenuIcon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PostersSlider from './SliderScreenComponents/postersSlider';
import { connect } from 'react-redux';
import { setSliderActiveSlide } from '../Actions/sliderActions';
import SliderEntry from './SliderScreenComponents/SliderEntry';
import styles from '../Screens/SliderScreenComponents/indexStyles';
import LocalizedComponent from '../Localization/LocalizedComponent';
import { fetchPosters } from '../Actions/sliderActions';
import { BallIndicator } from 'react-native-indicators';

class SliderScreen extends LocalizedComponent {
    static navigationOptions = ({ screenProps }) => {
        return {
            drawerIcon: (<MaterialCommunityIcons name='theater' size={25} />),
            title: screenProps.SliderScreenTitle,
        }
    }

    componentDidMount() {
        this.props.fetchPosters(this.props.languageCode);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.languageCode !== this.props.languageCode) {
            this.props.fetchPosters(this.props.languageCode);
        }
    }

    renderItemWithParallax({ item, index }, parallaxProps) {
        return (
            <SliderEntry
                data={item}
                parallax={true}
                parallaxProps={parallaxProps}
            />
        );
    }

    render() {
        if (this.props.isRepertoireLoading | this.props.isLanguageLoading) {
            return (
                <Container style={{ flex: 1 }}>
                    <DrawerMenuIcon
                        onPressMenuIcon={() => this.props.navigation.openDrawer()}
                        text={this.t('Repertoire')} />
                    <Content contentContainerStyle={styles.contentContainer}>
                        <BallIndicator color="#aaa" />
                    </Content>
                </Container>
            );
        }
        else {
            return (
                <Container style={{ flex: 1 }}>
                    <DrawerMenuIcon
                        onPressMenuIcon={() => this.props.navigation.openDrawer()}
                        text={this.t('Repertoire')} />
                    <Content contentContainerStyle={styles.contentContainer}>
                        <SafeAreaView style={styles.safeArea}>
                            <View style={styles.container}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <PostersSlider
                                        title={this.t('Now the performances premieres are:')}
                                        posters={this.props.posters}
                                        renderItemWithParallax={this.renderItemWithParallax}
                                        setActiveSlide={(index) => this.props.setSliderActiveSlide(index)}
                                        activeSlide={this.props.sliderActiveSlide}
                                    />
                                </View>
                            </View>
                        </SafeAreaView>
                    </Content>
                </Container>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        sliderActiveSlide: state.sliderActiveSlide.sliderActiveSlide,
        posters: state.sliderActiveSlide.posters,
        languageCode: state.settings.settings.languageCode,
        isRepertoireLoading: state.sliderActiveSlide.loading,
        isLanguageLoading: state.settings.loading,
    }
}
const mapDispatchToProps = {
    setSliderActiveSlide,
    fetchPosters
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderScreen)
