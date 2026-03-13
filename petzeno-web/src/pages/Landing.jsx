import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Shield, Users, Heart, ArrowRight, CheckCircle, Zap, Globe, Lock,
  PawPrint, Star, MessageCircle, Info, ChevronDown, Activity,
  Search, Calendar, ShoppingBag, PlusCircle, Sun, Moon, Languages, Volume2, ChevronUp,
  Mail, MessageSquare, Linkedin, Twitter
} from 'lucide-react';
import styles from './Landing.module.css';

const TextReveal = ({ children, className }) => (
  <motion.span className={`text-reveal ${className}`}>
    <motion.span
      className="text-reveal-content"
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
    >
      {children}
    </motion.span>
  </motion.span>
);

const FloatingIcon = ({ icon: Icon, delay, initialX, initialY }) => (
  <motion.div
    className={styles.floatingIcon}
    initial={{ x: initialX, y: initialY, opacity: 0 }}
    animate={{
      y: [initialY, initialY - 20, initialY],
      opacity: [0, 0.6, 0]
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    <Icon size={32} color="var(--color-primary)" strokeWidth={1} />
  </motion.div>
);

const StatItem = ({ num, label, icon: Icon, delay }) => (
  <motion.div
    className={styles.statItem}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
  >
    <div className={styles.statIconBox}>
      <Icon size={24} color="var(--color-primary)" />
    </div>
    <div className={styles.statContent}>
      <h3 className={styles.statNum}>{num}</h3>
      <p className={styles.statLabel}>{label}</p>
    </div>
  </motion.div>
);

const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
      <motion.div
        className={styles.spotlight}
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([x, y]) => `radial-gradient(600px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,107,107,0.1), transparent 40%)`
          )
        }}
      />
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <TiltCard className={styles.featureCard}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={styles.featureCardInner}
    >
      <div className={styles.featureIcon}>
        <Icon size={28} />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      <div className={styles.featurePaw}>
        <PawPrint size={120} />
      </div>
      <div className={styles.spotlight} />
    </motion.div>
  </TiltCard>
);

const TestimonialCard = ({ quote, name, role, image, delay }) => (
  <TiltCard className={styles.testimonialCard}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className={styles.testimonialHeader}>
        <div className={styles.testimonialImage}>
          <img src={image} alt={name} />
        </div>
        <div>
          <h4 className={styles.testimonialName}>{name}</h4>
          <p className={styles.testimonialRole}>{role}</p>
        </div>
      </div>
      <p className={styles.testimonialQuote}>"{quote}"</p>
      <div className={styles.quoteIcon}>
        <MessageCircle size={24} color="var(--color-primary-soft)" fill="var(--color-primary-soft)" />
      </div>
    </motion.div>
  </TiltCard>
);

