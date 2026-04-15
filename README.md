# 🏦 Deployment Gate App Demo

> A sample team application demonstrating how **Custom Deployment Protection Rules** enforce deployment governance — without the team adding ANY enforcement logic to their workflows.

## What This Demonstrates

This repo shows what a **typical team's repo** looks like when the org uses [Custom Deployment Protection Rules](https://github.com/joshjohanning-org/deployment-gate-demo) for enforcement.

**Key point:** This workflow has **NO** enforcement logic. No prior-environment checks, no ServiceNow validation, no gating code. All of that is handled automatically by the deployment protection rule on the environment.

## Workflows

### CI (`ci.yml`) — Triggered on push to `main`
1. Build the Node.js app
2. Run tests
3. Create a ZIP artifact
4. Create a **GitHub Release** with a tag (e.g., `v1.0.42`)
5. Attach the build artifact to the release
6. Attest the artifact (provenance signing)
7. Register a linked artifact storage record

### Deploy (`deploy.yml`) — Triggered manually (workflow_dispatch)

The deployer picks:
| Input | Description |
|---|---|
| **Release tag** | Which release to deploy (e.g., `v1.0.42`) |
| **Environment** | Target: Dev, QA, Staging, Production-East, or Production-Central |
| **Change ticket** | ServiceNow ticket (e.g., `CHG0012345`) — required for Production |

When targeting a protected environment, the **Custom Deployment Protection Rule automatically fires** and checks:
- ✅ Was this artifact deployed to the prior environment?
- ✅ Is the ServiceNow change ticket valid? (production only)

If checks fail → deployment is **rejected**. If checks pass → deployment proceeds.

## How to Use

### 1. Push code to `main`
The CI workflow creates a release automatically.

### 2. Go to Actions → Deploy → Run workflow
- Pick a release tag from the dropdown
- Pick an environment
- Add a change ticket if deploying to production

### 3. Watch the gate
If the environment has a custom deployment protection rule attached, GitHub will call the gate app. You'll see the approval/rejection in the workflow run.

## Environments

| Environment | Prior Required | Change Ticket | Description |
|---|---|---|---|
| Dev | — | No | First environment |
| QA | Dev | No | Requires Dev deployment first |
| Staging | QA | No | Requires QA deployment first |
| Production-East | Staging | Yes | East region production |
| Production-Central | Staging | Yes | Central region production |

## The Point

Teams **don't need to change their workflows** to get deployment governance. The org sets up the gate app once, attaches it to environments, and enforcement happens automatically — across all 1,500 repos.

## FAQ

### Why does CI create GitHub Releases?

Releases are used as a **convenience** — they give the deployer a nice versioned artifact to pick from in the workflow dispatch dropdown, and they provide a permanent, immutable record of the build output. But releases are **not required** for the gate to work. The gate checks the [GitHub Deployments API](https://docs.github.com/en/rest/deployments/deployments) (based on commit SHA), not releases. You could deploy from a branch, a tag, a commit SHA, or any other ref — as long as the deploy job uses `environment:`, the gate fires.

### What are the linked artifact storage/deployment records for?

The CI and deploy workflows register **linked artifact records** via the REST API, but the deployment gate does **not** use them for enforcement. They serve a separate purpose:

- **Storage records** (registered at build time) — provide org-wide visibility into what was built, where it's stored, and its provenance attestation
- **Deployment records** (registered at deploy time) — provide org-wide visibility into what's deployed in each environment

These show up at **Org → Packages → Linked Artifacts** and are useful for:
- Security alert prioritization ("this vulnerability is in production")
- Compliance/audit exports
- Org-wide deployment visibility across all repos

**Enforcement** uses the GitHub Deployments API. **Visibility/audit** uses linked artifacts. They're complementary but independent.

### What if I don't want to create releases?

Remove the release creation steps from `ci.yml`. For the deploy workflow, instead of downloading from a release, you could:
- Use `actions/download-artifact` to get the build artifact from a prior workflow run
- Build at deploy time (less ideal but works)
- Pull from an external registry (JFrog, Nexus, etc.)

The gate doesn't care how the artifact gets to the deploy job — it only cares about the environment and SHA.

### What does the artifact attestation do?

The `actions/attest` step in CI creates a **signed provenance attestation** — a cryptographic proof of where the artifact was built, which workflow built it, and which commit it came from. This is separate from the deployment gate and is useful for:
- Verifying artifacts haven't been tampered with
- Meeting SLSA (Supply chain Levels for Software Artifacts) compliance
- Kubernetes admission controllers that require attested artifacts

It's optional for the gate demo but shows a best practice for supply chain security.

### Can I use a different build system or language?

Yes. The Node.js app is just for demo purposes. The CI workflow could build Java, .NET, Python, Go — anything. The only requirement is that the deploy job uses `environment:` so the gate fires. The gate is language/framework agnostic.

## Related

- [deployment-gate-demo](https://github.com/joshjohanning-org/deployment-gate-demo) — The Custom Deployment Protection Rule app
- [linked-artifacts-demo](https://github.com/joshjohanning-org/linked-artifacts-demo) — Linked Artifacts feature demo

