import * as React from "react";
import * as RNative from "react-native";
import {IStyleable} from "../style/Styles";

interface IProps extends IStyleable {
    children?: any;
}

export const Text: React.StatelessComponent<IProps> = (props: IProps): JSX.Element => {
    const {children} = props;
    return <RNative.Text {...props}>
        {children}
    </RNative.Text>;
};
