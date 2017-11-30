import {capitalize} from "lodash";
import * as RNative from "react-native";

export const getPlatformString = (): string => capitalize(RNative.Platform.OS);
export const isAndroid = (): boolean => RNative.Platform.OS === "android";
