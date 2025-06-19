# 🎯 TrainWise.AI - AI-Powered Fitness & Nutrition Platform

> Transform your body with personalized workout routines and diet plans generated through natural voice conversations with our AI assistant.

![TrainWise.AI](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Convex](https://img.shields.io/badge/Convex-Database-orange?style=for-the-badge)

## 🚀 **What is TrainWise.AI?**

TrainWise.AI eliminates the guesswork and expense of personalized fitness planning. Instead of paying Thousands for personal trainers or nutritionists, users get AI-generated, completely personalized workout routines and diet plans in just 3 minutes through natural voice conversations.

### ✨ **Key Features**

- 🎙️ **Voice-First Experience** - Talk naturally to our AI instead of filling out forms
- 🏋️ **Personalized Workouts** - Custom routines based on your fitness level, equipment, and goals
- 🍎 **Nutrition Planning** - Detailed diet plans with calories, macros, and meal examples
- 🚫 **Injury-Aware** - Programs adapted for your specific limitations and restrictions
- 📱 **Fully Responsive** - Seamless experience across all devices
- ⚡ **Real-time Generation** - Get your complete fitness program in minutes

## 🎬 **How It Works**

1. **Explore** - Browse sample programs from other users to see what's possible
2. **Talk** - Start a natural voice conversation with our AI assistant
3. **Share** - Discuss your goals, fitness level, equipment, dietary needs, and any injuries
4. **Receive** - Get a comprehensive workout schedule and nutrition plan
5. **Track** - Manage multiple programs in your personalized dashboard

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with custom cyber theme
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### **Backend & Database**
- **Convex** - Real-time backend with TypeScript
- **Clerk** - Complete authentication solution
- **Webhook Integration** - Seamless user data synchronization

### **AI & Voice**
- **Vapi.AI** - Voice AI assistant for natural conversations
- **Google Gemini 2.0 Flash** - LLM for generating fitness plans
- **Real-time Processing** - Live transcription and conversation flow

## 📁 **Project Structure**

```
projecttrainwise/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage with hero and sample programs
│   │   ├── generate-program/   # Voice conversation interface
│   │   ├── profile/           # User dashboard and plan management
│   │   ├── programs/[id]/     # Sample program details
│   │   └── (auth)/            # Authentication pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base components (buttons, cards, etc.)
│   │   ├── navbar.jsx        # Responsive navigation
│   │   ├── userprograms.jsx  # Sample program showcase
│   │   └── profileheader.tsx # User profile display
│   ├── lib/                  # Utilities and configurations
│   ├── constants/            # Static data and mock content
│   └── providers/            # React context providers
├── convex/                   # Backend logic and database
│   ├── schema.ts            # Database schema definitions
│   ├── http.ts              # API routes and webhooks
│   ├── users.ts             # User management
│   └── plans.ts             # Fitness plan operations
└── public/                  # Static assets
```

## 🚦 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Clerk account (for authentication)
- Convex account (for database)
- Vapi.AI account (for voice AI)

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/trainwise-ai.git
cd trainwise-ai
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex Database
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Vapi.AI
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id

# Google AI (Optional)
GEMINI_API_KEY=your_gemini_api_key
```

### **4. Setup Convex Database**
```bash
npx convex dev
```

### **5. Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 **Configuration**

### **Clerk Setup**
1. Create a Clerk application
2. Configure social login providers
3. Set up webhooks to sync user data with Convex
4. Add webhook endpoint: `your-domain/api/clerk-webhook`

### **Vapi.AI Setup**
1. Create a Vapi assistant for fitness conversations
2. Design a workflow for structured fitness plan generation
3. Configure voice and AI model settings
4. Test conversation flow in Vapi dashboard

### **Convex Setup**
1. Deploy your Convex functions
2. Set up authentication integration with Clerk
3. Configure database indexes for optimal performance

## 🎨 **Design System**

### **Theme**
TrainWise.AI uses a cyber-themed design with:
- **Dark color scheme** with neon accent colors
- **Glassmorphism effects** with backdrop blur
- **Grid patterns** and scan line animations
- **Terminal-inspired** typography and elements

### **Components**
- All components are fully responsive
- Built with accessibility in mind using Radix UI
- Consistent hover states and smooth transitions
- Mobile-first design approach

## 📊 **Database Schema**

### **Users Table**
```typescript
{
  name: string,           // User's full name
  email: string,          // Primary email address
  image?: string,         // Profile picture URL
  clerkId: string         // Link to Clerk authentication
}
```

### **Plans Table**
```typescript
{
  userId: string,         // Reference to user
  name: string,           // Plan name/title
  workoutPlan: {
    schedule: string[],   // Weekly schedule
    exercises: Array<{
      day: string,
      routines: Array<{
        name: string,
        sets?: number,
        reps?: number,
        duration?: string
      }>
    }>
  },
  dietPlan: {
    dailyCalories: number,
    meals: Array<{
      name: string,
      foods: string[]
    }>
  },
  isActive: boolean       // Only one active plan per user
}
```

## 🎯 **Core Features Explained**

### **Voice Conversation Flow**
```typescript
// 1. Initialize Vapi call
await vapi.start(assistantId, undefined, undefined, workflowId, {
  variableValues: { full_name: userName }
});

// 2. Handle real-time events
vapi.on("message", handleTranscription);
vapi.on("call-end", redirectToProfile);
vapi.on("error", handleErrors);
```

### **Real-time Data Sync**
- Clerk webhooks automatically sync user data to Convex
- Convex queries provide real-time updates to UI
- Optimistic updates for better user experience

### **Responsive Design**
- Mobile-first approach with Tailwind breakpoints
- Touch-friendly voice controls
- Hamburger menu navigation on mobile
- Adaptive grid layouts

## 🔐 **Security & Privacy**

- **Authentication** handled by Clerk with industry-standard security
- **Webhook verification** using svix signatures
- **Environment variables** for all sensitive data
- **Type-safe** database operations with Convex
- **Input validation** at both frontend and backend

## 🚀 **Deployment**

### **Recommended Stack**
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Convex (handles scaling automatically)
- **Authentication**: Clerk (production-ready)
- **Monitoring**: Vercel Analytics + Convex Dashboard

### **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

### **Environment Variables**
Ensure all environment variables are configured in your deployment platform.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **API Endpoints**

### **Webhooks**
- `POST /api/clerk-webhook` - Handles user creation/updates from Clerk

### **Convex Functions**
- `users.syncUser` - Create new user in database
- `users.updateUser` - Update existing user data
- `plans.createPlan` - Create new fitness plan
- `plans.getUserPlans` - Fetch user's fitness plans

## 🎓 **Learning Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.dev/docs)
- [Vapi.AI Documentation](https://docs.vapi.ai)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📞 **Support**

- **Issues**: GitHub Issues
- **Documentation**: This README and inline code comments
- **Community**: Join our Discord server

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by PardhaSaradhi to all the Gym freaks**

*Transform your fitness journey with the power of AI.*
