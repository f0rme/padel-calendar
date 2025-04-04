"use client";

import { Activity } from "@/app/types";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/app/lib/calendar-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  activity: Activity;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  participants: z.coerce.number().int().min(1).optional(),
});

export default function BookingForm({ activity, onCancel }: BookingFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      participants: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would normally send the booking data to your API
    console.log({
      activityId: activity.id,
      ...values,
      bookingDate: new Date(),
    });
    
    toast({
      title: "Booking confirmed!",
      description: `You've successfully booked ${activity.title} on ${formatDate(activity.startTime)}.`,
    });
    
    onCancel();
  }

  return (
    <div className="border-t mt-4 pt-4">
      <h3 className="text-lg font-medium mb-4">Book {activity.title}</h3>
      <p className="text-sm mb-4">
        {formatDate(activity.startTime)}, {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="yourname@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {activity.type !== 'court' && (
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of participants</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={activity.maxParticipants} {...field} />
                  </FormControl>
                  <FormDescription>
                    {activity.currentParticipants} of {activity.maxParticipants} spots taken
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
            <Button type="submit">Confirm Booking</Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 