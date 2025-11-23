# Security Policy

If you discover a security vulnerability, please do NOT open a public issue. Instead:

1. Email the maintainers at: `security@example.com` (replace with your contact or GitHub security).
2. Provide reproduction steps, affected versions, and a suggested mitigation if possible.

Before publishing the repo publicly, remove any secrets and rotate keys (see below).

Cleaning secrets from repository history:

- For small repos: `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch path/to/secret" --prune-empty --tag-name-filter cat -- --all`
- Recommended: use the BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/

After cleaning history, rotate any credentials that were exposed (DB passwords, API keys, private keys).
