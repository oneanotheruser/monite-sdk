---
'@monite/sdk-react': minor
---

fix(DEV-11166): rewrite <FileViewer /> component to use native PDF rendering

* Fixed a bug with PDF rendering caused by SSR rendering by changing to a more native approach.
* Switched from `react-pdf` to  native iframe.