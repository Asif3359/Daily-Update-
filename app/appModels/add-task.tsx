import Button from "@/Components/Common/Button";
import { useTasks } from "@/hooks/useTasks";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Realm from "realm";

export default function AddTaskScreen() {
  const router = useRouter();
  const { createTask, getTaskById, updateTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isImportant, setIsImportant] = useState(false);
  const [category, setCategory] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const isEditMode = !!taskId;

  useEffect(() => {
    if (isEditMode && taskId) {
      try {
        const objectId = new Realm.BSON.ObjectId(taskId);
        const task = getTaskById(objectId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || " ");
          setPriority(task.priority || "medium");
          setIsImportant(task.isImportant || false);
          setCategory(task.category || "");
          setEstimatedTime(task.estimatedTime?.toString() || "");
          setDueDate(task.dueDate || null);
          setReminderDate(task.reminderDate || null);
        }
      } catch (error) {
        console.error("Invalid task ID:", error);
        Alert.alert("Error", "Invalid task ID");
      }
    }
  }, [isEditMode, taskId]);

  const handleAddTask = () => {
    if (title.trim() === "") {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const reminderDateObj = reminderDate ? new Date(reminderDate) : undefined;

    createTask(
      title.trim(),
      "asifahammednishst@gmail.com",
      description.trim(),
      priority,
      dueDateObj,
      reminderDateObj,
      isImportant,
      [],
      category.trim() || undefined,
      estimatedTime ? parseInt(estimatedTime) : undefined
    );

    Alert.alert("Success", "Task added successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleUpdate = () => {
    if (title.trim() === "") {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    if (!taskId) {
      Alert.alert("Error", "Task ID not found");
      return;
    }

    try {
      const objectId = new Realm.BSON.ObjectId(taskId);
      const updates = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        reminderDate: reminderDate ? new Date(reminderDate) : null,
        isImportant,
        category: category.trim() || null,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
      };

      updateTask(objectId, updates as any);

      Alert.alert("Success", "Task updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleSave = () => {
    if (isEditMode) {
      handleUpdate();
    } else {
      handleAddTask();
    }
  };

  const handleGoBack = () => {
    if (title.trim() || description.trim()) {
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 py-2">
        <TouchableOpacity onPress={handleGoBack} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          className="text-2xl font-bold text-black flex-shrink"
          numberOfLines={1}
        >
          {isEditMode ? "Edit Task" : "Add New Task"}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-4 bg-white">
            {/* Task Title */}
            <Text className="text-lg font-semibold text-black mb-2">
              Title *
            </Text>
            <TextInput
              className="bg-gray-100 text-black p-3 rounded mb-4 border border-gray-300"
              placeholder="Enter task title"
              placeholderTextColor="#6B7280"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />

            {/* Description */}
            <Text className="text-lg font-semibold text-black mb-2">
              Description
            </Text>
            <TextInput
              className="bg-gray-100 text-black p-3 rounded mb-4 min-h-[100px] border border-gray-300"
              placeholder="Enter task description"
              placeholderTextColor="#6B7280"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              returnKeyType="next"
            />

            {/* Priority */}
            <Text className="text-lg font-semibold text-black mb-2">
              Priority
            </Text>
            <View className="flex-row justify-between mb-4">
              {(["low", "medium", "high"] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setPriority(level)}
                  className={`flex-1 mx-1 p-3 rounded ${
                    priority === level
                      ? level === "low"
                        ? "bg-green-500"
                        : level === "medium"
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold capitalize ${
                      priority === level ? "text-white" : "text-black"
                    }`}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Important Toggle */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-black">
                Important
              </Text>
              <TouchableOpacity
                onPress={() => setIsImportant(!isImportant)}
                className={`w-12 h-6 rounded-full ${
                  isImportant ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full bg-white ${
                    isImportant ? "ml-6" : "ml-0"
                  }`}
                />
              </TouchableOpacity>
            </View>

            {/* Due Date */}
            <Text className="text-lg font-semibold text-black mb-2">
              Due Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDueDatePicker(true)}
              className="bg-gray-100 p-3 rounded mb-4 border border-gray-300"
            >
              <Text className="text-black">
                {dueDate ? dueDate.toLocaleDateString() : "Select due date"}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={showDueDatePicker}
              date={dueDate || new Date()}
              onConfirm={(date) => {
                setShowDueDatePicker(false);
                setDueDate(date);
              }}
              onCancel={() => {
                setShowDueDatePicker(false);
              }}
            />

            {/* Reminder Date */}
            <Text className="text-lg font-semibold text-black mb-2">
              Reminder Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowReminderPicker(true)}
              className="bg-gray-100 p-4 rounded-lg mb-4 flex-row justify-between items-center border border-gray-300"
            >
              <Text className="text-black text-base">
                {reminderDate
                  ? reminderDate.toLocaleString()
                  : "Select reminder date and time"}
              </Text>
              <MaterialIcons name="notifications" size={20} color="#6B7280" />
            </TouchableOpacity>

            <DatePicker
              modal
              open={showReminderPicker}
              date={reminderDate || new Date()}
              mode="datetime"
              onConfirm={(date) => {
                setShowReminderPicker(false);
                setReminderDate(date);
              }}
              onCancel={() => {
                setShowReminderPicker(false);
              }}
            />

            {/* Category */}
            <Text className="text-lg font-semibold text-black mb-2">
              Category
            </Text>
            <TextInput
              className="bg-gray-100 text-black p-3 rounded mb-4 border border-gray-300"
              placeholder="e.g., Work, Personal, Shopping"
              placeholderTextColor="#6B7280"
              value={category}
              onChangeText={setCategory}
              returnKeyType="next"
            />

            {/* Estimated Time */}
            <Text className="text-lg font-semibold text-black mb-2">
              Estimated Time (minutes)
            </Text>
            <TextInput
              className="bg-gray-100 text-black p-3 rounded mb-6 border border-gray-300"
              placeholder="e.g., 30"
              placeholderTextColor="#6B7280"
              value={estimatedTime}
              onChangeText={setEstimatedTime}
              keyboardType="numeric"
              returnKeyType="done"
            />

            {/* Save/Update Button */}
            <Button
              title={isEditMode ? "Update Task" : "Add Task"}
              variant="outline"
              size="lg"
              className="border-2 border-gray-600 bg-white mb-4"
              titleClassname="text-black font-semibold"
              onPress={handleSave}
              disabled={!title.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add some bottom padding
  },
});

export { AddTaskScreen };
