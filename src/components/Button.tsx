import * as React from "react";
import * as RNative from "react-native";
import {IStyleable} from "../style/Styles";

interface IProps extends IStyleable {
    title: string;
    onPress: () => void;
}

export const Button: React.StatelessComponent<IProps> = (props: IProps): JSX.Element =>
    <RNative.Button {...props}/>;
