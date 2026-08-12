# GAGE Strategies — Email Configuration Guide

## Executive Summary

After researching your requirements against SiteGround's capabilities, **Google Workspace Business Starter ($7/user/month)** is the recommended solution. SiteGround's built-in email supports forwarding and catch-all rules, but it **cannot** automatically reply from the same alias address that received the message — which is your core requirement.

---

## Why SiteGround Alone Won't Work

| Requirement | SiteGround Email | Google Workspace |
|---|---|---|
| Receive email at multiple addresses | Yes (forwarders) | Yes (aliases) |
| Single inbox for all addresses | Yes (catch-all/forward) | Yes (aliases arrive in one inbox) |
| Auto-reply FROM the alias that received the message | **No** | **Yes** |
| Send As different addresses | **No** | **Yes** (up to 30 aliases) |
| SPF/DKIM/DMARC | Partial (basic) | Full enterprise-grade |
| Professional mobile apps | Webmail only | Gmail app (iOS/Android) |
| Calendar, Drive, Meet | No | Included |

SiteGround can forward `solutions@gage-strategies.com` to a main inbox, but when you reply, it will always show your main email address — not `solutions@`. This breaks the professional department illusion you need.

---

## Recommended Solution: Google Workspace Business Starter

**Cost:** $7–$8.40/month for 1 user (annual vs monthly billing)

**What you get:**
- Custom email with your domain (hello@gage-strategies.com)
- 30 GB storage per user
- Up to 30 email aliases per user (you only need 5)
- Gmail, Calendar, Drive, Meet, Docs, Sheets
- Full SPF, DKIM, DMARC support
- Mobile apps with push notifications
- 99.9% uptime SLA

---

## Step-by-Step Setup Guide

### Phase 1: Sign Up for Google Workspace

