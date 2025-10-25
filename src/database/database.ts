// src/database/database.ts
import DailyUpdate from '@/src/models/DailyUpdate';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';

// Import the Expo SQLite driver

// Create adapter for Expo
const adapter = new SQLiteAdapter({
    schema,
    dbName: 'DailyUpdateDB',
    // Use Expo SQLite driver
    // driver: SQLite,
});

// Create database
export const database = new Database({
    adapter,
    modelClasses: [DailyUpdate],
});

export default database;