# Getting Started with Serverless Resume Builder

Welcome to the Serverless Resume Builder project! This tutorial will guide you through setting up the project locally, running the development server, and making your first basic edit.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18.17 or newer)
- **npm** (v9 or newer)

## Step 1: Clone and Install

1. Clone the repository to your local machine:

   ```bash
   git clone <your-repository-url>
   cd serverless-resume-builder
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Step 2: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the landing page of the Resume Builder.

## Step 3: Make Your First Edit

Let's make a small change to the application to see the live reloading in action.

1. Open `src/app/home/Hero.tsx` in your favorite code editor.
2. Find the main heading (`h1`) and change the text from "Create a professional resume" to something else, like "Build an ATS-friendly resume".
3. Save the file.
4. Check your browser—the change should be reflected immediately without a page refresh!

## Step 4: Explore the Project

Now that you have the app running, here are a few key areas to explore:

- **`/src/app/resume-builder/page.tsx`**: The main interface for building a resume.
- **`/src/app/components/ResumeForm/`**: The components handling user input.
- **`/src/app/components/Resume/`**: The components responsible for rendering the resume preview and PDF.

## Next Steps

To learn more about modifying the application's core logic or layout, check out our [How-To Guides](../how-to/).
