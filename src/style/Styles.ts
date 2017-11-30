import * as RNative from "react-native";

export interface IStyleable {
    style?: any;
}

export const Styles = RNative.StyleSheet.create({
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },
    fill: {
        flex: 1,
    },
    h1: {
        fontSize: 30,
        justifyContent: "center",
        margin: 10,
    },
    h2: {
        fontSize: 20,
        margin: 10,
    },
    lightgrey: {
        backgroundColor: "#fcfcfc",
    },
    text: {
        fontSize: 10,
        margin: 0,
    },
});
