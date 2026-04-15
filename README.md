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

## Related

- [deployment-gate-demo](https://github.com/joshjohanning-org/deployment-gate-demo) — The Custom Deployment Protection Rule app
- [linked-artifacts-demo](https://github.com/joshjohanning-org/linked-artifacts-demo) — Linked Artifacts feature demo
Sample team app demonstrating deployment gating with custom protection rules and linked artifacts

