# Fitness Forge

A simple HTML/CSS landing page project.

## Files
- `index.html`
- `styles.css`

## Publish to a **separate GitHub repository**

From the root of this repository, run:

```bash
# 1) Create a branch containing only the fitness-forge folder
git subtree split --prefix=fitness-forge -b fitness-forge-release

# 2) Create a new empty repo on GitHub (example name)
#    (skip this if you already created it in GitHub UI)
gh repo create fitness-forge --public --description "Fitness Forge HTML/CSS project" --source=. --remote=fitness-forge-origin --push=false

# 3) Push the split branch to that repo as main
git push fitness-forge-origin fitness-forge-release:main
```

If you prefer using GitHub website only:
1. Create a new empty repository named `fitness-forge`.
2. Download/copy the `fitness-forge` folder files from this repo.
3. Upload `index.html` and `styles.css` to the new repo.

## Local preview
Open `index.html` in your browser.
