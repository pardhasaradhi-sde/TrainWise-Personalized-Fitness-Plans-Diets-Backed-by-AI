"use client";

import { useParams } from "next/navigation";
import { USER_PROGRAMS } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  UserIcon, 
  CalendarIcon, 
  ClockIcon, 
  Dumbbell, 
  AppleIcon,
  TrendingUpIcon,
  ShieldIcon,
  StarIcon,
  Sparkles
} from "lucide-react";
import Image from "next/image";

const ProgramDetailsPage = () => {
  const params = useParams();
  const programId = parseInt(params.id as string);
  
  // Find the program by ID
  const program = USER_PROGRAMS.find(p => p.id === programId);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested fitness program could not be found.</p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 px-3 py-2 bg-background/60 backdrop-blur-sm border border-border rounded-lg hover:border-primary/50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>          
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">              {/* User Profile */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <Image
                    src={program.profilePic}
                    alt={program.first_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">{program.first_name}'s Program</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground mt-2">
                    <span className="flex items-center gap-1 text-sm">
                      <UserIcon className="w-4 h-4 flex-shrink-0" />
                      {program.age} years old
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                      {program.workout_days} days/week
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <TrendingUpIcon className="w-4 h-4 flex-shrink-0" />
                      {program.fitness_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Goal Badge */}
              <div className="w-full md:w-auto">
                <div className="px-3 md:px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-center">
                  <span className="text-primary font-medium text-sm md:text-base">{program.fitness_goal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* User Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardContent className="p-3 md:p-4 text-center">
              <h3 className="text-lg md:text-2xl font-bold text-primary truncate">{program.height}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Height</p>
            </CardContent>
          </Card>
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardContent className="p-3 md:p-4 text-center">
              <h3 className="text-lg md:text-2xl font-bold text-primary truncate">{program.weight}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Weight</p>
            </CardContent>
          </Card>
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardContent className="p-3 md:p-4 text-center">
              <h3 className="text-sm md:text-2xl font-bold text-primary truncate">{program.equipment_access}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Equipment</p>
            </CardContent>
          </Card>
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardContent className="p-3 md:p-4 text-center">
              <h3 className="text-sm md:text-2xl font-bold text-primary truncate">{program.injuries || "None"}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Injuries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {/* Workout Plan */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{program.workout_plan.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {program.workout_plan.description}
                  </p>
                </div>
              </div>
            </CardHeader>            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground mb-3">Weekly Schedule</h4>
                {program.workout_plan.weekly_schedule.map((day, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background/50 rounded-lg border border-border gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{day.day}</p>
                      <p className="text-sm text-muted-foreground truncate">{day.focus}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary flex-shrink-0">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{day.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diet Plan */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <AppleIcon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{program.diet_plan.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {program.diet_plan.description}
                  </p>
                </div>
              </div>
            </CardHeader>            <CardContent className="p-4 md:p-6">
              {/* Daily Calories & Macros */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm md:text-base">Daily Calories:</span>
                  <span className="text-primary font-bold text-sm md:text-base">{program.diet_plan.daily_calories}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-background/50 rounded border">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-bold text-primary text-sm">{program.diet_plan.macros.protein}</p>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded border">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="font-bold text-primary text-sm">{program.diet_plan.macros.carbs}</p>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded border">
                    <p className="text-xs text-muted-foreground">Fats</p>
                    <p className="font-bold text-primary text-sm">{program.diet_plan.macros.fats}</p>
                  </div>
                </div>
              </div>

              {/* Meal Examples */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Meal Examples</h4>
                <div className="space-y-3">
                  {program.diet_plan.meal_examples.map((meal, index) => (
                    <div key={index} className="p-3 bg-background/50 rounded-lg border border-border">
                      <p className="font-medium text-foreground mb-1 text-sm md:text-base">{meal.meal}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{meal.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>        {/* Additional Info */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <ShieldIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <CardTitle className="text-base md:text-lg">Safety Considerations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm md:text-base text-muted-foreground">
                This program has been designed considering the user's {program.injuries ? 'injury history' : 'health profile'} 
                {program.injuries && ` (${program.injuries})`} and fitness level ({program.fitness_level}). 
                {program.dietary_restrictions && ` Dietary restrictions (${program.dietary_restrictions}) have been accommodated.`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <StarIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <CardTitle className="text-base md:text-lg">AI Personalization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm md:text-base text-muted-foreground">
                This program was generated by TrainWise.AI based on the user's specific goals, 
                fitness level, available equipment, and personal preferences. Every aspect has been 
                tailored for optimal results and safety.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Want a program like this?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
              Create your own personalized fitness and nutrition plan with our AI assistant. 
              Just tell us about your goals, preferences, and we'll build something perfect for you.
            </p>
            <Link href="/generate-program">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base">
                Generate My Program
                <StarIcon className="ml-2 w-4 md:w-5 h-4 md:h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Sample Program Note */}
        <div className="mt-6 px-3 py-2 bg-muted/20 rounded-md border border-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 This is a sample program created for demonstration purposes. Actual programs generated by TrainWise.AI will be personalized based on your specific inputs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;
