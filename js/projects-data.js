/*
 * Project data. Each category is an array of project objects.
 * To add a project: append an object to the relevant array below.
 *
 * Shape:
 * {
 *   title: string,
 *   blurb: string,          // 1-2 sentence summary
 *   tags: string[],         // short labels shown as pills
 *   detail: {
 *     type: 'text',
 *     content: string       // shown directly on the card
 *   } | {
 *     type: 'canva',
 *     embedUrl: string      // Canva "Share > Embed" URL
 *   }
 * }
 */
window.PROJECTS = {
  work: [
    {
      title: 'Placeholder: Merchant onboarding revamp',
      blurb: 'Redesigned a multi-step onboarding flow to cut drop-off for new merchants.',
      tags: ['Worldline', 'GTM'],
      detail: {
        type: 'text',
        content: 'Replace with the real problem, approach, and outcome for this project.'
      }
    },
    {
      title: 'Placeholder: Pricing strategy deck',
      blurb: 'A go-to-market pricing recommendation presented to leadership.',
      tags: ['Strategy', 'Payments'],
      detail: {
        type: 'canva',
        embedUrl: 'https://www.canva.com/design/PLACEHOLDER/view?embed'
      }
    }
  ],
  school: [
    {
      title: 'Placeholder: Market-entry capstone',
      blurb: 'Market sizing, positioning, and go-to-market sequencing for a mid-size SaaS player.',
      tags: ['ESSEC', 'Capstone'],
      detail: {
        type: 'text',
        content: 'Replace with the real capstone summary, methodology, and result.'
      }
    },
    {
      title: 'Placeholder: Growth strategy case study',
      blurb: 'Acquisition and retention plan built during GrowthX coursework.',
      tags: ['GrowthX', 'Growth'],
      detail: {
        type: 'canva',
        embedUrl: 'https://www.canva.com/design/PLACEHOLDER/view?embed'
      }
    }
  ],
  personal: [
    {
      title: 'Placeholder: Side project name',
      blurb: 'A short description of a self-directed project built outside work or school.',
      tags: ['Personal'],
      detail: {
        type: 'text',
        content: 'Replace with what you built, why, and what you learned.'
      }
    },
    {
      title: 'Placeholder: Another personal project',
      blurb: 'Something scoped specifically to round out the portfolio.',
      tags: ['Personal'],
      detail: {
        type: 'text',
        content: 'Replace with the real project description.'
      }
    }
  ]
};
