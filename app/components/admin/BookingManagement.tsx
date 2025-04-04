"use client";

import { useState } from "react";
import { Activity } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime, getActivityColor } from "@/app/lib/calendar-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { sampleActivities } from "@/app/lib/data";
import EventForm from "./EventForm";

export default function BookingManagement() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleDeleteActivity = (id: string) => {
    const activityIndex = activities.findIndex(activity => activity.id === id);
    if (activityIndex !== -1) {
      const activityName = activities[activityIndex].title;
      
      // In a real app, we would call an API to delete the activity
      const updatedActivities = [...activities];
      updatedActivities.splice(activityIndex, 1);
      
      // Update the sample data
      while (sampleActivities.length) sampleActivities.pop();
      sampleActivities.push(...updatedActivities);
      
      setActivities(updatedActivities);
      
      toast({
        title: "Activity Deleted",
        description: `"${activityName}" has been removed from the calendar.`,
      });
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingActivity(undefined);
    
    // Refresh activities from sample data
    setActivities([...sampleActivities]);
    
    toast({
      title: "Activity Updated",
      description: "The activity has been successfully updated.",
    });
  };

  const filteredActivities = filterType 
    ? activities.filter(activity => activity.type === filterType)
    : activities;

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    const dateKey = formatDate(activity.startTime);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterType === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType(null)}
          >
            All
          </Button>
          <Button 
            variant={filterType === "coaching" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("coaching")}
          >
            Coaching
          </Button>
          <Button 
            variant={filterType === "activity" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("activity")}
          >
            Activities
          </Button>
          <Button 
            variant={filterType === "court" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("court")}
          >
            Courts
          </Button>
          <Button 
            variant={filterType === "open_game" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("open_game")}
          >
            Open Games
          </Button>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No activities found with the selected filter.</p>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map(dateKey => (
          <div key={dateKey} className="space-y-3">
            <h3 className="text-lg font-semibold">{dateKey}</h3>
            <div className="space-y-2">
              {groupedActivities[dateKey].map(activity => {
                const colorClasses = getActivityColor(activity.type);
                
                return (
                  <Card key={activity.id} className={`border-l-4 ${colorClasses.split(' ')[1]}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-gray-500">
                            {formatTime(activity.startTime)} - {formatTime(activity.endTime)} | {activity.location}
                          </div>
                          {activity.type !== 'court' && (
                            <div className="text-sm">
                              {activity.currentParticipants} / {activity.maxParticipants} participants
                            </div>
                          )}
                          {activity.price > 0 && (
                            <div className="text-sm">${activity.price}</div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditActivity(activity)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Edit Activity Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <EventForm 
              editActivity={editingActivity} 
              onSuccess={handleEditSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 