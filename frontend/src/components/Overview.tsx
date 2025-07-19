import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllProjects, getAllTasks } from "../api/api";

const Overview = () => {
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await getAllTasks();
      return response.data;
    },
  });

  const stats = useMemo(() => {
    const statusCount = {
      Project: {
        PENDING: 0,
        IN_PROGRESS: 0,
        INACTIVE: 0,
        COMPLETED: 0,
      },
      Task: {
        PENDING: 0,
        IN_PROGRESS: 0,
        INACTIVE: 0,
        COMPLETED: 0,
        ARCHIVED: 0,
      },
    };

    const projectList = Array.isArray(projects) ? projects : [];
    const taskList = Array.isArray(tasks) ? tasks : [];

    projectList.forEach((p: any) => {
      if (p.status in statusCount.Project) {
        statusCount.Project[p.status as keyof typeof statusCount.Project]++;
      }
    });

    taskList.forEach((t: any) => {
      if (t.status in statusCount.Task) {
        statusCount.Task[t.status as keyof typeof statusCount.Task]++;
      }
    });

    return (Object.keys(statusCount) as Array<keyof typeof statusCount>).flatMap((type) =>
      Object.entries(statusCount[type]).map(([status, count]) => ({
        type,
        status,
        count,
      }))
    );
  }, [projects, tasks]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
