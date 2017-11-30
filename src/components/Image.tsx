import * as React from "react";
import * as RNative from "react-native";
import {ImageURISource} from "react-native";
import {IStyleable} from "../style/Styles";

interface IProps extends IStyleable {
    source: ImageURISource;
}

export const Image: React.StatelessComponent<any> = (props: IProps): JSX.Element =>
    <RNative.Image {...props}/>;
