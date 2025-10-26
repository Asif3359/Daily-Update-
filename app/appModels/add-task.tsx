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

    // Convert date strings to Date objects
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const reminderDateObj = reminderDate ? new Date(reminderDate) : undefined;

    createTask(
      title.trim(),
      description.trim(),
      priority,
      dueDateObj,
      reminderDateObj,
      isImportant,
      [], // tags - you can add tag input later
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
    <View className="flex-1 bg-gray-200 px-2 pb-2">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-gray-900 border-b border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text
          className="text-2xl font-bold text-white flex-shrink"
          numberOfLines={1}
        >
          Add New Task
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Cart className="p-4 mb-4">
          {/* Task Title */}
          <Text className="text-lg font-semibold  mb-2">Title *</Text>
          <TextInput
            className="bg-gray-700 text-white p-3 rounded mb-4"
            placeholder="Enter task title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text className="text-lg font-semibold  mb-2">Description</Text>
          <TextInput
            className="bg-gray-700 text-white p-3 rounded mb-4 min-h-[100px]"
            placeholder="Enter task description"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          {/* Priority */}
          <Text className="text-lg font-semibold  mb-2">Priority</Text>
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
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    : "bg-gray-600"
                }`}
              >
                <Text className="text-white text-center font-semibold capitalize">
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Important Toggle */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold ">Important</Text>
            <TouchableOpacity
              onPress={() => setIsImportant(!isImportant)}
              className={`w-12 h-6 rounded-full ${
                isImportant ? "bg-blue-500" : "bg-gray-600"
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
          <Text className="text-lg font-semibold mb-2">Due Date</Text>
          <TouchableOpacity
            onPress={() => setShowDueDatePicker(true)}
            className="bg-gray-700 p-3 rounded mb-4"
          >
            <Text className="text-white">
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
          <Text className="text-lg font-semibold mb-2">Reminder Date</Text>
          <TouchableOpacity
            onPress={() => setShowReminderPicker(true)}
            className="bg-gray-700 p-4 rounded-lg mb-4 flex-row justify-between items-center"
          >
            <Text className="text-white text-base">
              {reminderDate
                ? reminderDate.toLocaleString()
                : "Select reminder date and time"}
            </Text>
            <MaterialIcons name="notifications" size={20} color="#9CA3AF" />
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
          <Text className="text-lg font-semibold  mb-2">Category</Text>
          <TextInput
            className="bg-gray-700 text-white p-3 rounded mb-4"
            placeholder="e.g., Work, Personal, Shopping"
            placeholderTextColor="#9CA3AF"
            value={category}
            onChangeText={setCategory}
          />

          {/* Estimated Time */}
          <Text className="text-lg font-semibold  mb-2">
            Estimated Time (minutes)
          </Text>
          <TextInput
            className="bg-gray-700 text-white p-3 rounded mb-6"
            placeholder="e.g., 30"
            placeholderTextColor="#9CA3AF"
            value={estimatedTime}
            onChangeText={setEstimatedTime}
            keyboardType="numeric"
          />

          {/* Add Task Button */}
          <Button
            title="Add Task"
            variant="outline"
            size="lg"
            className="border-2 border-gray-600"
            titleClassname="text-gray-800"
            onPress={handleAddTask}
            disabled={!title.trim()}
          ></Button>
        </Cart>
      </ScrollView>
    </View>
  );
}

export { AddTaskScreen };
