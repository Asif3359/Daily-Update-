// app/create-update.tsx
import { useDailyUpdates } from "@/src/hooks/useDailyUpdates";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = ["Work", "Personal", "Health", "Learning", "Other"];
const MOODS = ["😊 Great", "😐 Okay", "😔 Tough", "🚀 Productive", "😴 Tired"];

export default function CreateUpdateScreen() {
  const { createUpdate, getTodaysUpdate, updateUpdate } = useDailyUpdates();
  const todaysUpdate = getTodaysUpdate();

  const [title, setTitle] = useState(todaysUpdate?.title || "");
  const [content, setContent] = useState(todaysUpdate?.content || "");
  const [category, setCategory] = useState(todaysUpdate?.category || "Work");
  const [mood, setMood] = useState(todaysUpdate?.mood || "");

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      if (todaysUpdate) {
        await updateUpdate(todaysUpdate.id, { title, content, category, mood });
        Alert.alert("Success", "Update updated successfully!");
      } else {
        await createUpdate({ title, content, category, mood });
        Alert.alert("Success", "Update created successfully!");
      }

      router.back();
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save update");
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">
          {todaysUpdate ? "Edit Today's Update" : "Today's Update"}
        </Text>
      </View>

      <View className="bg-white p-4 rounded-lg mb-4">
        <Text className="text-lg font-semibold mb-2">Title *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="What's the main focus today?"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-lg font-semibold mb-2">Details</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4 h-32"
          placeholder="What did you accomplish? Any reflections?"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <Text className="text-lg font-semibold mb-2">Category</Text>
        <View className="flex-row flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                category === cat ? "bg-blue-500" : "bg-gray-200"
              }`}
              onPress={() => setCategory(cat)}
            >
              <Text
                className={category === cat ? "text-white" : "text-gray-700"}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-lg font-semibold mb-2">How was your day?</Text>
        <View className="flex-row flex-wrap">
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m}
              className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                mood === m ? "bg-green-500" : "bg-gray-200"
              }`}
              onPress={() => setMood(m)}
            >
              <Text className={mood === m ? "text-white" : "text-gray-700"}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mb-4"
        onPress={handleSave}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {todaysUpdate ? "Update" : "Save"} Today's Update
        </Text>
      </TouchableOpacity>

      {todaysUpdate && (
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg"
          onPress={() => {
            Alert.alert(
              "Delete Update",
              "Are you sure you want to delete today's update?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    // Add delete functionality here
                    router.back();
                  },
                },
              ]
            );
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Delete Today's Update
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
