"use client";

import { useUser } from "@clerk/clerk-react";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { User, Mail, FileText, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar";
import { Button } from "@/components/common/button";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const notes = useQuery(api.notes.getNotes);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const notesCount = notes?.length || 0;
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Top Banner */}
          <div className="h-32 bg-gradient-to-r from-[#0d87e1] to-[#0a6bc0]" />

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                <AvatarFallback className="bg-gray-200 text-3xl">
                  {user.firstName?.[0] || user.fullName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {user.fullName || "User"}
              </h1>
              <p className="text-gray-600">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0d87e1] bg-opacity-10 p-3 rounded-lg">
                    <FileText className="h-5 w-5 text-[#0d87e1]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Notes</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {notesCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0d87e1] bg-opacity-10 p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#0d87e1]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {joinedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.fullName || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.primaryEmailAddress?.emailAddress || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/notes")}
                variant="outline"
                className="flex-1"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => signOut()}
                variant="destructive"
                className="flex-1"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
