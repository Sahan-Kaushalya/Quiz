import { Mail, Phone, MapPin } from 'lucide-react';
import logoicon from '../assets/icons/logo.png';

const FOOTER_LINK_GROUPS = [
  {
    title: 'Subjects',
    links: ['Mathematics', 'Sinhala', 'Environment', 'IQ Tests'],
  },
  {
    title: 'Company',
    links: ['Privacy Policy', 'Terms of Service', 'Help Center', 'Contact Us'],
  },
];

const CONTACT_ITEMS = [
  { icon: Mail, value: 'hello@quizmaster.lk' },
  { icon: Phone, value: '+94 77 123 4567' },
  { icon: MapPin, value: 'Colombo, Sri Lanka' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">
                <img src={logoicon} alt="Quiz Master logo" className="h-8 w-auto" />
              </span>
              <span className="text-xl font-black text-indigo-700">Quiz Master</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              The fun way to prepare for the Grade 5 scholarship exam. ශිෂ්‍යත්ව ජය මග.
            </p>
          </div>

          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-900">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 transition-colors hover:text-indigo-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-900">Contact</h4>
            <ul className="space-y-3">
              {CONTACT_ITEMS.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-start gap-2 text-sm text-gray-500">
                  <Icon size={14} className="mt-0.5 shrink-0 text-indigo-400" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 md:flex-row">
          <p className="text-sm text-gray-400">© 2026 Quiz Master Adventure. All rights reserved.</p>
          <p className="text-sm font-semibold text-indigo-400">Made for Sri Lankan students</p>
        </div>
      </div>
    </footer>
  );
}