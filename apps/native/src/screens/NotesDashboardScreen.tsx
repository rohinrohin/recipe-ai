import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Keyboard,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const NotesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allNotes = useQuery(api.notes.getNotes);
  const [search, setSearch] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const finalNotes = search
    ? allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()),
      )
    : allNotes;

  useEffect(() => {
    Animated.spring(searchAnimation, {
      toValue: isSearchVisible ? 1 : 0,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();

    if (isSearchVisible) {
      // Auto-focus the search input when it appears
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchVisible]);

  const toggleSearch = () => {
    if (isSearchVisible) {
      // When closing, clear the search
      setSearch("");
      Keyboard.dismiss();
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InsideNoteScreen", {
          item: item,
        })
      }
      activeOpacity={0.5}
      style={styles.noteItem}
    >
      <Text style={styles.noteText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")} // Replace with your logo image file
          style={styles.logo}
        />
      </View>

      <View style={styles.yourNotesContainer}>
        {/* @ts-ignore, for css purposes */}
        <Image style={styles.avatarSmall} />
        <Text style={styles.title}>Your Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleSearch}
            style={styles.searchButton}
            activeOpacity={0.7}
          >
            <Feather name="search" size={22} color="#2D2D2D" />
          </TouchableOpacity>
          {imageUrl ? (
            <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
          ) : (
            <Text style={styles.avatarPlaceholder}>{firstName ? firstName : ""}</Text>
          )}
        </View>
      </View>

      {/* Animated Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchAnimation,
            height: searchAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 50],
            }),
            marginTop: searchAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 20],
            }),
            transform: [
              {
                scaleY: searchAnimation,
              },
            ],
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color="#0D87E1"
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          value={search}
          onChangeText={setSearch}
          placeholder="Search notes..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Feather name="x" size={18} color="#999" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={toggleSearch}
          style={styles.cancelButton}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
      {!finalNotes || finalNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Create your first note to{"\n"}get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={finalNotes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.notesList}
          contentContainerStyle={{
            marginTop: 19,
            borderTopWidth: 0.5,
            borderTopColor: "rgba(0, 0, 0, 0.59)",
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateNoteScreen")}
        style={styles.newNoteButton}
      >
        <AntDesign name="pluscircle" size={20} color="#fff" />
        <Text style={styles.newNoteButtonText}>Create a New Note</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  yourNotesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginTop: 19,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  avatarPlaceholder: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#2D2D2D",
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 15,
    overflow: "hidden",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#2D2D2D",
    paddingVertical: 12,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButton: {
    paddingHorizontal: 10,
  },
  cancelButtonText: {
    fontSize: RFValue(14),
    fontFamily: "MMedium",
    color: "#0D87E1",
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.59)",

    backgroundColor: "#F9FAFB",
  },
  noteText: {
    fontSize: 16,
    fontFamily: "MLight",
    color: "#2D2D2D",
  },

  newNoteButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 7,
    width: Dimensions.get("window").width / 1.6,
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
  newNoteButtonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
  switchContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  emptyStateText: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: RFValue(15),
    color: "grey",
    fontFamily: "MLight",
  },
  emptyState: {
    width: "100%",
    height: "35%",
    marginTop: 19,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.59)",
  },
});

export default NotesDashboardScreen;
