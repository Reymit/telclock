/**
 * TelClock - Telegram Profile Clock
 * Automatically updates your Telegram last name with current time
 * using Cloudflare Workers + Chat Automation (Business Connection)
 *
 * https://github.com/Reymit/telclock
 */

const WEBHOOK_PATH = '/webhook';
const SECRET = 'ChangeThisToAStrongRandomSecret'; // یه رمز قوی بذار

// Unicode Mathematical Bold digits
const DIGIT_MAP = {
  '0': '\ud835\udfd8', '1': '\ud835\udfd9', '2': '\ud835\udfda', '3': '\ud835\udfdb', '4': '\ud835\udfdc',
  '5': '\ud835\udfdd', '6': '\ud835\udfde', '7': '\ud835\udfdf', '8': '\ud835\udfe0', '9': '\ud835\udfe1'
};

function toFancy(str) {
  return str.split('').map(c => DIGIT_MAP[c] || c).join('');
}

function getTehranTime() {
  const now = new Date();
  const opts = {
    timeZone: 'Asia/Tehran',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  };
  let t = now.toLocaleTimeString('en-GB', opts);
  if (t.startsWith('24')) t = '00' + t.slice(2);
  return t;
}

async function api(token, method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Register webhook
    if (url.pathname === '/register') {
      const webhookUrl = `${url.origin}${WEBHOOK_PATH}`;
      const r = await api(env.BOT_TOKEN, 'setWebhook', {
        url: webhookUrl,
        secret_token: SECRET,
        allowed_updates: ['business_connection', 'business_message', 'message']
      });
      return new Response(JSON.stringify(r, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Manual update (for testing & external cron)
    if (url.pathname === '/update') {
      const result = await updateProfileName(env);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Webhook endpoint
    if (url.pathname === WEBHOOK_PATH) {
      if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
        return new Response('Unauthorized', { status: 403 });
      }

      const update = await request.json();
      ctx.waitUntil(handleUpdate(update, env));
      return new Response('OK');
    }

    return new Response('TelClock is running \u2705\n\nEndpoints:\n/register - Set webhook\n/update - Force update name');
  },

  // Cloudflare Cron Trigger (optional - external cron is more reliable)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(updateProfileName(env));
  }
};

async function handleUpdate(update, env) {
  // Save business_connection_id when Chat Automation is connected/updated
  if (update.business_connection) {
    const conn = update.business_connection;
    if (conn.is_enabled) {
      await env.KV.put('business_connection_id', conn.id);
      console.log('business_connection_id saved:', conn.id);
    } else {
      await env.KV.delete('business_connection_id');
    }
  }
}

async function updateProfileName(env) {
  const connId = await env.KV.get('business_connection_id');
  if (!connId) {
    return { ok: false, error: 'business_connection_id not found. Connect the bot via Chat Automation first.' };
  }

  const time = toFancy(getTehranTime());

  const result = await api(env.BOT_TOKEN, 'setBusinessAccountName', {
    business_connection_id: connId,
    first_name: env.FIRST_NAME || 'User',
    last_name: time
  });

  return result;
}
