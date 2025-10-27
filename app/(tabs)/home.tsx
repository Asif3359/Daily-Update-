import Button from "@/Components/Common/Button";
import Cart from "@/Components/Common/Cart";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/models/Task";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ TaskItem Component
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
    if (status === "todo") return "bg-gray-200";
    if (status === "in-progress") return "bg-yellow-200";
    if (status === "done") return "bg-green-200";
    return "bg-gray-100";
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 mx-2 shadow-sm border border-gray-200 relative"
      onPress={() =>
        router.push({
          pathname: "/appModels/add-task",
          params: { taskId: item._id.toString() },
        })
      }
      onLongPress={() => handleDeleteTask(item)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-black">{item.title}</Text>

          {item.description && (
            <Text
              className="mt-1 text-gray-700"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          )}

          {/* Additional Info */}
          <View className="flex-row flex-wrap  gap-2 mt-2">
            {item.priority && item.priority !== "medium" && (
              <View className="bg-gray-200 rounded-full">
                <Text className="text-xs  text-black px-1 py-1">{item.priority}</Text>
              </View>
            )}
            {item.isImportant && (
              <View className="bg-yellow-200 rounded-full">
                <Text className="text-xs  text-black  px-1 py-1  ">
                  Important
                </Text>
              </View>
            )}
            {item.category && (
              <View className="bg-blue-200 rounded-full">
                <Text className="text-xs  text-black  px-1 py-1">
                  {item.category}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-xs text-gray-500 mt-1">
            Created: {item.createdAt.toLocaleDateString()}
          </Text>
          {item?.reminderDate && (
            <Text className="text-xs text-gray-500 mt-1">
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

          <Text className="text-xs">{item?.userEmail}</Text>
        </View>

        <View className="absolute bottom-2 right-2">
          <Text
            className={`text-xs ${getBgForStatus(
              item.status
            )} text-black px-2 py-1 rounded-full`}
          >
            {item.status}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleActions}>
          <MaterialIcons name="more-vert" size={22} color="#4B5563" />
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
            className="px-2 py-1 bg-gray-200 rounded"
          >
            <Text className="text-black text-xs">Todo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleStatusChange(item, "in-progress");
              setShowActions(false);
            }}
            className="px-2 py-1 bg-yellow-200 rounded"
          >
            <Text className="text-black text-xs">In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleStatusChange(item, "done");
              setShowActions(false);
            }}
            className="px-2 py-1 bg-green-200 rounded"
          >
            <Text className="text-black text-xs">Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleDeleteTask(item);
              setShowActions(false);
            }}
            className="px-2 py-1 bg-red-200 rounded"
          >
            <Text className="text-black text-xs">Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </TouchableOpacity>
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
    { name: "Total", count: tasks.length },
    { name: "Todo", count: getTasksByStatus("todo").length },
    { name: "In progress", count: getTasksByStatus("in-progress").length },
    { name: "Done", count: getTasksByStatus("done").length },
  ];

  return (
    <SafeAreaView className="flex-1 px-2 pb-2 bg-white">
      {/* Header */}
      <Cart className="flex-row justify-between items-center mb-2 pb-2">
        <Text className="text-2xl font-bold text-black">My Work Dashboard</Text>
        <Text className="text-sm text-gray-700 mt-1">
          {user?.displayName || user?.email}
        </Text>
      </Cart>

      {/* Stats Overview */}
      <View className="flex-row gap-2 items-center mb-4">
        {dailyUpdates.map((dailyUpdate) => (
          <Cart
            key={dailyUpdate.name}
            className="flex-1 h-full bg-gray-100 rounded-xl p-3 border border-gray-300"
          >
            <Text className="text-2xl font-bold text-black">
              {dailyUpdate.count}
            </Text>
            <Text className="text-sm text-gray-700">{dailyUpdate.name}</Text>
          </Cart>
        ))}
      </View>

      {/* Tasks List */}
      <Cart className="flex-1 p-3 mt-3 rounded-xl">
        <Text className="text-xl font-bold mb-3 text-black">
          My Tasks ({tasks.length})
        </Text>

        {tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 text-center text-lg mb-4">
              No tasks yet
            </Text>
            <Button
              title=" + Add New Task"
              variant="outline"
              size="lg"
              className="border border-gray-400 bg-white"
              titleClassname="text-black"
              onPress={() => router.push("/appModels/add-task")}
            />
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
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full justify-center items-center shadow-lg z-10"
        onPress={() => router.push("/appModels/add-task")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HomeScreen;
