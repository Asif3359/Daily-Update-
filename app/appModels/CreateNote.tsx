import { useNotes } from "@/hooks/useNotes";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Realm from "realm"; // ✅ use proper import (fixes warning)

function CreateNoteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote, getNoteById, updateNote } = useNotes();
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = params.noteId as string;

  const isEditMode = !!noteId;

  useEffect(() => {
    if (isEditMode) {
      const objectId = new Realm.BSON.ObjectId(noteId);
      const note = getNoteById(objectId);
      if (note) {
        setTitle(note.title);
        setContent(note.note);
      }
    }
  }, [isEditMode, noteId]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your note");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content for your note");
      return;
    }

    if (isEditMode) {
      const objectId = new Realm.BSON.ObjectId(noteId);
      updateNote(objectId, { title, note: content });
      Alert.alert("Success", "Note updated successfully");
    } else {
      createNote(title, content);
    }

    router.back();
  };

  const handleGoBack = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to discard?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 px-2 pb-2 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center pb-2 border-b border-gray-300 bg-white">
        <TouchableOpacity onPress={handleGoBack} className="p-2">
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">
          {isEditMode ? "Edit Note" : "New Note"}
        </Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={!title.trim() || !content.trim()}
          className={`p-2 ${!title.trim() || !content.trim() ? "opacity-50" : ""}`}
        >
          <Text
            className={`font-semibold ${
              !title.trim() || !content.trim()
                ? "text-gray-400"
                : "text-blue-500"
            }`}
          >
            {isEditMode ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Note Form */}
      <View className="flex-1 p-4 bg-white">
        <TextInput
          className="text-2xl font-bold text-black mb-4"
          placeholder="Note title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9ca3af"
        />

        <TextInput
          className="flex-1 text-base text-black"
          placeholder="Start typing your note..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
        />
      </View>
    </SafeAreaView>
  );
}

export default CreateNoteScreen;