1. Go to [workspace.google.com](https://workspace.google.com)
2. Click "Get Started"
3. Enter your business name: **GAGE Strategies**
4. Select "Just you" for number of employees
5. Enter your existing domain: **gage-strategies.com**
6. Choose your primary admin email: **hello@gage-strategies.com**
7. Select **Business Starter** plan
8. Complete payment

---

### Phase 2: Verify Domain Ownership

Google will ask you to verify you own `gage-strategies.com`. The easiest method with SiteGround:

1. Log into SiteGround → Site Tools → Domain → DNS Zone Editor
2. Add the TXT record Google provides (looks like: `google-site-verification=XXXXXXXXXXXX`)
3. Wait 5–15 minutes for DNS propagation
4. Click "Verify" in Google Workspace admin

---

### Phase 3: Update MX Records (Route Email to Google)

This tells the internet to deliver your email to Google instead of SiteGround.

1. In SiteGround → Site Tools → Domain → DNS Zone Editor
2. **Delete** all existing MX records for gage-strategies.com
3. **Add** these new MX records:

| Priority | Host | Value |
|---|---|---|
| 1 | @ | ASPMX.L.GOOGLE.COM |
| 5 | @ | ALT1.ASPMX.L.GOOGLE.COM |
| 5 | @ | ALT2.ASPMX.L.GOOGLE.COM |
| 10 | @ | ALT3.ASPMX.L.GOOGLE.COM |
| 10 | @ | ALT4.ASPMX.L.GOOGLE.COM |

4. Allow 24–48 hours for full propagation (usually works within 1–2 hours)

---

### Phase 4: Configure Email Aliases

In Google Workspace Admin Console (admin.google.com):

1. Go to **Directory → Users**
2. Click on your user account (hello@gage-strategies.com)
3. Click **User information → Alternate email addresses (email aliases)**
4. Add each alias:
   - `solutions@gage-strategies.com`
   - `hub@gage-strategies.com`
   - `support@gage-strategies.com`
   - `billing@gage-strategies.com`

All emails sent to any of these addresses will now arrive in your single Gmail inbox.

---

### Phase 5: Configure "Send As" for Each Alias

This is the critical step that makes replies come FROM the correct address.

In Gmail (mail.google.com):

1. Click the **gear icon** → **See all settings** → **Accounts** tab
2. In the "Send mail as" section, each alias should already appear
3. If not, click **"Add another email address"** and enter each alias
4. For each alias, click **"edit info"** and set:
   - Name: **GAGE Strategies** (same for all — reinforces the brand)
   - Uncheck "Treat as an alias" only if it doesn't auto-populate
5. **Critical setting:** Check the box that says:
   > "Reply from the same address the message was sent to"

This single checkbox ensures that when someone emails `hub@gage-strategies.com`, your reply automatically comes FROM `hub@gage-strategies.com`.

---

### Phase 6: Email Authentication (SPF, DKIM, DMARC)

These DNS records prevent your emails from going to spam.

#### SPF Record

In SiteGround → Site Tools → Domain → DNS Zone Editor:

1. Find the existing TXT record for SPF (starts with `v=spf1`)
2. **Replace** it with:

```
v=spf1 include:_spf.google.com ~all
```

This tells receiving servers that Google is authorized to send email for your domain.

#### DKIM Record

1. In Google Workspace Admin Console → Apps → Google Workspace → Gmail → Authenticate email
2. Select your domain and click **"Generate new record"**
3. Google will give you a TXT record (selector: `google`)
4. In SiteGround DNS Zone Editor, add a new TXT record:
   - **Host:** `google._domainkey`
   - **Value:** (paste the long string Google provides)
5. Return to Google Admin and click **"Start authentication"**

#### DMARC Record

In SiteGround DNS Zone Editor, add (or update) a TXT record:

- **Host:** `_dmarc`
- **Value:**
```
v=DMARC1; p=quarantine; rua=mailto:hello@gage-strategies.com; pct=100; adkim=s; aspf=s
```

**What this does:**
- `p=quarantine` — emails failing authentication go to spam (not rejected outright while you're setting up)
- `rua=mailto:hello@...` — you receive aggregate reports about authentication failures
- `pct=100` — applies to 100% of messages
- `adkim=s` and `aspf=s` — strict alignment for maximum deliverability

**After 2–4 weeks** of monitoring (no legitimate emails failing), upgrade to:
```
v=DMARC1; p=reject; rua=mailto:hello@gage-strategies.com; pct=100; adkim=s; aspf=s
```

---

### Phase 7: Create Email Signatures

Set up a professional signature for each alias. In Gmail Settings → Signature:

Create a signature for each "Send As" address:

**For hello@gage-strategies.com:**
```
GAGE Strategies
AI Solutions & Business Workflow Tools
gage-strategies.com
```

**For solutions@gage-strategies.com:**
```
GAGE Solutions Team
AI & Business Process Consulting
gage-strategies.com/solutions
```

**For hub@gage-strategies.com:**
```
GAGE Solutions Hub
AI Workflow Tools & Templates
gage-strategies.com/hub
```

**For support@gage-strategies.com:**
```
GAGE Support Team
We typically respond within 24 hours
gage-strategies.com
```

**For billing@gage-strategies.com:**
```
GAGE Billing Department
Subscriptions & Account Management
gage-strategies.com
```

---

## Website Integration (Already Configured)

The GAGE Solutions Hub website contact forms should route to:

| Page/Form | Sends To |
|---|---|
| Main Contact page ("Bring Us Your Challenge") | hello@gage-strategies.com |
| Solutions Hub marketplace inquiries | hub@gage-strategies.com |
| AI consulting / strategy requests | solutions@gage-strategies.com |
| Support requests | support@gage-strategies.com |
| Billing / subscription questions | billing@gage-strategies.com |

I will update the website's contact form and lead capture system to route to the correct addresses based on the inquiry type.

---

## How It All Works Together

```
Customer emails hub@gage-strategies.com
        ↓
Google receives it (MX records point to Google)
        ↓
Arrives in YOUR single Gmail inbox
        ↓
You click Reply
        ↓
Gmail automatically sets "From: hub@gage-strategies.com"
        ↓
Customer sees reply from hub@gage-strategies.com
        ↓
Customer perceives they're talking to the "Hub Team"
```

---

## Gmail Organization Tips

To keep your single inbox organized by "department":

1. **Create Labels:** Solutions, Hub, Support, Billing, General
2. **Create Filters:** 
   - If "To" contains `solutions@` → Apply label "Solutions"
   - If "To" contains `hub@` → Apply label "Hub"
   - If "To" contains `support@` → Apply label "Support"
   - If "To" contains `billing@` → Apply label "Billing"
3. **Color-code labels** for quick visual scanning
4. **Use Multiple Inboxes** (Gmail Labs) to see each "department" in its own section

---

## Cost Summary

| Item | Cost |
|---|---|
| Google Workspace Business Starter | $7–$8.40/month |
| Domain (already owned) | $0 |
| Aliases (up to 30) | Included |
| SPF/DKIM/DMARC | Free (DNS records) |
| **Total** | **~$7–$8.40/month** |

---

## Alternative: Microsoft 365 Business Basic

If you prefer Microsoft:
- **Cost:** $6/user/month
- **Aliases:** Up to 400 per user
- **Send As:** Supported (Outlook settings)
- **Auto-reply from alias:** Yes (same behavior as Gmail)
- **Includes:** Outlook, Teams, OneDrive, SharePoint

The setup process is nearly identical — verify domain, update MX records, add aliases, configure Send As.

**Recommendation:** Google Workspace is slightly easier to configure for this specific use case and has better integration with most business tools. Microsoft 365 is a valid alternative if you already use Outlook.

---

## Checklist

- [ ] Sign up for Google Workspace Business Starter
- [ ] Verify domain ownership via DNS TXT record
- [ ] Update MX records in SiteGround to point to Google
- [ ] Wait for MX propagation (1–48 hours)
- [ ] Add 4 email aliases in Google Admin Console
- [ ] Configure "Send As" for each alias in Gmail
- [ ] Enable "Reply from same address" setting
- [ ] Add SPF record for Google
- [ ] Generate and add DKIM record
- [ ] Add DMARC record (start with quarantine)
- [ ] Create email signatures for each alias
- [ ] Set up Gmail filters and labels for organization
- [ ] Test: send email TO each alias, verify it arrives, reply, confirm From address
- [ ] After 2–4 weeks: upgrade DMARC to reject

---

## Next Steps for the Website

Once your email is configured, I can:
1. Update the Contact form to include a dropdown for inquiry type (General, Solutions, Hub, Support, Billing)
2. Route form submissions to the correct email address based on selection
3. Add appropriate email addresses to the website footer and relevant pages
4. Set up email notification triggers from the admin panel when new leads come in

---

*Document prepared for GAGE Strategies — July 2026*
