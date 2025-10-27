import { Note } from "@/models/Note";
import { Task } from "@/models/Task";
import { RealmProvider as RealmProviderBase } from "@realm/react";
import React from "react";
interface RealmProviderProps {
  children: React.ReactNode;
}

export function RealmProvider({ children }: RealmProviderProps) {
  return (
    <RealmProviderBase schema={[Task, Note]} schemaVersion={1}>
      {children}
    </RealmProviderBase>
  );
}
