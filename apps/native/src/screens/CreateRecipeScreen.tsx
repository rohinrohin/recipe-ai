import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@packages/backend/convex/_generated/dataModel";

const { width } = Dimensions.get("window");

export default function CreateRecipeScreen({ navigation }) {
  const createRecipe = useMutation(api.recipes.createRecipe);
  const openaiKeySet = useQuery(api.openai.openaiKeySet) ?? true;

  const [recipeText, setRecipeText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [recipeId, setRecipeId] = useState<Id<"recipes"> | null>(null);

  // Poll the recipe to check if parsing is complete
  const recipe = useQuery(
    api.recipes.getRecipe,
    recipeId ? { id: recipeId } : "skip"
  );

  // Animation for the spinner
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (isParsing) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isParsing]);

  // Check if parsing is complete
  const parsingComplete =
    recipe &&
    recipe.title !== "Parsing recipe..." &&
    recipe.title !== "Failed to parse recipe";

  useEffect(() => {
    if (parsingComplete && isParsing) {
      setTimeout(() => {
        setIsParsing(false);
        setRecipeText("");
        setRecipeId(null);
        navigation.navigate("RecipesDashboardScreen");
      }, 1500);
    }
  }, [parsingComplete, isParsing]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const createUserRecipe = async () => {
    if (!recipeText.trim() || !openaiKeySet) return;

    setIsParsing(true);
    try {
      const id = await createRecipe({ recipeText });
      setRecipeId(id);
    } catch (error) {
      console.error("Error creating recipe:", error);
      setIsParsing(false);
    }
  };

  if (isParsing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/icons/logo2small.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.parsingContainer}>
          <Text style={styles.parsingTitle}>
            {parsingComplete ? "Recipe Parsed! ✨" : "Parsing Your Recipe..."}
          </Text>

          {!parsingComplete && (
            <>
              <View style={styles.animationContainer}>
                <Animated.Text
                  style={[styles.cookingEmoji, { transform: [{ rotate: spin }] }]}
                >
                  🍳
                </Animated.Text>
              </View>

              <View style={styles.dotsContainer}>
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      opacity: spinValue.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [1, 0.3, 0.3, 1],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      opacity: spinValue.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [0.3, 1, 0.3, 0.3],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      opacity: spinValue.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [0.3, 0.3, 1, 0.3],
                      }),
                    },
                  ]}
                />
              </View>

              <Text style={styles.parsingSubtext}>
                Our AI chef is analyzing your recipe...
              </Text>
              <Text style={styles.parsingHint}>
                This usually takes a few seconds
              </Text>
            </>
          )}

          {parsingComplete && (
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>✅</Text>
              <Text style={styles.successText}>Your recipe has been saved!</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.underHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowBack}
            source={require("../assets/icons/arrow-back.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Create a New Recipe</Text>
        <View style={styles.arrowBack} />
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Recipe Text</Text>
          <Text style={styles.inputHint}>
            Paste your recipe here with ingredients, instructions, times, etc.
          </Text>
          <TextInput
            value={recipeText}
            onChangeText={(val: string) => setRecipeText(val)}
            style={[styles.inputField, styles.inputFieldMulti]}
            multiline
            placeholder="Paste your recipe here..."
            placeholderTextColor="#A9A9A9"
          />
          {!openaiKeySet && (
            <Text style={styles.errorText}>
              OpenAI API key is not configured. Please set it in your Convex
              dashboard.
            </Text>
          )}
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={createUserRecipe}
          style={[
            styles.parseButton,
            (!recipeText.trim() || !openaiKeySet) && styles.parseButtonDisabled,
          ]}
          disabled={!recipeText.trim() || !openaiKeySet}
        >
          <AntDesign name="scan1" size={20} color="#fff" />
          <Text style={styles.parseButtonText}>Parse Recipe with AI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0D87E1",
    height: 67,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 20,
    resizeMode: "contain",
  },
  underHeaderContainer: {
    width: width,
    height: 62,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  arrowBack: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  inputContainer: {
    paddingHorizontal: 27,
    marginTop: 43,
  },
  inputLabel: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "#000",
    marginBottom: 6,
  },
  inputHint: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#666",
    marginBottom: 12,
  },
  inputField: {
    backgroundColor: "#FFF",
    fontSize: RFValue(15),
    fontFamily: "MLight",
    color: "#000",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12.5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  inputFieldMulti: {
    minHeight: 400,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  errorText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#DC2626",
    marginTop: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  parseButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 7,
    width: width / 1.4,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    position: "absolute",
    bottom: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  parseButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  parseButtonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
  parsingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  parsingTitle: {
    fontSize: RFValue(22),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    marginBottom: 40,
    textAlign: "center",
  },
  animationContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  cookingEmoji: {
    fontSize: 80,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0D87E1",
  },
  parsingSubtext: {
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  parsingHint: {
    fontSize: RFValue(12),
    fontFamily: "MLight",
    color: "#A9A9A9",
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  successText: {
    fontSize: RFValue(17),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
  },
});
