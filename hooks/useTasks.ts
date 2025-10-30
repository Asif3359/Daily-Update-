import { Task } from '@/models/Task';
import { cancelTaskReminder, scheduleTaskReminder } from '@/utils/notifications';
import { useQuery, useRealm } from '@realm/react';
import { useCallback } from 'react';

export function useTasks() {
    const realm = useRealm();
    const tasks = useQuery(Task).sorted('createdAt', true);

    const createTask = useCallback(async (
        title: string,
        userEmail: string,
        description?: string,
        priority: 'low' | 'medium' | 'high' = 'medium',
        dueDate?: Date,
        reminderDate?: Date,
        isImportant: boolean = false,
        tags: string[] = [],
        category?: string,
        estimatedTime?: number,

    ) => {
        let createdTask: any | null = null;
        realm.write(() => {
            createdTask = realm.create('Task', Task.generate(
                title,
                userEmail,
                description,
                'todo',
                priority,
                dueDate,
                reminderDate,
                isImportant,
                tags,
                category,
                estimatedTime,

            ));
        });

        if (createdTask && reminderDate && reminderDate.getTime() > Date.now()) {
            const id = `task-${createdTask._id.toHexString()}`;
            const notifId = await scheduleTaskReminder({
                id,
                title: 'Task Reminder',
                body: createdTask.title,
                fireDate: reminderDate,
                payload: { taskId: createdTask._id.toHexString() },
            });
            if (notifId) {
                realm.write(() => {
                    const t = realm.objectForPrimaryKey(Task, createdTask!._id);
                    if (t) {
                        (t as any).notificationId = notifId;
                    }
                });
            }
        }
    }, [realm]);

    const updateTaskStatus = useCallback(async (taskId: Realm.BSON.ObjectId, status: 'todo' | 'in-progress' | 'done') => {
        const task = realm.objectForPrimaryKey(Task, taskId);
        if (task) {
            realm.write(() => {
                task.status = status;
                task.updatedAt = new Date();
                if (status === 'done') {
                    task.completedAt = new Date();
                }
            });
        }

    }, [realm]);

    const updateTask = useCallback(async (taskId: Realm.BSON.ObjectId, updates: Partial<Task>) => {
        const task = realm.objectForPrimaryKey(Task, taskId);
        if (task) {
            const nextReminder = (updates as any).reminderDate as Date | null | undefined;
            const hasReminderChange = Object.prototype.hasOwnProperty.call(updates, 'reminderDate');

            realm.write(() => {
                Object.keys(updates).forEach(key => {
                    if (key in task && key !== '_id') {
                        (task as any)[key] = (updates as any)[key];
                    }
                });
                task.updatedAt = new Date();
            });

            if (hasReminderChange) {
                if ((task as any).notificationId) {
                    await cancelTaskReminder((task as any).notificationId);
                }

                if (nextReminder && nextReminder.getTime() > Date.now()) {
                    const id = `task-${task._id.toHexString()}`;
                    const notifId = await scheduleTaskReminder({
                        id,
                        title: 'Task Reminder',
                        body: task.title,
                        fireDate: nextReminder,
                        payload: { taskId: task._id.toHexString() },
                    });
                    realm.write(() => {
                        const t = realm.objectForPrimaryKey(Task, taskId);
                        if (t) {
                            (t as any).notificationId = notifId || null as any;
                        }
                    });
                } else {
                    realm.write(() => {
                        const t = realm.objectForPrimaryKey(Task, taskId);
                        if (t) {
                            (t as any).notificationId = null as any;
                        }
                    });
                }
            }
        }
    }, [realm]);

    const deleteTask = useCallback(async (taskId: Realm.BSON.ObjectId) => {
        const task = realm.objectForPrimaryKey(Task, taskId);
        if (task) {
            if ((task as any).notificationId) {
                await cancelTaskReminder((task as any).notificationId);
            }
            realm.write(() => {
                realm.delete(task);
            });
        }
    }, [realm]);


    const getTaskById = useCallback((taskId: Realm.BSON.ObjectId) => {
        const task = realm.objectForPrimaryKey(Task, taskId);
        return task;
    }, [realm])

    const getTasksByStatus = useCallback((status: 'todo' | 'in-progress' | 'done') => {
        return tasks.filtered(`status = "${status}"`);
    }, [tasks]);

    const getTasksByPriority = useCallback((priority: 'low' | 'medium' | 'high') => {
        return tasks.filtered(`priority = "${priority}"`);
    }, [tasks]);

    const getImportantTasks = useCallback(() => {
        return tasks.filtered('isImportant = true');
    }, [tasks]);

    const getTasksByCategory = useCallback((category: string) => {
        return tasks.filtered(`category = "${category}"`);
    }, [tasks]);

    const getTasksWithReminders = useCallback(() => {
        return tasks.filtered('reminderDate != null');
    }, [tasks]);

    const getOverdueTasks = useCallback(() => {
        const now = new Date();
        return tasks.filtered('dueDate < $0 && status != "done"', now);
    }, [tasks]);

    const getTasksDueToday = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return tasks.filtered('dueDate >= $0 && dueDate < $1 && status != "done"', today, tomorrow);
    }, [tasks]);

    const getUpcomingReminders = useCallback(() => {
        const now = new Date();
        return tasks.filtered('reminderDate >= $0 && status != "done"', now);
    }, [tasks]);

    return {
        tasks,
        createTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByStatus,
        getTasksByPriority,
        getImportantTasks,
        getTasksByCategory,
        getTasksWithReminders,
        getOverdueTasks,
        getTasksDueToday,
        getUpcomingReminders,
    };
}