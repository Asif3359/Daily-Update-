import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useNotes } from "@/hooks/useNotes";
import { useSyncNotes } from "@/hooks/useSyncNotes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import Realm from "realm";

export default function CreateNoteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote, getNoteById, updateNote } = useNotes();
  const { syncNotes } = useSyncNotes();
  const isOnline = useNetworkStatus();
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = params.noteId as string;
  const isEditMode = !!noteId;

  const auth = getAuth();
  const user = auth.currentUser;

  const richText = useRef<RichEditor>(null);

  // Hoisted/memoized styles and actions to avoid new references each render
  const editorStyle = useMemo(
    () => ({
      backgroundColor: "#fff",
      color: "#000",
      placeholderColor: "#9ca3af",
    }),
    []
  );

  const toolbarActions = useMemo(
    () => [
      actions.setBold,
      actions.setItalic,
      actions.setUnderline,
      actions.insertBulletsList,
      actions.insertOrderedList,
    ],
    []
  );

  const toolbarStyle = useMemo(
    () => ({
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    }),
    []
  );

  useEffect(() => {
    if (isEditMode) {
      const objectId = new Realm.BSON.ObjectId(noteId);
      const note = getNoteById(objectId);
      if (note) {
        setTitle(note.title);
        setContent(note.note); // HTML content
      }
    }
  }, [isEditMode, noteId, getNoteById]);

  const handleSave = async () => {
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

      if (isOnline) {
        await syncNotes(user?.email || "");
      } else {
        console.log("OFFLINE");
      }
    } else {
      createNote(title, content, user?.email || "");

      if (isOnline) {
        await syncNotes(user?.email || "");
      } else {
        console.log("OFFLINE");
      }
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
    <SafeAreaView className="flex-1 bg-white px-2 pb-2">
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

      {/* Title Input */}
      <TextInput
        className="text-2xl font-bold text-black mb-2"
        placeholder="Note title..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#9ca3af"
      />

      <RichEditor
        ref={richText}
        initialContentHTML={content}
        onChange={setContent}
        style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}
        editorStyle={editorStyle}
        placeholder="Start typing your note..."
      />
      {/* Rich Text Editor */}
      <RichToolbar
        editor={richText}
        actions={toolbarActions}
        iconTint="black"
        selectedIconTint="blue"
        style={toolbarStyle}
      />
    </SafeAreaView>
  );
}

export { CreateNoteScreen };
