import { Note } from '@/models/Note';
import { useQuery, useRealm } from '@realm/react';
import { useCallback } from 'react';
import Realm from 'realm';


export function useNotes() {
    const realm = useRealm();
    const notes = useQuery(Note).sorted('createdAt', true);

    const createNote = useCallback(async (
        title: string,
        note: string,
        userEmail: string
    ) => {
        realm.write(() => {
            realm.create('Note', Note.generate(
                title,
                note,
                userEmail
            ));
        });
    }, [realm]);

    const deleteNote = useCallback((noteId: Realm.BSON.ObjectId) => {
        const note = realm.objectForPrimaryKey(Note, noteId);

        if (note) {
            realm.write(() => {
                realm.delete(note);
            });
            return true;
        }
        return false;
    }, [realm]);

    const updateNote = useCallback((
        noteId: Realm.BSON.ObjectId,
        updates: { title?: string; note?: string }
    ) => {
        const note = realm.objectForPrimaryKey(Note, noteId);

        if (note) {
            realm.write(() => {
                if (updates.title !== undefined) note.title = updates.title;
                if (updates.note !== undefined) note.note = updates.note;
                note.syncStatus = 0;
                note.updatedAt = new Date();
            });
            return true;
        }
        return false;
    }, [realm]);

    // Create a note coming from the server, preserving the server-provided _id and timestamps
    const createNoteFromServer = useCallback((data: {
        _id: string;
        title: string;
        note: string;
        userEmail: string;
        createdAt: string | Date;
        updatedAt: string | Date;
    }) => {
        const createdAt = typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
        const updatedAt = typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : data.updatedAt;

        realm.write(() => {
            realm.create('Note', {
                _id: new Realm.BSON.ObjectId(data._id),
                title: data.title,
                note: data.note,
                createdAt,
                updatedAt,
                userEmail: data.userEmail,
                syncStatus: 1, // synced because it came from server
            }, Realm.UpdateMode.Never);
        });
    }, [realm]);

    // Apply server update to an existing note without marking it unsynced
    const applyServerUpdate = useCallback((
        noteId: Realm.BSON.ObjectId,
        updates: { title?: string; note?: string; updatedAt?: string | Date }
    ) => {
        const note = realm.objectForPrimaryKey(Note, noteId);
        if (note) {
            const updatedAt = updates.updatedAt
                ? (typeof updates.updatedAt === 'string' ? new Date(updates.updatedAt) : updates.updatedAt)
                : new Date();

            realm.write(() => {
                if (updates.title !== undefined) note.title = updates.title;
                if (updates.note !== undefined) note.note = updates.note;
                note.syncStatus = 1; // mark as synced after applying server data
                note.updatedAt = updatedAt;
            });
            return true;
        }
        return false;
    }, [realm]);

    const updateNoteSyncStatus = useCallback((noteId: Realm.BSON.ObjectId, syncStatus: number) => {
        const note = realm.objectForPrimaryKey(Note, noteId);
        if (note) {
            realm.write(() => {
                note.syncStatus = syncStatus;
                note.updatedAt = new Date();
            });
            return true;
        }
        return false;
    }, [realm]);


    const getNotes = useCallback(() => {
        return notes;
    }, [notes]);

    const getNoteById = useCallback((noteId: Realm.BSON.ObjectId) => {
        const note = realm.objectForPrimaryKey(Note, noteId);
        return note;
    }, [realm]);

    return {
        notes,
        createNote,
        getNotes,
        getNoteById,
        deleteNote,
        updateNote,
        updateNoteSyncStatus,
        createNoteFromServer,
        applyServerUpdate,
    };
}