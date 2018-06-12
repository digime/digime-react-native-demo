import * as fs from "fs";
import {get, set} from "lodash";
import * as PATH from "path";
import {js2xml, xml2js} from "xml-js";
import * as Vars from "../src/constants/Constants";

/* tslint:disable:no-console */

interface IKeyValue {
    key: string;
    value: string;
}

interface IJSONElement {
    type: string;
    name: string;
    attributes: {
        name: string;
    };
    elements: Array<{elements: any[]}>;
}

const generateHeader = (inLineStyle: boolean = false): string => [
    "******************************************************",
    " digi.me React Native Demo",
    " This file has been generated from javascript source",
    "******************************************************"
].map((value: string) => `${inLineStyle ? '#' : '//'}${value}`)
.reduce((prev: string, current: string) => `${prev}${current}\r\n`, "");

/**
 * Updates the Android project variables to copy the APP and Contract ID constants
 * into a build.properties file which is then referenced in the Android (build.gradle)
 * build script - which in turn sets variables in its strings.xml file
 */
const setAndroidConfig = (): void => {
    // Retrieve the strings resources Android file
    const path: string = PATH.resolve("./android/app/build.properties");
    const buildProps: string = [
        {key: "app_name", value: Vars.Constants.APPLICATION_NAME},
        {key: "app_id", value: Vars.Constants.APPLICATION_ID},
        {key: "contract_id", value: Vars.Constants.CONTRACT_ID},
        {key: "p12_keystore_filename", value: Vars.Constants.P12_FILENAME + Vars.Constants.P12_EXTENSION},
        {key: "p12_keystore_passphrase", value: Vars.Constants.P12_PASSPHRASE},
    ].map((value: IKeyValue) => `${value.key}=${value.value}`)
    .reduce((prev: string, current: string) => `${prev}${current}\r\n`, "")

    console.log(`Setting ${path} to:${buildProps}`);
    fs.writeFileSync(path, generateHeader(true) + buildProps);
};

/**
 * Updates the iOS project Constants file to utilise the variables
 * as def'd in the Constants.ts file.
 */
 const setiOSConfig = (): void => {
    // Retrieve the iOS Constants file
    // Updates the variables used for contracts id etc
    const path: string = PATH.resolve("./ios/CAExample/Constants.h");
    if (fs.existsSync(path)) {
        const getKeyValue = (): IKeyValue[] => {
            return [
                {key: "APPLICATION_NAME", value: Vars.Constants.APPLICATION_NAME},
                {key: "APPLICATION_ID", value: Vars.Constants.APPLICATION_ID},
                {key: "CONTRACT_ID", value: Vars.Constants.CONTRACT_ID},
                {key: "P12_FILENAME", value: Vars.Constants.P12_FILENAME},
                {key: "P12_PASSPHRASE", value: Vars.Constants.P12_PASSPHRASE},
            ];
        };

        const fileString: string = getKeyValue()
            .map((value: IKeyValue) => `#define ${value.key} @"${value.value}"`)
            .join("\r\n");

        console.log(`Setting ${path} to:`);
        console.log(fileString);

        fs.writeFileSync(path, generateHeader(false) + fileString);
    } else {
        console.error(`Please check the path to Constants.h. Path to ios doesn't exist. ${path}`);
    }

    // Updates the URL schema in the info.plist file
    // in order to append the application-id
    const infoPath: string = PATH.resolve("./ios/CAExample/info.plist");

    if (fs.existsSync(infoPath)) {
        const stingsXml: string = fs.readFileSync(infoPath).toString("utf8");
        const res: any = xml2js(stingsXml, {compact: false});

        let useNext: boolean = false;
        const elements: string[] = get(res, `elements[1].elements[0].elements`, [])
            .map((value: IJSONElement) => {
                if (value.name === "key" && get(value, "elements[0].text") === "CFBundleURLTypes") {
                    useNext = true;
                }

                if (useNext && value.name === "array") {
                    useNext = false;

                    let useNextSub: boolean = false;
                    get(value, "elements[0].elements")
                        .map((subValue: IJSONElement) => {
                            if (subValue.name === "key" && get(subValue, "elements[0].text") === "CFBundleURLSchemes") {
                                useNextSub = true;
                            }

                            if (useNextSub && subValue.name === "array") {
                                useNextSub = false;
                                set(
                                    subValue,
                                    "elements[0].elements[0].text",
                                   `digime-ca-${Vars.Constants.APPLICATION_ID}`,
                                );
                            }

                            return subValue;
                        });
                }

                return value;
            });

        console.log("Set info.plist");
        fs.writeFileSync(infoPath, js2xml(res, {spaces: "\t"}));
    } else {
        console.error(`Please check the path to the info.plist file`);
    }
};

setiOSConfig();
setAndroidConfig();
