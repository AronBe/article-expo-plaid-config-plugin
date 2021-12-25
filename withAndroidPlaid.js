"use strict";
exports.__esModule = true;
var config_plugins_1 = require("@expo/config-plugins");
function applyPackage(mainApplication) {
    var plaidPackageImport = "import com.plaid.PlaidPackage;\n";
    var plaidAddPackage = "packages.add(new PlaidPackage());";
    // Make sure the project does not have the settings already
    if (!mainApplication.includes(plaidPackageImport)) {
        mainApplication = mainApplication.replace(/package com.expo.plaid;/, "package com.expo.plaid;\n" + plaidPackageImport);
    }
    if (!mainApplication.includes(plaidAddPackage)) {
        mainApplication = mainApplication.replace(/return packages;/, "\n    " + plaidAddPackage + "\n    return packages;\n    ");
    }
    return mainApplication;
}
function applyImplementation(appBuildGradle) {
    var plaidImplementation = "implementation project(':react-native-plaid-link-sdk')";
    // Make sure the project does not have the dependency already
    if (!appBuildGradle.includes(plaidImplementation)) {
        return appBuildGradle.replace(/dependencies\s?{/, "dependencies {\n    " + plaidImplementation);
    }
    return appBuildGradle;
}
function applySettings(gradleSettings) {
    var plaidSettings = "include ':react-native-plaid-link-sdk'\n  project(':react-native-plaid-link-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-plaid-link-sdk/android')";
    // Make sure the project does not have the settings already
    if (!gradleSettings.includes("include ':react-native-plaid-link-sdk'")) {
        return gradleSettings + plaidSettings;
    }
    return gradleSettings;
}
var withAndroidPlaid = function (expoConfig) {
    expoConfig = config_plugins_1.withMainApplication(expoConfig, function (config) {
        config.modResults.contents = applyPackage(config.modResults.contents);
        return config;
    });
    expoConfig = config_plugins_1.withAppBuildGradle(expoConfig, function (config) {
        config.modResults.contents = applyImplementation(config.modResults.contents);
        return config;
    });
    expoConfig = config_plugins_1.withSettingsGradle(expoConfig, function (config) {
        config.modResults.contents = applySettings(config.modResults.contents);
        return config;
    });
    return expoConfig;
};
exports["default"] = withAndroidPlaid;
