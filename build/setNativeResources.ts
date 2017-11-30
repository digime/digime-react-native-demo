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

/**
 * Updates the Android project variables to copy the APP and Contract ID constants
 * into the strings.xml resource so that they can be used in the Android Manifest.
 * In order for the SDK to function correctly, the variables must be set and ready
 * before the build is made.
 *
 * Currently the only way to set the CA properties (p12 file) is by updating the
 * Android Manifest xml. Is it, however, possible to set the Contract ID and App ID
 * directly into the SDK using the provided methods.
 *
 * Move to using values set in the build.config instead.
 */
const setAndroidConfig = (): void => {
    // Retrieve the strings resources Android file
    const path: string = PATH.resolve("./android/app/src/main/res/values/strings.xml");

    if (fs.existsSync(path)) {
        const getKeyValue = (): IKeyValue[] => {
          return [
              {key: "app_name", value: Vars.Constants.APPLICATION_NAME},
              {key: "app_id", value: Vars.Constants.APPLICATION_ID},
              {key: "contract_id", value: Vars.Constants.CONTRACT_ID},
              {key: "p12_keystore_filename", value: Vars.Constants.P12_FILENAME + Vars.Constants.P12_EXTENSION},
              {key: "p12_keystore_passphrase", value: Vars.Constants.P12_PASSPHRASE},
          ];
        };

        const stingsXml: string = fs.readFileSync(path).toString("utf8");
        const res: any = xml2js(stingsXml, {compact: false});
        const elements: string[] = get(res, `elements[0].elements`, [])
            .map((value: IJSONElement) => {
                getKeyValue().some((keyValue) => {
                    if (get(value, "attributes.name") === keyValue.key) {
                        set(value, `elements[0].text`, keyValue.value);
                        return true;
                    }
                    return false;
                });
                return value;
            });

        set(res, `elements[0].elements`, elements);

        console.log(`Setting ${path} to:`);
        console.log(js2xml(res, {spaces: "\t"}));

        fs.writeFileSync(path, js2xml(res, {spaces: "\t"}));
    } else {
        console.error(`Please check the path to stings.xml. Path to android doesn't exist. ${path}`);
    }
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

        fs.writeFileSync(path, fileString);
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
