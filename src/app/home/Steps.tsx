const STEPS = [
  { title: 'Add a resume pdf', text: 'or create from scratch' },
  { title: 'Preview design', text: 'and make edits' },
  { title: 'Download new resume', text: 'and apply with confidence' },
];

export const Steps = () => {
  return (
    <section className="relative mx-auto mt-12 overflow-hidden rounded-3xl border border-gray-50 bg-white px-8 pb-16 pt-12 shadow-sm lg:mt-8">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl" />
      <h1 className="animate-slide-up text-center text-4xl font-extrabold text-gray-900">
        3 Simple Steps
      </h1>
      <div className="relative z-10 mt-12 flex justify-center">
        <dl className="flex flex-col gap-y-12 lg:flex-row lg:justify-center lg:gap-x-20">
          {STEPS.map(({ title, text }, idx) => (
            <div
              className="animate-fade-in group relative self-start pl-16"
              style={{ animationDelay: `${idx * 0.2}s` }}
              key={idx}
            >
              <dt className="text-xl font-bold text-gray-900">
                <div className="absolute left-0 top-0.5 flex h-12 w-12 select-none items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-md transition-transform group-hover:scale-110">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                    <div className="text-2xl font-extrabold text-primary-600">{idx + 1}</div>
                  </div>
                </div>
                {title}
              </dt>
              <dd className="mt-2 text-gray-500">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
