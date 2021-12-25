import type { ConfigPlugin } from "@expo/config-plugins";
import {
  withMainApplication,
  withAppBuildGradle,
  withSettingsGradle,
} from "@expo/config-plugins";

function applyPackage(mainApplication: string) {
  const plaidPackageImport = `import com.plaid.PlaidPackage;\n`;
  const plaidAddPackage = `packages.add(new PlaidPackage());`;

  // Make sure the project does not have the settings already
  if (!mainApplication.includes(plaidPackageImport)) {
    mainApplication = mainApplication.replace(
      /package com.expo.plaid;/,
      `package com.expo.plaid;\n${plaidPackageImport}`
    );
  }

  if (!mainApplication.includes(plaidAddPackage)) {
    mainApplication = mainApplication.replace(
      /return packages;/,
      `
    ${plaidAddPackage}
    return packages;
    `
    );
  }

  return mainApplication;
}

function applyImplementation(appBuildGradle: string) {
  const plaidImplementation = `implementation project(':react-native-plaid-link-sdk')`;

  // Make sure the project does not have the dependency already
  if (!appBuildGradle.includes(plaidImplementation)) {
    return appBuildGradle.replace(
      /dependencies\s?{/,
      `dependencies {
    ${plaidImplementation}`
    );
  }

  return appBuildGradle;
}

function applySettings(gradleSettings: string) {
  const plaidSettings = `include ':react-native-plaid-link-sdk'
  project(':react-native-plaid-link-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-plaid-link-sdk/android')`;
  // Make sure the project does not have the settings already
  if (!gradleSettings.includes(`include ':react-native-plaid-link-sdk'`)) {
    return gradleSettings + plaidSettings;
  }

  return gradleSettings;
}

const withAndroidPlaid: ConfigPlugin = (expoConfig) => {
  expoConfig = withMainApplication(expoConfig, (config) => {
    config.modResults.contents = applyPackage(config.modResults.contents);
    return config;
  });

  expoConfig = withAppBuildGradle(expoConfig, (config) => {
    config.modResults.contents = applyImplementation(
      config.modResults.contents
    );
    return config;
  });

  expoConfig = withSettingsGradle(expoConfig, (config) => {
    config.modResults.contents = applySettings(config.modResults.contents);
    return config;
  });

  return expoConfig;
};

export default withAndroidPlaid;
