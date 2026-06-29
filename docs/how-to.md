# How to add a new Resume Template

1. Create a new component in `src/app/features/templates/`.
2. Ensure it implements `@Input() data!: ResumeData`.
3. Use Tailwind classes to style your A4 layout.
4. Add your component to the `BaseUniversalComponent` switch-case or create a new selector in the builder.
