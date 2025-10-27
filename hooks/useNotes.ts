import { Note } from '@/models/Note';
import { useQuery, useRealm } from '@realm/react';
import { useCallback } from 'react';


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
    };
}