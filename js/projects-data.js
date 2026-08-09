/*
 * Project data. Each category is an array of project objects.
 * To add a project: append an object to the relevant array below.
 *
 * Shape:
 * {
 *   title: string,
 *   blurb: string,          // optional — 1-2 sentence summary. Omit entirely
 *                           // when the preview (PDF/thumbnail) speaks for itself.
 *   tags: string[],         // short labels shown as pills
 *   icon: string,           // optional — key into the ICONS map in script.js,
 *                           // used as the thumbnail for non-pdf projects instead
 *                           // of the generic first-letter glyph. See script.js
 *                           // for available keys; add a new one there first.
 *   detail: {
 *     type: 'text',
 *     content: string       // shown directly on the card
 *   } | {
 *     type: 'pdf',
 *     pdfUrl: string        // path to a PDF in assets/work/, e.g. 'assets/work/capstone.pdf'
 *   } | {
 *     type: 'link',
 *     url: string,          // external destination (e.g. a GitHub repo) —
 *                           // thumbnail/title/tags link here
 *     downloadUrl: string,  // optional — path to a downloadable file (e.g.
 *                           // in assets/work/); renders a separate download
 *                           // button below the card, since a file type like
 *                           // .pbix can't be previewed inline like a PDF
 *     downloadLabel: string // optional — download button text, defaults to
 *                           // 'Download file'
 *   }
 * }
 */
window.PROJECTS = {
  work: [
    {
      title: 'Strategy & Business Potential - Nordics',
      tags: ['Worldline', 'Market Strategy'],
      icon: 'growth',
      detail: {
        type: 'text',
        content: 'I proposed a unified commerce solution for the Nordics, then backed it with market and competitor analysis across 4 countries, alongside market sizing and revenue forecasting to estimate €37.5M in additional revenue by 2030.'
      }
    },
    {
      title: 'AI Tooling for Enterprise GTM',
      tags: ['Worldline', 'AI', 'GTM'],
      icon: 'ai',
      detail: {
        type: 'text',
        content: 'I led an AI tooling initiative in the Enterprise GTM team. I started by building a competitive intelligence agent to make my own analysis and workflow more efficient, then expanded the initiative to build a battlecard generator and internal reporting agent, extending those efficiency gains to other teams.'
      }
    },
    {
      title: 'SoftPOS Business Case — France',
      tags: ['Worldline', 'Payments Strategy'],
      icon: 'pos',
      detail: {
        type: 'text',
        content: 'I built a business case to decide between launching a full gateway SoftPOS solution or keeping the existing offer, running scenario analysis across 3 offers for the French market by vertical to identify €8.37M in additional potential revenue by 2029.'
      }
    }
  ],
  school: [
    {
      title: 'Telmont Marketing Strategy',
      tags: ['ESSEC', 'Marketing Strategy'],
      detail: {
        type: 'pdf',
        pdfUrl: 'assets/work/essec-growthx/telmont-marketing-strategy.pdf'
      }
    },
    {
      title: 'UiPath Marketing Strategy',
      tags: ['ESSEC', 'B2B Marketing'],
      detail: {
        type: 'pdf',
        pdfUrl: 'assets/work/essec-growthx/uipath-marketing-strategy.pdf'
      }
    },
    {
      title: 'Groww Onboarding Breakdown',
      tags: ['GrowthX', 'Onboarding'],
      detail: {
        type: 'pdf',
        pdfUrl: 'assets/work/essec-growthx/groww-onboarding-breakdown.pdf'
      }
    }
  ],
  personal: [
    {
      title: 'Data Jobs Dashboard - PowerBI',
      tags: ['PowerBI', 'BI', 'Analytics', 'Dashboard'],
      icon: 'chart',
      detail: {
        type: 'link',
        url: 'https://github.com/deathkiller99/Data_Jobs_Dashboard',
        downloadUrl: 'assets/work/personal/Data_Jobs_Dashboard.pbix',
        downloadLabel: 'Download .pbix'
      }
    }
  ]
};
