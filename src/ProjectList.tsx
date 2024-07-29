import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import React from "react";

const client = generateClient<Schema>();

export default function ProjectList() {
  const [projects, setProjects] = useState<Schema["Project"]["type"][]>([]);

  useEffect(() => {
    const sub = client.models.Project.observeQuery().subscribe({
      next: ({ items }) => {
        setProjects([...items]);
      }
    });
    return () => sub.unsubscribe();
  });

  const createProject = async () => {
    await client.models.Project.create({
      name: window.prompt("Add a new project"),
    });
  }

  return (
    <div>
      <button onClick={createProject}>Add Project</button>
      <ul>
        {projects.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </div>
  );
}