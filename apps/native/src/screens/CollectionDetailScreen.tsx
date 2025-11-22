import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Svg, { Path } from "react-native-svg";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const CollectionDetailScreen = ({ navigation, route }) => {
  const { collectionId, collectionName } = route.params;
  const insets = useSafeAreaInsets();

  // If collectionId is "all", show all recipes, otherwise show collection recipes
  const allRecipes = useQuery(api.recipes.getRecipes);
  const collectionRecipes =
    collectionId !== "all"
      ? useQuery(api.collections.getCollectionRecipes, {
        collectionId,
      })
      : null;

  const recipesToDisplay = collectionId === "all" ? allRecipes : collectionRecipes;
  const previewRecipes = recipesToDisplay?.slice(0, 3) || [];

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItemContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("RecipeDetailsScreen", {
            recipeId: item._id,
          })
        }
        activeOpacity={0.6}
        style={styles.recipeItem}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
        ) : (
          <View style={styles.recipeImagePlaceholder}>
            <Ionicons name="restaurant" size={24} color="#9E9B99" />
          </View>
        )}

        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={1}>
            {item.name || 'Untitled Recipe'}
          </Text>
          <View style={styles.recipeMetaPill}>
            {/* Servings */}
            <Ionicons name="people-outline" size={12} color="#6B6866" />
            <Text style={styles.metaText}>{item.servings || '8'}</Text>

            {/* Prep Time */}
            <Ionicons name="time-outline" size={12} color="#6B6866" />
            <Text style={styles.metaText}>{item.prepTime || '20 min'}</Text>

            {/* Cook Time - Using Flame Icon */}
            <Ionicons name="flame-outline" size={12} color="#6B6866" />
            <Text style={styles.metaText}>{item.cookTime || '1 h'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={20} color="#1A1918" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.collectionHeaderContainer}>
      <View style={styles.collectionHeaderContent}>
        <View style={styles.imageStackContainer}>
          {previewRecipes.length > 0 ? (
            previewRecipes.map((recipe, index) => {
              // Stack logic: Index 0 is top, others behind
              const zIndex = 3 - index;
              const rotate = index === 0 ? '0deg' : index === 1 ? '-8deg' : '8deg';
              const translateX = index === 0 ? 0 : index === 1 ? -12 : 12;
              const scale = index === 0 ? 1 : 0.92;

              return (
                <View
                  key={recipe._id}
                  style={[
                    styles.stackImageWrapper,
                    {
                      zIndex,
                      transform: [
                        { rotate },
                        { translateX },
                        { scale }
                      ],
                    }
                  ]}
                >
                  {recipe.imageUrl ? (
                    <Image source={{ uri: recipe.imageUrl }} style={styles.stackImage} />
                  ) : (
                    <View style={styles.stackPlaceholder}>
                      <Ionicons name="restaurant" size={30} color="#6B6866" />
                    </View>
                  )}
                </View>
              )
            })
          ) : (
            <View style={[styles.stackImageWrapper, { zIndex: 1 }]}>
              <View style={styles.stackPlaceholder}>
                <Ionicons name="images-outline" size={40} color="#ccc" />
              </View>
            </View>
          )}
        </View>

        <Text style={styles.collectionName}>{collectionName}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {recipesToDisplay?.length || 0} recipe{recipesToDisplay?.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>


      {/* Circular Curved Sheet Top - Using SVG for smooth arc */}
      <Svg
        height="40"
        width="100%"
        style={styles.curveSvg}
        viewBox="0 0 375 40"
        preserveAspectRatio="none"
      >
        <Path
          d="M 0 40 Q 187.5 0 375 40 L 375 40 L 0 40 Z"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={24} color="#1A1918" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Feather name="more-horizontal" size={24} color="#1A1918" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipesToDisplay}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        bounces={false}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No recipes yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#F9F5F1",
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#EAE5E0",
  },
  collectionHeaderContainer: {
    backgroundColor: "#F9F5F1",
  },
  collectionHeaderContent: {
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 10,
  },
  imageStackContainer: {
    height: 140,
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  stackImageWrapper: {
    position: "absolute",
    width: 100,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 3,
  },
  stackImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9,
    resizeMode: "cover",
  },
  stackPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 9,
    backgroundColor: "#F0EBE6",
    justifyContent: "center",
    alignItems: "center",
  },
  collectionName: {
    fontSize: RFValue(24),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 12,
    textAlign: "center",
  },
  badge: {
    backgroundColor: "#EAE5E0", // Slightly darker beige for badge
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#1A1918",
  },
  sheetCurve: {
    height: 30,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginBottom: -1, // Prevent sub-pixel gaps
  },
  flatList: {
    backgroundColor: "#F9F5F1",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  recipeItemContainer: {
    backgroundColor: "#FFFFFF", // White background for items
    paddingHorizontal: 16,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  recipeImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    resizeMode: "cover",
  },
  recipeImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F0EBE6",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: RFValue(12),
    fontFamily: "PPSemibold",
    color: "#1A1918",
    marginBottom: 6,
  },
  recipeMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8F4F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  metaSeparator: {
    width: 1,
    height: 12,
    backgroundColor: "#D4CFC9",
    marginHorizontal: 2,
  },
  metaText: {
    fontSize: RFValue(10),
    fontFamily: "PPMedium",
    color: "#1A1918",
  },
  moreButton: {
    padding: 8,
  },
  curveSvg: {
    marginTop: -1,
  },
  listFooter: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  emptyStateContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
});

export default CollectionDetailScreen;
