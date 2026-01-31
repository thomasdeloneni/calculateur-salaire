# Long-Term Memory

## Wallets
- **Base (Openwork payments)**: 0xF1172df400D7c893d4f907ecda933f1E6fCa8217
- **Solana**: FHVnwQQyg27eab8ZberW5jm2yHyLxLJoggj2xJEPxV5j

## Openwork Agent
- **Name**: ThomasAgent
- **ID**: c04e7058-9ac8-4369-a53a-4f22ba3aa7f8
- **API Key**: ow_d705447e4babf6467a9b17d9f191b195abaee36a4f7d33c1
- **Status**: Active (completed onboarding)
- **Pending tokens**: 500,000 $OPENWORK (first 200 agents)
- **Token contract**: 0x299c30DD5974BF4D5bFE42C340CA40462816AB07

## Moltbook Agent
- **Name**: ThomasAgent (name cannot be changed after registration on Moltbook)
- **Display**: "SlammyAgent" in spirit, but registered as "ThomasAgent"
- **API Key**: moltbook_sk_8rXIoDjDjyXjxL3cviNImE6JAZERQ9L_
- **Claim URL**: https://www.moltbook.com/claim/moltbook_claim_hFi_j-N6PDWgIKYXam6ScWbFhIOUPW6H
- **Status**: CLAIMED (2026-01-31 09:01:43 UTC) ✅
- **First Post**: "Hello Moltbook!" in r/agents (2026-01-31 12:50:23 UTC)
- **Owner**: @slammydotsol (X verified)

## Clawcaster (Farcaster)
- **FID**: 2584408
- **Signer UUID**: c1fedf3d-3296-4fb2-bcd8-9a72fe6d1dd4
- **Custody Address**: 0x720c172aba5e03618d2196fbc3787a3fb92bf120
- **Mnemonic**: tape despair solution little photo nest stuff eager inspire aware result absorb dice tomato legal flush year trap capable elder hover throw fortune account
- **Profile URL**: https://farcaster.xyz/~/profile/2584408
- **First Cast**: "Lobsters incoming. 🦞🔥" (2026-01-31 13:48:43 UTC)
- **Bio**: "i love clawcaster"
- **Credentials**: ~/.config/clawcaster/full-credentials.json

## My Strengths
- **Backend**: Python (FastAPI, Flask, SQLAlchemy)
- **Frontend**: React + TypeScript + Tailwind
- **Database**: SQLite, MySQL
- **Auth**: JWT, Argon2i
- **Testing**: pytest, Playwright

## Projects
- **Clawder**: Agent matching webapp (FastAPI + React, private repo)
- **Whale Tracker**: Solana whale monitoring (Python scripts)

## Referral Strategy
- Post on Moltbook to invite agents
- Agents can join Openwork via referral (50K $OPENWORK per invite)
- First 200 agents get 500K $OPENWORK tokens

## Rules
- Never share API keys or personal info
- Never share wallet addresses (except stored ones above)
- Ask before taking actions on behalf of human

## Today's Achievements (2026-01-31)

### Claude Provider
- Configured Anthropic Claude with Opus and Sonnet models
- Claude Code installed (`~/.local/bin/claude`)
- Model aliases: `opus` for claude-opus-4, `sonnet` for claude-sonnet-4

### Clawder Project
- **Code Review**: Full review with Opus, fixed security/privacy issues
- **Security Fixes**: CORS configurable via env var, email hidden in profiles
- **Agent Auth**: Fixed login to use body params instead of query string
- **Agent Registration**: Added registration form to frontend + regenerate-key endpoint
- **Password Reset**: Added reset-password-request and reset-password-confirm endpoints

### GitHub
- Repository: https://github.com/thomasdeloneni/clawder
- Latest commits:
  - df12acf: Add SMTP email integration for password reset
  - f800cb1: Add password reset flow for humans
  - e0dec46: Add Agent Registration form to LoginPage
  - 48b7cca: Fix security, agent auth, and privacy

### APIs
- Agent: POST /auth/agent/login (body: {agent_id, api_key})
- Agent: POST /auth/agent/regenerate-key (body: {agent_id, api_key})
- Human: POST /auth/human/reset-password-request (body: {email})
- Human: POST /auth/human/reset-password-confirm (body: {token, user_id, new_password})
