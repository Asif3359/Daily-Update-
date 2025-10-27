import Button from "@/Components/Common/Button";
import Cart from "@/Components/Common/Cart";
import { useTasks } from "@/hooks/useTasks";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTaskScreen() {
  const router = useRouter();
  const { createTask } = useTasks();

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

  const handleAddTask = () => {
    if (title.trim() === "") {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const reminderDateObj = reminderDate ? new Date(reminderDate) : undefined;

    createTask(
      title.trim(),
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

  return (
    <SafeAreaView className="flex-1 px-2 pb-2 bg-white">
      {/* Header */}
      <View className="flex-row items-center pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          className="text-2xl font-bold text-black flex-shrink"
          numberOfLines={1}
        >
          Add New Task
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Cart className="p-4 mb-4 bg-white border border-gray-300 rounded-xl shadow-sm">
          {/* Task Title */}
          <Text className="text-lg font-semibold text-black mb-2">Title *</Text>
          <TextInput
            className="bg-gray-100 text-black p-3 rounded mb-4 border border-gray-300"
            placeholder="Enter task title"
            placeholderTextColor="#6B7280"
            value={title}
            onChangeText={setTitle}
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
            <Text className="text-lg font-semibold text-black">Important</Text>
            <TouchableOpacity
              onPress={() => setIsImportant(!isImportant)}
              className={`w-12 h-6 rounded-full ${
                isImportant ? "bg-blue-500" : "bg-gray-300"
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
          />

          {/* Add Task Button */}
          <Button
            title="Add Task"
            variant="outline"
            size="lg"
            className="border-2 border-gray-600 bg-white"
            titleClassname="text-black font-semibold"
            onPress={handleAddTask}
            disabled={!title.trim()}
          />
        </Cart>
      </ScrollView>
    </SafeAreaView>
  );
}

export { AddTaskScreen };
