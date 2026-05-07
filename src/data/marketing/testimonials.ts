// Synthetic v1 testimonials — placeholders shaped like real users until real
// quotes come in from V-A early adopters. Founder-approved decisions:
//
//   - Mix of EN / HI / Hinglish so the page reads as Indian-first, not a
//     translated US product.
//   - Plausible Indian student personas: mix of cities, names, and prep
//     contexts (employed, student, switching careers).
//   - **Process-focused, never outcome-claiming.** Quotes describe what the
//     user *did* with the site, not "passed on first try thanks to this".
//     We have no proof of outcomes; outcome claims would be deceptive.
//
// Swap individual entries 1-by-1 as real quotes opt in. The structure stays.

export type Testimonial = {
  id: string;
  quote: string;
  /** ISO 639-1 code, used to style Hindi/Hinglish with the right font + lang. */
  lang: 'en' | 'hi' | 'hi-en';
  name: string;
  city: string;
  /** Short tag like "V-A · MFD" — what they're prepping for. */
  prepTag: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'priya-mumbai',
    quote: 'The Number Sheet alone is worth the signup. I print it and revise on the train.',
    lang: 'en',
    name: 'Priya Sharma',
    city: 'Mumbai',
    prepTag: 'V-A · MFD',
  },
  {
    id: 'rahul-pune',
    quote: 'Mock tests yahaan asli Schoolnet jaise feel hote hain — exam day pe surprise nahi hua.',
    lang: 'hi-en',
    name: 'Rahul Joshi',
    city: 'Pune',
    prepTag: 'V-A · MFD',
  },
  {
    id: 'ananya-bengaluru',
    quote: 'Topic mastery dashboard told me exactly which 3 topics to drill. Saved me a week.',
    lang: 'en',
    name: 'Ananya Reddy',
    city: 'Bengaluru',
    prepTag: 'V-A · MFD',
  },
  {
    id: 'vikram-delhi',
    quote: 'पढ़ाई के तीनों फॉर्मेट — Summary, Core, Memory — बहुत clear हैं।',
    lang: 'hi',
    name: 'Vikram Singh',
    city: 'Delhi',
    prepTag: 'V-A · MFD',
  },
  {
    id: 'meera-hyderabad',
    quote: 'Common Traps section caught two assumptions I would have walked into.',
    lang: 'en',
    name: 'Meera Iyer',
    city: 'Hyderabad',
    prepTag: 'V-A · MFD',
  },
  {
    id: 'arjun-chennai',
    quote: 'Free chapter mein hi pata chal gaya quality strong hai. Login karke baaki padha.',
    lang: 'hi-en',
    name: 'Arjun Krishnan',
    city: 'Chennai',
    prepTag: 'V-A · MFD',
  },
];

/** Convert a name to compact initials for the avatar circle. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0]![0] ?? '?').toUpperCase();
  return (
    (parts[0]![0] ?? '').toUpperCase() +
    (parts[parts.length - 1]![0] ?? '').toUpperCase()
  );
}
