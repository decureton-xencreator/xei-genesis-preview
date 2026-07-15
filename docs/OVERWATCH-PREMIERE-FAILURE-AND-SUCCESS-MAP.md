# Overwatch — Executive Premiere Failure & Success Map

Status: Active operating evidence

## Registered Failures

1. Multiple runtimes competed for startup, speech, captions, navigation, and restart.
2. A boot-lock hid the film while audio continued.
3. Saved scene state restored the wrong landing scene.
4. Browser speech began outside the original user gesture and was blocked.
5. Captions advanced independently from voice.
6. Beat-level `scrollIntoView({block:'center'})` clipped scene headings and loaded scenes mid-composition.
7. Required interactions appeared below the fold without a visual handoff.
8. Static CI passed file presence while missing live timing and viewport failures.

## Proven Successful Path

1. One master director owns scene state, cancellation, captions, speech, and navigation.
2. The landing scene is visible and silent until one explicit start action.
3. Every scene begins at a safe top anchor below persistent chrome.
4. Establishing scenes retain their complete composition while narration plays.
5. Motion is tied to meaningful visual beats, not every sentence.
6. Interactive scenes pause after narration.
7. The required control is reframed into the safe viewport and receives a visible interaction spotlight.
8. Back, forward, and restart cancel the prior timeline before starting a new one.
9. Browser voice failure degrades to synchronized captions without changing visual state.
10. Validation must cover runtime ownership, viewport framing, interaction prominence, navigation cancellation, and reduced-motion behavior.

## Release Gate

No guided premiere is Gold Master until a human can complete a full start-to-finish run on the target desktop viewport without clipped primary content, hidden controls, silent unsynchronised captions, or ambiguous next actions.
