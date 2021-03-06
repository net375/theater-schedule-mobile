import React from 'react';
import { connect } from "react-redux";
import LocalizeComponent from "../Localization/LocalizedComponent";
import {Constants} from 'expo';
import {FontAwesome} from '@expo/vector-icons';
import {BallIndicator} from 'react-native-indicators';
import registerForNotification from "../services/pushNotification";

import {
  enterAuthLogin,
  enterAuthPass,
  validateLogin,
  sendAuthorization,
  validatePassword
} from '../Actions/authorizationActions';
import {Content, Container, Toast} from 'native-base';
import CustomTextField from './UserProfileComponents/CustomTextField';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import jwt_decode from 'jwt-decode';
import UniformButton from './Components/UniformButton';

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (width / guidelineBaseWidth) * size;
const scaleVertical = size => (height / guidelineBaseHeight) * size;


class AuthorizationScreen extends LocalizeComponent {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      accessToken: '',
      expires: '',
      refreshToken: '',
      decoded: '',
    }
  }

  onSendMessage = () => {

    this.props.validateLogin();
    this.props.validatePassword();

    if ((this.props.authorization.LoginError === "" && this.props.authorization.PasswordError === "") 
        && (this.props.authorization.Login !== "" && this.props.authorization.PasswordHash !== "")){
      let deviceId=AsyncStorage.getItem("deviceID");
      registerForNotification(deviceId);
      this.props.sendAuthorization({
        Email: this.props.authorization.Login,
        PasswordHash: this.props.authorization.PasswordHash
      }).then((res) => {
        if (this.props.authorization.sendingError === null) {
          this.setState({
          accessToken: res.accessToken, 
          expires: res.expiresTime, 
          refreshToken: res.refreshToken, 
          decoded: jwt_decode(res.accessToken)});
        } else {
          Toast.show({
            text: this.t(this.props.authorization.sendingError.toString()),
            buttonText: "Okay",
            type: "danger",
            duration: 3000
          })
        }
      })
      .then(async () => {
        if (this.props.authorization.sendingError === null) {
          await AsyncStorage.setItem('FirstName', this.state.decoded.firstName);
          await AsyncStorage.setItem('LastName', this.state.decoded.lastName);
          await AsyncStorage.setItem('UserId', this.state.decoded.userId);
          await AsyncStorage.setItem('Email', this.state.decoded.email);
          await AsyncStorage.setItem('DateOfBirth', this.state.decoded.dateOfBirth);
          await AsyncStorage.setItem('Country', this.state.decoded.country);
          await AsyncStorage.setItem('City', this.state.decoded.city);
          await AsyncStorage.setItem('PhoneNumber', this.state.decoded.phoneNumber);
          await AsyncStorage.setItem('AccessToken', this.state.accessToken);
          await AsyncStorage.setItem('RefreshToken', this.state.refreshToken);
          await AsyncStorage.setItem('ExpiresDate', this.state.expires);
        }
      })
      .then(() => {
        if (this.props.authorization.sendingError === null){
          this.setState({email: "", password: ""});
          this.props.navigation.navigate("Schedule");
        }
      })
      .catch((error) => console.error(error));
    } else {
      Toast.show({
        text: this.t("Fill the form correctly"),
        buttonText: "Okay",
        type: "danger",
        duration: 3000
      })
    } 
  };

  render() {
    return (
      <Container contentContainerStyle={styles.all}>
        <View style={styles.screen}>
          <View style={styles.header}>
            <FontAwesome
              name="sign-in"
              size={scale(50)}
              style={{ color: "#4A4A4A" }}
            />
            <Text
              style={styles.headerText}
            >
              {this.t("Authorization")}
            </Text>
          </View>

          <Content >
            <View >
              <KeyboardAvoidingView behavior='padding'>
                <CustomTextField
                  label={this.t("LOGIN")}
                  labelTextStyle={{}}
                  onChangeText={(txt) => {
                    this.props.enterAuthLogin(txt);
                    this.props.validateLogin();
                  }}
                />
                {this.props.authorization.LoginError ? 
                    (<Text style={styles.error}>{this.t(this.props.authorization.LoginError)}</Text>) : null}

                <CustomTextField
                  secureTextEntry = {true}
                  label={this.t("Password")}
                  labelTextStyle={styles.labelColor}
                  onChangeText={(txt) => {
                    this.props.enterAuthPass(txt);
                    this.props.validatePassword();
                  }}
                />
                    {this.props.authorization.PasswordError ? 
                    (<Text style={styles.error}>{this.t(this.props.authorization.PasswordError)}</Text>) : null}

                <View>
                  <View style={styles.textRow}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("forgotPasswordScreen")}>
                      <Text style={styles.textRowContinue}> {this.t("Forgot password?")} </Text>
                    </TouchableOpacity>
                  </View>
              </View>

              <View style={{display: !this.props.authorization.isLoading ? "flex" : "none"}}>
                <UniformButton
                  text={this.t("Login")}
                  style={styles.button}
                  onPress={this.onSendMessage}
                />
              </View>

              <View style={{...styles.button, display: this.props.authorization.isLoading ? "flex" : "none"}}>
                <BallIndicator color="#aaa" />
              </View>

              </KeyboardAvoidingView>
              <View style={{display: this.props.authorization.isLoading ? "none" : "flex"}}>
                <View style={styles.textRow}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("registrationScreen")}>
                    <Text style={styles.textRowContinue}> {this.t("Still haven't an account?")} </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{display: this.props.authorization.isLoading ? "none" : "flex"}}>
                <View style={styles.textRow}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("Schedule")}>
                    <Text style={styles.textRowContinue}> {this.t("Continue without authorization")} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Content>

        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: scaleVertical(28),
    paddingHorizontal: scale(16),
    flex: 1,
    backgroundColor: "rgb(245, 245, 245)"
  },
  textRowContinue:{
    color: "#3B4EFE", fontSize: 15, marginTop: 8
  },
  button: {
    alignSelf: "center",
    margin: 20,
    width: "65%",
    justifyContent: 'center',
    marginTop: 8
  },
  back: {
    position: "absolute",
    top: Constants.statusBarHeight + 8,
    left: 16,
    zIndex: 1
  },
  header: {
    marginTop: scaleVertical(36),
    alignItems: "center",
    justifyContent: "center"
  },
  all: {
    flex: 1,
    justifyContent: "space-evenly"
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scaleVertical(28),
    marginBottom: scaleVertical(8),
    paddingHorizontal: 8
  },
  error: {
    color: "red"
  },
  headerText:{
    fontSize: scale(28), fontWeight: "800", color: "#4A4A4A"
  },
  labelColor:{
    color:"#707070"
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    zIndex: 10,
    alignSelf: 'center',
    //display: this.props.isLoaded ? "flex" : "none"
  },
});

const mapStateToProps = (state) => ({
  authorization: state.authorization,
  languageCode: state.settings.settings.languageCode,
  deviceId: state.settings.deviceId,
})

const mapDispatchToProps = dispatch => {
  return {
    enterAuthLogin: txt => dispatch(enterAuthLogin(txt)),
    enterAuthPass: txt => dispatch(enterAuthPass(txt)),
    validateLogin: () => dispatch(validateLogin()),
    validatePassword: () => dispatch(validatePassword()),
    sendAuthorization: authorization => dispatch(sendAuthorization(authorization))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationScreen);