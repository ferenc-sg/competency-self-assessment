import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚠️  Update `base` to match your exact GitHub repo name
// e.g. if your repo is github.com/yourname/my-tool → base: "/my-tool/"
export default defineConfig({
  plugins: [react()],
  base: "https://github.com/ferenc-sg/competency-self-assessment",
});
