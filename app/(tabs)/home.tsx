import Button from "@/Components/Common/Button";
import Cart from "@/Components/Common/Cart";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/models/Task";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ TaskItem Component (same as before)
const TaskItem = ({
  item,
  handleStatusChange,
  handleDeleteTask,
}: {
  item: Task;
  handleStatusChange: (
    task: Task,
    newStatus: "todo" | "in-progress" | "done"
  ) => void;
  handleDeleteTask: (task: Task) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const slideAnim = useRef(new Animated.Value(200)).current;

  const toggleActions = () => {
    setShowActions((prev) => !prev);
    Animated.timing(slideAnim, {
      toValue: showActions ? 200 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const getBgForStatus = (status: string) => {
    if (status == "todo") return "bg-gray-600";
    if (status == "in-progress") return "bg-yellow-600";
    if (status == "done") return "bg-green-600";
    return "bg-gray-600";
  };

  return (
    <Cart className="mb-2 p-3 bg-gray-900 border-2 rounded-xl relative">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">{item.title}</Text>

          {item.description && (
            <Text
              className="mt-1 text-gray-300"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          )}

          {/* Show additional task info */}
          <View className="flex-row flex-wrap mt-2">
            {item.priority && item.priority !== "medium" && (
              <Text
                className={`text-xs px-2 py-1 rounded-full mr-2 ${
                  item.priority === "high" ? "bg-red-500" : "bg-green-500"
                } text-white`}
              >
                {item.priority}
              </Text>
            )}
            {item.isImportant && (
              <Text className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full mr-2">
                Important
              </Text>
            )}
            {item.category && (
              <Text className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                {item.category}
              </Text>
            )}
          </View>

          <Text className="text-xs text-gray-400 mt-1">
            Created: {item.createdAt.toLocaleDateString()}
          </Text>
          {item?.reminderDate && (
            <Text className="text-xs text-gray-400 mt-1">
              Reminder:{" "}
              {item.reminderDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {item.reminderDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          )}
        </View>
        <View className="absolute bottom-2 right-2">
          <Text
            className={`text-xs ${getBgForStatus(item.status)} text-white px-2 py-1 rounded-full`}
          >
            {item.status}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleActions}>
          <MaterialIcons name="more-vert" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {showActions && (
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            position: "absolute",
            top: 8,
            right: 35,
          }}
          className="flex-row space-x-2 mt-2"
        >
          <TouchableOpacity
            onPress={() => {
              handleStatusChange(item, "todo");
              setShowActions(false);
            }}
            className={`px-2 py-1 rounded ${
              item.status === "todo" ? "bg-gray-600" : "bg-gray-400"
            }`}
          >
            <Text className="text-white text-xs">Todo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleStatusChange(item, "in-progress");
              setShowActions(false);
            }}
            className={`px-2 py-1 rounded ${
              item.status === "in-progress" ? "bg-yellow-600" : "bg-yellow-400"
            }`}
          >
            <Text className="text-white text-xs">In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleStatusChange(item, "done");
              setShowActions(false);
            }}
            className={`px-2 py-1 rounded ${
              item.status === "done" ? "bg-green-600" : "bg-green-400"
            }`}
          >
            <Text className="text-white text-xs">Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleDeleteTask(item);
              setShowActions(false);
            }}
            className="px-2 py-1 bg-red-500 rounded"
          >
            <Text className="text-white text-xs">Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Cart>
  );
};

function HomeScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const { tasks, updateTaskStatus, deleteTask, getTasksByStatus } = useTasks();

  const handleStatusChange = (
    task: Task,
    newStatus: "todo" | "in-progress" | "done"
  ) => updateTaskStatus(task._id, newStatus);

  const handleDeleteTask = (task: Task) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTask(task._id),
      },
    ]);
  };

  const dailyUpdates = [
    {
      name: "Total",
      count: tasks.length,
      bg: "bg-gray-900",
      color: "text-white",
    },
    {
      name: "Todo",
      count: getTasksByStatus("todo").length,
      bg: "bg-gray-600",
      color: "text-white",
    },
    {
      name: "In progress",
      count: getTasksByStatus("in-progress").length,
      bg: "bg-yellow-500",
      color: "text-white",
    },
    {
      name: "Done",
      count: getTasksByStatus("done").length,
      bg: "bg-green-500",
      color: "text-white",
    },
  ];

  return (
    <View className="flex-1 px-1 py-1 bg-gray-200">
      {/* Header */}
      <Cart className="flex-row justify-between items-center mb-2 bg-gray-900 rounded-lg">
        <Text className="text-2xl font-bold text-white ">
          My Work Dashboard
        </Text>
        <Text className="text-lg text-white  mt-1">
          {user?.displayName || user?.email}
        </Text>
      </Cart>
      {/* Stats Overview */}
      <View className="flex-row gap-2 items-center mb-4">
        {dailyUpdates.map((dailyUpdate) => (
          <Cart
            key={dailyUpdate.name}
            className={`flex-1 h-full ${dailyUpdate.bg} rounded-xl`}
          >
            <Text className={`text-2xl font-bold ${dailyUpdate.color}`}>
              {dailyUpdate.count}
            </Text>
            <Text className={`text-lg ${dailyUpdate.color}`}>
              {dailyUpdate.name}
            </Text>
          </Cart>
        ))}
      </View>
      <Button
        title=" + Add New Task"
        variant="outline"
        size="lg"
        className="border-2 border-gray-600"
        titleClassname="text-gray-800"
        onPress={() => router.push("../appModels/add-task")}
      ></Button>
      {/* Tasks List */}
      <Cart className="flex-1 p-3 ">
        <Text className="text-xl font-bold mb-3">
          My Tasks ({tasks.length})
        </Text>

        {tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-600 text-center text-lg mb-4">
              No tasks yet
            </Text>
            <Button
              title=" + Add New Task"
              variant="outline"
              size="lg"
              className="border-2 border-gray-600"
              titleClassname="text-gray-800"
              onPress={() => router.push("../appModels/add-task")}
            ></Button>
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <TaskItem
                item={item}
                handleStatusChange={handleStatusChange}
                handleDeleteTask={handleDeleteTask}
              />
            )}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Cart>
    </View>
  );
}

export default HomeScreen;
