# List of all components / subpackages.

TRIANGLE_PACKAGES = [
  "affix",
  "alert",
  "anchor",
  "auto-complete",
  "avatar",
  "back-top",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "cascader",
  "collapse",
  "core",
#  "data-grid",
#  "data-iterator",
#  "data-ix",
  "data-query",
#  "data-store",
  "data-table",
  "date-picker",
  "desc-list",
  "dialog",
  "draggable",
  "dropdown",
  "form",
  "grid",
  "grid-list",
  "i18n",
  "icon",
  "input-compose",
  "inputs",
  "layout",
  "locale",
#  "math-date",
#  "math-vector",
  "menu",
  "message",
  "modal",
  "ng-tree",
  "pagination",
  "popconfirm",
  "popover",
  "progress",
  "rate",
#  "root",
  "slider",
  "spin",
  "steps",
  "switch",
  "table",
  "tabs",
  "tag",
  "time-picker",
  "timeline",
  "tooltip",
  "transfer",
  "tree",
  "util",
]

TRIANGLE_TARGETS = ["//libs/triangle"] + ["//libs/triangle/%s" % p for p in TRIANGLE_PACKAGES]


# List that references the sass libraries for each Material package. This can be used to create
# the theming scss-bundle or to specify dependencies for the all-theme.scss file.
TRIANGLE_SCSS_LIBS = [
  "//libs/triangle/%s:%s_scss_lib" % (p, p.replace('-', '_')) for p in TRIANGLE_PACKAGES
]

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = ">=6.0.0 <8.0.0"
VERSION_PLACEHOLDER_REPLACEMENTS = {
  "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
}

# Base rollup globals for everything in the repo.
ROLLUP_GLOBALS = {
  'tslib': 'tslib',
  'moment': 'moment',
  'uuid': 'uuid',
  'ix': 'ix',
  'date-fns': 'date-fns',
  '@gradii/triangle': 'gd.triangle',
  '@angular/cdk': 'ng.cdk',
  '@angular/cdk/a11y': 'ng.cdk.a11y',
  '@angular/cdk/accordion': 'ng.cdk.accordion',
  '@angular/cdk/bidi': 'ng.cdk.bidi',
  '@angular/cdk/bundles': 'ng.cdk.bundles',
  '@angular/cdk/coercion': 'ng.cdk.coercion',
  '@angular/cdk/collections': 'ng.cdk.collections',
  '@angular/cdk/drag-drop': 'ng.cdk.drag-drop',
  '@angular/cdk/keycodes': 'ng.cdk.keycodes',
  '@angular/cdk/layout': 'ng.cdk.layout',
  '@angular/cdk/observers': 'ng.cdk.observers',
  '@angular/cdk/overlay': 'ng.cdk.overlay',
  '@angular/cdk/platform': 'ng.cdk.platform',
  '@angular/cdk/portal': 'ng.cdk.portal',
  '@angular/cdk/schematics': 'ng.cdk.schematics',
  '@angular/cdk/scrolling': 'ng.cdk.scrolling',
  '@angular/cdk/stepper': 'ng.cdk.stepper',
  '@angular/cdk/table': 'ng.cdk.table',
  '@angular/cdk/text-field': 'ng.cdk.text-field',
  '@angular/cdk/tree': 'ng.cdk.tree',
  '@angular/cdk-experimental': 'ng.cdkExperimental'
}

# Rollup globals for cdk subpackages in the form of, e.g., {"@angular/cdk/table": "ng.cdk.table"}
ROLLUP_GLOBALS.update({
  "@gradii/triangle/%s" % p: "gd.tri.%s" % p for p in TRIANGLE_PACKAGES
})

# UMD bundles for Angular packages and subpackges we depend on for development and testing.
ANGULAR_LIBRARY_UMDS = [
  "@npm//node_modules/@angular/animations:bundles/animations-browser.umd.js",
  "@npm//node_modules/@angular/animations:bundles/animations.umd.js",
  "@npm//node_modules/@angular/common:bundles/common-http-testing.umd.js",
  "@npm//node_modules/@angular/common:bundles/common-http.umd.js",
  "@npm//node_modules/@angular/common:bundles/common-testing.umd.js",
  "@npm//node_modules/@angular/common:bundles/common.umd.js",
  "@npm//node_modules/@angular/compiler:bundles/compiler-testing.umd.js",
  "@npm//node_modules/@angular/compiler:bundles/compiler.umd.js",
  "@npm//node_modules/@angular/core:bundles/core-testing.umd.js",
  "@npm//node_modules/@angular/core:bundles/core.umd.js",
  "@npm//node_modules/@angular/forms:bundles/forms.umd.js",
  "@npm//node_modules/@angular/platform-browser-dynamic:bundles/platform-browser-dynamic-testing.umd.js",
  "@npm//node_modules/@angular/platform-browser-dynamic:bundles/platform-browser-dynamic.umd.js",
  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser-animations.umd.js",
  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser-testing.umd.js",
  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser.umd.js",
]
