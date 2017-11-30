"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vars = require("../src/constants/Constants");
const xml_js_1 = require("xml-js");
const fs = require("fs");
const PATH = require("path");
const lodash_1 = require("lodash");
const setAndroidConfig = () => {
    const relPathToAndroid = PATH.resolve("./android/app/src/main/res/values/strings.xml");
    if (fs.existsSync(relPathToAndroid)) {
        const keyApplicationName = "app_name";
        const keyApplicationId = "app_id";
        const keyContractId = "contract_id";
        const keyP12Filename = "p12_keystore_filename";
        const keyP12Passphrase = "p12_keystore_passphrase";
        const getKeyValue = () => {
            return [
                { key: keyApplicationName, newValue: Vars.Constants.APPLICATION_NAME },
                { key: keyApplicationId, newValue: Vars.Constants.APPLICATION_ID },
                { key: keyContractId, newValue: Vars.Constants.CONTRACT_ID },
                { key: keyP12Filename, newValue: Vars.Constants.P12_FILENAME },
                { key: keyP12Passphrase, newValue: Vars.Constants.P12_PASSPHRASE },
            ];
        };
        const stingsXml = fs.readFileSync(relPathToAndroid).toString("utf8");
        const res = xml_js_1.xml2js(stingsXml, { compact: false });
        const elements = lodash_1.get(res, `elements[0].elements`, [])
            .map((value) => {
            getKeyValue().some(keyValue => {
                if (lodash_1.get(value, "attributes.name") === keyValue.key) {
                    lodash_1.set(value, `elements[0].text`, keyValue.newValue);
                    return true;
                }
                return false;
            });
            return value;
        });
        lodash_1.set(res, `elements[0].elements`, elements);
        console.log(`Setting ${relPathToAndroid} to:`);
        console.log(xml_js_1.js2xml(res, { spaces: "\t" }));
        fs.writeFileSync(relPathToAndroid, xml_js_1.js2xml(res, { spaces: "\t" }));
    }
    else {
        console.error(`Please check the path to stings.xml. Path to android doesn't exist. ${relPathToAndroid}`);
    }
};
setAndroidConfig();
//# sourceMappingURL=setNativeResources.js.map