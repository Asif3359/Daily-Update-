// src/hooks/useDailyUpdates.ts
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import { useEffect, useState } from 'react';
import DailyUpdate from '../models/DailyUpdate';

export const useDailyUpdates = () => {
    const database = useDatabase();
    const [updates, setUpdates] = useState<DailyUpdate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load updates from database
    useEffect(() => {
        let subscription: any;

        const loadUpdates = async () => {
            try {
                const updatesQuery = database.get<DailyUpdate>('daily_updates')
                    .query(
                        Q.where('is_deleted', Q.notEq(true)), // Use the correct column name
                        Q.sortBy('date', Q.desc)
                    );

                // Observe changes to the query
                subscription = updatesQuery.observe().subscribe((fetchedUpdates) => {
                    setUpdates(fetchedUpdates);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error('Error loading updates:', error);
                setIsLoading(false);
            }
        };

        loadUpdates();

        // Cleanup subscription
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [database]);

    // Get today's update
    const getTodaysUpdate = () => {
        const today = new Date().toISOString().split('T')[0];
        return updates.find(update => update.date === today);
    };

    // Get updates by date range
    const getUpdatesByDateRange = (startDate: string, endDate: string) => {
        return updates.filter(update =>
            update.date >= startDate && update.date <= endDate
        );
    };

    // Create new daily update
    const createUpdate = async (data: {
        title: string;
        content: string;
        category: string;
        mood?: string;
    }) => {
        const today = new Date().toISOString().split('T')[0];

        await database.write(async () => {
            await database.get<DailyUpdate>('daily_updates').create(update => {
                update.title = data.title;
                update.content = data.content;
                update.date = today;
                update.category = data.category;
                update.mood = data.mood;
                update.isCompleted = true;
                update.isDeleted = false; // Initialize as not deleted
                update.isSynced = false;
            });
        });
    };

    // Update existing update
    const updateUpdate = async (updateId: string, data: Partial<{
        title: string;
        content: string;
        category: string;
        mood?: string;
    }>) => {
        const update = await database.get<DailyUpdate>('daily_updates').find(updateId);

        await database.write(async () => {
            await update.update(record => {
                if (data.title !== undefined) record.title = data.title;
                if (data.content !== undefined) record.content = data.content;
                if (data.category !== undefined) record.category = data.category;
                if (data.mood !== undefined) record.mood = data.mood;
                record.isSynced = false;
            });
        });
    };

    // Delete update (soft delete)
    const deleteUpdate = async (updateId: string) => {
        const update = await database.get<DailyUpdate>('daily_updates').find(updateId);

        await database.write(async () => {
            await update.update(record => {
                record.isDeleted = true;
                record.isSynced = false;
            });
        });
    };

    return {
        updates,
        isLoading,
        getTodaysUpdate,
        getUpdatesByDateRange,
        createUpdate,
        updateUpdate,
        deleteUpdate,
    };
};