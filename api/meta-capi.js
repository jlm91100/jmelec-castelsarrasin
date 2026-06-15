const crypto = require("crypto");

const ALLOWED_EVENTS = new Set(["Lead", "QualifiedLead", "Contact"]);
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v25.0";

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.end(JSON.stringify(body));
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function sha256(value) {
  const normalized = normalize(value);
  if (!normalized) {
    return undefined;
  }
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function sha256Phone(value) {
  const phone = digits(value);
  if (!phone) {
    return undefined;
  }
  return crypto.createHash("sha256").update(phone).digest("hex");
}

function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== "")
  );
}

function splitName(name) {
  const parts = normalize(name).split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : ""
  };
}

async function parseJson(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID || "1647777846339180";

  if (!token || !pixelId) {
    sendJson(res, 202, {
      skipped: true,
      reason: "META_CAPI_ACCESS_TOKEN and META_PIXEL_ID are not configured."
    });
    return;
  }

  let body;
  try {
    body = await parseJson(req);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  if (!ALLOWED_EVENTS.has(body.event_name)) {
    sendJson(res, 400, { error: "Unsupported event_name." });
    return;
  }

  const userDataInput = body.user_data || {};
  const name = splitName(userDataInput.name);
  const userData = compact({
    em: sha256(userDataInput.email),
    ph: sha256Phone(userDataInput.phone),
    fn: sha256(name.firstName),
    ln: sha256(name.lastName),
    client_ip_address:
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress,
    client_user_agent: req.headers["user-agent"],
    fbc: userDataInput.fbc,
    fbp: userDataInput.fbp
  });

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id || crypto.randomUUID(),
        action_source: "website",
        event_source_url: body.event_source_url || "",
        user_data: userData,
        custom_data: body.custom_data || {}
      }
    ]
  };

  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`);
  url.searchParams.set("access_token", token);

  const metaResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const metaBody = await metaResponse.json().catch(() => ({}));

  if (!metaResponse.ok) {
    sendJson(res, 502, {
      error: "Meta Conversions API request failed.",
      meta: metaBody
    });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    event_name: body.event_name,
    event_id: payload.data[0].event_id,
    meta: metaBody
  });
};
