import LocalizeComponent from "../Localization/LocalizedComponent";
import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList } from 'react-native';
import DrawerMenuIcon from 'TheaterSchedule/Navigation/DrawerMenuIcon';
import { Container, Button } from 'native-base';
import { BallIndicator } from 'react-native-indicators';
import BASE_URL from 'TheaterSchedule/baseURL';

class MessagesScreen extends LocalizeComponent {
    constructor(props) {
        super(props);
        this.state = {
            privateMessages: [{}],
            publicMessages: [{}],
            currentPublic: true,
            isLoaded: false
        }
    }

    static navigationOptions = ({ screenProps }) => {
        return {
            drawerLabel: () => null,
            title: screenProps.MessagesScreenTitle,
        };
    };

    async fetchMessages(isPublic) {
        this.setState({ isLoaded: false });
        if (!isPublic) {
            fetch(`${BASE_URL}AdminsPost`).then(response => {
                console.log(`${BASE_URL}AdminsPost`)
                return response.json();
            }).then((msgs) => {
                console.log(msgs);
                let sortedMessages = msgs.sort(function(a,b){
                    return new Date(b.postDate) - new Date(a.postDate);
                  });
                this.setState({ publicMessages: sortedMessages, isLoaded: true, currentPublic: true });
            })
        }
        else {
            let Accountid = await AsyncStorage.getItem('UserId');
            //should be uncommented when userid will correctly store after authorization
            //let Accountid=91;
            console.log(`${BASE_URL}AdminsPost/${Accountid}`);
            fetch(`${BASE_URL}AdminsPost/${Accountid}`).then(response => {
                return response.json();
            }).then((msgs) => {
                console.log(msgs);
                let sortedMessages = msgs.sort(function(a,b){
                    return new Date(b.postDate) - new Date(a.postDate);
                  });
                this.setState({ privateMessages: sortedMessages, isLoaded: true, currentPublic: false });
            })
        }
    }

    componentDidMount() {
        this.fetchMessages();
    }

    pickedPublic() {
        if (this.state.currentPublic) {
            this.fetchMessages(true);
        }
    }

    pickedPrivate() {
        if (!this.state.currentPublic) {
            this.fetchMessages(false);
        }
    }

    changeTypeOfMessages = {
        public: {
            text: 'public messages',
            click: () => {
                console.log(this.state.currentPublic)
                if (!this.state.currentPublic) {
                    this.fetchMessages(false);
                }
            }
        },
        private: {
            text: 'private messages',
            click: () => {
                console.log(this.state.currentPublic)
                if (this.state.currentPublic) {
                    console.log("picckedd");
                    this.fetchMessages(true);
                }
            }
        }
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#BFD0D670' }}>
                    <DrawerMenuIcon
                        onPressMenuIcon={() => this.props.navigation.openDrawer()}
                        text={this.t("Messages")}
                        showMessageTypeIcon={true}
                        items={this.changeTypeOfMessages}
                    />
                    <View style={styles.container}>
                        <BallIndicator color="#aaa" />
                    </View>
                </Container>
            )
        }
        else {
            return (
                <Container style={{ flex: 1, backgroundColor: '#BFD0D670' }}>
                    <DrawerMenuIcon
                        onPressMenuIcon={() => this.props.navigation.openDrawer()}
                        text={this.t("Messages")}
                        showMessageTypeIcon={true}
                        items={this.changeTypeOfMessages}
                    />
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.currentPublic ? this.state.publicMessages : this.state.privateMessages}
                            renderItem={({ item }) =>
                                <View style={styles.title}>
                                    <Text style={styles.titleTextStyle}>{item.subject}</Text>
                                    <View style={styles.message}>
                                        <Text style={styles.messageTextStyle}>{item.postText}</Text>
                                    </View>
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Container>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        alignSelf: 'center',
        marginTop: 10,
        width: '99%',
        borderRadius: 5,
        backgroundColor: '#7154b8',
        borderColor: '#7154b8',
        alignItems: 'center'
    },
    message: {
        alignSelf: 'center',
        padding: 5,
        width: '100%',
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        backgroundColor: '#b4a5d9',
        borderColor: '#7154b8',
        alignItems: 'flex-start'
    },
    titleTextStyle: {
        fontFamily: 'Arsenal-Regular',
        fontSize: 18,
        color: 'white',
        padding: 5,
        textAlign: 'center',
    },
    messageTextStyle: {
        fontFamily: 'Arsenal-Regular',
        fontSize: 16,
        color: 'black',
    },
})

export default MessagesScreen