import * as React from "react";
import * as RNative from "react-native";
import {IStyleable} from "../style/Styles";

interface IProps extends IStyleable {
    children?: any;
}

export const ScrollView: React.StatelessComponent<IProps> = (props: IProps): JSX.Element => {
    const {children} = props;
    return <RNative.ScrollView {...props}>
        {children}
    </RNative.ScrollView>;
};
