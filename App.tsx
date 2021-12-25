import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";

export default function App() {
  return (
    <View style={styles.container}>
      <PlaidLink
        tokenConfig={{
          token: "link-sandbox-965dbc89-14fc-4122-b900-27a562de6db0",
          noLoadingState: false,
        }}
        onSuccess={(success: LinkSuccess) => console.log(success)}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text>Add Account</Text>
      </PlaidLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
