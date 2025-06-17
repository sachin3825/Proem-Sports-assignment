# Proem Sports Assignment

A multi-step campaign creation interface with channel-specific messaging support and message preview functionality.

**🔗 Live Deployment:**
[https://proem-sports-assignment.vercel.app/](https://proem-sports-assignment.vercel.app/)

---

## 📌 How to Run the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sachin3825/Proem-Sports-assignment.git
   cd proem-sports-assignment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

---

##  Tech Stack Decisions

### Frontend

* **Vite + React 19 + TypeScript**
  Fast, modern tooling with the latest React features including Actions and Form enhancements.

* **Tailwind CSS + ShadCN**
  For rapid, consistent styling and UI components that are accessible and customizable.

* **Draft.js**
  Rich text editing for the Email channel to support personalization and formatting. Chosen for its React integration and extensibility.

* **Radix UI + Keyframes animations**
  Accordion and tab transitions use Radix-friendly `@keyframes` to enhance the user experience without heavy animation libraries.
  
*  **Zod Validation**
   Used to validate user inputs (e.g., message content, step completion) in a type-safe and declarative way. Helps ensure correctness before progressing between steps.

### State Management

* **React Context API**
  Lightweight state sharing across steps, avoiding Redux or external stores due to the app's small scope.

* **LocalStorage Persistence**
  Campaign progress is saved between page refreshes for better UX, as requested.

---

##  Known Limitations / Trade-offs

* **Draft.js bundle size**: Adds some bundle overhead. Alternatives like Quill were ruled out due to React 19 incompatibility.
* **Limited validation**: Basic checks are implemented (e.g., character limits), but input sanitation or deeper validation is minimal.
* **Mobile UX not fully optimized**: UI is responsive, but detailed testing on various mobile screen sizes is pending.


