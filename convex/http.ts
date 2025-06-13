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
Design a **weekly workout plan** that:
- Prioritizes **1 to 2 muscle groups per session only** — NEVER full-body routines  
- Is progressive, safe, and tailored to the user’s fitness goal and level  
- Avoids training the same muscle group on consecutive days  
- Avoids exercises that could aggravate injuries

🏋️‍♂️ PROGRAM STRUCTURE:
Follow these standards strictly:

1. **Weekly Split**  
   - Choose the best split based on available days (e.g., Push/Pull/Legs, Upper-Lower, Bro-Split)  
   - NEVER assign full-body routines  
   - Each session must focus on **only one or two primary muscle groups**

2. **Exercise Selection Based on Level**
   - **Beginner**: Machine-based, bodyweight or stable movements, simple mechanics  
   - **Intermediate**: Compound + isolation mix, moderate complexity  
   - **Advanced**: High volume, progressive overload, supersets or drop sets allowed

3. **Reps & Sets Based on Fitness Goal**
   - **Fat loss**: Circuits or supersets, 12–15 reps  
   - **Muscle gain**: 8–12 reps, with progressive overload  
   - **Strength**: 4–6 reps, fewer exercises, more rest  
   - **General fitness**: 8–12 reps, moderate volume

4. **Workout Day Rules**
   - Begin each workout with compound movements  
   - Follow with isolation work  
   - Never repeat major muscles two days in a row

⚠️ CRITICAL SCHEMA INSTRUCTIONS:
- Your output MUST follow the exact JSON structure below
- "sets" and "reps" MUST always be NUMBERS — not strings, descriptions, or text
- For cardio or circuits, use valid numbers like "sets": 1, "reps": 1

🚫 DO NOT include:
- Extra fields (like rest time, intensity, duration, equipment, notes, etc.)
- Any text outside the required JSON structure

============================================================

Return a valid JSON object using this **exact schema**:

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
        }
      ]
    }
  ]
}

============================================================

❗IMPORTANT:
- Each day must target **no more than 2 muscle groups**
- NO full-body workouts allowed
- NO extra fields outside "day", "name", "sets", and "reps"
- Output ONLY the JSON object — no extra text, no markdown, no explanations

Now based on the user profile, return a professionally structured split workout plan targeting 1–2 muscle groups per day.`;

            const workoutResult = await model.generateContent(workoutPrompt);
            const workoutPlanText = workoutResult.response.text();

            //validate response from ai
            let workoutPlan = JSON.parse(workoutPlanText);
            workoutPlan = validateWorkoutPlan(workoutPlan);

            const dietPrompt = `You are a highly experienced, certified professional nutrition coach and sports dietician. Your task is to generate a **personalized, practical, and culturally grounded Indian diet plan** based on the user's profile.

User profile:  
Age: ${age}  
Height: ${height}  
Weight: ${weight}  
Fitness goal: ${fitnessgoals}  
Dietary restrictions: ${dietary_preferences}

🎯 OBJECTIVE:
Design a **goal-oriented daily meal plan** tailored specifically to the user's needs (e.g., fat loss, muscle gain, or maintenance), using only foods that are common in Indian households.

As a top-level professional, ensure the following:
- ✅ Accurately calculate total daily calorie needs based on age, height, weight, and goal using standard nutritional formulas (e.g., Mifflin-St Jeor or equivalent)
- ✅ Align meals with the user’s fitness goal: energy deficit for fat loss, surplus for muscle gain, maintenance for balance
- ✅ Ensure nutritional completeness — each meal should reflect proper **macronutrient balance** (carbs, protein, fats)
- ✅ Recommend only **readily available Indian foods** — use ingredients found in a middle-class Indian household
- ✅ Honor all **dietary restrictions** strictly (vegetarian, gluten-free, lactose-free, etc.)
- ✅ Ensure **food diversity** — avoid repetition across meals
- ✅ Suggest foods that also support digestive health and long-term sustainability
- ✅ Consider cultural taste preferences and seasonal adaptability

🚫 DO NOT include:
- Exotic, foreign, or expensive ingredients like quinoa, kale, tofu, almond milk, protein powders, salmon, etc.
- Supplements, macros, timing, portion sizes, calorie breakdowns, or explanations

⚠️ CRITICAL SCHEMA INSTRUCTIONS:
- Your output MUST strictly follow this JSON format
- dailyCalories must be a NUMBER (not a string or label)
- Each meal object must contain ONLY:
  • "name": the name of the meal (e.g., "Breakfast")
  • "foods": an array of food item strings

============================================================

Return a valid JSON object using **this exact structure**:

{
  "dailyCalories": 2000,
  "meals": [
    {
      "name": "Breakfast",
      "foods": ["Oats with banana", "Boiled eggs", "Masala chai (no sugar)"]
    },
    {
      "name": "Lunch",
      "foods": ["Roti with dal", "Mixed vegetable sabzi", "Curd"]
    },
    {
      "name": "Snack",
      "foods": ["Handful of peanuts", "Buttermilk"]
    },
    {
      "name": "Dinner",
      "foods": ["Steamed rice", "Grilled paneer", "Spinach sabzi"]
    }
  ]
}

============================================================

🔒 FINAL INSTRUCTIONS:
- DO NOT add any fields or metadata outside the above JSON format
- DO NOT include any text outside the JSON block
- All values in "foods" must be strings (no objects or explanations)
- Use ONLY culturally relevant Indian foods, as found in typical home-cooked meals

Now, based on the user profile provided, generate a highly effective and Indian household-friendly diet plan that aligns with the goal and fits real-life application.`;

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
