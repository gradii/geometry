# List of all entry-points of the Angular CDK package.
TRIANGLE_ENTRYPOINTS = [
    # "affix",
    "accordion",
    "alert",
    "anchor",
    "auth",
    "autocomplete",
    "avatar",
    "back-top",
    "badge",
    "breadcrumb",
    "button",
    "button-toggle",
    "calendar",
    "card",
    "carousel",
    "cascader",
    "core",
    #  "data-grid",
    #  "data-iterator",
    #  "data-ix",
    #  "data-store",
    "data-query",
    "data-table",
    "date-picker",
    "desc-list",
    "diagram",
    "dialog",
    "dnd",
    "draggable",
    "drawer",
#    "dropdown",
    "empty",
    "form",
    "form-field",
    "grid",
    "grid-list",
    "i18n",
    "icon",
    #  "input-compose",
    "input",
    "input-number",
    "radio",
    "checkbox",
    "combobox",
    "select",
    "sidenav",
    "layout",
    "list",
    #  "locale",
    #  "math-date",
    #  "math-vector",
    "menu",
    "message",
    "modal",
    "navbar",
    "tree",
    "pagination",
    "confirm-popup",
    "popover",
    "progress",
    "rate",
    #  "root",
    "slider",
    "spin",
    "steps",
    "switch",
    "tab-nav-bar",
    "tabs",
    "tag",
    "time-picker",
    "timeline",
    "tooltip",
    "transfer",
    "util",
    "tree-view",
    "gridster",
#    "tree-select",
    #  "tree",
     "splitter",
]

TRIANGLE_TESTING_ENTRYPOINTS = [
    "core/testing",
]

TRIANGLE_ENTRYPOINTS_WITH_STYLES = [
    # "affix",
    "accordion",
    "alert",
    "anchor",
    "autocomplete",
    "avatar",
    "back-top",
    "badge",
    "breadcrumb",
    "button",
    "button-toggle",
    "calendar",
    "card",
    "carousel",
    "cascader",
    #  "core",
    #  "data-grid",
    #  "data-store",
    #  "data-query",
    "data-table",
    "date-picker",
    "desc-list",
    "diagram",
    "dialog",
    #  "draggable",
    "drawer",
#    "dropdown",
    "empty",
    "form",
    "form-field",
    #  "grid",
    "grid-list",
    "icon",
    #  "i18n",
    "input",
    "input-number",
    "list",
    "radio",
    "checkbox",
    "combobox",
    "select",
    "sidenav",
    "layout",
    #  "locale",
    #  "math-date",
    #  "math-vector",
    "menu",
    "message",
    "modal",
    "navbar",
    "tree",
    "pagination",
    "confirm-popup",
    "popover",
    "progress",
    "rate",
    #  "root",
    "slider",
    "spin",
    "steps",
    "switch",
    "tab-nav-bar",
    "tabs",
    "tag",
    "time-picker",
    "timeline",
    "tooltip",
    "transfer",
    #  "util",
    #  "tree",
    "tree-view",
    "gridster",
#    "tree-select",
    "splitter",
]

TRIANGLE_SCSS_LIBS = [
    "//src/triangle/%s:%s_scss_lib" % (p, p.replace("-", "_"))
    for p in TRIANGLE_ENTRYPOINTS_WITH_STYLES
]

TRIANGLE_TARGETS = ["//src/triangle"] + \
                   ["//src/triangle/%s" % ep for ep in TRIANGLE_ENTRYPOINTS]

TRIANGLE_TESTING_TARGETS = ["//src/triangle/%s" % ep for ep in TRIANGLE_TESTING_ENTRYPOINTS]
