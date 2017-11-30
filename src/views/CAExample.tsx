import * as React from "react";
import {EmitterSubscription} from "react-native";

import {Button} from "../components/Button";
import {Text} from "../components/Text";
import {View} from "../components/View";
import {Constants} from "../constants/Constants";
import Events from "../events/Events";
import {Styles} from "../style/Styles";
import {NativeBridge} from "../native/NativeBridge";


export default class CAExample extends React.Component<any, any> {
    private accept: EmitterSubscription;
    private reject: EmitterSubscription;

    constructor(props) {
        super(props);
    }

    public componentDidMount(): void {
        this.accept = NativeBridge.getNativeBridge().addListener(Events.USER_AUTH_ACCEPT, () => {
            this.changeView("results");
        });
        this.reject = NativeBridge.getNativeBridge().addListener(Events.USER_AUTH_REJECT, () => {
            this.changeView("splash");
        });
    }

    public render(): any {
        return <View style={[Styles.centered, Styles.fill]}>
            <Text>Using App ID: {Constants.APPLICATION_ID}</Text>
            <Text>Using Contract ID: {Constants.CONTRACT_ID}</Text>
            <Text>Using digi.me endpoint: {Constants.ARGON_URL}</Text>
            <Button title="Open digi.me" onPress={() => {
                NativeBridge.getNativeBridge().initSDK();
            }}/>
        </View>;
    }

    private changeView(view: String): void {
        this.accept.remove();
        this.reject.remove();
        this.props.navigation.navigate(view);
    }
}
