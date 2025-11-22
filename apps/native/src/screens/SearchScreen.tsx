import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-focus search input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const searchResults = useQuery(api.recipes.searchRecipes, {
    searchQuery: debouncedQuery,
  });

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
        navigation.navigate("RecipeDetailsScreen", {
          recipeId: item._id,
        });
      }}
      activeOpacity={0.6}
      style={styles.recipeCard}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      ) : (
        <View style={styles.recipeImagePlaceholder}>
          <Ionicons name="restaurant" size={32} color="#6B6866" />
        </View>
      )}
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const showEmptyState = debouncedQuery.trim() && searchResults?.length === 0;
  const showInitialState = !debouncedQuery.trim();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1918" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#6B6866"
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor="#6B6866"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
              activeOpacity={0.6}
            >
              <Ionicons name="close-circle" size={18} color="#6B6866" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showInitialState ? (
        <View style={styles.initialState}>
          <View style={styles.initialStateIconContainer}>
            <Ionicons name="search" size={48} color="#E8E4E0" />
          </View>
          <Text style={styles.initialStateText}>
            Search for recipes by{"\n"}name, description, or tags
          </Text>
        </View>
      ) : showEmptyState ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIconContainer}>
            <Ionicons name="file-tray-outline" size={48} color="#E8E4E0" />
          </View>
          <Text style={styles.emptyStateTitle}>No recipes found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try searching with different keywords
          </Text>
        </View>
      ) : (
        <>
          {searchResults && searchResults.length > 0 && (
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>
                {searchResults.length} recipe{searchResults.length !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
          <FlatList
            data={searchResults}
            renderItem={renderRecipeCard}
            keyExtractor={(item) => item._id}
            numColumns={2}
            style={styles.recipesList}
            contentContainerStyle={styles.recipesListContent}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.recipeRow}
            keyboardShouldPersistTaps="handled"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFE",
  },
  header: {
    backgroundColor: "#FFFEFE",
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E4E0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "PPMedium",
    color: "#1A1918",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  resultHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  resultCount: {
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
  recipesList: {
    flex: 1,
  },
  recipesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  recipeRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recipeCard: {
    width: "48%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F8F4F0",
  },
  recipeImage: {
    width: "100%",
    aspectRatio: 0.85,
    resizeMode: "cover",
  },
  recipeImagePlaceholder: {
    width: "100%",
    aspectRatio: 0.85,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F4F0",
  },
  recipeInfo: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: RFValue(14),
    fontFamily: "PPSemiBold",
    color: "#1A1918",
    lineHeight: RFValue(18),
  },
  initialState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  initialStateIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F8F4F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  initialStateText: {
    fontSize: RFValue(16),
    fontFamily: "PPMedium",
    color: "#6B6866",
    textAlign: "center",
    lineHeight: RFValue(24),
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F8F4F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: RFValue(20),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
});

export default SearchScreen;
