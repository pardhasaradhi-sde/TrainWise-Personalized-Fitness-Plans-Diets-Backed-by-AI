import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const http = httpRouter();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("No svix headers found", {
                status: 400,
            });
        }
        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return new Response("Error occurred", { status: 400 });
        }
        const eventType = evt.type;

        if (eventType === "user.created") {
            const { id, first_name, last_name, image_url, email_addresses } =
                evt.data;

            const email = email_addresses[0].email_address;

            const name = `${first_name || ""} ${last_name || ""}`.trim();
            try {
                await ctx.runMutation(api.users.syncUser, {
                    email,
                    name,
                    image: image_url,
                    clerkId: id,
                });
            } catch (error) {
                console.log("Error creating user:", error);
                return new Response("Error creating user", { status: 500 });
            }
        }
        if (eventType === "user.updated") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try {
                await ctx.runMutation(api.users.updateUser, {
                    clerkId: id,
                    email,
                    name,
                    image: image_url,
                });
            } catch (error) {
                console.log("Error updating user:", error);
                return new Response("Error updating user", { status: 500 });
            }
        }
        return new Response("Webhooks processed successfully", { status: 200 });
    }),
});

// validate and fix workout plan to ensure it has proper numeric types
function validateWorkoutPlan(plan: any) {
    const validatedPlan = {
        schedule: plan.schedule,
        exercises: plan.exercises.map((exercise: any) => ({
            day: exercise.day,
            routines: exercise.routines.map((routine: any) => ({
                name: routine.name,
                sets: typeof routine.sets === "number" ? routine.sets : parseInt(routine.sets) || 1,
                reps: typeof routine.reps === "number" ? routine.reps : parseInt(routine.reps) || 10,
            })),
        })),
    };
    return validatedPlan;
}

// validate diet plan to ensure it strictly follows schema
function validateDietPlan(plan: any) {
    // only keep the fields we want
    const validatedPlan = {
        dailyCalories: plan.dailyCalories,
        meals: plan.meals.map((meal: any) => ({
            name: meal.name,
            foods: meal.foods,
        })),
    };
    return validatedPlan;
}

