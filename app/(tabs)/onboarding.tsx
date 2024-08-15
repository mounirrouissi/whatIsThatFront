import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import  CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
// import { useGlobalContext } from "../context/GlobalProvider";
import React from "react";

const onboarding = () => {
//   const { loading, isLogged } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.container}>
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.contentContainer}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            style={styles.cards}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text style={styles.highlightedText}>Aora</Text>
            </Text>

            <Image
              source={images.path}
              style={styles.path}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.description}>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles={styles.button}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  scrollViewContent: {
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 130,
    height: 84,
  },
  cards: {
    maxWidth: 380,
    width: '100%',
    height: 298,
  },
  textContainer: {
    position: 'relative',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highlightedText: {
    color: '#secondary-200',
  },
  path: {
    width: 136,
    height: 15,
    position: 'absolute',
    bottom: -8,
    right: -32,
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#e5e5e5',
    marginTop: 28,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 28,
  },
});

export default onboarding;