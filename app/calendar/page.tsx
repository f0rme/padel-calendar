import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthlyView from "@/app/components/calendar/MonthlyView";
import WeeklyView from "@/app/components/calendar/WeeklyView";
import DailyView from "@/app/components/calendar/DailyView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Padel Calendar</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>View and Book Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <MonthlyView />
            </TabsContent>
            <TabsContent value="weekly">
              <WeeklyView />
            </TabsContent>
            <TabsContent value="daily">
              <DailyView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 