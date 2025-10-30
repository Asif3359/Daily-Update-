import { handleLogout, updateUserProfile } from "@/Components/Auth/AuthHelp";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import { useNotes } from "@/hooks/useNotes";
import { useTasks } from "@/hooks/useTasks";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Helper to get user initials
function getInitials(name: string) {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
}

const navLinks = [
  {
    label: "My Tasks",
    icon: "check-circle-outline",
    route: "/(tabs)/home",
    available: true,
  },
  {
    label: "My Notes",
    icon: "sticky-note-2",
    route: "/(tabs)/note",
    available: true,
  },
  {
    label: "Calendar",
    icon: "event",
    route: "/(tabs)/calendar",
    available: true,
  },
  {
    label: "Statistics",
    icon: "analytics",
    route: null,
    available: false,
  },
  {
    label: "Achievements",
    icon: "emoji-events",
    route: null,
    available: false,
  },
  {
    label: "Documents",
    icon: "folder",
    route: null,
    available: false,
  },
  {
    label: "Team",
    icon: "groups",
    route: null,
    available: false,
  },
  {
    label: "Notifications",
    icon: "notifications",
    route: null,
    available: false,
  },
  {
    label: "Security",
    icon: "security",
    route: null,
    available: false,
  },
  {
    label: "Help & Support",
    icon: "help-center",
    route: null,
    available: false,
  },
  {
    label: "About",
    icon: "info",
    route: null,
    available: false,
  },
];

function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { notes } = useNotes();
  const { tasks } = useTasks();

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      setEmail(user.email || "");
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL ?? null);
    }
  }, []);

  const onEditPress = () => {
    setEditName(displayName);
    setModalVisible(true);
    setError("");
    setSuccess("");
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    await updateUserProfile(
      editName,
      setError,
      (msg) => {
        setSuccess(msg);
        setDisplayName(editName);
        setTimeout(() => setModalVisible(false), 700);
      },
      setIsLoading
    );
  };

  const handleComingSoon = (featureName: string) => {
    Alert.alert(
      "Coming Soon",
      `${featureName} feature is under development and will be available soon!`,
      [{ text: "OK", style: "default" }]
    );
  };

  // Enhanced Avatar component with gradient border effect
  const Avatar = ({ name, photo }: { name: string; photo: string | null }) => (
    <View className="items-center justify-center">
      <View className="p-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
        {photo ? (
          <Image
            source={{ uri: photo }}
            className="w-28 h-28 rounded-full border-4 border-white"
          />
        ) : (
          <View className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 items-center justify-center border-4 border-white">
            <Text className="text-3xl font-bold text-slate-700">
              {getInitials(name)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Enhanced NavLink component with better styling
  const NavLink = ({
    icon,
    label,
    onPress,
    available,
  }: {
    icon: any;
    label: string;
    onPress: () => void;
    available: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-5 bg-white my-1 rounded-xl shadow-sm border border-slate-100"
      activeOpacity={0.7}
    >
      <View
        className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${available ? "bg-indigo-50" : "bg-slate-100"}`}
      >
        <MaterialIcons
          name={icon}
          size={24}
          color={available ? "#6366f1" : "#94a3b8"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${available ? "text-slate-800" : "text-slate-400"}`}
        >
          {label}
        </Text>
        {!available && (
          <Text className="text-xs text-slate-400 mt-1">Coming soon</Text>
        )}
      </View>
      <MaterialIcons
        name="chevron-right"
        size={20}
        color={available ? "#64748b" : "#cbd5e1"}
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Section (No gradient, white bg) */}
        <View className="pt-12 pb-7 px-6 bg-white">
          <View className="items-center">
            <Avatar name={displayName} photo={photoURL} />
            <Text className="text-2xl font-bold text-black mt-4 mb-1">
              {displayName || "No Name"}
            </Text>
            <Text className="text-slate-600 text-base">{email}</Text>
            <TouchableOpacity
              onPress={onEditPress}
              className="flex-row items-center border border-slate-200 px-4 py-2 rounded-full mt-4 bg-white"
            >
              <MaterialIcons name="edit" size={16} color="#334155" />
              <Text className="text-slate-800 font-medium ml-2">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section (white bg, dark text) */}
        <View className="flex-row justify-between -mt-6 px-6 mb-6 bg-white w-full space-x-4">
          <View className="bg-white rounded-2xl p-4 shadow flex-1 items-center border border-slate-100">
            <Text className="text-2xl font-bold text-slate-800">{tasks.length}</Text>
            <Text className="text-slate-500 text-sm">Tasks</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 shadow flex-1 items-center border border-slate-100">
            <Text className="text-2xl font-bold text-slate-800">{notes.length}</Text>
            <Text className="text-slate-500 text-sm">Notes</Text>
          </View>
        </View>

        {/* Features Section (white bg, dark text) */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-bold text-black mb-4">Features</Text>
          {navLinks.map((link, idx) => (
            <NavLink
              key={link.label}
              icon={link.icon}
              label={link.label}
              available={link.available}
              onPress={() => {
                if (link.available && link.route) {
                  router.push(link.route as any);
                } else {
                  handleComingSoon(link.label);
                }
              }}
            />
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 mb-8 mt-4">
          <Button
            onPress={handleLogout}
            title="Logout"
            variant="danger"
            className="w-full py-4"
            icon={<MaterialIcons name="logout" size={20} color="white" />}
          />
        </View>

        {/* App Version */}
        <View className="items-center mb-8">
          <Text className="text-slate-400 text-sm">Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-3xl shadow-2xl p-8 mx-6 w-11/12 max-w-md">
            <View className="items-center mb-6">
              <Text className="text-2xl font-bold text-slate-800 mb-2">
                Edit Profile
              </Text>
              <Text className="text-slate-500 text-center">
                Update your display name and profile information
              </Text>
            </View>
            {/* Avatar preview in modal */}
            <View className="items-center my-4">
              <Avatar name={editName} photo={photoURL} />
            </View>
            <Input
              label="Display Name"
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              className="mb-6"
            />

            <View className="space-y-3">
              <Button
                onPress={handleUpdate}
                title={isLoading ? "Updating..." : "Save Changes"}
                disabled={isLoading}
                variant="primary"
                className="w-full py-3"
              />
              <Button
                onPress={() => setModalVisible(false)}
                title="Cancel"
                variant="secondary"
                className="w-full py-3"
              />
            </View>

            {error ? (
              <View className="bg-red-50 p-3 rounded-lg mt-4 border border-red-200">
                <Text className="text-red-700 text-center font-medium">
                  {error}
                </Text>
              </View>
            ) : null}

            {success ? (
              <View className="bg-green-50 p-3 rounded-lg mt-4 border border-green-200">
                <Text className="text-green-700 text-center font-medium">
                  {success}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ProfileScreen;
