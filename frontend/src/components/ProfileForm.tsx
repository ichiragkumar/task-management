import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyProfile, updateProfile } from "../api/api";

export default function ProfileForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMyProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => updateProfile(form),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 mb-3 w-full rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 mb-3 w-full rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="New Password (optional)"
        value={form.password}
        onChange={handleChange}
        className="border p-2 mb-4 w-full rounded"
      />

      <button
        onClick={() => mutation.mutate()}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save Changes
      </button>
    </div>
  );
}
