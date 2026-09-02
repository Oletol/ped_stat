# Design QA

## Comparison target

- Source visual truth: `/Users/olecyatolstykh/.codex/generated_images/01a05dd8-b2c5-7c50-885d-a4878b5c4095/exec-06a1d0fc-9b1c-4e95-8196-4bc2cf6d1184.png`
- Browser implementation: `http://127.0.0.1:4173/`
- Implementation screenshot: `.qa/implementation-viewport.png`
- Combined comparison evidence: `.qa/qa-comparison-final.png`
- Focused calculator evidence: `.qa/method-result.png`
- State: English, paired quantitative pre/post study, approximately normal differences, n = 24; paired t-test example calculated on the method page.

## Normalization

- Browser CSS viewport: 1280 × 720.
- Browser device pixel ratio: 2; browser capture normalized to 1280 × 720 pixels.
- Source image: 1487 × 1058 pixels.
- The combined comparison places both images in equal-width panels with `object-fit: contain` and top alignment. Exact vertical extent differs because the source is a compact design target while the implementation preserves editable educational guidance and responsive content.

## Full-view comparison evidence

The final side-by-side comparison confirms the selected direction's major composition and visual system: compact navy navigation, editorial serif heading, pale gray background, thin bordered white surfaces, a horizontal five-part study snapshot, compact step list, two-column workspace, green evidence callout, amber limitation callout, restrained corners, and dense academic spacing. The implementation intentionally uses longer explanatory copy and larger accessible controls than the static concept.

## Focused region evidence

The paired t-test result was inspected at readable scale. It includes a contextual “What this chart shows” note, individual learner trajectories, green improvement lines, red decline support, a dark group-mean line, educational labels, confidence interval, effect size, cautious conclusion, and reusable report text. Text, controls, card borders, semantic colors, and graph labels are legible and consistent with the selected design language.

## Required fidelity surfaces

- Fonts and typography: Georgia provides the editorial serif hierarchy; the system sans-serif stack provides clear UI text. Weight, line height, heading wrapping, and small-label tracking are consistent and readable.
- Spacing and layout rhythm: shell width, two-column proportions, 5-item snapshot, compact step rhythm, 6–9 px radii, thin borders, and restrained shadows match the source direction. Responsive breakpoints collapse the workspace, snapshots, metrics, and guides without horizontal overflow.
- Colors and visual tokens: navy, cool gray, muted green, amber, blue-gray borders, and white panels map closely to the source. Gradients and glossy SaaS styling were removed.
- Image quality and asset fidelity: the design is interface-led and contains no required photographic or illustrative assets. Charts are data-driven result graphics, sharp at browser scale, and use the requested reference treatment.
- Copy and content: headings and explanations are educational-study specific. English and Russian versions cover use cases, observation units, data sources, examples, interpretation, limitations, and reporting.

## Comparison history

1. Initial browser implementation showed all five selector questions expanded. This was a P2 density and hierarchy mismatch because the selected design used compact completed steps and one active question.
2. Fixed by adding a progressive active-step state: completed steps collapse into concise rows, the next unanswered step opens automatically, and any completed step can be reopened by selecting its heading.
3. Post-fix evidence in `.qa/qa-comparison-final.png` shows the compact step hierarchy and improved correspondence with the source. No actionable P0, P1, or P2 issues remain.

## Functional verification

- Primary selector flow tested through all five questions; active step, snapshot, explanation, summary, and recommendations update correctly.
- English/Russian switching tested on the selector and a method page, including all five educational guidance blocks.
- “Use this example” and “Calculate” tested on all 17 calculators. All produced a non-error result.
- Paired t-test chart, conclusion, confidence interval, effect size, and report block inspected directly.
- Main navigation targets and method-directory page opened successfully.
- Browser console errors checked on the selector and calculator page: none.

## Follow-up polish

- P3: a future iteration could add an explicit “Edit choices” text action beside the study snapshot; completed steps are already editable by selecting their headings.

final result: passed
