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
    "atril": "npm:atril@0.0.1",
    "highlightjs": "github:components/highlightjs@8.5.0",
    "marked": "npm:marked@0.3.3",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "zone": "github:angular/zone.js@0.5.0",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:atril@0.0.1": {
      "zone": "github:angular/zone.js@0.5.0"
    },
    "npm:stylific@0.0.11": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

