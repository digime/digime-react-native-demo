import * as React from "react";
import {Animated} from "react-native";
import {NavigationContainer, StackNavigator} from "react-navigation";
import CAExample from "../views/CAExample";
import ResultsView from "../views/ResultsView";
import {WelcomeView} from "../views/WelcomeView";

export const Router: NavigationContainer = StackNavigator({
    splash: {
        screen: WelcomeView,
    },
    example: {
        screen: CAExample,
    },
    results: {
        screen: ResultsView,
    },
}, {
    headerMode: "screen",
    mode: "modal",
    transitionConfig: () => ({
        transitionSpec: {
            duration: 500,
            timing: Animated.timing,
        }}),
});
