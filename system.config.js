System.config({
  "baseURL": "/",
  "transpiler": "traceur",
  "paths": {
    "*": "app/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "atril": "github:Mitranim/atril@master",
    "highlightjs": "github:components/highlightjs@8.5.0",
    "marked": "npm:marked@0.3.3",
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "zone.js": "github:angular/zone.js@master",
    "github:Mitranim/atril@master": {
      "zone.js": "github:angular/zone.js@master"
    }
  }
});

