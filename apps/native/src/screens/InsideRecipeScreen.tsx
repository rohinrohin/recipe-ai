import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

export default function InsideRecipeScreen({ route, navigation }) {
  const { item } = route.params;

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

        <Text style={styles.title} numberOfLines={1}>
          Recipe Details
        </Text>
        <View style={styles.arrowBack} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Recipe Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.recipeDescription}>{item.description}</Text>
          )}
        </View>

        {/* Meta Information */}
        {(item.servings || item.prepTime || item.cookTime || item.totalTime) && (
          <View style={styles.metaContainer}>
            {item.servings && (
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>🍽️</Text>
                <Text style={styles.metaLabel}>Servings</Text>
                <Text style={styles.metaValue}>{item.servings}</Text>
              </View>
            )}
            {item.prepTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>⏱️</Text>
                <Text style={styles.metaLabel}>Prep Time</Text>
                <Text style={styles.metaValue}>{item.prepTime}</Text>
              </View>
            )}
            {item.cookTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>🔥</Text>
                <Text style={styles.metaLabel}>Cook Time</Text>
                <Text style={styles.metaValue}>{item.cookTime}</Text>
              </View>
            )}
            {item.totalTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>⏰</Text>
                <Text style={styles.metaLabel}>Total Time</Text>
                <Text style={styles.metaValue}>{item.totalTime}</Text>
              </View>
            )}
          </View>
        )}

        {/* Tags */}
        {(item.cuisine || item.category || (item.tags && item.tags.length > 0)) && (
          <View style={styles.tagsContainer}>
            {item.cuisine && (
              <View style={[styles.tag, styles.tagBlue]}>
                <Text style={styles.tagText}>{item.cuisine}</Text>
              </View>
            )}
            {item.category && (
              <View style={[styles.tag, styles.tagGreen]}>
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
            )}
            {item.tags?.map((tag, index) => (
              <View key={index} style={[styles.tag, styles.tagPurple]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🥘</Text>
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
          {item.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.ingredientText}>
                {ingredient.amount && (
                  <Text style={styles.ingredientAmount}>{ingredient.amount} </Text>
                )}
                {ingredient.item}
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>👨‍🍳</Text>
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          {item.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FE",
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
    flex: 1,
    textAlign: "center",
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: RFValue(22),
    fontFamily: "MMedium",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
  },
  recipeDescription: {
    fontSize: RFValue(14),
    fontFamily: "MLight",
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  metaItem: {
    alignItems: "center",
    minWidth: "40%",
    marginBottom: 12,
  },
  metaEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#666",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: RFValue(13),
    fontFamily: "MMedium",
    color: "#000",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagBlue: {
    backgroundColor: "#DBEAFE",
  },
  tagGreen: {
    backgroundColor: "#DCFCE7",
  },
  tagPurple: {
    backgroundColor: "#F3E8FF",
  },
  tagText: {
    fontSize: RFValue(12),
    fontFamily: "MMedium",
    color: "#1F2937",
  },
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontFamily: "MMedium",
    color: "#000",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    color: "#0D87E1",
    marginRight: 12,
    marginTop: 2,
  },
  ingredientText: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#000",
    flex: 1,
  },
  ingredientAmount: {
    fontFamily: "MMedium",
    color: "#374151",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0D87E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: RFValue(13),
    fontFamily: "MMedium",
    color: "#fff",
  },
  instructionText: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#000",
    flex: 1,
    lineHeight: RFValue(20),
  },
});
