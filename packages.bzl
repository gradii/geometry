# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = "^9.0.0-0 || ^10.0.0-0"
TSLIB_PACKAGE_VERSION = "^1.9.0"

VERSION_PLACEHOLDER_REPLACEMENTS = {
    "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
    "0.0.0-TSLIB": TSLIB_PACKAGE_VERSION,
}

# List of default Angular library UMD bundles which are not processed by ngcc.
ANGULAR_NO_NGCC_BUNDLES = [
    ("@angular/compiler", ["compiler.umd.js"]),
]

# List of Angular library UMD bundles which will are processed by ngcc.
ANGULAR_NGCC_BUNDLES = [
    ("@angular/animations", ["animations-browser.umd.js", "animations.umd.js"]),
    ("@angular/common", ["common-http-testing.umd.js", "common-http.umd.js", "common-testing.umd.js", "common.umd.js"]),
    ("@angular/compiler", ["compiler-testing.umd.js"]),
    ("@angular/core", ["core-testing.umd.js", "core.umd.js"]),
    ("@angular/elements", ["elements.umd.js"]),
    ("@angular/forms", ["forms.umd.js"]),
    ("@angular/platform-browser-dynamic", ["platform-browser-dynamic-testing.umd.js", "platform-browser-dynamic.umd.js"]),
    ("@angular/platform-browser", ["platform-browser.umd.js", "platform-browser-testing.umd.js", "platform-browser-animations.umd.js"]),
    ("@angular/router", ["router.umd.js"]),
]

ANGULAR_CDK_BUNDLES = [
    (
        "@angular/cdk",
        [
            "cdk-a11y.umd.js",
            "cdk-accordion.umd.js",
            "cdk-bidi.umd.js",
            "cdk-clipboard.umd.js",
            "cdk-coercion.umd.js",
            "cdk-collections.umd.js",
            "cdk-drag-drop.umd.js",
            "cdk-keycodes.umd.js",
            "cdk-layout.umd.js",
            "cdk-observers.umd.js",
            "cdk-overlay.umd.js",
            "cdk-platform.umd.js",
            "cdk-portal.umd.js",
            "cdk-scrolling.umd.js",
            "cdk-stepper.umd.js",
            "cdk-table.umd.js",
            "cdk-text-field.umd.js",
            "cdk-tree.umd.js",
            "cdk-testing.umd.js",
            "cdk-testing/protractor.umd.js",
            "cdk-testing/testbed.umd.js",
        ],
    ),
]

"""
  Gets a dictionary of all packages and their bundle names.
"""

def getFrameworkPackageBundles():
    res = {}
    for pkgName, bundleNames in ANGULAR_NGCC_BUNDLES + ANGULAR_NO_NGCC_BUNDLES + ANGULAR_CDK_BUNDLES:
        res[pkgName] = res.get(pkgName, []) + bundleNames
    return res

"""
  Gets a list of labels which resolve to the UMD bundles of the given packages.
"""

def getUmdFilePaths(packages, ngcc_artifacts):
    tmpl = "@npm//:node_modules/%s" + ("/__ivy_ngcc__" if ngcc_artifacts else "") + "/bundles/%s"
    return [
        tmpl % (pkgName, bundleName)
        for pkgName, bundleNames in packages
        for bundleName in bundleNames
    ]

ANGULAR_PACKAGE_BUNDLES = getFrameworkPackageBundles()

ANGULAR_LIBRARY_VIEW_ENGINE_UMDS = getUmdFilePaths(ANGULAR_NO_NGCC_BUNDLES, False) + \
                                   getUmdFilePaths(ANGULAR_NGCC_BUNDLES, False)

ANGULAR_LIBRARY_IVY_UMDS = getUmdFilePaths(ANGULAR_NO_NGCC_BUNDLES, False) + \
                           getUmdFilePaths(ANGULAR_NGCC_BUNDLES, True)

"""
  Gets the list of targets for the Angular library UMD bundles. Conditionally
  switches between View Engine or Ivy UMD bundles based on the
  "--config={ivy,view-engine}" flag.
"""

def getAngularUmdTargets():
    return select({
        "//tools:view_engine_mode": ANGULAR_LIBRARY_VIEW_ENGINE_UMDS,
        "//conditions:default": ANGULAR_LIBRARY_IVY_UMDS,
    })

