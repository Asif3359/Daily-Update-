import { Realm } from '@realm/react';

export class Note extends Realm.Object<Note> {
    _id!: Realm.BSON.ObjectId;
    title!: string;
    note!: string; // This should match the schema
    createdAt!: Date;
    updatedAt!: Date;
    userEmail!: string;

    static generate(title: string, note: string, userEmail: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            title,
            note, // This should match the schema
            createdAt: new Date(),
            updatedAt: new Date(),
            userEmail,
        }
    }

    static schema = {
        name: 'Note',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            title: 'string',
            note: 'string', // Changed from 'notes' to 'note' and removed '?'
            createdAt: 'date',
            updatedAt: 'date',
            userEmail: 'string',
        },
    };
}