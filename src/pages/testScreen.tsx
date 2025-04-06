import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { ImageBlur, ImageBlurView } from "../components/ImageBlur";

const landscapeImage = "https://picsum.photos/800/600";
const portraitImage = "https://picsum.photos/600/800";
const squareImage = "https://picsum.photos/800";

const App = (): JSX.Element => {
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.description}>
          Only ImageBlurView will be blurred
        </Text>
        <ImageBlur
          src={landscapeImage}
          aspectRatio="landscape"
          blurChildren={
            <View style={styles.landscape}>
              <Text style={styles.imageText}>Some text</Text>
              <ImageBlurView
                style={styles.plusButtonWrapper}
                blurProps={{ style: { borderRadius: 9999 } }}
              >
                <IconButton icon="plus" onPress={() => {}} />
              </ImageBlurView>
            </View>
          }
        />

        <Text style={styles.description}>Full width blur</Text>
        <ImageBlur
          src={portraitImage}
          aspectRatio="portrait"
          blurChildren={
            <ImageBlurView style={styles.portrait}>
              <Text style={styles.imageText}>Some content</Text>
            </ImageBlurView>
          }
        />

        <Text style={styles.description}>Full height blur</Text>
        <ImageBlur
          src={squareImage}
          aspectRatio="square"
          blurChildren={
            <ImageBlurView style={styles.square}>
              <Text style={styles.imageText}>Some content</Text>
            </ImageBlurView>
          }
        />

        <Text style={styles.description}>Full width / height blur</Text>
        <ImageBlur
          src={squareImage}
          aspectRatio="square"
          blurChildren={
            <ImageBlurView style={styles.square}>
              <Text style={styles.imageText}>Some content</Text>
            </ImageBlurView>
          }
        />

        <Text style={styles.description}>Multiple ImageBlurView</Text>
        <ImageBlur
          src={landscapeImage}
          aspectRatio="landscape"
          blurChildren={
            <View style={styles.multiView}>
              <View>
                <View>
                  <Text style={styles.imageText}>Text 1</Text>
                  <Text style={styles.imageText}>Text 2</Text>
                </View>
                <View style={styles.row}>
                  <ImageBlurView
                    style={styles.square}
                    blurProps={{
                      style: { borderRadius: 9999 },
                    }}
                  >
                    <TouchableOpacity>
                      <View style={styles.rowLabel}>
                        <Icon source="plus" size={10} />
                        <Text style={styles.imageText}>The greater label</Text>
                      </View>
                    </TouchableOpacity>
                  </ImageBlurView>
                  <ImageBlurView
                    style={styles.square}
                    blurProps={{
                      style: { borderRadius: 9999 },
                    }}
                  >
                    <TouchableOpacity>
                      <View style={styles.label}>
                        <Text style={styles.imageText}>Small label</Text>
                      </View>
                    </TouchableOpacity>
                  </ImageBlurView>
                </View>
              </View>
              <View>
                <Text style={styles.imageText}>Text 3</Text>
                <Text style={styles.imageText}>Text 4</Text>
              </View>
            </View>
          }
        />

        <Text style={styles.description}>Custom blur props</Text>
        <ImageBlur
          src={portraitImage}
          aspectRatio="portrait"
          blurChildren={
            <ImageBlurView
              blurProps={{
                blurRadius: 3,
                overlay: { backgroundColor: "blue", opacity: 0.3 },
                style: {
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 30,
                },
              }}
              style={styles.custom}
            >
              <Text style={styles.imageText}>Custom blur props</Text>
            </ImageBlurView>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  description: {
    fontSize: 20,
  },
  imageText: {
    fontWeight: "bold",
  },
  plusButtonWrapper: {
    alignSelf: "flex-start",
    padding: 12,
    marginTop: 4,
  },
  landscape: {
    padding: 20,
    left: 20,
  },
  portrait: {
    padding: 16,
  },
  square: {
    height: "100%",
    padding: 16,
    alignSelf: "flex-start",
  },
  multiView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    position: "absolute",
    width: "100%",
    bottom: 20,
  },
  row: {
    flexDirection: "row",
    columnGap: 4,
    marginTop: 8,
  },
  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    alignSelf: "flex-start",
  },
  label: {
    alignSelf: "flex-start",
  },
  custom: {
    padding: 16,
    alignSelf: "flex-start",
    justifyContent: "center",
    left: 20,
    top: "20%",
  },
});
