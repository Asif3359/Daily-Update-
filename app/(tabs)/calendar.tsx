import { useTasks } from "@/hooks/useTasks";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarScreen = () => {
  const [selected, setSelected] = useState<string>(new Date().toISOString().split('T')[0]);
  const { tasks } = useTasks();
  const router = useRouter();

  // Build marked dates object and list of tasks by due date
  const { markedDates, tasksByDate } = useMemo(() => {
    const marked: Record<string, any> = {};
    const byDate: Record<string, any[]> = {};
    tasks.forEach((task: any) => {
      if (task.dueDate) {
        const dateString = new Date(task.dueDate).toISOString().split("T")[0];
        if (!marked[dateString]) {
          marked[dateString] = {
            marked: true,
            dots: [{ color: '#6366f1', key: 'dot-' + task._id.toHexString() }],
          };
        } else {
          (marked[dateString].dots ||= []).push({ color: '#6366f1', key: 'dot-' + task._id.toHexString() });
        }
        if (!byDate[dateString]) {
          byDate[dateString] = [];
        }
        byDate[dateString].push(task);
      }
    });
    // Mark selected day specially
    marked[selected] = Object.assign({}, marked[selected] || {}, {
      selected: true, selectedColor: '#6366f1', selectedTextColor: '#fff'
    });
    // Mark today with dot (if no task already on today)
    const today = new Date().toISOString().split('T')[0];
    if (!marked[today]) {
      marked[today] = { marked: true, dotColor: '#a21caf', disableTouchEvent: true };
    }
    return { markedDates: marked, tasksByDate: byDate };
  }, [tasks, selected]);

  const tasksForSelected = tasksByDate[selected] || [];

  // Upcoming 4 days and Past 4 Days (not done)
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const soon = new Date(today);
    soon.setDate(soon.getDate() + 5);
    return tasks.filter((task: any) => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return (
        d > today &&
        d <= soon &&
        task.status !== 'done'
      );
    }).sort((a: any, b: any) => {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return da - db;
    });
  }, [tasks]);

  const pastDueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prev = new Date(today);
    prev.setDate(prev.getDate() - 4);
    return tasks.filter((task: any) => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return (
        d < today &&
        d >= prev &&
        task.status !== 'done'
      );
    }).sort((a: any, b: any) => {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return db - da;
    });
  }, [tasks]);

  // Navigation handler for tapping a task card
  const goToEditTask = (taskId: string) => {
    router.push({ pathname: '/appModels/add-task', params: { taskId } });
  };

  return (
    <ScrollView className="flex-1 bg-white px-3 py-7">
      <Text className="text-2xl font-bold mb-6 text-slate-800">Calendar</Text>
      <Calendar
        onDayPress={day => setSelected(day.dateString)}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: 'white',
          calendarBackground: 'white',
          todayTextColor: '#a21caf',
          dayTextColor: '#111827',
          arrowColor: '#6366f1',
          textDisabledColor: '#d1d5db',
          monthTextColor: '#09090b',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#fff',
        }}
        enableSwipeMonths={true}
        firstDay={1}
        hideExtraDays={false}
        style={{ borderRadius: 16, elevation: 2, shadowColor: '#e5e7eb', marginBottom: 18 }}
      />

      <View className="mt-8">
        <Text className="text-slate-800 text-lg font-medium mb-2">
          Tasks Due {selected}:
        </Text>
        {tasksForSelected.length > 0 ? (
          <FlatList
            data={tasksForSelected}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => goToEditTask(item._id.toString())}
                activeOpacity={0.85}
                className="bg-indigo-50 rounded-lg p-4 mb-2 border border-indigo-100"
              >
                <Text className="text-slate-800 font-bold text-base">{item.title}</Text>
                {item.description ? (
                  <Text className="text-slate-500 text-xs mt-1">{item.description}</Text>
                ) : null}
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text className="text-slate-400 italic">No tasks due on this date.</Text>
        )}
      </View>

      {/* Upcoming tasks section */}
      <View className="mt-10">
        <Text className="text-slate-800 text-lg font-medium mb-2">
          Upcoming Tasks (Next 4 Days):
        </Text>
        {upcomingTasks.length > 0 ? (
          <FlatList
            data={upcomingTasks}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => goToEditTask(item._id.toString())}
                activeOpacity={0.85}
                className="bg-green-50 rounded-lg p-4 mb-2 border border-green-100"
              >
                <Text className="text-slate-800 font-bold text-base">{item.title}</Text>
                <Text className="text-slate-500 text-xs mt-1">Due: {item.dueDate ? new Date(item.dueDate).toISOString().split("T")[0] : 'N/A'}</Text>
                {item.description ? (
                  <Text className="text-slate-500 text-xs mt-1">{item.description}</Text>
                ) : null}
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text className="text-slate-400 italic">No upcoming tasks.</Text>
        )}
      </View>

      {/* Past due section */}
      <View className="mt-10 mb-10">
        <Text className="text-slate-800 text-lg font-medium mb-2">
          Past Due (Last 4 Days):
        </Text>
        {pastDueTasks.length > 0 ? (
          <FlatList
            data={pastDueTasks}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => goToEditTask(item._id.toString())}
                activeOpacity={0.85}
                className="bg-orange-50 rounded-lg p-4 mb-2 border border-orange-100"
              >
                <Text className="text-slate-800 font-bold text-base">{item.title}</Text>
                <Text className="text-slate-500 text-xs mt-1">Due: {item.dueDate ? new Date(item.dueDate).toISOString().split("T")[0] : 'N/A'}</Text>
                {item.description ? (
                  <Text className="text-slate-500 text-xs mt-1">{item.description}</Text>
                ) : null}
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text className="text-slate-400 italic">No past-due tasks.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default CalendarScreen;
