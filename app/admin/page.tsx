"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminAuth from "@/app/components/admin/AdminAuth";
import EventForm from "@/app/components/admin/EventForm";
import BookingManagement from "@/app/components/admin/BookingManagement";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  const handleAddEventSuccess = () => {
    setShowAddEventDialog(false);
  };

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-6">
        <AdminAuth onAuthenticated={setIsAuthenticated} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/calendar")}>
            View Calendar
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
                <DialogTrigger asChild>
                  <Button>Add New Event</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <EventForm onSuccess={handleAddEventSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="mb-4">
          <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement />
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Overview of bookings and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                This feature would display statistics about bookings, popular time slots, etc.
                Not implemented in this demo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 