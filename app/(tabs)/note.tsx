import { useNotes } from "@/hooks/useNotes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

// Hoisted constants to avoid new object/array references on each render
const TAGS_STYLES = {
  b: { fontWeight: "bold" },
  i: { fontStyle: "italic" },
  ul: { paddingLeft: 16, marginVertical: 4 },
  li: { marginBottom: 2 },
} as const;

const BASE_STYLE = { color: "#000", fontSize: 14, lineHeight: 20 } as const;

type NoteItemType = {
  _id: Realm.BSON.ObjectId;
  title: string;
  note: string;
  updatedAt: Date;
  userEmail?: string;
};

const NoteCard = React.memo(function NoteCard({
  item,
  width,
  onPress,
  onLongPress,
  onDelete,
  formatDate,
}: {
  item: NoteItemType;
  width: number;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
  formatDate: (d: Date) => string;
}) {
  const contentWidth = useMemo(() => width - 32, [width]);
  const source = useMemo(() => ({ html: item.note }), [item.note]);

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 mx-2 shadow-sm border border-gray-200"
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text
          className="text-lg font-semibold text-black flex-1 mr-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <TouchableOpacity onPress={onDelete} className="p-1">
          <Ionicons name="trash-outline" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Render HTML content */}
      <View style={{ maxHeight: 100, overflow: "hidden", marginBottom: 8 }}>
        <RenderHtml
          contentWidth={contentWidth}
          source={source}
          baseStyle={BASE_STYLE}
          tagsStyles={TAGS_STYLES}
        />
      </View>

      <Text className="text-black/50 text-xs">{formatDate(item.updatedAt)}</Text>
      <Text className="text-xs">{item?.userEmail}</Text>
    </TouchableOpacity>
  );
});

function NoteScreen() {
  const { notes, deleteNote } = useNotes();
  const router = useRouter();

  const handleDeleteNote = useCallback((noteId: Realm.BSON.ObjectId, noteTitle: string) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${noteTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNote(noteId),
        },
      ]
    );
  }, [deleteNote]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const { width } = useWindowDimensions();

  const renderNoteItem = useCallback(
    ({ item }: { item: NoteItemType }) => (
      <NoteCard
        item={item}
        width={width}
        onPress={() =>
          router.push({
            pathname: "/appModels/CreateNote",
            params: { noteId: item._id.toString() },
          })
        }
        onLongPress={() => handleDeleteNote(item._id, item.title)}
        onDelete={() => handleDeleteNote(item._id, item.title)}
        formatDate={formatDate}
      />
    ),
    [width, router, handleDeleteNote]
  );

  return (
    <SafeAreaView className="flex-1 px-2 pb-2 bg-white">
      {/* Header */}
      <View className="bg-white pb-2 border-b border-gray-300">
        <Text className="text-2xl font-bold text-black">My Notes</Text>
        <Text className="text-black/60 text-sm mt-1">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </Text>
      </View>

      {/* Notes List */}
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          className="flex-1"
        />
      ) : (
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="document-text-outline" size={64} color="#999" />
          <Text className="text-xl font-semibold text-black/40 mt-4 text-center">
            No notes yet
          </Text>
          <Text className="text-black/40 text-center mt-2">
            Tap the + button to create your first note
          </Text>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full justify-center items-center shadow-lg"
        onPress={() => router.push("/appModels/CreateNote")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default NoteScreen;
