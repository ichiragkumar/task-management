import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllProjects, getAllTasks } from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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

    return (
      Object.keys(statusCount) as Array<keyof typeof statusCount>
    ).flatMap((type) =>
      Object.entries(statusCount[type]).map(([status, count]) => ({
        type,
        status,
        count,
      }))
    );
  }, [projects, tasks]);

  const taskStats = useMemo(() => {
    const taskList = Array.isArray(tasks) ? tasks : [];
    const statusCount = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    taskList.forEach((t: any) => {
      if (t.status in statusCount) {
        statusCount[t.status as keyof typeof statusCount]++;
      }
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
    }));
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Analytics Overview
          </h2>
          <p className="text-muted-foreground">
            Track your projects and tasks progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Project & Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Task Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
