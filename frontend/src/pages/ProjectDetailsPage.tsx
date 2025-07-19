import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Project Details</h1>
      <TaskList projectId={projectId!} />
    </div>
  );
}
