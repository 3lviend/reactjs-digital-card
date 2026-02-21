import { PowerSyncDatabase } from "@powersync/web";
import { supabase } from "./supabase";
import { AppSchema } from "./schema";

const powersyncUrl = import.meta.env.VITE_POWERSYNC_URL;

if (!powersyncUrl) {
  console.error("Missing PowerSync environment variables! Check your .env.local file.");
}

export const powersync = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: "my-digital-card.db",
  }
});

export const setupPowerSync = async () => {
  // Setup Supabase Connector
  powersync.connect(new SupabaseConnector());
};

export class SupabaseConnector {
  constructor() { }

  async fetchCredentials() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error("User not authenticated");
    }

    return {
      endpoint: powersyncUrl || "",
      token: session.access_token,
      expiresAt: new Date((session.expires_in || 0) * 1000 + Date.now()),
    };
  }

  async uploadData(database: any) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    try {
      // Fetch user once for the entire transaction
      const { data: { user } } = await supabase.auth.getUser();

      for (const op of transaction.crud) {
        let result;
        const record = { ...op.opData, id: op.id };

        // Convert PowerSync integers back to booleans for Supabase Postgres
        if ('is_public' in record) {
          record.is_public = record.is_public === 1 || record.is_public === true;
        }

        // Convert JSON string back to native array for Supabase ARRAY column
        if (typeof record.social_media === 'string') {
          try {
            record.social_media = JSON.parse(record.social_media);
          } catch (e) {
            record.social_media = [];
          }
        }

        console.log(`[PowerSync Upload] Operation: ${op.op} Table: ${op.table}`, record);

        switch (op.op) {
          case 'PUT':
            if (user) {
              record.user_id = user.id; // Enforce user_id for RLS policies
            } else {
              throw new Error("Cannot INSERT: No authenticated user_id found.");
            }
            result = await supabase.from(op.table).upsert(record);
            break;
          case 'PATCH':
            result = await supabase.from(op.table).update(record).eq('id', op.id);
            break;
          case 'DELETE':
            result = await supabase.from(op.table).delete().eq('id', op.id);
            break;
        }

        if (result && result.error) {
          console.error(`[PowerSync Upload] Error during ${op.op} on ${op.table}:`, result.error, "\nPayload:", record);
          throw new Error(`Upload failed for ${op.table}: ${result.error.message}`);
        } else {
          console.log(`[PowerSync Upload] Successfully executed ${op.op} on ${op.table}.`);
        }
      }
      await transaction.complete();
    } catch (e) {
      console.error("[PowerSync Upload] Transaction failed:", e);
    }
  }
}
