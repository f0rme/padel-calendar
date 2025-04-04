"use client";

import { Activity } from "@/app/types";
import { formatTime, getActivityColor } from "@/app/lib/calendar-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BookingForm from "@/app/components/booking/BookingForm";
import { useState } from "react";

interface ActivityItemProps {
  activity: Activity;
  compact?: boolean;
}

export default function ActivityItem({ activity, compact = false }: ActivityItemProps) {
  const [showBooking, setShowBooking] = useState(false);
  
  const colorClasses = getActivityColor(activity.type);
  
  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div 
            className={`px-2 py-1 mb-1 text-xs rounded border-l-4 cursor-pointer truncate ${colorClasses}`}
            title={activity.title}
          >
            {activity.title}
          </div>
        </DialogTrigger>
        <DialogContent>
          <ActivityDetails activity={activity} onBook={() => setShowBooking(true)} />
          {showBooking && <BookingForm activity={activity} onCancel={() => setShowBooking(false)} />}
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <div className={`p-3 mb-2 rounded border-l-4 ${colorClasses}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold">{activity.title}</h4>
          <p className="text-xs">
            {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
          </p>
          <p className="text-xs mt-1">{activity.location}</p>
          {activity.type !== 'court' && (
            <p className="text-xs">
              {activity.currentParticipants} / {activity.maxParticipants} participants
            </p>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Details</Button>
          </DialogTrigger>
          <DialogContent>
            <ActivityDetails activity={activity} onBook={() => setShowBooking(true)} />
            {showBooking && <BookingForm activity={activity} onCancel={() => setShowBooking(false)} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface ActivityDetailsProps {
  activity: Activity;
  onBook: () => void;
}

function ActivityDetails({ activity, onBook }: ActivityDetailsProps) {
  const typeLabel = {
    coaching: 'Coaching Session',
    activity: 'Activity',
    court: 'Court Booking',
    open_game: 'Open Game'
  }[activity.type];
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{activity.title}</DialogTitle>
        <DialogDescription>
          {typeLabel} - {formatTime(activity.startTime)} to {formatTime(activity.endTime)}
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold">Description</h4>
          <p className="text-sm">{activity.description || 'No description available'}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold">Location</h4>
          <p className="text-sm">{activity.location}</p>
        </div>
        
        {activity.type !== 'court' && (
          <div>
            <h4 className="text-sm font-semibold">Participants</h4>
            <p className="text-sm">
              {activity.currentParticipants} / {activity.maxParticipants} participants
            </p>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-semibold">Price</h4>
          <p className="text-sm">${activity.price}</p>
        </div>
        
        <Button onClick={onBook} className="w-full">Book Now</Button>
      </div>
    </>
  );
} 