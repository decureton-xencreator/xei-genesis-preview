# SWS — Xenesis and Xen Continuum Synchronization

**Date:** 2026-07-18
**Status:** Active preview integration record

This preview repository inherits **Xenesis** as the canonical XEI identity and deprecates **Genesis** as an active product name except where preserved for repository redirects, compatibility, or historical provenance.

## Applied integration

The preview is the primary future experience surface for XEN-CPC-001 — Xen Continuous Parallel Conversation, product name **Xen Continuum**, including:

- responsive foreground conversation;
- mission cards;
- Active Missions Dock;
- mission creation, pause, resume, redirect, priority, approval, and completion states;
- voice continuity controls;
- adaptive rendering and concurrency indicators;
- explicit truth boundaries between queued, running, blocked, simulated, and completed work.

## Migration requirement

The GitHub repository slug `xei-genesis-preview` should be renamed to `xei-xenesis-preview`. After rename, canonical references, deployment integrations, badges, clone URLs, workflows, and external configuration must be checked and updated.

## Truth boundary

This record links the approved architecture to the preview. It does not certify live parallel execution or background computation until the implementation, tests, services, and deployment evidence exist.
