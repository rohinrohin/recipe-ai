import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const { width } = Dimensions.get("window");

export default function InsideNoteScreen({ route, navigation }) {
  const { item } = route.params;
  const [activeTab, setActiveTab] = useState("original");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);
  const [regenerateSummary, setRegenerateSummary] = useState(false);

  const updateNote = useMutation(api.notes.updateNote);
  const openaiKeySet = useQuery(api.openai.openaiKeySet) ?? true;

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    try {
      await updateNote({
        noteId: item._id,
        title: editTitle,
        content: editContent,
        isSummary: regenerateSummary,
      });
      setIsEditing(false);
      Alert.alert("Success", "Note updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update note");
    }
  };

  const handleCancel = () => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setRegenerateSummary(false);
    setIsEditing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/icons/logo2small.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.underHeaderContainer}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Edit Note</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              style={styles.inputField}
              placeholder="Note Title"
              placeholderTextColor="#A9A9A9"
            />
            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              style={[styles.inputField, styles.inputFieldMulti]}
              multiline
              placeholder="Note Content"
              placeholderTextColor="#A9A9A9"
            />
          </View>

          <View style={styles.advancedSummarizationContainer}>
            <View style={styles.advancedSummarizationCheckboxContainer}>
              <TouchableOpacity
                onPress={() => setRegenerateSummary(!regenerateSummary)}
                style={openaiKeySet ? styles.checkbox : styles.checkboxDisabled}
                disabled={!openaiKeySet}
              >
                {regenerateSummary && (
                  <AntDesign
                    name="check"
                    size={RFValue(12.5)}
                    color="#0D87E1"
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.advancedSummarizationText}>
                Regenerate AI Summary {openaiKeySet ? "" : " (Disabled)"}
              </Text>
            </View>
          </View>
        </ScrollView>
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

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <AntDesign name="edit" size={20} color="#0D87E1" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {(item.createdAt || item.updatedAt) && (
          <View style={styles.timestampContainer}>
            {item.createdAt && (
              <Text style={styles.timestampText}>
                Created: {formatDate(item.createdAt)}
              </Text>
            )}
            {item.updatedAt &&
              item.createdAt &&
              item.updatedAt !== item.createdAt && (
                <Text style={styles.timestampText}>
                  Updated: {formatDate(item.updatedAt)}
                </Text>
              )}
          </View>
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.contentDescription}>
            {activeTab === "original"
              ? item.content
              : item.summary
                ? item.summary
                : "No summary available"}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.footerTab,
            activeTab === "original" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("original")}
        >
          <Image
            source={require("../assets/icons/OrignalIcon.png")} // Replace with your original icon image file
            style={[
              styles.footerIcon,
              activeTab === "original"
                ? styles.activeIcon
                : styles.inactiveIcon,
            ]}
          />
          <Text
            style={[
              styles.footerText,
              activeTab === "original"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Original
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.footerTab,
            activeTab === "summary" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("summary")}
        >
          <Image
            source={require("../assets/icons/summaryIcon.png")} // Replace with your summary icon image file
            style={[
              styles.footerIcon,
              activeTab === "summary" ? styles.activeIcon : styles.inactiveIcon,
            ]}
          />
          <Text
            style={[
              styles.footerText,
              activeTab === "summary"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Summary
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  contentContainer: {
    // Add styles for contentContainer if needed
  },
  contentTitle: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    color: "#000",
    textAlign: "center",
    marginTop: 28,
  },
  contentDescription: {
    fontSize: RFValue(17.5),
    fontFamily: "MRegular",
    alignSelf: "center",
    textAlign: "justify",
    paddingLeft: 29,
    paddingRight: 21,
    marginTop: 30,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
  },
  footerTab: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  activeTab: {
    backgroundColor: "#0D87E1",
  },
  activeIcon: {
    tintColor: "#fff",
  },
  inactiveIcon: {
    tintColor: "#000",
  },
  footerText: {
    fontSize: RFValue(12.5),
    fontFamily: "MRegular",
  },
  activeTabText: {
    color: "#fff",
  },
  inactiveTabText: {
    color: "#000",
  },
  cancelText: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "#FF3B30",
  },
  saveText: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "#0D87E1",
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
  inputField: {
    backgroundColor: "#FFF",
    marginBottom: 30,
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
    minHeight: 228,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  advancedSummarizationContainer: {
    paddingHorizontal: 27,
    marginTop: 10,
  },
  advancedSummarizationCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: RFValue(17.5),
    height: RFValue(17.5),
    borderRadius: RFValue(5),
    borderWidth: 1,
    borderColor: "#0D87E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: RFValue(10),
    backgroundColor: "#F9F5FF",
  },
  checkboxDisabled: {
    width: RFValue(17.5),
    height: RFValue(17.5),
    borderRadius: RFValue(5),
    borderWidth: 1,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: RFValue(10),
    backgroundColor: "#F9F5FF",
  },
  advancedSummarizationText: {
    fontSize: RFValue(15),
    fontFamily: "MLight",
    color: "#000",
  },
  timestampContainer: {
    paddingHorizontal: 27,
    marginTop: 20,
    alignItems: "center",
  },
  timestampText: {
    fontSize: RFValue(12),
    fontFamily: "MLight",
    color: "#666",
    marginBottom: 4,
  },
});
