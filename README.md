# Pedagogical Statistics Lab

A static, English-language educational website for selecting and applying statistical methods in pedagogical research.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder so that `index.html` is in the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save. GitHub will show the public Pages URL after deployment.

No server, database or build process is required.

## Structure

- `index.html` — method selector.
- `methods.html` — directory of implemented calculators.
- `guide.html` — study-design and interpretation guide.
- `methods/*.html` — individual method pages.
- `assets/css/style.css` — shared responsive design.
- `assets/js/stats.js` — statistical functions.
- `assets/js/app.js` — method recommendation logic.
- `assets/js/method-engine.js` — calculator/interpreter logic.

## Implemented methods

Sign Test, Wilcoxon Signed-Rank, paired t-test, exact McNemar, normalized gain (Hake g), Bespalko mastery coefficient, Friedman test, Mann–Whitney U, Welch independent t-test, Fisher exact test, Pearson chi-square, Spearman correlation, Pearson correlation, Cronbach's alpha, Cohen's kappa, Kendall's W, and one-way ANOVA.

## Methodological caution

The site separates statistical significance from causal claims of instructional effectiveness. Final analyses intended for a thesis, publication, or high-stakes decision should be reproduced in a validated statistical package such as Jamovi, JASP or R.

## Research-logic layer added

The current version also includes:

- a multi-step decision tree on the home page;
- automatic small-sample diagnostics for each recommended method;
- 95% confidence intervals where they can be estimated from the entered data;
- a separate **What can you conclude?** interpretation block;
- automatically generated Chapter 4 / Results prose with a copy button;
- explicit separation of statistical significance, effect magnitude and causal claims.