## List of all components / subpackages.
#
#TRIANGLE_PACKAGES = [
#  "affix", "alert", "anchor", "autocomplete", "avatar", "back-top", "badge", "breadcrumb", "button", "calendar",
#  "card", "carousel", "cascader", "collapse", "core",
##  "data-grid",
##  "data-iterator",
##  "data-ix",
##  "data-store",
#  "data-query", "data-table", "date-picker", "desc-list", "dialog", "draggable", "dropdown", "form",
#  "grid", "grid-list", "i18n", "icon",
##  "input-compose",
#  "input", "input-number", "radio", "checkbox", "select", "layout",
##  "locale",
##  "math-date",
##  "math-vector",
#  "menu", "message", "modal", "tree", "pagination", "popconfirm", "popover", "progress", "rate",
##  "root",
#  "slider", "spin", "steps", "switch", "tabs", "tag", "time-picker", "timeline", "tooltip", "transfer", "util",
##  "tree",
#]
#
#
#TRIANGLE_SCSS_PACKAGES = [
#  "affix", "alert", "anchor", "autocomplete", "avatar", "back-top", "badge", "breadcrumb", "button", "calendar",
#  "card", "carousel", "cascader", "collapse",
##  "core",
##  "data-grid",
##  "data-store",
##  "data-query",
#  "data-table", "date-picker", "desc-list", "dialog",
##  "draggable",
#  "dropdown", "form",
#  "grid", "grid-list", "icon",
##  "i18n",
#  "input", "input-number", "radio", "checkbox", "select", "layout",
##  "locale",
##  "math-date",
##  "math-vector",
#  "menu", "message", "modal", "tree", "pagination", "popconfirm", "popover", "progress", "rate",
##  "root",
#  "slider", "spin", "steps", "switch", "tabs", "tag", "time-picker", "timeline", "tooltip", "transfer",
##  "util",
##  "tree",
#]
#
#
#TRIANGLE_TARGETS = ["//src/triangle"] + ["//src/triangle/%s" % p for p in TRIANGLE_PACKAGES]
#
#
## List that references the sass libraries for each Material package. This can be used to create
## the theming scss-bundle or to specify dependencies for the all-theme.scss file.
#TRIANGLE_SCSS_LIBS = [
#  "//src/triangle/%s:%s_scss_lib" % (p, p) for p in TRIANGLE_SCSS_PACKAGES
#]
#
#
## Base rollup globals for everything in the repo.
#ROLLUP_GLOBALS = {
#  'tslib': 'tslib',
#  'moment': 'moment',
#  'uuid': 'uuid',
#  'ix': 'ix',
#  'date-fns': 'date-fns',
#  '@gradii/triangle': 'gd.triangle',
#  '@angular/cdk': 'ng.cdk',
#  '@angular/cdk/a11y': 'ng.cdk.a11y',
#  '@angular/cdk/accordion': 'ng.cdk.accordion',
#  '@angular/cdk/bidi': 'ng.cdk.bidi',
#  '@angular/cdk/bundles': 'ng.cdk.bundles',
#  '@angular/cdk/coercion': 'ng.cdk.coercion',
#  '@angular/cdk/collections': 'ng.cdk.collections',
#  '@angular/cdk/drag-drop': 'ng.cdk.drag-drop',
#  '@angular/cdk/keycodes': 'ng.cdk.keycodes',
#  '@angular/cdk/layout': 'ng.cdk.layout',
#  '@angular/cdk/observers': 'ng.cdk.observers',
#  '@angular/cdk/overlay': 'ng.cdk.overlay',
#  '@angular/cdk/platform': 'ng.cdk.platform',
#  '@angular/cdk/portal': 'ng.cdk.portal',
#  '@angular/cdk/schematics': 'ng.cdk.schematics',
#  '@angular/cdk/scrolling': 'ng.cdk.scrolling',
#  '@angular/cdk/stepper': 'ng.cdk.stepper',
#  '@angular/cdk/table': 'ng.cdk.table',
#  '@angular/cdk/text-field': 'ng.cdk.text-field',
#  '@angular/cdk/tree': 'ng.cdk.tree',
#  '@angular/cdk-experimental': 'ng.cdkExperimental'
#}
#
## Rollup globals for cdk subpackages in the form of, e.g., {"@angular/cdk/table": "ng.cdk.table"}
#ROLLUP_GLOBALS.update({
#  "@gradii/triangle/%s" % p: "gd.tri.%s" % p for p in TRIANGLE_PACKAGES
#})
#
## UMD bundles for Angular packages and subpackges we depend on for development and testing.
#ANGULAR_LIBRARY_UMDS = [
#  "@npm//node_modules/@angular/animations:bundles/animations-browser.umd.js",
#  "@npm//node_modules/@angular/animations:bundles/animations.umd.js",
#  "@npm//node_modules/@angular/common:bundles/common-http-testing.umd.js",
#  "@npm//node_modules/@angular/common:bundles/common-http.umd.js",
#  "@npm//node_modules/@angular/common:bundles/common-testing.umd.js",
#  "@npm//node_modules/@angular/common:bundles/common.umd.js",
#  "@npm//node_modules/@angular/compiler:bundles/compiler-testing.umd.js",
#  "@npm//node_modules/@angular/compiler:bundles/compiler.umd.js",
#  "@npm//node_modules/@angular/core:bundles/core-testing.umd.js",
#  "@npm//node_modules/@angular/core:bundles/core.umd.js",
#  "@npm//node_modules/@angular/forms:bundles/forms.umd.js",
#  "@npm//node_modules/@angular/platform-browser-dynamic:bundles/platform-browser-dynamic-testing.umd.js",
#  "@npm//node_modules/@angular/platform-browser-dynamic:bundles/platform-browser-dynamic.umd.js",
#  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser-animations.umd.js",
#  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser-testing.umd.js",
#  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser.umd.js",
#]
