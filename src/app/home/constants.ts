import {
  initialEducation,
  initialProfile,
  initialProject,
  initialWorkExperience,
} from 'lib/redux/resumeSlice';
import type { Resume } from 'lib/redux/types';
import { deepClone } from 'lib/deep-clone';

export const END_HOME_RESUME: Resume = {
  profile: {
    name: 'John Doe',
    summary:
      'Experienced Software Engineer with a passion for building scalable web applications and seamless user experiences.',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    url: 'johndoe.com',
    customLinks: ['github.com/johndoe', 'linkedin.com/in/johndoe'],
  },
  workExperiences: [
    {
      company: 'Tech Solutions Inc.',
      jobTitle: 'Senior Frontend Engineer',
      date: '2021 - Present',
      descriptions: [
        'Led the migration of legacy monolithic applications to a modern React-based micro-frontend architecture.',
        'Mentored junior developers and established code review best practices.',
        'Optimized critical rendering paths, improving LCP by 40%.',
      ],
    },
    {
      company: 'Web Innovators',
      jobTitle: 'Software Developer',
      date: '2018 - 2021',
      descriptions: [
        'Developed and maintained multiple client-facing Angular applications.',
        'Integrated RESTful APIs and managed complex state using NgRx.',
      ],
    },
  ],
  educations: [
    {
      school: 'State University',
      degree: 'Bachelor of Science in Computer Science',
      date: '2014 - 2018',
      gpa: '3.8',
      descriptions: [],
    },
  ],
  projects: [
    {
      project: 'Open Source UI Library',
      date: '2023',
      descriptions: [
        'Created a highly customizable and accessible React component library.',
        'Published on npm with over 10,000 monthly downloads.',
      ],
    },
    {
      project: 'E-commerce Dashboard',
      date: '2022',
      descriptions: ['Built a real-time analytics dashboard using WebSockets and D3.js.'],
    },
    {
      project: 'Automated Testing Suite',
      date: '2020',
      descriptions: [
        'Implemented end-to-end testing using Cypress, reducing production bugs by 30%.',
      ],
    },
  ],
  skills: {
    featuredSkills: [
      { skill: 'React', rating: 5 },
      { skill: 'TypeScript', rating: 5 },
      { skill: 'Next.js', rating: 4 },
      { skill: 'CSS / Tailwind', rating: 4 },
      { skill: 'Node.js', rating: 3 },
      { skill: 'GraphQL', rating: 3 },
    ],
    descriptions: [
      'Frontend: React, TypeScript, Next.js, Redux, Tailwind CSS',
      'Backend: Node.js, Express, PostgreSQL, MongoDB',
      'Tools: Git, Docker, AWS, GitHub Actions, Jest, Cypress',
    ],
  },
  custom: {
    descriptions: [],
  },
};

export const START_HOME_RESUME: Resume = {
  profile: {
    ...deepClone(initialProfile),
    customLinks: END_HOME_RESUME.profile.customLinks?.map(() => '') || [],
  },
  workExperiences: END_HOME_RESUME.workExperiences.map(() => deepClone(initialWorkExperience)),
  educations: END_HOME_RESUME.educations.map(() => deepClone(initialEducation)),
  projects: END_HOME_RESUME.projects.map(() => deepClone(initialProject)),
  skills: {
    featuredSkills: END_HOME_RESUME.skills.featuredSkills.map((item) => ({
      skill: '',
      rating: item.rating,
    })),
    descriptions: END_HOME_RESUME.skills.descriptions.map(() => ''),
  },
  custom: {
    descriptions: END_HOME_RESUME.custom.descriptions.map(() => ''),
  },
};
