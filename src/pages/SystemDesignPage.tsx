import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Server,
  Scale,
  Database,
  Zap,
  MessageSquare,
  Globe,
  Shield,
} from 'lucide-react';

interface Concept {
  id: number;
  title: string;
  icon: React.ReactNode;
  summary: string;
  details: string[];
  examples: string[];
  color: string;
}

const concepts: Concept[] = [
  {
    id: 1,
    title: 'Horizontal Scaling',
    icon: <Server className="w-7 h-7" />,
    summary: 'Adding more servers instead of making one server more powerful.',
    details: [
      'Scale out by adding identical server instances.',
      'Provides better performance and fault tolerance.',
      'Each node shares the load equally.',
    ],
    examples: ['1 server → 10 servers handling traffic together'],
    color: 'rose',
  },
  {
    id: 2,
    title: 'Load Balancer',
    icon: <Scale className="w-7 h-7" />,
    summary: 'Distributes incoming requests across multiple servers evenly.',
    details: [
      'Prevents any single server from being overloaded.',
      'Supports health checks to route only to healthy nodes.',
      'Can use round-robin, least-connections, or IP-hash strategies.',
    ],
    examples: ['User requests → Load Balancer → Server 1, Server 2, Server 3'],
    color: 'pink',
  },
  {
    id: 3,
    title: 'Database Sharding',
    icon: <Database className="w-7 h-7" />,
    summary: 'Splits a large database into smaller, independent shards.',
    details: [
      'Each shard holds a subset of the total data.',
      'Reduces query load on any single database node.',
      'Shard key selection is critical for even distribution.',
    ],
    examples: [
      'Shard 1: Users A–H',
      'Shard 2: Users I–P',
      'Shard 3: Users Q–Z',
    ],
    color: 'fuchsia',
  },
  {
    id: 4,
    title: 'Caching',
    icon: <Zap className="w-7 h-7" />,
    summary: 'Stores frequently accessed data in fast in-memory storage.',
    details: [
      'Dramatically reduces latency compared to database reads.',
      'Common strategies: cache-aside, write-through, write-back.',
      'Requires a cache invalidation policy (TTL, LRU, etc.).',
    ],
    examples: [
      'Redis, Memcached',
      'Frequently viewed product details served from cache',
    ],
    color: 'rose',
  },
  {
    id: 5,
    title: 'Message Queues',
    icon: <MessageSquare className="w-7 h-7" />,
    summary: 'Handles background tasks asynchronously via a queue.',
    details: [
      'Decouples producers from consumers for resilience.',
      'Enables retry logic and dead-letter queues.',
      'Ideal for emails, notifications, image processing, payments.',
    ],
    examples: ['RabbitMQ', 'Apache Kafka', 'Amazon SQS'],
    color: 'pink',
  },
  {
    id: 6,
    title: 'CDN (Content Delivery Network)',
    icon: <Globe className="w-7 h-7" />,
    summary: 'Serves static content from edge nodes closest to the user.',
    details: [
      'Reduces latency by minimising geographic distance.',
      'Caches images, CSS, JavaScript, and video at the edge.',
      'Offloads traffic from origin servers.',
    ],
    examples: ['Cloudflare', 'Akamai', 'Amazon CloudFront'],
    color: 'fuchsia',
  },
  {
    id: 7,
    title: 'Rate Limiting',
    icon: <Shield className="w-7 h-7" />,
    summary: 'Caps how many requests a client can make in a given window.',
    details: [
      'Protects APIs from abuse, bots, and DDoS attacks.',
      'Algorithms: token bucket, leaky bucket, fixed window, sliding window.',
      'Can be applied per user, IP, or API key.',
    ],
    examples: ['Max 100 requests per minute per user'],
    color: 'rose',
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; icon: string }> = {
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    icon: 'bg-rose-900 text-white',
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-800',
    icon: 'bg-pink-700 text-white',
  },
  fuchsia: {
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-200',
    badge: 'bg-fuchsia-100 text-fuchsia-800',
    icon: 'bg-fuchsia-800 text-white',
  },
};

const ConceptCard: React.FC<{ concept: Concept; index: number }> = ({ concept, index }) => {
  const [expanded, setExpanded] = useState(false);
  const c = colorMap[concept.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${c.icon}`}>
            {concept.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                #{concept.id}
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-rose-950 mb-2">{concept.title}</h3>
            <p className="text-rose-800 text-sm leading-relaxed">{concept.summary}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-rose-700 hover:text-rose-900 transition-colors"
        >
          {expanded ? '— Show less' : '+ Learn more'}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">Key Points</p>
              <ul className="space-y-1">
                {concept.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-rose-900">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">Examples</p>
              <div className="flex flex-wrap gap-2">
                {concept.examples.map((ex, i) => (
                  <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium ${c.badge}`}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

interface SystemDesignPageProps {
  onNavigate: (path: string) => void;
}

const SystemDesignPage: React.FC<SystemDesignPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1 bg-white/10 backdrop-blur rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
          >
            Engineering Reference
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight"
          >
            System Design
            <br />
            <span className="text-rose-300">Concepts</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-rose-200 text-lg max-w-xl mx-auto"
          >
            Seven foundational concepts every backend engineer should know — from scaling and caching to queues and rate limiting.
          </motion.p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-rose-100 bg-rose-50/60">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap gap-6 justify-center">
          {['7 Concepts', 'Scalability', 'Reliability', 'Performance'].map((label) => (
            <span key={label} className="text-xs font-bold uppercase tracking-widest text-rose-600">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Concepts grid */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept, i) => (
            <ConceptCard key={concept.id} concept={concept} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="px-8 py-3 border-2 border-rose-900 text-rose-900 rounded-full font-bold text-sm hover:bg-rose-900 hover:text-white transition-all duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemDesignPage;
