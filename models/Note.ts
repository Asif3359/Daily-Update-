import { Realm } from '@realm/react';

export class Note extends Realm.Object<Note> {
    _id!: Realm.BSON.ObjectId;
    title!: string;
    note!: string;
    createdAt!: Date;
    updatedAt!: Date;
    userEmail!: string;
    syncStatus!: number; // 0 = not synced, 1 = synced

    static generate(title: string, note: string, userEmail: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            title,
            note,
            createdAt: new Date(),
            updatedAt: new Date(),
            userEmail,
            syncStatus: 0, // Default: not synced
        }
    }

    static schema = {
        name: 'Note',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            title: 'string',
            note: 'string',
            createdAt: 'date',
            updatedAt: 'date',
            userEmail: 'string',
            syncStatus: 'int', // Add syncStatus field
        },
    };
}