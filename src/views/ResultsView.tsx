import {clone} from "lodash";
import * as React from "react";
import {EmitterSubscription} from "react-native";

import {ScrollView} from "../components/ScrollView";
import {Text} from "../components/Text";
import {View} from "../components/View";
import Events from "../events/Events";
import {NativeBridge} from "../native/NativeBridge";

interface IState {
    data: string[];
}

export default class ResultsView extends React.Component<any, IState> {
    private fileData: EmitterSubscription;

    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
        };
    }

    public componentDidMount(): void {
        this.fileData = NativeBridge.getNativeBridge().addListener(Events.FILE_DATA, this.addDataString.bind(this));
    }

    public componentWillUnmount(): void {
        if (this.fileData) {
            this.fileData.remove();
        }
    }

    public render(): any {
        const count: number = this.state.data.length;

        if (count) {
            const lastObject: string = this.state.data[this.state.data.length - 1];
            return <ScrollView>
                    <Text>Found {this.state.data.length} file(s)</Text>
                    <Text>Last Object:</Text>
                    <Text>{lastObject}</Text>
            </ScrollView>;
        }

        return <View>
            <Text>Awaiting data / no data returned</Text>
        </View>;
    }

    private addDataString(jsonString: string): void {
        const data: string[] = clone(this.state.data);
        data.push(jsonString.toString());

        this.setState({data});
    }
}
