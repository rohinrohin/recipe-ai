import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const ProfileScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const fullName = user?.user?.fullName;
  const firstName = user?.user?.firstName;
  const email = user?.user?.primaryEmailAddress?.emailAddress;
  const createdAt = user?.user?.createdAt;

  const allNotes = useQuery(api.notes.getNotes);
  const notesCount = allNotes?.length || 0;

  const joinedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate("LoginScreen");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Banner */}
      <View style={styles.banner} />

      {/* Profile Content */}
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {imageUrl ? (
            <Image style={styles.avatar} source={{ uri: imageUrl }} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {firstName?.[0] || fullName?.[0] || "U"}
              </Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{fullName || "User"}</Text>
          <Text style={styles.userEmail}>{email || "No email"}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="file-text" size={20} color="#0D87E1" />
            </View>
            <Text style={styles.statLabel}>Total Notes</Text>
            <Text style={styles.statValue}>{notesCount}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="calendar" size={20} color="#0D87E1" />
            </View>
            <Text style={styles.statLabel}>Member Since</Text>
            <Text style={styles.statValueSmall}>{joinedDate}</Text>
          </View>
        </View>

        {/* Info List */}
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Feather name="user" size={20} color="#6B7280" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{fullName || "Not set"}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Feather name="mail" size={20} color="#6B7280" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{email || "Not set"}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotesDashboardScreen")}
            style={styles.dashboardButton}
          >
            <Text style={styles.dashboardButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Feather name="log-out" size={18} color="white" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#0D87E1",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontFamily: "MSemiBold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  banner: {
    height: 80,
    backgroundColor: "#0D87E1",
  },
  content: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -60,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
  },
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    fontSize: RFValue(40),
    fontFamily: "MSemiBold",
    color: "#6B7280",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  userName: {
    fontSize: RFValue(22),
    fontFamily: "MSemiBold",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B7280",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  statIconContainer: {
    backgroundColor: "rgba(13, 135, 225, 0.1)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: RFValue(24),
    fontFamily: "MSemiBold",
    color: "#2D2D2D",
  },
  statValueSmall: {
    fontSize: RFValue(14),
    fontFamily: "MSemiBold",
    color: "#2D2D2D",
  },
  infoList: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: RFValue(14),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  buttonContainer: {
    marginBottom: 40,
  },
  dashboardButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  dashboardButtonText: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutButtonText: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "white",
    marginLeft: 8,
  },
});

export default ProfileScreen;
