// src/database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'daily_updates',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'date', type: 'string' }, // Store as YYYY-MM-DD
        { name: 'category', type: 'string' },
        { name: 'mood', type: 'string', isOptional: true },
        { name: 'is_completed', type: 'boolean' },
        { name: 'is_deleted', type: 'boolean' }, // ADD THIS MISSING COLUMN
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'is_synced', type: 'boolean' },
      ],
    }),
  ],
});