import { createDrawerNavigator, createStackNavigator } from "react-navigation";
import ScheduleScreen from "../Screens/ScheduleScreen";
import SettingsScreen from "../Screens/SettingsScreen";
import MessageScreen from "../Screens/messageScreen";
import CustomDrawerContent from "./CustomDrawerContentComponent";
import { connect } from "react-redux";
import { reduxifyNavigator, createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import SliderScreen from "../Screens/SliderScreen";
import WishListScreen from '../Screens/WishListScreen';
import PerformanceScreen from '../Screens/PerformanceScreen';
import SplashScreen from "../Screens/SplashScreen";
import LanguageScreen from "../Screens/LanguageScreen";
import EventScreen from "../Screens/EventScreen";
import AboutTheaterScreen from '../Screens/AboutTheaterScreen';
import PerformanceScheduleScreen from '../Screens/PerformanceSchedule';
import EventDetailScreen from '../Screens/EventDetailScreen';

const DrawerStack = createDrawerNavigator(
  {
    Schedule: { screen: ScheduleScreen },
    Repertoire: { screen: SliderScreen },
    WishList: { screen: WishListScreen },
    Event: { screen: EventScreen}, 
    Message: { screen: MessageScreen },
    Settings: { screen: SettingsScreen },
    AboutTheater: { screen: AboutTheaterScreen },
  },
  {
    drawerPosition: "left",
    contentComponent: CustomDrawerContent,
    initialRouteName: "Schedule"
  }
);

const DrawerNavigation = createStackNavigator(
  {
    DrawerStack: { screen: DrawerStack }
  },
  {
    headerMode: "none",
    navigationOptions: () => ({
      gesturesEnabled: false
    })
  }
);

const PerformanceStack = createStackNavigator(
  {
    performanceScreen: { screen: PerformanceScreen }
  },
  {
    headerMode: 'none',
  })

export const AppNavigator = createStackNavigator(
  {
    drawerStack: { screen: DrawerNavigation },
    performanceStack: { screen: PerformanceStack },
    Splash: { screen: SplashScreen },
    ChooseLanguage: { screen: LanguageScreen },
    PerformanceSchedule: {screen : PerformanceScheduleScreen},
    eventDetailScreen: { screen: EventDetailScreen },
  },
  {
    headerMode: "none",
    initialRouteName: "Splash"
  }
);
export const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.navigation
);
const Apps = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = state => ({
  state: state.navigation
});

export default connect(mapStateToProps)(Apps);
