import Overview from "../components/Overview";
import { getAllProjects, getAllTasks } from "../api/api";
import { Card, CardContent } from "../components/ui/card";
import { useQuery } from "@tanstack/react-query";

import { Briefcase, ListChecks } from "lucide-react";

const Dashboard = () => {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Projects</h2>
              <p className="text-3xl font-bold">{Array.isArray(projects) ? projects.length : 0}</p>
            </div>
            <Briefcase size={36} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Tasks</h2>
              <p className="text-3xl font-bold">{Array.isArray(tasks) ? tasks.length : tasks.data?.length ?? 0}</p>
            </div>
            <ListChecks size={36} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Overview />
      </div>
    </div>
  );
};

export default Dashboard;