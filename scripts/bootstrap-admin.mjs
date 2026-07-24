#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

async function findUserByEmail(adminClient, email) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(`Impossible de lire les utilisateurs : ${error.message}`);
    }

    const users = Array.isArray(data?.users) ? data.users : [];
    const match = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());

    if (match) {
      return match;
    }

    if (users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function main() {
  const projectRoot = process.cwd();
  loadEnvFile(path.join(projectRoot, ".env.local"));
  loadEnvFile(path.join(projectRoot, ".env"));

  const args = parseArgs(process.argv.slice(2));
  const email = args.email || "";
  const password = args.password || process.env.SUPABASE_TAKACODE_PASSWORD || "";
  const fullName = args.name || "Admin TakaCode";
  const points = Number.parseInt(args.points || "1500", 10);

  if (!email) {
    throw new Error("Argument requis: --email admin@exemple.com");
  }

  if (!password) {
    throw new Error("Mot de passe manquant. Passe --password ou configure SUPABASE_TAKACODE_PASSWORD.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant. Ajoute-le dans .env.local pour créer/promouvoir un admin.");
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const existing = await findUserByEmail(adminClient, email);

  let targetUserId = "";

  if (existing) {
    const nextAppMetadata = {
      ...(existing.app_metadata || {}),
      role: "admin"
    };

    const nextUserMetadata = {
      ...(existing.user_metadata || {}),
      full_name: fullName
    };

    const { data, error } = await adminClient.auth.admin.updateUserById(existing.id, {
      password,
      app_metadata: nextAppMetadata,
      user_metadata: nextUserMetadata
    });

    if (error) {
      throw new Error(`Échec promotion admin : ${error.message}`);
    }

    targetUserId = data.user?.id || existing.id;
    console.log(`Utilisateur existant promu admin : ${email}`);
  } else {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { full_name: fullName }
    });

    if (error) {
      throw new Error(`Échec création admin : ${error.message}`);
    }

    targetUserId = data.user?.id || "";
    console.log(`Compte admin créé : ${email}`);
  }

  if (!targetUserId) {
    throw new Error("Impossible de récupérer l'identifiant utilisateur admin.");
  }

  const normalizedPoints = Number.isFinite(points) ? Math.max(points, 0) : 1500;
  const { error: profileError } = await adminClient
    .from("user_profiles")
    .upsert(
      {
        id: targetUserId,
        role: "admin",
        points: normalizedPoints
      },
      {
        onConflict: "id"
      }
    );

  if (profileError) {
    throw new Error(`Admin créé/promu mais profil non mis à jour : ${profileError.message}`);
  }

  console.log("Profil admin synchronisé.");
  console.log(`Connexion admin : ${email}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
