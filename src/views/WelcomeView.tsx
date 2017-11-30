import * as React from "react";
import * as RNative from "react-native";
import {Button} from "../components/Button";
import {Image} from "../components/Image";
import {Text} from "../components/Text";
import {View} from "../components/View";
import {Styles} from "../style/Styles";
import {getPlatformString} from "../utils/AppUtils";

const devInstructions = RNative.Platform.select({
    android: ["Android SDK available from", "http://github.com/digi.me/digime-android-sdk"].join("\n"),
    ios: ["iOS SDK available from", "http://github.com/digi.me/digime-sdk-ios"].join("\n"),
});

export class WelcomeView extends React.Component<any, any> {
    public render() {
        return <View style={[Styles.centered, Styles.fill]}>
            <Image source={require("../../assets/images/digime-app-icon-256.png")}/>
            <Text style={Styles.h1}>
                digi.me Consent Access
            </Text>
            <Text style={Styles.h2}>
                React-Native Example for {getPlatformString()}
            </Text>
            <Text>
                {devInstructions}
            </Text>
            <Button title="Start!" onPress={() => {
                this.props.navigation.navigate("example");
            }}/>
        </View>;
    }
}
