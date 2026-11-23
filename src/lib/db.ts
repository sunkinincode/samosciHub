import fs from "fs/promises";
import path from "path";
import { INITIAL_HUB_DATA } from "@/lib/seed-data";
import { HubDatabase, PublicHubData } from "@/types/hub";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "hub-data.json");

let writeQueue: Promise<void> = Promise.resolve();

async function ensureDbFile(): Promise<HubDatabase> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<HubDatabase>;
    // Merge with defaults to protect against partial/older files
    const merged: HubDatabase = {
      siteConfig: {
        ...INITIAL_HUB_DATA.siteConfig,
        ...(parsed.siteConfig || {}),
        whatWeDoItems: parsed.siteConfig?.whatWeDoItems ?? INITIAL_HUB_DATA.siteConfig.whatWeDoItems,
        lineBatches: parsed.siteConfig?.lineBatches ?? INITIAL_HUB_DATA.siteConfig.lineBatches,
      },
      members: Array.isArray(parsed.members) ? parsed.members : INITIAL_HUB_DATA.members,
      services: Array.isArray(parsed.services) ? parsed.services : INITIAL_HUB_DATA.services,
      adminPassword: parsed.adminPassword || INITIAL_HUB_DATA.adminPassword,
      updatedAt: parsed.updatedAt || INITIAL_HUB_DATA.updatedAt,
    };
    return merged;
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(INITIAL_HUB_DATA, null, 2), "utf8");
    return INITIAL_HUB_DATA;
  }
}

export async function getDb(): Promise<HubDatabase> {
  return ensureDbFile();
}

export async function getPublicHubData(): Promise<PublicHubData> {
  const db = await getDb();
  const sortedMembers = [...db.members].sort((a, b) => a.order - b.order);
  const sortedServices = [...db.services].sort((a, b) => a.order - b.order);
  return {
    siteConfig: db.siteConfig,
    members: sortedMembers,
    services: sortedServices,
    updatedAt: db.updatedAt,
  };
}

export async function saveDb(nextDb: HubDatabase): Promise<HubDatabase> {
  const payload: HubDatabase = {
    ...nextDb,
    updatedAt: new Date().toISOString(),
  };

  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tempFile = `${DB_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(payload, null, 2), "utf8");
    await fs.rename(tempFile, DB_FILE);
  });

  await writeQueue;
  return payload;
}

export async function updateDb(
  updater: (current: HubDatabase) => HubDatabase | Promise<HubDatabase>
): Promise<HubDatabase> {
  const current = await getDb();
  const updated = await updater(current);
  return saveDb(updated);
}
