import * as React from "react";
import * as RNative from "react-native";
import {IStyleable} from "../style/Styles";

interface IProps extends IStyleable {
    children?: any;
}

export const View: React.StatelessComponent<any> = (props: IProps): JSX.Element => {
    const {children} = props;
    return <RNative.View {...props}>
        {children}
    </RNative.View>;
};
