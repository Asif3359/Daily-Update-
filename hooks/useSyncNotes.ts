// hooks/useSyncNotes.ts
import { useState } from 'react';
import { useNotes } from './useNotes';

const API_BASE_URL = 'https://daily-update-backend-cve5.onrender.com/api';

interface SyncResult {
    success: boolean;
    message: string;
    syncedCount?: number;
    error?: string;
}

interface ServerNote {
    _id: string;
    title: string;
    note: string;
    createdAt: string;
    updatedAt: string;
    userEmail: string;
}

export function useSyncNotes() {
    const { notes, createNoteFromServer, applyServerUpdate, updateNoteSyncStatus } = useNotes();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    const pushChangesToServer = async (): Promise<number> => {
        const unsyncedNotes = notes.filtered('syncStatus == 0');
        let pushedCount = 0;

        for (const note of unsyncedNotes) {
            try {
                const response = await fetch(`${API_BASE_URL}/notes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: note._id.toString(),
                        title: note.title,
                        note: note.note,
                        createdAt: note.createdAt.toISOString(),
                        updatedAt: note.updatedAt.toISOString(),
                        userEmail: note.userEmail,
                    }),
                });

                if (response.ok) {
                    updateNoteSyncStatus(note._id, 1); // Mark as synced
                    pushedCount++;
                } else {
                    console.warn(`Failed to sync note ${note._id}`);
                }
            } catch (error) {
                console.error(`Error syncing note ${note._id}:`, error);
            }
        }

        return pushedCount;
    };

    const pullChangesFromServer = async (userEmail: string): Promise<number> => {
        try {
            // Get the latest update timestamp for efficient sync
            const lastUpdate = notes.sorted('updatedAt', true)[0]?.updatedAt;

            const url = lastUpdate
                ? `${API_BASE_URL}/notes?since=${lastUpdate.toISOString()}&userEmail=${encodeURIComponent(userEmail)}`
                : `${API_BASE_URL}/notes?userEmail=${encodeURIComponent(userEmail)}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch notes from server');
            }

            const serverNotes: ServerNote[] = await response.json();
            let pulledCount = 0;

            for (const serverNote of serverNotes) {
                const existingNote = notes.find(n => n._id.toString() === serverNote._id);

                if (existingNote) {
                    // Update existing note if server version is newer
                    const serverUpdated = new Date(serverNote.updatedAt);
                    if (serverUpdated > existingNote.updatedAt) {
                        applyServerUpdate(existingNote._id, {
                            title: serverNote.title,
                            note: serverNote.note,
                            updatedAt: serverNote.updatedAt,
                        });
                        pulledCount++;
                    }
                } else {
                    // Create new note from server, preserving server _id and timestamps
                    createNoteFromServer({
                        _id: serverNote._id,
                        title: serverNote.title,
                        note: serverNote.note,
                        userEmail: serverNote.userEmail,
                        createdAt: serverNote.createdAt,
                        updatedAt: serverNote.updatedAt,
                    });
                    pulledCount++;
                }
            }

            return pulledCount;
        } catch (error) {
            console.error('Error pulling changes:', error);
            throw error;
        }
    };

    const syncNotes = async (userEmail: string): Promise<SyncResult> => {
        if (isSyncing) {
            return { success: false, message: 'Sync already in progress' };
        }

        setIsSyncing(true);

        try {
            // Push local changes first
            const pushedCount = await pushChangesToServer();

            // Then pull server changes
            const pulledCount = await pullChangesFromServer(userEmail);

            const totalSynced = pushedCount + pulledCount;
            setLastSync(new Date());

            return {
                success: true,
                message: `Sync completed successfully`,
                syncedCount: totalSynced,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Sync failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        } finally {
            setIsSyncing(false);
        }
    };

    const forceSyncAll = async (userEmail: string): Promise<SyncResult> => {
        setIsSyncing(true);

        try {
            // Mark all notes as unsynced to force full sync
            const allNotes = Array.from(notes);
            allNotes.forEach(note => {
                updateNoteSyncStatus(note._id, 0);
            });

            const result = await syncNotes(userEmail);
            return result;
        } catch (error) {
            return {
                success: false,
                message: 'Force sync failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        } finally {
            setIsSyncing(false);
        }
    };

    return {
        syncNotes,
        forceSyncAll,
        isSyncing,
        lastSync,
    };
}