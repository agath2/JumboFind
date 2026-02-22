// Team information
import Link from "next/link";

const TEAM_GROUPS = [
  {
    role: "Frontend Engineer",
    members: [
      {
        name: "Agatha Yang",
        bio: "Builds smooth, accessible interfaces and keeps the user flow simple.",
      },
      {
        name: "Betty",
        bio: "Focuses on responsive layouts and interaction polish across devices.",
      },
      {
        name: "Matt Zhang",
        bio: "Builds clean React components and supports frontend feature integration.",
      },
    ],
  },
  {
    role: "Backend Engineer",
    members: [
      {
        name: "John Smith",
        bio: "Designs API endpoints and data pipelines for reliable item reporting.",
      },
      {
        name: "Alice Brown",
        bio: "Works on database models, search performance, and service stability.",
      },
    ],
  },
  {
    role: "Product Designer",
    members: [
      {
        name: "Priya Patel",
        bio: "Shapes the UX so posting and finding items takes as few steps as possible.",
      },
    ],
  },
];

const VALUES = [
  {
    title: "Fast Recovery",
    description: "Reduce the time between losing an item and getting it back.",
  },
  {
    title: "Trust & Safety",
    description: "Encourage verified, respectful communication across campus.",
  },
  {
    title: "Student First",
    description: "Keep the workflow clear, mobile-friendly, and low-friction.",
  },
];

export default function AboutUs() {
  return (
    <section className="min-h-full bg-light-beige px-4 pb-14 pt-32 text-dark-navy">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 rounded-2xl bg-dark-navy p-8 text-light-beige shadow-lg md:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] opacity-80">About JumboFind</p>
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl">Lost Less. Find Faster.</h1>
          <p className="max-w-3xl text-base leading-7 opacity-90 md:text-lg">
            JumboFind is a Tufts-focused lost-and-found platform that helps students reconnect with their belongings through
            a searchable feed, map visibility, and simple reporting.
          </p>
          <div className="mt-6">
            <Link
              href="/lostfeed"
              className="inline-block rounded-lg bg-light-beige px-5 py-3 font-heading text-sm font-semibold text-dark-navy transition hover:opacity-90"
            >
              Browse Lost Feed
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-5 font-heading text-2xl font-bold md:text-3xl">Our Team</h2>
          <div className="space-y-8">
            {TEAM_GROUPS.map((group) => (
              <section key={group.role}>
                <h3 className="mb-3 font-heading text-xl font-semibold text-dark-navy/90">{group.role}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {group.members.map((member) => (
                    <article
                      key={`${group.role}-${member.name}`}
                      className="rounded-xl border border-dark-navy/15 bg-white p-5 shadow-sm"
                    >
                      <h4 className="font-heading text-lg font-semibold">{member.name}</h4>
                      <p className="mt-2 text-sm leading-7 text-dark-navy/85">{member.bio}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-5 font-heading text-2xl font-bold md:text-3xl">Our Mission</h2>
          <p className="max-w-4xl text-base leading-8">
            We built JumboFind to make campus lost-and-found less fragmented. Instead of searching across multiple channels,
            students can post and discover items in one place with consistent details, timestamps, and location context.
          </p>
        </div>

        <div>
          <h2 className="mb-5 font-heading text-2xl font-bold md:text-3xl">What We Value</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.title} className="rounded-xl border border-dark-navy/15 bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-heading text-xl font-semibold">{value.title}</h3>
                <p className="text-sm leading-7 text-dark-navy/85">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
