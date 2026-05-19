# Migrations

Run in chronological order on a fresh project. On existing project, each migration is idempotent and safe to re-run.

## Apply via Supabase dashboard

1. Open https://supabase.com/dashboard/project/tdthuluyohqtmdhegjhf/sql/new
2. Paste the migration file contents
3. Click **Run**

## Apply via Supabase CLI

```bash
supabase db execute --file migrations/2026-05-19-security-hardening.sql
```

## Apply via Management API

```bash
curl -X POST "https://api.supabase.com/v1/projects/tdthuluyohqtmdhegjhf/database/query" \
  -H "Authorization: Bearer $SUPABASE_MGMT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @<(jq -Rs '{query: .}' < migrations/2026-05-19-security-hardening.sql)
```

---

## 2026-05-19-security-hardening.sql

Bundles Tier-1 security fixes from the squad audit (T1.1, T1.2, T1.4, T1.8):

- **T1.1** — Asaas API key moved from hardcoded SQL into `vault.secrets`
- **T1.2** — `asaas_webhook` now requires `p_token` (validated against vault). EXECUTE revoked from anon/authenticated on sensitive functions.
- **T1.4** — `UNIQUE` index on `orders.asaas_payment_id` (idempotency)
- **T1.8** — `ANTHROPIC_API_KEY` moved to vault (still placeholder — update manually)

### After running

1. **Copy the webhook token** printed at the end of the migration output → paste into Asaas dashboard › Configurações › Integrações › Webhooks › *Token de autenticação*.

2. **Configure Asaas webhook URL** to point to your edge function (you must create one — see TODO below) or to a Postgres RPC that calls `asaas_webhook(token, event, payment_id)`.

3. **Set real Anthropic key**:
   ```sql
   SELECT vault.update_secret(
     (SELECT id FROM vault.secrets WHERE name = 'ANTHROPIC_API_KEY'),
     'sk-ant-api03-YOUR-REAL-KEY'
   );
   ```

4. **Deploy the new edge function**:
   ```bash
   supabase functions deploy change-user-password
   supabase functions deploy asaas-checkout    # has CORS fix
   supabase functions deploy asaas-proxy       # has CORS + admin check + JSON validation
   ```

5. **Set edge function envs** (if not already set):
   ```bash
   supabase secrets set ASAAS_API_KEY="<your asaas key>"
   # SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected
   ```

6. **Rotate the leaked Asaas key** (it's been in git history since the initial commit):
   - Asaas dashboard › Configurações › Integrações › API
   - Generate new key
   - Update vault:
     ```sql
     SELECT vault.update_secret(
       (SELECT id FROM vault.secrets WHERE name = 'ASAAS_API_KEY'),
       '<new key>'
     );
     ```
   - Also update edge function env: `supabase secrets set ASAAS_API_KEY="<new key>"`

7. **(Optional) After confirming change-user-password edge function works**, uncomment the `DROP FUNCTION public.change_user_password` line in the migration and re-run.

### Webhook setup

The `asaas-webhook` edge function (`supabase/functions/asaas-webhook/`) receives Asaas POST requests:

```bash
# Deploy (--no-verify-jwt because Asaas does not send a Supabase JWT)
supabase functions deploy asaas-webhook --no-verify-jwt

# Set webhook token env (must match the value in vault)
WEBHOOK_TOKEN=$(curl -s -X POST "https://api.supabase.com/v1/projects/tdthuluyohqtmdhegjhf/database/query" \
  -H "Authorization: Bearer $SUPABASE_MGMT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='\''ASAAS_WEBHOOK_TOKEN'\''"}' \
  | jq -r '.[0].decrypted_secret')

supabase secrets set ASAAS_WEBHOOK_TOKEN="$WEBHOOK_TOKEN"
```

Then in Asaas dashboard › Configurações › Integrações › Webhooks:
- **URL**: `https://tdthuluyohqtmdhegjhf.functions.supabase.co/asaas-webhook`
- **Header**: `asaas-access-token` = `<WEBHOOK_TOKEN value>`
