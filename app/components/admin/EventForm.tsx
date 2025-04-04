"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Activity, ActivityType } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addHours } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { sampleActivities } from "@/app/lib/data";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  type: z.enum(["coaching", "activity", "court", "open_game"] as const),
  date: z.date({
    required_error: "A date is required.",
  }),
  startHour: z.coerce.number().min(0).max(23),
  startMinute: z.coerce.number().min(0).max(59),
  durationHours: z.coerce.number().min(1).max(5),
  location: z.string().optional(),
  description: z.string().optional(),
  maxParticipants: z.coerce.number().min(1).max(50).optional(),
  price: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onSuccess?: () => void;
  editActivity?: Activity;
}

export default function EventForm({ onSuccess, editActivity }: EventFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default values based on editActivity or use defaults
  const defaultValues: Partial<FormValues> = editActivity
    ? {
        title: editActivity.title,
        type: editActivity.type,
        date: new Date(editActivity.startTime),
        startHour: editActivity.startTime.getHours(),
        startMinute: editActivity.startTime.getMinutes(),
        durationHours: Math.ceil(
          (editActivity.endTime.getTime() - editActivity.startTime.getTime()) /
            (1000 * 60 * 60)
        ),
        location: editActivity.location,
        description: editActivity.description,
        maxParticipants: editActivity.maxParticipants,
        price: editActivity.price,
      }
    : {
        title: "",
        type: "court",
        date: new Date(),
        startHour: 9,
        startMinute: 0,
        durationHours: 1,
        maxParticipants: 4,
        price: 25,
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    // Create start and end dates based on form values
    const startTime = new Date(values.date);
    startTime.setHours(values.startHour, values.startMinute, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + values.durationHours);

    // Generate a random ID
    const id = editActivity?.id || Math.random().toString(36).substring(2, 10);

    // Create the activity object
    const activity: Activity = {
      id,
      title: values.title,
      type: values.type,
      startTime,
      endTime,
      description: values.description || "",
      location: values.location || `Court ${Math.floor(Math.random() * 5) + 1}`,
      maxParticipants: values.maxParticipants || 4,
      currentParticipants: editActivity?.currentParticipants || 0,
      price: values.price || 0,
    };

    // In a real app, we would send this to an API
    // For demo, we'll just add it to our sample data
    if (editActivity) {
      // Update existing activity
      const index = sampleActivities.findIndex((a) => a.id === editActivity.id);
      if (index !== -1) {
        sampleActivities[index] = activity;
      }
    } else {
      // Add new activity
      sampleActivities.push(activity);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: editActivity ? "Event updated" : "Event created",
        description: `${activity.title} has been ${
          editActivity ? "updated" : "scheduled"
        } for ${format(activity.startTime, "EEEE, MMMM d, yyyy 'at' h:mm a")}`,
      });

      if (onSuccess) {
        onSuccess();
      }

      if (!editActivity) {
        form.reset();
      }
    }, 500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coaching">Coaching Session</SelectItem>
                  <SelectItem value="activity">Group Activity</SelectItem>
                  <SelectItem value="court">Court Booking</SelectItem>
                  <SelectItem value="open_game">Open Game</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="startHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hour</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      placeholder="HH"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startMinute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minute</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      placeholder="MM"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (h)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      placeholder="Hours"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Court 1" {...field} />
              </FormControl>
              <FormDescription>
                The specific court or area where the event will take place
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of the event"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Participants</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Maximum number of participants"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Price in $"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : editActivity
            ? "Update Event"
            : "Create Event"}
        </Button>
      </form>
    </Form>
  );
} 