const FAQItem = ({ question, answer, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
      <button className={styles.faqHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.faqIcon}>
          <Icon size={20} />
        </div>
        <span className={styles.faqHeaderText}>{question}</span>
        <motion.div className={styles.faqChevron} animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.faqContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={styles.faqAnswerText}>{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PartnerTicker = () => {
  const partners = [
    { name: "PetGo", logo: Shield },
    { name: "VetCare", logo: Activity },
    { name: "SafePaws", logo: Lock },
    { name: "HappyTails", logo: Heart },
    { name: "GreenVet", logo: Zap },
    { name: "AnimalAid", logo: Globe }
  ];

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerHeader}>Trusted by India's Top Organizations</div>
      <div className={styles.tickerTrack}>
        <motion.div
          className={styles.tickerContent}
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {duplicatedPartners.map((p, idx) => (
            <div key={idx} className={styles.partnerLogo}>
              <div className={styles.partnerIconBox}>
                <p.logo size={24} />
              </div>
              <span className={styles.partnerName}>{p.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState('general');

  const faqData = {
    general: [
      { q: "Is PetZeno free for pet owners?", a: "Absolutely! PetZeno is free for pet owners. You can search for verified vets, book appointments, and manage all your pet's health records at no cost.", icon: Heart },
      { q: "How is my pet's medical data secured?", a: "We use enterprise-grade end-to-end encryption to ensure that your pet's medical history is only accessible to you and the veterinarians you share it with.", icon: Lock }
    ],
    parents: [
      { q: "Can I manage multiple pets on one account?", a: "Yes! You can add multiple pet profiles under a single account, each with their own unique medical history, vaccination records, and appointment schedules.", icon: Users },
      { q: "What happens if I have an emergency?", a: "The PetZeno app features a dedicated 'Emergency' button that instantly lists the nearest 24/7 animal hospitals and available emergency vet clinics in your area.", icon: Zap },
      { q: "Does PetZeno support pet adoption?", a: "Yes! We partner with verified shelters across India to showcase pets available for adoption. You can view profiles, chat with shelter directors, and start the adoption process directly through the app.", icon: Globe }
    ],
    providers: [
      { q: "How do I register as a Veterinary Provider?", a: "Click on the 'Join as Provider' button, fill in your clinic's details, and upload your professional certifications. Our team will verify your documents within 24-48 hours.", icon: Shield },
      { q: "Are all service providers on the platform verified?", a: "Yes, every veterinarian, shelter, and store owner must go through a manual verification process, including background checks and license validation, before joining our network.", icon: CheckCircle },
      { q: "Can I switch between an Owner and a Provider profile?", a: "Currently, Owner and Provider accounts are separate to maintain data integrity. However, you can use the same email address to register for both roles with distinct profiles.", icon: Activity }
    ]
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqCategoryTabs}>
        {['general', 'parents', 'providers'].map((tab) => (
          <button
            key={tab}
            className={`${styles.faqCategoryBtn} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={styles.faqList}
      >
        {faqData[activeTab].map((item, idx) => (
          <FAQItem
            key={idx}
            question={item.q}
            answer={item.a}
            icon={item.icon}
          />
        ))}
      </motion.div>
    </div>
  );
};

const PetUniverse = () => {
  const items = [
    { title: "Digital Health Card", desc: "Centralized medical records, vaccination history, and custom health reminders.", img: "/indian_vet.png" },
    { title: "Smart Adoption", desc: "AI-driven matchmaking connecting shelters and loving homes across the nation.", img: "/indian_owner.png" },
    { title: "Emergency SOS", desc: "Immediate access to urgent veterinary assistance and 24/7 clinic locations.", img: "/petzeno_landing_hero.png" },
    { title: "Pet Supply Store", desc: "Integrated dashboard for premium gear, nutrition, and provider inventory sync.", img: "/petzeno-logo.png" }
  ];

  return (
    <section id="universe" className={styles.universeSection}>
      <motion.div
        className={styles.universeHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>
          The Pet <span className="shimmer-3d">Super App</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          A unified digital ecosystem ending fragmentation. Seamlessly connecting pet parents, elite vets, and shelters on a single, centralized platform.
        </p>
      </motion.div>

      <div className={styles.universePortals}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={styles.immersivePortal}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.portalMedia}>
              <img src={item.img} alt={item.title} className={styles.portalImage} />
              <div className={styles.portalOverlay} />
            </div>
            <div className={styles.portalContent}>
              <h3 className={styles.portalTitle}>{item.title}</h3>
              <p className={styles.portalDesc}>{item.desc}</p>
              <div className={styles.portalAction}>
                <span>Explore</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const QuickContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    { icon: Mail, label: 'Email Support', href: 'mailto:support@petzeno.com' },
    { icon: Activity, label: 'Emergency Kit', href: '#' },
    { icon: Heart, label: 'Donate Now', href: '#' }
  ];

  return (
    <div className={styles.quickContactWrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.contactMenu}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {contacts.map((c, idx) => (
              <motion.a
                key={idx}
                href={c.href}
                className={styles.contactItem}
                whileHover={{ x: -10, backgroundColor: 'var(--color-bg-subtle)' }}
              >
                <c.icon size={18} />
                <span>{c.label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className={`${styles.contactTrigger} ${isOpen ? styles.active : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Contact"
      >
        {isOpen ? <PlusCircle size={24} style={{ transform: 'rotate(45deg)' }} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="community" className={styles.newsletterSection}>
      <motion.div
        className={`${styles.newsletterBox} glass-effect`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterIcon}><motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Mail size={40} color="var(--color-primary)" /></motion.div></div>
          <h2>Join the Elite Pet Club</h2>
          <p>Get exclusive updates, vet-verified pet care tips, and early access to new PetZeno features.</p>

          {status !== 'success' ? (
            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.newsletterBtn}
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join Now'}
              </motion.button>
            </form>
          ) : (
            <motion.div
              className={styles.successMessage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <CheckCircle size={32} color="var(--color-success)" />
              <span>Welcome to the club! Check your inbox soon.</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

const ConnectionRoadmap = ({ title }) => {
  const points = [
    { id: 'sos', label: 'Emergency SOS', icon: Activity, x: '20%', y: '15%', color: '#ef4444' }, // Red
    { id: 'parents', label: 'Pet Parents', icon: Heart, x: '10%', y: '50%', color: '#ec4899' }, // Pink
    { id: 'training', label: 'Pro Training', icon: Zap, x: '20%', y: '85%', color: '#8b5cf6' }, // Purple
    { id: 'shops', label: 'Pet Stores', icon: ShoppingBag, x: '80%', y: '15%', color: '#f59e0b' }, // Amber
    { id: 'vets', label: 'Veterinarians', icon: PlusCircle, x: '90%', y: '50%', color: '#10b981' }, // Emerald
    { id: 'labs', label: 'Diagnostic Labs', icon: Search, x: '80%', y: '85%', color: '#3b82f6' }, // Blue
    { id: 'core', label: 'PetZeno Core', icon: Zap, x: '50%', y: '50%', main: true, color: '#f97316' } // Orange
  ];

  return (
    <section className={styles.roadmapSection}>
      <div className={styles.centeredHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>Connecting every node in the pet care universe through a central verified hub.</p>
      </div>
      <div className={styles.roadmapContainer}>
        <svg className={styles.roadmapSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Central Hub Connections */}
          {points.filter(p => !p.main).map((p, i) => {
            const xVal = parseFloat(p.x);
            const yVal = parseFloat(p.y);
            const path = `M ${xVal} ${yVal} L 50 50`;
            return (
              <React.Fragment key={p.id}>
                {/* Static Background Path */}
                <motion.path
                  d={path}
                  stroke={p.color}
                  strokeWidth="0.2"
                  style={{ strokeOpacity: 0.15 }}
                  fill="none"
                />
                {/* Animated Entrance Path */}
                <motion.path
                  d={path}
                  stroke={p.color}
                  strokeWidth="0.4"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
                {/* Data Pulse (Color Matched) */}
                <motion.circle
                  r="0.5"
                  fill={p.color}
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.4
                  }}
                  style={{
                    offsetPath: `path("${path}")`,
                    filter: `drop-shadow(0 0 4px ${p.color})`
                  }}
                />
              </React.Fragment>
            );
          })}
        </svg>

        {points.map((p, idx) => (
          <motion.div
            key={p.id}
            className={`${styles.roadmapNode} ${p.main ? styles.nodeMain : ''}`}
            style={{
              left: p.x,
              top: p.y,
              '--node-color': p.color
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: idx * 0.1
            }}
          >
            <div className={styles.nodeIconWrapper}>
              <div className={styles.nodeIcon} style={{ borderColor: p.main ? 'transparent' : `${p.color}44`, color: p.color }}>
                <p.icon size={p.main ? 36 : 24} />
                {!p.main && <div className={styles.nodeAura} style={{ background: p.color }} />}
              </div>
              {p.main && <div className={styles.nodePulse} style={{ background: `${p.color}66` }}></div>}
            </div>
            <div className={styles.nodeLabel}>{p.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const TeamSection = ({ title }) => {
  const team = [
    { name: "Debraj Naik", role: "Team Leader, Lead Archirect, Backend", image: "/team/debraj.jpg" },
    { name: "Ajay Bala", role: "Full Stack Developer", image: "/team/ajay.jpg" },
    { name: "Jems Manjit Sahu", role: "UI/UX & Frontend Specialist", image: "/team/naren.jpg" },
    { name: "Naren Kumar Biswal", role: "Research", image: "/team/jems.jpg" },
    { name: "Sushree Dash", role: "Product Strategy & Operations", image: "/team/sushree.jpg" }
  ];

  return (
    <section id="team" className={styles.teamSection}>
      <div className={styles.centeredHeader}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={styles.badge}
          style={{ margin: '0 auto 1.5rem auto' }}
        >
          <Users size={14} />
          <span>The Architects</span>
        </motion.div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>Meet the visionaries building the world's most advanced pet care ecosystem.</p>
      </div>

      <div className={styles.teamGrid}>
        {team.map((member, idx) => (
          <TiltCard key={idx} className={styles.teamCardContainer}>
            <motion.div
              className={styles.teamCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className={styles.teamImgBox}>
                <img src={member.image} alt={member.name} />
                <div className={styles.teamImgOverlay}></div>
                <div className={styles.teamSocials}>
                  <motion.a href="#" whileHover={{ y: -3, color: '#0077b5' }}><Linkedin size={18} /></motion.a>
                  <motion.a href="#" whileHover={{ y: -3, color: '#1DA1F2' }}><Twitter size={18} /></motion.a>
                </div>
              </div>
              <div className={styles.teamInfo}>
                <div className={styles.teamRoleBadge}>{member.role.split(' ')[0]}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className={styles.cardGlow} />
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('en');
  const { scrollYProgress } = useScroll();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.05
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = (id) => {
    if (lenisRef.current) {
      const target = document.querySelector(id);
      if (target) {
        lenisRef.current.scrollTo(target, {
          offset: -100,
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLang = () => {
    if (lang === 'en') setLang('hi');
    else if (lang === 'hi') setLang('or');
    else setLang('en');
  };

  const readPage = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `
      ${content.heroTitle}. 
      ${content.heroSubtitle}. 
      ${content.stakeholderTitle}. 
      ${content.stakeholderSubtitle}.
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    if (lang === 'en') utterance.lang = 'en-US';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'or-IN';

    utterance.onend = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const t = {
    en: {
      heroTitle: "The Complete Pet Care Super App",
      heroSubtitle: "A unified digital platform connecting pet owners, veterinarians, shelters, and businesses. Seamlessly manage health records, appointments, and adoptions in a single ecosystem.",
      downloadApp: "Download the App",
      joinProvider: "Join as Provider",
      futureBadge: "The Complete Pet Ecosystem",
      features: "Features",
      process: "Process",
      reviews: "Reviews",
      community: "Community",
      support: "Support",
      providerPortal: "Provider Portal",
      stakeholderTitle: "Built for every stakeholder",
      stakeholderSubtitle: "Tailored digital tools for everyone in the pet care journey.",
      faqTitle: "Frequently Asked Questions",
      meetTeam: "Meet the Founders & Team",
      roadmapTitle: "The Integrated Pet Ecosystem",
      themeTip: "Switch Theme",
      langTip: "Change Language",
      voiceTip: "Listen to Page"
    },
    hi: {
      heroTitle: "संपूर्ण पेट केयर सुपर ऐप",
      heroSubtitle: "पालतू जानवरों के मालिकों, पशु चिकित्सकों, आश्रयों और व्यवसायों को जोड़ने वाला एक एकीकृत डिजिटल प्लेटफ़ॉर्म। एक ही इकोसिस्टम में स्वास्थ्य रिकॉर्ड, अपॉइंटमेंट और गोद लेने का सहजता से प्रबंधन करें।",
      downloadApp: "ऐप डाउनलोड करें",
      joinProvider: "प्रदाता के रूप में जुड़ें",
      futureBadge: "संपूर्ण पेट केयर इकोसिस्टम",
      features: "विशेषताएं",
      process: "प्रक्रिया",
      reviews: "समीक्षाएं",
      community: "कम्युनिटी",
      support: "सहायता",
      providerPortal: "प्रदाता पोर्टल",
      stakeholderTitle: "हर हितधारक के लिए बनाया गया",
      stakeholderSubtitle: "पेट केयर यात्रा में सभी के लिए तैयार किए गए डिजिटल उपकरण।",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
      meetTeam: "संस्थापकों और टीम से मिलें",
      roadmapTitle: "एकीकृत पालतू पारिस्थितिकी तंत्र",
      themeTip: "थीम बदलें",
      langTip: "भाषा बदलें",
      voiceTip: "पेज सुनें"
    },
    or: {
      heroTitle: "ସମ୍ପୂର୍ଣ୍ଣ ପେଟ୍ କେୟାର ସୁପର ଆପ୍",
      heroSubtitle: "ପୋଷା ପ୍ରାଣୀ ମାଲିକ, ପଶୁ ଚିକିତ୍ସକ, ଆଶ୍ରୟସ୍ଥଳୀ ଏବଂ ବ୍ୟବସାୟଗୁଡ଼ିକୁ ସଂଯୋଗ କରୁଥିବା ଏକ ଏକୀକୃତ ଡିଜିଟାଲ୍ ପ୍ଲାଟଫର୍ମ। ଗୋଟିଏ ଇକୋସିଷ୍ଟମରେ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ, ଆପଏଣ୍ଟମେଣ୍ଟ ଏବଂ ପୋଷ୍ୟଗ୍ରହଣକୁ ସହଜରେ ପରିଚାଳନା କରନ୍ତୁ।",
      downloadApp: "ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
      joinProvider: "ପ୍ରଦାନକାରୀ ଭାବରେ ଯୋଗ ଦିଅନ୍ତୁ",
      futureBadge: "ସମ୍ପୂର୍ଣ୍ଣ ପେଟ୍ ଇକୋସିଷ୍ଟମ୍",
      features: "ବୈଶିଷ୍ଟ୍ୟ",
      process: "ପ୍ରକ୍ରିୟା",
      reviews: "ସମୀକ୍ଷା",
      community: "ସମ୍ପ୍ରଦାୟ",
      support: "ସହାୟତା",
      providerPortal: "ପ୍ରଦାନକାରୀ ପୋର୍ଟାଲ୍",
      stakeholderTitle: "ପ୍ରତ୍ୟେକ ହିତାଧିକାରୀଙ୍କ ପାଇଁ ନିର୍ମିତ",
      stakeholderSubtitle: "ପୋଷା ଯତ୍ନ ଯାତ୍ରାରେ ସମସ୍ତଙ୍କ ପାଇଁ ପ୍ରସ୍ତୁତ ଡିଜିଟାଲ୍ ଉପକରଣ |",
      faqTitle: "ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ",
      meetTeam: "ପ୍ରତିଷ୍ଠାତା ଏବଂ ଦଳକୁ ଭେଟନ୍ତୁ",
      roadmapTitle: "ସମନ୍ୱିତ ପୋଷା ପରିସଂସ୍ଥାନ",
      themeTip: "ଥିମ୍ ବଦଳାନ୍ତୁ",
      langTip: "ଭାଷା ବଦଳାନ୍ତୁ",
      voiceTip: "ପୃଷ୍ଠା ଶୁଣନ୍ତୁ"
    }
  };

  const content = t[lang];

  return (
    <div className={styles.landingContainer}>
      <div className="noise-overlay" />
      <QuickContact />
      <div className={styles.bgDecorations}>
        <FloatingIcon icon={PawPrint} delay={0} initialX="10vw" initialY="20vh" />
        <FloatingIcon icon={Heart} delay={1.5} initialX="85vw" initialY="15vh" />
        <FloatingIcon icon={Star} delay={0.8} initialX="15vw" initialY="70vh" />
        <FloatingIcon icon={PawPrint} delay={2.2} initialX="80vw" initialY="80vh" />
        {/* 3D Floating Orbs */}
        <div className="orb orb-primary" style={{ width: '400px', height: '400px', top: '-10%', right: '-5%' }} />
        <div className="orb orb-teal" style={{ width: '300px', height: '300px', bottom: '10%', left: '-8%' }} />
        <div className="orb orb-blue" style={{ width: '250px', height: '250px', top: '40%', right: '20%' }} />
      </div>

      <nav className={`${styles.nav} glass-effect`}>
        <div className={styles.navBrand}>
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { duration: 1.5 });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className={styles.logoIcon}>
              <img src="/petzeno-logo.png" alt="PetZeno" className={styles.brandLogo} />
            </div>
            <span>PetZeno</span>
          </motion.div>
        </div>

        <div className={styles.navLinks}>
          <motion.a href="#universe" whileHover={{ y: -2 }} onClick={(e) => { e.preventDefault(); scrollToSection('#universe'); }}>{content.features}</motion.a>
          <motion.a href="#how-it-works" whileHover={{ y: -2 }} onClick={(e) => { e.preventDefault(); scrollToSection('#how-it-works'); }}>{content.process}</motion.a>
          <motion.a href="#community" whileHover={{ y: -2 }} onClick={(e) => { e.preventDefault(); scrollToSection('#community'); }}>{content.community}</motion.a>
          <motion.a href="#testimonials" whileHover={{ y: -2 }} onClick={(e) => { e.preventDefault(); scrollToSection('#testimonials'); }}>{content.reviews}</motion.a>
          <motion.a href="#support" whileHover={{ y: -2 }} onClick={(e) => { e.preventDefault(); scrollToSection('#support'); }}>{content.support}</motion.a>
        </div>

        <div className={styles.navControls}>

          <div className={styles.controlWrapper} data-tooltip={content.themeTip}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>
          </div>

          <div className={styles.controlWrapper} data-tooltip={content.voiceTip}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.voiceToggle}
              onClick={readPage}
              aria-label="Read Page"
            >
              <Volume2 size={18} className={isSpeaking ? styles.pulseIcon : ''} />
            </motion.button>
          </div>

          <div className={styles.controlWrapper} data-tooltip={content.langTip}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.langToggle}
              onClick={toggleLang}
              aria-label="Switch Language"
            >
              <Languages size={18} />
              <span>{lang.toUpperCase()}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className={styles.loginBtn}
          >
            {content.providerPortal}
          </motion.button>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className="perspective-grid" />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Zap size={14} />
            <span>{content.futureBadge}</span>
          </motion.div>

          <h1 className={`${styles.heroTitle} elite-heading text-reveal`}>
            {lang === 'en' ? (
              <>
                <TextReveal className="shimmer-3d">The Complete Pet Care</TextReveal>
                <div className={styles.heroLineTwo}>
                  <TextReveal>Super App Ecosystem</TextReveal>
                </div>
              </>
            ) : (
              <TextReveal>{content.heroTitle}</TextReveal>
            )}
          </h1>

          <p className={styles.heroSubtitle}>
            {content.heroSubtitle}
          </p>

          <div className={styles.heroBtns}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-primary)' }}
              whileTap={{ scale: 0.95 }}
              className={`${styles.primaryBtn} glow-ring`}
            >
              {content.downloadApp}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className={styles.secondaryBtn}
            >
              {content.joinProvider} <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className={styles.heroImageContainer}
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="morph-blob" style={{ width: '120%', height: '120%', top: '-10%', left: '-10%', background: 'linear-gradient(135deg, rgba(255,123,84,0.15), rgba(45,212,191,0.1))' }} />
          <div className={styles.imageBlob}></div>
          <img src="/petzeno_landing_hero.png" alt="Happy pets" className={styles.heroImage} />

          <motion.div
            className={`${styles.statsFloating} glass-effect`}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={styles.statsIcon}>
              <Users size={20} color="white" />
            </div>
            <div>
              <div className={styles.statsNum}>50k+</div>
              <div className={styles.statsLabel}>Verified Users</div>
            </div>
          </motion.div>
        </motion.div>
      </header>
      <PartnerTicker />

      <PetUniverse />

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <StatItem icon={Heart} num="12k+" label="Pets Saved" delay={0.1} />
          <StatItem icon={PlusCircle} num="450+" label="Vet Clinics" delay={0.2} />
          <StatItem icon={Users} num="50k+" label="Community Members" delay={0.3} />
          <StatItem icon={Activity} num="99.9%" label="Reliability" delay={0.4} />
        </div>
      </section>

      <section id="features" className={styles.featuresSection}>
        <div className="orb orb-teal" style={{ width: '350px', height: '350px', top: '20%', left: '-10%', opacity: 0.15, zIndex: -1 }} />
        <div className="orb orb-primary" style={{ width: '300px', height: '300px', bottom: '10%', right: '-5%', opacity: 0.15, zIndex: -1 }} />
        <motion.div
          className={styles.centeredHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>{content.stakeholderTitle}</h2>
          <p className={styles.sectionSubtitle}>{content.stakeholderSubtitle}</p>
        </motion.div>

        <div className={styles.featuresGrid}>
          <FeatureCard
            index={0}
            icon={Shield}
            title="Veterinary Ecosystem"
            description="Complete clinic operations, medical records, and appointment scheduling with 100% data integrity."
          />
          <FeatureCard
            index={1}
            icon={Activity}
            title="Digital Health Cards"
            description="Secure pet profiles and digital health cards to store complete medical history, vaccination records, and health reminders."
          />
          <FeatureCard
            index={2}
            icon={Heart}
            title="Shelter Intelligence"
            description="Manage adoptions, track pet availability, and find loving homes with AI-driven matching."
          />
          <FeatureCard
            index={3}
            icon={Globe}
            title="Ecosystem Dashboards"
            description="Integrated inventory management for pet stores and advanced analytics for providers with global sync."
          />
          <FeatureCard
            index={4}
            icon={Zap}
            title="Emergency SOS"
            description="One-tap access to emergency pet services, urgent veterinary assistance, and critical care transportation."
          />
          <FeatureCard
            index={5}
            icon={Lock}
            title="Pet Passport"
            description="A secure, digital identity for your pet, valid across the entire verified ecosystem."
          />
        </div>
      </section>

      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.centeredHeader}>
          <h2 className={styles.sectionTitle}>How PetZeno Works</h2>
          <p className={styles.sectionSubtitle}>A seamless experience for pet owners and care providers.</p>
        </div>

        <div className={styles.roadmapWrapper}>
          <div className={styles.roadmapLineContainer}>
            <svg className={styles.roadmapSvgLine} viewBox="0 0 4 100" preserveAspectRatio="none">
              <motion.path
                d="M 2 0 L 2 100"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeDasharray="10,10"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {[
            { icon: Search, title: "Create Profile", desc: "Digital health card banayein aur medical history aur vaccination records ek jagah manage karein." },
            { icon: Calendar, title: "Book & Remind", desc: "Appointments schedule karein aur autonomous vaccination aur health reminders payein." },
            { icon: ShoppingBag, title: "Manage Dashboards", desc: "Clinics, shelters aur shops ke liye web-based management panels ka upyog karein." },
            { icon: Zap, title: "Emergency SOS", desc: "Kisi bhi urgent situation mein one-tap SOS button use karke emergency assistance payein." }
          ].map((item, idx) => (
            <div key={idx} className={`${styles.stepWrapper} ${idx % 2 === 0 ? styles.stepWrapperLeft : styles.stepWrapperRight}`}>
              <motion.div
                className={styles.stepCard}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className={styles.stepNumber}>0{idx + 1}</div>
                <div className={styles.stepIcon}><item.icon size={32} /></div>
                <div className={styles.stepDot} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.centeredHeader}>
          <h2 className={styles.sectionTitle}>Trusted by the Community</h2>
          <p className={styles.sectionSubtitle}>Hear from pet parents, elite vets, and verified shelters using our complete ecosystem every day.</p>
        </div>
        <div className={styles.testimonialsGrid}>
          <TestimonialCard
            name="Dr. Ananya Iyer"
            role="Chief Vet, Paws & Claws"
            quote="PetZeno's web dashboard completely transformed our clinic. Managing operations, tracking digital health cards, and booking vaccinations is now entirely seamless."
            image="/indian_vet.png"
            delay={0.1}
          />
          <TestimonialCard
            name="Rahul Malhotra"
            role="Pet Parent"
            quote="The emergency SOS feature alone makes this application a lifesaver. Plus, having all vaccination reminders and medical records in one place is incredibly convenient."
            image="/indian_owner.png"
            delay={0.2}
          />
          <TestimonialCard
            name="Kavita Reddy"
            role="Shelter Director"
            quote="Since deploying the shelter management panel, our adoptions have increased by 40%. Tracking availability and matching pets with loving owners has never been easier."
            image="https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita"
            delay={0.3}
          />
        </div>
      </section>



      <ConnectionRoadmap title={content.roadmapTitle} />
      <TeamSection title={content.meetTeam} />

      <section id="support" className={styles.faqSection}>
        <div className={styles.centeredHeader}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={styles.badge}
            style={{ margin: '0 auto 1rem' }}
          >
            <MessageSquare size={14} />
            <span>Support Center</span>
          </motion.div>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Everything you need to know about India's most advanced pet ecosystem.</p>
        </div>

        <FAQSection />
      </section>

      <Newsletter />
      <section className={styles.finalCTA}>
        <div className={styles.ctaGlow} />
        <motion.div
          className={styles.ctaBox}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className={styles.ctaBadge}>
            <Zap size={14} />
            <span>Limited Beta Access</span>
          </div>
          <h2 className="shimmer-3d">Join the Pet Revolution in India</h2>
          <p>
            Experience the future of pet care. Whether you're a pet parent seeking elite care
            or a provider looking to scale, PetZeno is your gateway to a unified ecosystem.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaPrimary}>
              <span>Get Started Now</span>
              <ArrowRight size={18} />
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate('/login')}>
              Partner Gateway
            </button>
          </div>

          <div className={styles.ctaTrust}>
            <p>Trusted by 500+ Veterinary Clinics across India</p>
            <div className={styles.trustLogos}>
              <Shield size={16} />
              <span>Enterprise-Grade Security</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="security" className={styles.securitySection}>
        <motion.div
          className={styles.securityBox}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.scanningLine} />
          <div className={styles.securityIcon}>
            <Shield size={36} color="white" />
          </div>
          <h2 className="shimmer-3d">Verified Professional Network</h2>
          <p>
            To eliminate fraudulent services and ensure elite care standards, we manually verify every single provider.
            Vets and shelters must undergo rigorous background checks and document validation before joining the PetZeno ecosystem.
          </p>
          <div className={styles.securitySteps}>
            {[
              "Join Network",
              "Document Verification",
              "Gateway Access"
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className={styles.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (idx * 0.2) }}
                viewport={{ once: true }}
              >
                <CheckCircle size={20} color="var(--color-success)" />
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGlow} />

        <div className={styles.footerTop}>
          <div className={styles.footerBrandSection}>
            <div className={styles.footerBrand}>
              <img src="/petzeno-logo.png" alt="PetZeno" className={styles.footerLogo} />
              <span>PetZeno</span>
            </div>
            <p className={styles.footerDesc}>
              The ultimate Pet Care Super App integrating health cards, adoption, store inventory, and emergency services into one seamless global ecosystem.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="GitHub"><Globe size={20} /></a>
            </div>
          </div>

          <div className={styles.footerLinksGrid}>
            <div className={styles.footerLinks}>
              <h4>Ecosystem</h4>
              <a href="#features">Pet Parent Portal</a>
              <a href="#features">Provider Gateway</a>
              <a href="#features">Shelter Network</a>
              <a href="#features">Marketplace API</a>
            </div>
            <div className={styles.footerLinks}>
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#team">Founders & Team</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact Support</a>
            </div>
            <div className={styles.footerLinks}>
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
              <a href="#security">Security Protocol</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p>&copy; {new Date().getFullYear()} PetZeno Corporate Ecosystem. All rights reserved.</p>
            <div className={styles.footerBottomLinks}>
              <a href="#status">System Status: <span className={styles.statusDot}></span> Operational</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
