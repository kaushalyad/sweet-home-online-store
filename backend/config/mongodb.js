import mongoose from "mongoose";
import logger from "./logger.js";

async function resolveAtlasSrvViaDoh(clusterHost) {
  // Uses DNS-over-HTTPS to bypass networks that block SRV DNS lookups.
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node version');
  }

  const name = `_mongodb._tcp.${clusterHost}`;
  const url = new URL('https://cloudflare-dns.com/dns-query');
  url.searchParams.set('name', name);
  url.searchParams.set('type', 'SRV');

  const res = await fetch(url.toString(), {
    headers: { accept: 'application/dns-json' },
  });

  if (!res.ok) {
    throw new Error(`DoH SRV lookup failed (${res.status})`);
  }

  const json = await res.json();
  const answers = Array.isArray(json.Answer) ? json.Answer : [];
  const targets = [];

  for (const a of answers) {
    if (!a || typeof a.data !== 'string') continue;
    // Format: "priority weight port target"
    const parts = a.data.trim().split(/\s+/);
    if (parts.length < 4) continue;
    const port = parts[2];
    const target = parts.slice(3).join(' ').replace(/\.$/, '');
    if (target && port) targets.push(`${target}:${port}`);
  }

  return Array.from(new Set(targets));
}

function buildSeedlistUriFromSrv(originalUri, seedHosts) {
  const u = new URL(originalUri);
  const username = u.username ? decodeURIComponent(u.username) : '';
  const password = u.password ? decodeURIComponent(u.password) : '';
  const auth =
    username || password
      ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
      : '';

  const db = (u.pathname || '').replace(/^\//, ''); // may be empty
  const qp = new URLSearchParams(u.searchParams);

  // Ensure TLS for Atlas if user didn't specify it.
  if (!qp.has('tls') && !qp.has('ssl')) qp.set('tls', 'true');

  const query = qp.toString();
  const dbPart = db ? `/${db}` : '';
  const queryPart = query ? `?${query}` : '';

  return `mongodb://${auth}${seedHosts.join(',')}${dbPart}${queryPart}`;
}

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is not set. Create backend/.env and set MONGODB_URI (MongoDB Atlas or local MongoDB)."
            );
        }
        try {
          const conn = await mongoose.connect(process.env.MONGODB_URI);
          logger.info(`MongoDB Connected: ${conn.connection.host}`);
          return conn;
        } catch (error) {
          const msg = error?.message || String(error);
          const isSrv = typeof process.env.MONGODB_URI === 'string' && process.env.MONGODB_URI.startsWith('mongodb+srv://');
          const isSrvDnsIssue =
            msg.includes('querySrv') ||
            msg.includes('_mongodb._tcp') ||
            msg.includes('ECONNREFUSED') ||
            msg.includes('ENOTFOUND');

          // If SRV is blocked, fall back to DoH SRV resolution and retry using a seedlist URI.
          if (isSrv && isSrvDnsIssue) {
            try {
              const u = new URL(process.env.MONGODB_URI);
              const seedHosts = await resolveAtlasSrvViaDoh(u.hostname);
              if (seedHosts.length > 0) {
                const seedUri = buildSeedlistUriFromSrv(process.env.MONGODB_URI, seedHosts);
                logger.warn(`Atlas SRV DNS blocked; retrying MongoDB connection via seedlist (${seedHosts.length} hosts).`);
                const conn2 = await mongoose.connect(seedUri);
                logger.info(`MongoDB Connected: ${conn2.connection.host}`);
                return conn2;
              }
            } catch (dohError) {
              logger.warn(`DoH fallback also failed: ${dohError.message}. Throwing original error.`);
            }
          }

          throw error;
        }
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        const msg = error?.message || String(error);
        const isSrv = typeof process.env.MONGODB_URI === 'string' && process.env.MONGODB_URI.startsWith('mongodb+srv://');
        const isSrvDnsIssue =
            msg.includes('querySrv') ||
            msg.includes('_mongodb._tcp') ||
            msg.includes('ECONNREFUSED') ||
            msg.includes('ENOTFOUND');

        if (isSrv && isSrvDnsIssue) {
            logger.error(
                `MongoDB connection error: ${msg}. This usually means your network/DNS blocks Atlas SRV lookups required by mongodb+srv. ` +
                `Fix: use Atlas "Standard connection string" (mongodb://host1,host2,host3/...) or change DNS/network. ` +
                `Workaround in code: this backend will attempt SRV resolution via DNS-over-HTTPS.`
            );
        } else {
            logger.error(`MongoDB connection error: ${msg}`);
        }
        throw error;
    }
};

export default connectDB;
