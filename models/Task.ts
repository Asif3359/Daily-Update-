import { Realm } from '@realm/react';

export class Task extends Realm.Object<Task> {
    _id!: Realm.BSON.ObjectId;
    title!: string;
    description?: string;
    status!: 'todo' | 'in-progress' | 'done';
    priority!: 'low' | 'medium' | 'high';
    dueDate?: Date;
    reminderDate?: Date; // New: When to remind the user
    notificationId?: string; // New: local notification id for reminder
    createdAt!: Date;
    updatedAt!: Date;
    completedAt?: Date;
    isImportant!: boolean;
    tags!: string[];
    category?: string;
    estimatedTime?: number; // in minutes
    actualTime?: number; // in minutes
    subtasks?: string; // JSON string or simple list
    notes?: string;
    userEmail!: string;

    static generate(
        title: string,
        userEmail: string,
        description?: string,
        status: 'todo' | 'in-progress' | 'done' = 'todo',
        priority: 'low' | 'medium' | 'high' = 'medium',
        dueDate?: Date,
        reminderDate?: Date, // New: reminder parameter
        isImportant: boolean = false,
        tags: string[] = [],
        category?: string,
        estimatedTime?: number,

    ) {
        return {
            _id: new Realm.BSON.ObjectId(),
            title,
            description,
            status,
            priority,
            dueDate,
            reminderDate, // New: included in generation
            notificationId: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: status === 'done' ? new Date() : undefined,
            isImportant,
            tags,
            category,
            estimatedTime,
            actualTime: 0,
            subtasks: '',
            notes: '',
            userEmail,
        };
    }

    static schema = {
        name: 'Task',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            title: 'string',
            description: 'string?',
            status: 'string',
            priority: 'string',
            dueDate: 'date?',
            reminderDate: 'date?', // New: added to schema
            notificationId: 'string?', // New: store scheduled notification id to cancel/reschedule
            createdAt: 'date',
            updatedAt: 'date',
            completedAt: 'date?',
            isImportant: 'bool',
            tags: 'string[]',
            category: 'string?',
            estimatedTime: 'int?',
            actualTime: 'int?',
            subtasks: 'string?',
            notes: 'string?',
            userEmail: 'string?'
        },
    };
}