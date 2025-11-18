import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const RecipesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allRecipes = useQuery(api.recipes.getRecipes);
  const [search, setSearch] = useState("");

  const finalRecipes = search
    ? allRecipes?.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      )
    : allRecipes;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InsideRecipeScreen", {
          item: item,
        })
      }
      activeOpacity={0.5}
      style={styles.recipeItem}
    >
      <View style={styles.recipeItemContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        {(item.servings || item.totalTime) && (
          <View style={styles.recipeMetaContainer}>
            {item.servings && (
              <Text style={styles.recipeMeta}>🍽️ {item.servings}</Text>
            )}
            {item.totalTime && (
              <Text style={styles.recipeMeta}>⏱️ {item.totalTime}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.yourRecipesContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotesDashboardScreen")}
          style={styles.notesButton}
        >
          <Text style={styles.notesButtonText}>📝 Notes</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Recipes</Text>
        {imageUrl ? (
          <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
        ) : (
          <Text>{firstName ? firstName : ""}</Text>
        )}
      </View>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="grey"
          style={styles.searchIcon}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search recipes..."
          style={styles.searchInput}
        />
      </View>
      {!finalRecipes || finalRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {search
              ? "No recipes found"
              : "Create your first recipe to\nget started"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={finalRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.recipesList}
          contentContainerStyle={{
            marginTop: 19,
            borderTopWidth: 0.5,
            borderTopColor: "rgba(0, 0, 0, 0.59)",
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateRecipeScreen")}
        style={styles.newRecipeButton}
      >
        <AntDesign name="pluscircle" size={20} color="#fff" />
        <Text style={styles.newRecipeButtonText}>Create a New Recipe</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    alignSelf: "center",
  },
  yourRecipesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginTop: 19,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  notesButton: {
    backgroundColor: "#0D87E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  notesButtonText: {
    fontSize: RFValue(12),
    fontFamily: "MMedium",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 2,
    paddingHorizontal: 16,
    marginHorizontal: 13,
    marginTop: 19,
    height: 39,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "MLight",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#A9A9A9",
    textAlign: "center",
  },
  recipesList: {
    flex: 1,
    marginHorizontal: 13,
  },
  recipeItem: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.59)",
  },
  recipeItemContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    marginBottom: 6,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    gap: 12,
  },
  recipeMeta: {
    fontSize: RFValue(12),
    fontFamily: "MLight",
    color: "#666",
  },
  newRecipeButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 7,
    width: width / 1.6,
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
  newRecipeButtonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
});

export default RecipesDashboardScreen;
