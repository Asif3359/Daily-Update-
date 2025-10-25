// src/models/DailyUpdate.ts
import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class DailyUpdate extends Model {
    static table = 'daily_updates';

    @field('title') title!: string;
    @field('content') content!: string;
    @field('date') date!: string; // YYYY-MM-DD format
    @field('category') category!: string;
    @field('mood') mood?: string;
    @field('is_completed') isCompleted!: boolean;
    @field('is_deleted') isDeleted!: boolean; // ADD THIS FIELD
    @field('is_synced') isSynced!: boolean;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    // Helper method to check if it's today's update
    get isToday() {
        const today = new Date().toISOString().split('T')[0];
        return this.date === today;
    }

    // Helper method to format date for display
    get displayDate() {
        return new Date(this.date).toLocaleDateString();
    }
}