http.route({
    path: "/vapi/generate-program",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const payload = await request.json();
            const {
                user_id,
                age,
                height,
                weight,
                injuries,
                workoutDays,
                fitnessgoals,
                fitness_level,
                dietary_preferences,
            } = payload;
            console.log("Received payload:", payload);

            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-001",
                generationConfig: {
                    temperature: 0.4, // lower temperature for more predictable outputs
                    topP: 0.9,
                    responseMimeType: "application/json",
                },
            });

            const workoutPrompt = `You are a certified expert fitness and strength coach. Create a **goal-based, muscle-focused workout program** tailored to the following individual:

Age: ${age}  
Height: ${height}  
Weight: ${weight}  
Injuries or limitations: ${injuries}  
Available workout days: ${workoutDays}  
Fitness goal: ${fitnessgoals}  
Fitness level: ${fitness_level} (Options: beginner, intermediate, advanced)

🎯 OBJECTIVE:
Design a weekly workout plan that:
- Targets **only 1 to 2 major muscle groups per workout day**
- Includes **at least 5 and no more than 7 exercises** per day
- Follows a progressive, safe, and goal-aligned structure based on fitness level
- Avoids repeating major muscle groups on consecutive days
- Excludes exercises that may aggravate reported injuries

🏋️‍♂️ PROGRAM STRUCTURE:

1. ✅ **Weekly Split**  
   - Select an optimal split (e.g., Push/Pull/Legs, Upper-Lower, Bro-Split) based on the available days  
   - NEVER assign full-body routines  
   - Each session should focus on **only 1 or 2 specific muscle groups**

2. ✅ **Exercise Selection Based on Level**
   - **Beginner**: Bodyweight, machine-based, or simple movements  
   - **Intermediate**: Balanced compound and isolation exercises  
   - **Advanced**: Include progressive overload, supersets, drop sets, higher volume

3. ✅ **Reps & Sets Based on Goal**
   - **Fat Loss**: 12–15 reps  
   - **Muscle Gain**: 8–12 reps  
   - **Strength**: 4–6 reps  
   - **General Fitness**: 8–12 reps

4. ✅ **Workout Day Rules**
   - Start with compound lifts  
   - Follow with isolation exercises  
   - Avoid repeating the same muscle group two days in a row

⚠️ CRITICAL SCHEMA INSTRUCTIONS:
- Your response MUST use ONLY the JSON format shown below  
- Each workout day must include **between 5 to 7 exercises**  
- "sets" and "reps" MUST be numbers (e.g., "sets": 3, "reps": 10) — NO text or descriptions  
- DO NOT include any other fields such as:  
  ❌ rest  
  ❌ duration  
  ❌ intensity  
  ❌ notes  
  ❌ calories  
  ❌ equipment  

============================================================

Return a valid JSON object using **this exact format**:

{
  "schedule": ["Monday", "Wednesday", "Friday"],
  "exercises": [
    {
      "day": "Monday",
      "routines": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": 10
        },
        {
          "name": "Second Exercise",
          "sets": 3,
          "reps": 10
        },
        {
          "name": "Third Exercise",
          "sets": 3,
          "reps": 10
        },
        {
          "name": "Fourth Exercise",
          "sets": 3,
          "reps": 10
        },
        {
          "name": "Fifth Exercise",
          "sets": 3,
          "reps": 10
        },
        {
          "name": "Sixth Exercise (optional)",
          "sets": 3,
          "reps": 10
        },
        {
          "name": "Seventh Exercise (optional)",
          "sets": 3,
          "reps": 10
        }
      ]
    }
  ]
}

============================================================

❗FINAL RULES:
- Each day MUST contain **at least 5 and no more than 7 exercises**  
- Target only **1–2 muscle groups per session**  
- NO full-body workouts allowed  
- DO NOT include any fields other than: "day", "name", "sets", and "reps"  
- Return ONLY the valid JSON — no extra text, markdown, or explanation

Now, based on the user profile, return a **professional, high-performance workout split** using the format above.`;


            const workoutResult = await model.generateContent(workoutPrompt);
            const workoutPlanText = workoutResult.response.text();

            //validate response from ai
            let workoutPlan = JSON.parse(workoutPlanText);
            workoutPlan = validateWorkoutPlan(workoutPlan);

            const dietPrompt = `You are a highly experienced, certified professional nutrition coach and sports dietician. Your task is to generate a **personalized, practical, and culturally grounded Indian diet plan** based on the user's profile.

User Profile:  
Age: ${age}  
Height: ${height}  
Weight: ${weight}  
Fitness Goal: ${fitnessgoals}  
Dietary Restrictions: ${dietary_preferences}

🎯 OBJECTIVE:
Design a **goal-oriented daily meal plan** tailored to the user's needs (e.g., fat loss, muscle gain, or maintenance), using only foods that are widely available in Indian households and practical for a middle-class lifestyle.

As a top-level professional, ensure the following:
- ✅ Accurately estimate daily calorie needs based on age, height, weight, and goal using standard nutrition formulas (e.g., Mifflin-St Jeor or similar)
- ✅ Align the total calorie target with the user’s goal: deficit (fat loss), surplus (muscle gain), or maintenance
- ✅ Ensure all meals are nutritionally complete with balanced carbohydrates, protein, and healthy fats
- ✅ ONLY use culturally relevant, affordable Indian household foods — avoid imported, exotic, or expensive items
- ✅ Strictly respect any dietary restrictions (e.g., vegetarian, gluten-free, lactose-free)
- ✅ Avoid food repetition between meals — ensure diversity and meal satisfaction
- ✅ Include 6 total meals: Breakfast, Pre-workout, Lunch, Snack, Post-workout, and Dinner
- ✅ Include **at least 5 items** per meal to support variety, fullness, and nutritional adequacy
- ✅ All meals should support digestion, cultural preference, and long-term adherence

🚫 DO NOT include:
- Supplements, protein powders, or calorie/macro breakdowns
- Portion sizes, nutrient labels, or cooking methods
- Any foreign foods like kale, tofu, quinoa, avocados, almond milk, salmon, etc.

⚠️ CRITICAL SCHEMA INSTRUCTIONS:
- Your output MUST follow the JSON format below with NO extra fields or text
- The field \`dailyCalories\` MUST be a NUMBER
- Each item in \`meals\` MUST follow this schema:
  • \`name\`: (e.g., "Breakfast", "Lunch", etc.)
  • \`foods\`: an array of STRINGS ONLY (at least 5 per meal)

============================================================

Return a valid JSON object using THIS EXACT STRUCTURE:

{
  "dailyCalories": 2000,
  "meals": [
    {
      "name": "Breakfast",
      "foods": ["Poha with peanuts", "Boiled eggs", "Masala chai (no sugar)", "Banana", "Curd"]
    },
    {
      "name": "Pre-workout",
      "foods": ["Banana", "Handful of soaked almonds", "Black coffee", "Dalia", "Water"]
    },
    {
      "name": "Lunch",
      "foods": ["Chapati", "Toor dal", "Mixed vegetable curry", "Curd", "Salad with cucumber and carrot"]
    },
    {
      "name": "Snack",
      "foods": ["Roasted chana", "Buttermilk", "Peanut chikki", "Fruit salad", "Lemon water"]
    },
    {
      "name": "Post-workout",
      "foods": ["Boiled eggs", "Sprouted moong salad", "Coconut water", "Chickpeas", "Apple"]
    },
    {
      "name": "Dinner",
      "foods": ["Steamed rice", "Palak paneer", "Tinda sabzi", "Cucumber raita", "Ghee-roasted papad"]
    }
  ]
}

============================================================

🔒 FINAL INSTRUCTIONS:
- DO NOT include any markdown, comments, or additional text outside the JSON block
- DO NOT use any nested objects, notes, or explanations in \`foods\`
- DO NOT add or remove any fields beyond what is shown in the example above
- Stick strictly to **Indian food culture**, home-cooked practicality, and middle-class accessibility

Now based on the provided user profile, return a **goal-specific, realistic, Indian household-friendly** 6-meal plan using the schema above.`;


            const dietResult = await model.generateContent(dietPrompt);
            const dietPlanText = dietResult.response.text();
            //validate response from ai
            let dietPlan = JSON.parse(dietPlanText);
            dietPlan = validateDietPlan(dietPlan);

            //save to our database
            const planId = await ctx.runMutation(api.plans.createPlan, {
                userId: user_id,
                dietPlan,
                isActive: true,
                workoutPlan,
                name: `${fitnessgoals} Plan - ${new Date().toLocaleDateString()}`,
            })

            return new Response(
                JSON.stringify({
                    success: true,
                    data: {
                        planId,
                        workoutPlan,
                        dietPlan,
                    },
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (error) {
            console.error("Error generating fitness plan:", error);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : String(error),
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }),
});

export default http;
