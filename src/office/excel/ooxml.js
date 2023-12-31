import map from './utils/map';
import createZip from './utils/create-zip';
import IntlService from './services/intl-service';
import dateToSerial from './utils/time';

const MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const DATA_URL_PREFIX = `data:${MIME_TYPE};base64,`;
const DATA_URL_OPTIONS = { compression: "DEFLATE", type: "base64" };
const BLOB_OPTIONS = { compression: "DEFLATE", type: "blob" };
const ARRAYBUFFER_OPTIONS = { compression: "DEFLATE", type: "arraybuffer" };

/* eslint-disable key-spacing, no-arrow-condition, indent, no-nested-ternary, consistent-return */

function toDataURI(content) {
    return DATA_URL_PREFIX + content;
}

function indexOf(thing, array) {
    return array.indexOf(thing);
}

const parseJSON = JSON.parse.bind(JSON);

function ESC(val) {
    return String(val)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/\'/g, "&#39;");
}

function repeat(count, func) {
    let str = "";
    for (let i = 0; i < count; ++i) {
        str += func(i);
    }
    return str;
}

function foreach(arr, func) {
    let str = "";
    if (arr != null) {
        if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; ++i) {
                str += func(arr[i], i);
            }
        } else if (typeof arr == "object") {
            Object.keys(arr).forEach((key, i) => {
                str += func(arr[key], key, i);
            });
        }
    }
    return str;
}

const XMLHEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r';

const RELS = `${XMLHEAD}
            <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
               <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
               <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
               <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
            </Relationships>`;

const CORE = ({ creator, lastModifiedBy, created, modified }) => `${XMLHEAD}
 <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
   xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"
   xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <dc:creator>${ESC(creator)}</dc:creator>
   <cp:lastModifiedBy>${ESC(lastModifiedBy)}</cp:lastModifiedBy>
   <dcterms:created xsi:type="dcterms:W3CDTF">${ESC(created)}</dcterms:created>
   <dcterms:modified xsi:type="dcterms:W3CDTF">${ESC(modified)}</dcterms:modified>
</cp:coreProperties>`;

const APP = ({ sheets }) => `${XMLHEAD}
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant>
        <vt:lpstr>Worksheets</vt:lpstr>
      </vt:variant>
      <vt:variant>
        <vt:i4>${sheets.length}</vt:i4>
      </vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="${sheets.length}" baseType="lpstr">${
      foreach(sheets, (sheet, i) =>
        sheet.options.title
          ? `<vt:lpstr>${ESC(sheet.options.title)}</vt:lpstr>`
          : `<vt:lpstr>Sheet${i + 1}</vt:lpstr>`
      )
    }</vt:vector>
  </TitlesOfParts>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>14.0300</AppVersion>
</Properties>`;

const CONTENT_TYPES = ({ sheetCount, commentFiles, drawingFiles }) => `${XMLHEAD}
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="gif" ContentType="image/gif"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
  <Default Extension="xml" ContentType="application/xml" />
  <Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  ${repeat(sheetCount, idx =>
    `<Override PartName="/xl/worksheets/sheet${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />`)}
  ${foreach(commentFiles, filename =>
    `<Override PartName="/xl/${filename}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml"/>`)}
  ${foreach(drawingFiles, filename =>
    `<Override PartName="/xl/drawings/${filename}" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`)}
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml" />
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" />
</Types>`;

const WORKBOOK = ({ sheets, filterNames, userNames }) => `${XMLHEAD}
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303" />
  <workbookPr defaultThemeVersion="124226" />
  <bookViews>
    <workbookView xWindow="240" yWindow="45" windowWidth="18195" windowHeight="7995" />
  </bookViews>
  <sheets>
  ${foreach(sheets, ({ options }, i) => {
    const name = options.name || options.title || `Sheet${i + 1}`;
    return `<sheet name="${ESC(name)}" sheetId="${i + 1}" r:id="rId${i + 1}" />`;
  })}
  </sheets>
  ${filterNames.length || userNames.length ? `
    <definedNames>
      ${foreach(filterNames, (f) => `
         <definedName name="_xlnm._FilterDatabase" hidden="1" localSheetId="${f.localSheetId}">${ESC(quoteSheet(f.name))}!${ESC(f.from)}:${ESC(f.to)}</definedName>`)}
      ${foreach(userNames, (f) => `
         <definedName name="${f.name}" hidden="${f.hidden ? 1 : 0}" ${f.localSheetId != null ? `localSheetId="${f.localSheetId}"` : ''}>${ESC(f.value)}</definedName>`)}
    </definedNames>` : ''}
  <calcPr fullCalcOnLoad="1" calcId="145621" />
</workbook>`;

const WORKSHEET = ({
    frozenColumns,
    frozenRows,
    columns,
    defaults,
    data,
    index,
    mergeCells,
    autoFilter,
    filter,
    showGridLines,
    hyperlinks,
    validations,
    defaultCellStyleId,
    rtl,
    legacyDrawing,
    drawing,
    lastRow,
    lastCol
}) => `${XMLHEAD}
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">
   ${lastRow && lastCol ? `<dimension ref="A1:${ref(lastRow - 1, lastCol - 1)}" />` : ""}

   <sheetViews>
     <sheetView ${ rtl ? 'rightToLeft="1"' : '' } ${index === 0 ? 'tabSelected="1"' : ''} workbookViewId="0" ${showGridLines === false ? 'showGridLines="0"' : ''}>
     ${frozenRows || frozenColumns ? `
       <pane state="frozen"
         ${frozenColumns ? `xSplit="${frozenColumns}"` : ''}
         ${frozenRows ? `ySplit="${frozenRows}"` : ''}
         topLeftCell="${String.fromCharCode(65 + (frozenColumns || 0)) + ((frozenRows || 0) + 1)}"
       />` : ''}
     </sheetView>
   </sheetViews>

   <sheetFormatPr x14ac:dyDescent="0.25" ${!defaults.skipCustomHeight ? 'customHeight="1"' : ''} defaultRowHeight="${defaults.rowHeight ? defaults.rowHeight * 0.75 : 15}"
     ${defaults.columnWidth ? `defaultColWidth="${toWidth(defaults.columnWidth)}"` : ''} />

   ${defaultCellStyleId != null || (columns && columns.length > 0) ? `
     <cols>
       ${!columns || !columns.length ? `
         <col min="1" max="16384" style="${defaultCellStyleId}"
              ${defaults.columnWidth ? `width="${toWidth(defaults.columnWidth)}"` : ''} /> ` : ''}
       ${foreach(columns, (column, ci) => {
         const columnIndex = typeof column.index === "number" ? column.index + 1 : (ci + 1);
         if (column.width === 0) {
           return `<col ${defaultCellStyleId != null ? `style="${defaultCellStyleId}"` : ''}
                        min="${columnIndex}" max="${columnIndex}" hidden="1" customWidth="1" />`;
         }
         return `<col ${defaultCellStyleId != null ? `style="${defaultCellStyleId}"` : ''}
                      min="${columnIndex}" max="${columnIndex}" customWidth="1"
                      ${column.autoWidth
                          ? `width="${((column.width * 7 + 5) / 7 * 256) / 256}" bestFit="1"`
                          : `width="${toWidth(column.width)}"`} />`;
       })}
     </cols>` : ''}

   <sheetData>
     ${foreach(data, (row, ri) => {
       const rowIndex = typeof row.index === "number" ? row.index + 1 : (ri + 1);
       return `
         <row r="${rowIndex}" x14ac:dyDescent="0.25"
              ${row.level ? `outlineLevel="${row.level}"` : ''}
              ${row.height === 0 ? 'hidden="1"'
                                 : row.height ? `ht="${toHeight(row.height)}" customHeight="1"` : ""}>
           ${foreach(row.data, (cell) => `
             <c r="${cell.ref}" ${cell.style ? `s="${cell.style}"` : ''} ${cell.type ? `t="${cell.type}"` : ''}>
               ${cell.formula != null ? writeFormula(cell.formula) : ''}
               ${cell.value != null ? `<v>${ESC(cell.value)}</v>` : ''}
             </c>`)}
         </row>
       `;})}
   </sheetData>

   ${autoFilter ? `<autoFilter ref="${autoFilter.from}:${autoFilter.to}"/>`
                : filter ? spreadsheetFilters(filter) : ''}

   ${mergeCells.length ? `
     <mergeCells count="${mergeCells.length}">
       ${foreach(mergeCells, (ref) => `<mergeCell ref="${ref}"/>`)}
     </mergeCells>` : ''}

   ${validations.length ? `
     <dataValidations>
       ${foreach(validations, (val) => `
         <dataValidation sqref="${val.sqref.join(" ")}"
                         showErrorMessage="${val.showErrorMessage}"
                         type="${ESC(val.type)}"
                         ${ val.type !== "list" ? `operator="${ESC(val.operator)}"` : ''}
                         allowBlank="${val.allowBlank}"
                         showDropDown="${val.showDropDown}"
                         ${val.error ? `error="${ESC(val.error)}"` : ''}
                         ${val.errorTitle ? `errorTitle="${ESC(val.errorTitle)}"` : ''}>
           ${val.formula1 ? `<formula1>${ESC(val.formula1)}</formula1>` : ''}
           ${val.formula2 ? `<formula2>${ESC(val.formula2)}</formula2>` : ''}
         </dataValidation>`)}
     </dataValidations>` : ''}

   ${hyperlinks.length ? `
     <hyperlinks>
       ${foreach(hyperlinks, (link) => `
         <hyperlink ref="${link.ref}" r:id="${link.rId}"/>`)}
     </hyperlinks>` : ''}

   <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3" />
   ${drawing ? `<drawing r:id="${drawing}"/>` : ''}
   ${legacyDrawing ? `<legacyDrawing r:id="${legacyDrawing}"/>` : ''}
</worksheet>`;

const WORKBOOK_RELS = ({ count }) => `${XMLHEAD}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${repeat(count, (idx) => `
    <Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${idx + 1}.xml" />`)}
  <Relationship Id="rId${count + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml" />
  <Relationship Id="rId${count + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml" />
</Relationships>`;

const WORKSHEET_RELS = ({ hyperlinks, comments, sheetIndex, drawings }) => `${XMLHEAD}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${foreach(hyperlinks, (link) => `
    <Relationship Id="${link.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${ESC(link.target)}" TargetMode="External" />`)}
  ${!comments.length ? '' : `
    <Relationship Id="comment${sheetIndex}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="../comments${sheetIndex}.xml"/>
    <Relationship Id="vml${sheetIndex}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" Target="../drawings/vmlDrawing${sheetIndex}.vml"/>`}
  ${!drawings.length ? '' : `
    <Relationship Id="drw${sheetIndex}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${sheetIndex}.xml"/>`}
</Relationships>`;

const COMMENTS_XML = ({ comments }) => `${XMLHEAD}
<comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <authors>
    <author></author>
  </authors>
  <commentList>
    ${foreach(comments, comment => `
      <comment ref="${comment.ref}" authorId="0">
        <text>
          <r>
            <rPr>
              <sz val="8"/>
              <color indexed="81"/>
              <rFont val="Tahoma"/>
              <charset val="1"/>
            </rPr>
            <t>${ESC(comment.text)}</t>
          </r>
        </text>
      </comment>`)}
  </commentList>
</comments>`;

const LEGACY_DRAWING = ({ comments }) => `\
<xml xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:o="urn:schemas-microsoft-com:office:office"
     xmlns:x="urn:schemas-microsoft-com:office:excel">
  <v:shapetype id="_x0000_t202" path="m,l,21600r21600,l21600,xe"></v:shapetype>
  ${foreach(comments, comment => `
    <v:shape type="#_x0000_t202" style="visibility: hidden" fillcolor="#ffffe1" o:insetmode="auto">
      <v:shadow on="t" color="black" obscured="t"/>
      <x:ClientData ObjectType="Note">
        <x:MoveWithCells/>
        <x:SizeWithCells/>
        <x:Anchor>${comment.anchor}</x:Anchor>
        <x:AutoFill>False</x:AutoFill>
        <x:Row>${comment.row}</x:Row>
        <x:Column>${comment.col}</x:Column>
      </x:ClientData>
    </v:shape>`)}
</xml>`;

const DRAWINGS_XML = (drawings) => `${XMLHEAD}
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
          xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  ${foreach(drawings, (drawing, index) => `
    <xdr:oneCellAnchor editAs="oneCell">
      <xdr:from>
        <xdr:col>${drawing.col}</xdr:col>
        <xdr:colOff>${drawing.colOffset}</xdr:colOff>
        <xdr:row>${drawing.row}</xdr:row>
        <xdr:rowOff>${drawing.rowOffset}</xdr:rowOff>
      </xdr:from>
      <xdr:ext cx="${drawing.width}" cy="${drawing.height}" />
      <xdr:pic>
        <xdr:nvPicPr>
          <xdr:cNvPr id="${index + 1}" name="Picture ${index + 1}"/>
          <xdr:cNvPicPr/>
        </xdr:nvPicPr>
        <xdr:blipFill>
          <a:blip r:embed="${drawing.imageId}"/>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </xdr:blipFill>
        <xdr:spPr>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </xdr:spPr>
      </xdr:pic>
      <xdr:clientData/>
    </xdr:oneCellAnchor>`)}
</xdr:wsDr>`;

const DRAWINGS_RELS_XML = (rels) => `${XMLHEAD}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${foreach(rels, rel => `
    <Relationship Id="${rel.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${rel.target}"/>`)}
</Relationships>`;

const SHARED_STRINGS = ({ count, uniqueCount, indexes }) => `${XMLHEAD}
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${count}" uniqueCount="${uniqueCount}">
  ${foreach(Object.keys(indexes), (index) => `
    <si><t xml:space="preserve">${ESC(index.substring(1))}</t></si>`)}
</sst>`;

const STYLES = ({
    formats,
    fonts,
    fills,
    borders,
    styles
}) => `${XMLHEAD}
<styleSheet
    xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="x14ac"
    xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">
  <numFmts count="${formats.length}">
  ${foreach(formats, (format, fi) => `
    <numFmt formatCode="${ESC(format.format)}" numFmtId="${165 + fi}" />`)}
  </numFmts>
  <fonts count="${fonts.length + 1}" x14ac:knownFonts="1">
    <font>
       <sz val="11" />
       <color theme="1" />
       <name val="Calibri" />
       <family val="2" />
       <scheme val="minor" />
    </font>
    ${foreach(fonts, (font) => `
    <font>
      ${font.bold ? '<b/>' : ''}
      ${font.italic ? '<i/>' : ''}
      ${font.underline ? '<u/>' : ''}
      <sz val="${font.fontSize || 11}" />
      ${font.color ? `<color rgb="${ESC(font.color)}" />` : '<color theme="1" />'}
      ${font.fontFamily ? `
        <name val="${ESC(font.fontFamily)}" />
        <family val="2" />
      ` : `
        <name val="Calibri" />
        <family val="2" />
        <scheme val="minor" />
      `}
    </font>`)}
  </fonts>
  <fills count="${fills.length + 2}">
      <fill><patternFill patternType="none"/></fill>
      <fill><patternFill patternType="gray125"/></fill>
    ${foreach(fills, (fill) => `
      ${fill.background ? `
        <fill>
          <patternFill patternType="solid">
              <fgColor rgb="${ESC(fill.background)}"/>
          </patternFill>
        </fill>
      ` : ''}`)}
  </fills>
  <borders count="${borders.length + 1}">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    ${foreach(borders, borderTemplate)}
  </borders>
  <cellStyleXfs count="1">
    <xf borderId="0" fillId="0" fontId="0" />
  </cellStyleXfs>
  <cellXfs count="${styles.length + 1}">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" />
    ${foreach(styles, (style) => `
      <xf xfId="0"
          ${style.fontId ? `fontId="${style.fontId}" applyFont="1"` : ''}
          ${style.fillId ? `fillId="${style.fillId}" applyFill="1"` : ''}
          ${style.numFmtId ? `numFmtId="${style.numFmtId}" applyNumberFormat="1"` : ''}
          ${style.textAlign || style.verticalAlign || style.wrap ? 'applyAlignment="1"' : ''}
          ${style.borderId ? `borderId="${style.borderId}" applyBorder="1"` : ''}>
        ${style.textAlign || style.verticalAlign || style.wrap ? `
        <alignment
          ${style.textAlign ? `horizontal="${ESC(style.textAlign)}"` : ''}
          ${style.verticalAlign ? `vertical="${ESC(style.verticalAlign)}"` : ''}
          ${style.indent ? `indent="${ESC(style.indent)}"` : ''}
          ${style.wrap ? 'wrapText="1"' : ''} />
        ` : ''}
      </xf>
    `)}
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
  <dxfs count="0" />
  <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleMedium9" />
</styleSheet>`;

function writeFormula(formula) {
    if (typeof formula == "string") {
        return `<f>${ESC(formula)}</f>`;
    }
    // array formulas
    return `<f t="array" ref="${formula.ref}">${ESC(formula.src)}</f>`;
}

function numChar(colIndex) {
   const letter = Math.floor(colIndex / 26) - 1;

   return (letter >= 0 ? numChar(letter) : "") + String.fromCharCode(65 + (colIndex % 26));
}

function ref(rowIndex, colIndex) {
    return numChar(colIndex) + (rowIndex + 1);
}

function $ref(rowIndex, colIndex) {
    return "$" + numChar(colIndex) + "$" + (rowIndex + 1);
}

function filterRowIndex(options) {
    const frozenRows = options.frozenRows || (options.freezePane || {}).rowSplit || 1;
    return frozenRows - 1;
}

function toWidth(px) {
    const maximumDigitWidth = 7;
    return (px / maximumDigitWidth) - (Math.floor(128 / maximumDigitWidth) / 256);
}

function toHeight(px) {
    return px * 0.75;
}

function stripFunnyChars(value) {
    return String(value)
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, "") // leave CRLF in
        .replace(/\r?\n/g, "\r\n");                   // make sure LF is preceded by CR
}

class Worksheet {

    constructor(options, sharedStrings, styles, borders) {
        this.options = options;
        this._strings = sharedStrings;
        this._styles = styles;
        this._borders = borders;
        this._validations = {};
        this._comments = [];
        this._drawings = options.drawings || [];
        this._hyperlinks = (this.options.hyperlinks || []).map(
            (link, i) => Object.assign({}, link, { rId: `link${i}` }));
    }

    relsToXML() {
        const hyperlinks = this._hyperlinks;
        const comments = this._comments;
        const drawings = this._drawings;

        if (hyperlinks.length || comments.length || drawings.length) {
            return WORKSHEET_RELS({
                hyperlinks : hyperlinks,
                comments   : comments,
                sheetIndex : this.options.sheetIndex,
                drawings   : drawings
            });
        }
    }

    toXML(index) {
        const mergeCells = this.options.mergedCells || [];
        const rows = this.options.rows || [];
        const data = inflate(rows, mergeCells);

        this._readCells(data);

        let autoFilter = this.options.filter;
        let filter;
        if (autoFilter && (typeof autoFilter.from === "number") && (typeof autoFilter.to === "number")) {
            // Grid enables auto filter
            autoFilter = {
                from: ref(filterRowIndex(this.options), autoFilter.from),
                to: ref(filterRowIndex(this.options), autoFilter.to)
            };
        } else if (autoFilter && autoFilter.ref && autoFilter.columns) {
            // this is probably from the Spreadsheet
            filter = autoFilter;
            autoFilter = null;
        }

        const validations = [];
        for (let i in this._validations) {
            if (Object.prototype.hasOwnProperty.call(this._validations, i)) {
                validations.push(this._validations[i]);
            }
        }

        let defaultCellStyleId = null;
        if (this.options.defaultCellStyle) {
            defaultCellStyleId = this._lookupStyle(this.options.defaultCellStyle);
        }

        const freezePane = this.options.freezePane || {};
        const defaults = this.options.defaults || {};
        const lastRow = this.options.rows ? this._getLastRow() : 1;
        const lastCol = this.options.rows ? this._getLastCol() : 1;

        return WORKSHEET({
            frozenColumns: this.options.frozenColumns || freezePane.colSplit,
            frozenRows: this.options.frozenRows || freezePane.rowSplit,
            columns: this.options.columns,
            defaults: defaults,
            data: data,
            index: index,
            mergeCells: mergeCells,
            autoFilter: autoFilter,
            filter: filter,
            showGridLines: this.options.showGridLines,
            hyperlinks: this._hyperlinks,
            validations: validations,
            defaultCellStyleId: defaultCellStyleId,
            rtl: this.options.rtl !== undefined ? this.options.rtl : defaults.rtl,
            legacyDrawing: this._comments.length ? `vml${this.options.sheetIndex}` : null,
            drawing: this._drawings.length ? `drw${this.options.sheetIndex}` : null,
            lastRow: lastRow,
            lastCol: lastCol
        });
    }

    commentsXML() {
        if (this._comments.length) {
            return COMMENTS_XML({ comments: this._comments });
        }
    }

    drawingsXML(images) {
        if (this._drawings.length) {
            let rels = {};
            let main = this._drawings.map(drw => {
                let ref = parseRef(drw.topLeftCell);
                let img = rels[drw.image];
                if (!img) {
                    img = rels[drw.image] = {
                        rId: `img${drw.image}`,
                        target: images[drw.image].target
                    };
                }
                return {
                    col       : ref.col,
                    colOffset : pixelsToExcel(drw.offsetX),
                    row       : ref.row,
                    rowOffset : pixelsToExcel(drw.offsetY),
                    width     : pixelsToExcel(drw.width),
                    height    : pixelsToExcel(drw.height),
                    imageId   : img.rId
                };
            });
            return {
                main: DRAWINGS_XML(main),
                rels: DRAWINGS_RELS_XML(rels)
            };
        }
    }

    legacyDrawing() {
        if (this._comments.length) {
            return LEGACY_DRAWING({ comments: this._comments });
        }
    }

    _lookupString(value) {
        const key = "$" + value;
        const index = this._strings.indexes[key];
        let result;

        if (index !== undefined) {
            result = index;
        } else {
            result = this._strings.indexes[key] = this._strings.uniqueCount;
            this._strings.uniqueCount ++;
        }

        this._strings.count ++;

        return result;
    }

    _lookupStyle(style) {
        const json = JSON.stringify(style);

        if (json === "{}") {
            return 0;
        }

        let index = indexOf(json, this._styles);

        if (index < 0) {
            index = this._styles.push(json) - 1;
        }

        // There is one default style
        return index + 1;
    }

    _lookupBorder(border) {
        const json = JSON.stringify(border);
        if (json === "{}") {
            return;
        }

        let index = indexOf(json, this._borders);
        if (index < 0) {
            index = this._borders.push(json) - 1;
        }

        // There is one default border
        return index + 1;
    }

    _readCells(rowData) {
        for (let i = 0; i < rowData.length; i++) {
            const row = rowData[i];
            const cells = row.cells;

            row.data = [];

            for (let j = 0; j < cells.length; j++) {
                const cellData = this._cell(cells[j], row.index, j);
                if (cellData) {
                    row.data.push(cellData);
                }
            }
        }
    }

    _cell(data, rowIndex, cellIndex) {
        if (!data || data === EMPTY_CELL) {
            return null;
        }

        let value = data.value;

        let border = {};

        if (data.borderLeft) {
            border.left = data.borderLeft;
        }

        if (data.borderRight) {
            border.right = data.borderRight;
        }

        if (data.borderTop) {
            border.top = data.borderTop;
        }

        if (data.borderBottom) {
            border.bottom = data.borderBottom;
        }

        border = this._lookupBorder(border);

        const defStyle = this.options.defaultCellStyle || {};
        let style = { borderId: border };

        (function(add) {
            add("color");
            add("background");
            add("bold");
            add("italic");
            add("underline");
            if (!add("fontFamily")) { add("fontName", "fontFamily"); }
            add("fontSize");
            add("format");
            if (!add("textAlign")) { add("hAlign", "textAlign"); }
            if (!add("verticalAlign")) { add("vAlign", "verticalAlign"); }
            add("wrap");
            add("indent");
        })(
            function(prop, target) {
                let val = data[prop];
                if (val === undefined) {
                    val = defStyle[prop];
                }
                if (val !== undefined) {
                    style[target || prop] = val;
                    return true;
                }
            }
        );

        const columns = this.options.columns || [];

        const column = columns[cellIndex];
        let type = typeof value;

        if (column && column.autoWidth && (!data.colSpan || data.colSpan === 1)) {
            let displayValue = value;

            // XXX: let's not bring kendo.toString in only for this.
            //      better wait until the spreadsheet engine is available as a separate
            //      component, then we can use a real Excel-like formatter.
            //
            if (type === "number") {
                // kendo.toString will not behave exactly like the Excel format
                // Still, it's the best we have available for estimating the character count.
                displayValue = IntlService.toString(value, data.format);
            }

            column.width = Math.max(column.width || 0, String(displayValue).length);
        }

        if (type === "string") {
            value = stripFunnyChars(value);
            value = this._lookupString(value);
            type = "s";
        } else if (type === "number") {
            type = "n";
        } else if (type === "boolean") {
            type = "b";
            value = Number(value);
        } else if (value && value.getTime) {
            type = null;
            value = dateToSerial(value);
            if (!style.format) {
                style.format = "mm-dd-yy";
            }
        } else {
            type = null;
            value = null;
        }

        style = this._lookupStyle(style);

        const cellName = ref(rowIndex, cellIndex);

        if (data.validation) {
            this._addValidation(data.validation, cellName);
        }

        if (data.comment) {
            let anchor = [
                cellIndex + 1,  // start column
                15,             // start column offset
                rowIndex,       // start row
                10,             // start row offset
                cellIndex + 3,  // end column
                15,             // end column offset
                rowIndex + 3,   // end row
                4               // end row offset
            ];
            this._comments.push({
                ref    : cellName,
                text   : data.comment,
                row    : rowIndex,
                col    : cellIndex,
                anchor : anchor.join(", ")
            });
        }

        return {
            value: value,
            formula: data.formula,
            type: type,
            style: style,
            ref: cellName
        };
    }

    _addValidation(v, ref) {
        const tmp = {
            showErrorMessage : v.type === "reject" ? 1 : 0,
            formula1         : v.from,
            formula2         : v.to,
            type             : MAP_EXCEL_TYPE[v.dataType] || v.dataType,
            operator         : MAP_EXCEL_OPERATOR[v.comparerType] || v.comparerType,
            allowBlank       : v.allowNulls ? 1 : 0,
            showDropDown     : v.showButton ? 0 : 1, // LOL, Excel!
            error            : v.messageTemplate,
            errorTitle       : v.titleTemplate
        };
        const json = JSON.stringify(tmp);
        if (!this._validations[json]) {
            this._validations[json] = tmp;
            tmp.sqref = [];
        }
        this._validations[json].sqref.push(ref);
    }

    _getLastRow() {
        return countData(this.options.rows);
    }

    _getLastCol() {
        let last = 0;
        this.options.rows.forEach(function(row) {
            if (row.cells) {
                last = Math.max(last, countData(row.cells));
            }
        });
        return last;
    }
}

function countData(data) {
    let last = data.length;
    data.forEach(function(el) {
        if (el.index && el.index >= last) {
            last = el.index + 1;
        }
    });
    return last;
}

const MAP_EXCEL_OPERATOR = {
    // includes only what differs; key is our operator, value is Excel
    // operator.
    greaterThanOrEqualTo : "greaterThanOrEqual",
    lessThanOrEqualTo    : "lessThanOrEqual"
};

const MAP_EXCEL_TYPE = {
    number: "decimal"
};

const defaultFormats = {
    "General": 0,
    "0": 1,
    "0.00": 2,
    "#,##0": 3,
    "#,##0.00": 4,
    "0%": 9,
    "0.00%": 10,
    "0.00E+00": 11,
    "# ?/?": 12,
    "# ??/??": 13,
    "mm-dd-yy": 14,
    "d-mmm-yy": 15,
    "d-mmm": 16,
    "mmm-yy": 17,
    "h:mm AM/PM": 18,
    "h:mm:ss AM/PM": 19,
    "h:mm": 20,
    "h:mm:ss": 21,
    "m/d/yy h:mm": 22,
    "#,##0 ;(#,##0)": 37,
    "#,##0 ;[Red](#,##0)": 38,
    "#,##0.00;(#,##0.00)": 39,
    "#,##0.00;[Red](#,##0.00)": 40,
    "mm:ss": 45,
    "[h]:mm:ss": 46,
    "mmss.0": 47,
    "##0.0E+0": 48,
    "@": 49,
    "[$-404]e/m/d": 27,
    "m/d/yy": 30,
    "t0": 59,
    "t0.00": 60,
    "t#,##0": 61,
    "t#,##0.00": 62,
    "t0%": 67,
    "t0.00%": 68,
    "t# ?/?": 69,
    "t# ??/??": 70
};

function convertColor(value) {
    let color = value;
    if (color.length < 6) {
        color = color.replace(/(\w)/g, function($0, $1) {
            return $1 + $1;
        });
    }

    color = color.substring(1).toUpperCase();

    if (color.length < 8) {
        color = "FF" + color;
    }

    return color;
}

class Workbook {

    constructor(options) {
        this.options = options || {};
        this._strings = {
            indexes: {},
            count: 0,
            uniqueCount: 0
        };
        this._styles = [];
        this._borders = [];
        this._images = this.options.images;
        this._imgId = 0;

        this._sheets = map(this.options.sheets || [], (options, i) => {
            options.defaults = this.options;
            options.sheetIndex = i + 1;
            return new Worksheet(options, this._strings, this._styles, this._borders);
        });
    }

    imageFilename(mimeType) {
        const id = ++this._imgId;
        switch (mimeType) {
          case "image/jpg":
          case "image/jpeg":
            return `image${id}.jpg`;
          case "image/png":
            return `image${id}.png`;
          case "image/gif":
            return `image${id}.gif`;
          default:
            return `image${id}.bin`; // XXX: anything better to do here?
        }
    }

    toZIP() {
        const zip = createZip();

        const docProps = zip.folder("docProps");

        docProps.file("core.xml", CORE({
            creator: this.options.creator || "Kendo UI",
            lastModifiedBy: this.options.creator || "Kendo UI",
            created: this.options.date || new Date().toJSON(),
            modified: this.options.date || new Date().toJSON()
        }));

        const sheetCount = this._sheets.length;

        docProps.file("app.xml", APP({ sheets: this._sheets }));

        const rels = zip.folder("_rels");
        rels.file(".rels", RELS);

        const xl = zip.folder("xl");

        const xlRels = xl.folder("_rels");
        xlRels.file("workbook.xml.rels", WORKBOOK_RELS({ count: sheetCount }));

        if (this._images) {
            const media = xl.folder("media");
            Object.keys(this._images).forEach(id => {
                const img = this._images[id];
                const filename = this.imageFilename(img.type);
                media.file(filename, img.data);
                img.target = `../media/${filename}`;
            });
        }

        const sheetIds = {};
        xl.file("workbook.xml", WORKBOOK({
            sheets: this._sheets,
            filterNames: map(this._sheets, function(sheet, index) {
                const options = sheet.options;
                const sheetName = (options.name || options.title || "Sheet" + (index + 1));
                sheetIds[sheetName.toLowerCase()] = index;
                const filter = options.filter;
                if (filter) {
                    if (filter.ref) {
                        // spreadsheet provides `ref`
                        let a = filter.ref.split(":");
                        let from = parseRef(a[0]);
                        let to = parseRef(a[1]);
                        return {
                            localSheetId: index,
                            name: sheetName,
                            from: $ref(from.row, from.col),
                            to: $ref(to.row, to.col)
                        };
                    } else if (typeof filter.from !== "undefined" && typeof filter.to !== "undefined") {
                        // grid does this
                        return {
                            localSheetId: index,
                            name: sheetName,
                            from: $ref(filterRowIndex(options), filter.from),
                            to: $ref(filterRowIndex(options), filter.to)
                        };
                    }
                }
            }),
            userNames: map(this.options.names || [], function(def) {
                return {
                    name: def.localName,
                    localSheetId: def.sheet ? sheetIds[def.sheet.toLowerCase()] : null,
                    value: def.value,
                    hidden: def.hidden
                };
            })
        }));

        const worksheets = xl.folder("worksheets");
        const drawings = xl.folder("drawings");
        const drawingsRels = drawings.folder("_rels");
        const sheetRels = worksheets.folder("_rels");
        const commentFiles = [];
        const drawingFiles = [];

        for (let idx = 0; idx < sheetCount; idx++) {
            const sheet = this._sheets[idx];
            const sheetName = `sheet${idx + 1}.xml`;
            const sheetXML = sheet.toXML(idx); // must be called before relsToXML
            const relsXML = sheet.relsToXML();
            const commentsXML = sheet.commentsXML();
            const legacyDrawing = sheet.legacyDrawing();
            const drawingsXML = sheet.drawingsXML(this._images);

            if (relsXML) {
                sheetRels.file(sheetName + ".rels", relsXML);
            }
            if (commentsXML) {
                let name = `comments${sheet.options.sheetIndex}.xml`;
                xl.file(name, commentsXML);
                commentFiles.push(name);
            }
            if (legacyDrawing) {
                drawings.file(`vmlDrawing${sheet.options.sheetIndex}.vml`, legacyDrawing);
            }
            if (drawingsXML) {
                let name = `drawing${sheet.options.sheetIndex}.xml`;
                drawings.file(name, drawingsXML.main);
                drawingsRels.file(`${name}.rels`, drawingsXML.rels);
                drawingFiles.push(name);
            }

            worksheets.file(sheetName, sheetXML);
        }

        const borders = map(this._borders, parseJSON);

        const styles = map(this._styles, parseJSON);

        const hasFont = function(style) {
            return style.underline || style.bold || style.italic || style.color || style.fontFamily || style.fontSize;
        };

        const convertFontSize = function(value) {
            let fontInPx = Number(value);
            let fontInPt;

            if (fontInPx) {
                fontInPt = fontInPx * 3 / 4;
            }

            return fontInPt;
        };

        const fonts = map(styles, function(style) {
            if (style.fontSize) {
                style.fontSize = convertFontSize(style.fontSize);
            }

            if (style.color) {
                style.color = convertColor(style.color);
            }

            if (hasFont(style)) {
                return style;
            }
        });

        const formats = map(styles, function(style) {
            if (style.format && defaultFormats[style.format] === undefined) {
                return style;
            }
        });

        const fills = map(styles, function(style) {
            if (style.background) {
                style.background = convertColor(style.background);
                return style;
            }
        });

        xl.file("styles.xml", STYLES({
            fonts: fonts,
            fills: fills,
            formats: formats,
            borders: borders,
            styles: map(styles, function(style) {
                const result = {};

                if (hasFont(style)) {
                    result.fontId = indexOf(style, fonts) + 1;
                }

                if (style.background) {
                    result.fillId = indexOf(style, fills) + 2;
                }

                result.textAlign = style.textAlign;
                result.indent = style.indent;
                result.verticalAlign = style.verticalAlign;
                result.wrap = style.wrap;
                result.borderId = style.borderId;

                if (style.format) {
                    if (defaultFormats[style.format] !== undefined) {
                        result.numFmtId = defaultFormats[style.format];
                    } else {
                        result.numFmtId = 165 + indexOf(style, formats);
                    }
                }

                return result;
            })
        }));

        xl.file("sharedStrings.xml", SHARED_STRINGS(this._strings));

        zip.file("[Content_Types].xml", CONTENT_TYPES({
            sheetCount: sheetCount,
            commentFiles: commentFiles,
            drawingFiles: drawingFiles
        }));

        return zip;
    }

    toDataURL() {
        const zip = this.toZIP();

        return zip.generateAsync ? zip.generateAsync(DATA_URL_OPTIONS).then(toDataURI) : toDataURI(zip.generate(DATA_URL_OPTIONS));
    }

    toBlob() {
        const zip = this.toZIP();
        if (zip.generateAsync) {
            return zip.generateAsync(BLOB_OPTIONS);
        }
        return new Blob([ zip.generate(ARRAYBUFFER_OPTIONS) ], { type: MIME_TYPE });
    }
}

function borderStyle(width) {
    let alias = "thin";

    if (width === 2) {
        alias = "medium";
    } else if (width === 3) {
        alias = "thick";
    }

    return alias;
}

function borderSideTemplate(name, style) {
    let result = "";

    if (style) {
        result += "<" + name + " style=\"" + borderStyle(style.size) + "\">";
        if (style.color) {
            result += "<color rgb=\"" + convertColor(style.color) + "\"/>";
        }
        result += "</" + name + ">";
    }

    return result;
}

function borderTemplate(border) {
    return "<border>" +
       borderSideTemplate("left", border.left) +
       borderSideTemplate("right", border.right) +
       borderSideTemplate("top", border.top) +
       borderSideTemplate("bottom", border.bottom) +
   "</border>";
}

const EMPTY_CELL = {};
function inflate(rows, mergedCells) {
    const rowData = [];
    const rowsByIndex = [];

    indexRows(rows, function(row, index) {
        const data = {
            _source: row,
            index: index,
            height: row.height,
            level: row.level,
            cells: []
        };

        rowData.push(data);
        rowsByIndex[index] = data;
    });

    const sorted = sortByIndex(rowData).slice(0);
    const ctx = {
        rowData: rowData,
        rowsByIndex: rowsByIndex,
        mergedCells: mergedCells
    };

    for (let i = 0; i < sorted.length; i++) {
        fillCells(sorted[i], ctx);
        delete sorted[i]._source;
    }

    return sortByIndex(rowData);
}

function indexRows(rows, callback) {
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row) {
            continue;
        }

        let index = row.index;
        if (typeof index !== "number") {
            index = i;
        }

        callback(row, index);
    }
}

function sortByIndex(items) {
    return items.sort(function(a, b) {
        return a.index - b.index;
    });
}

function pushUnique(array, el) {
    if (array.indexOf(el) < 0) {
        array.push(el);
    }
}

function getSpan(mergedCells, ref) {
    for (let i = 0; i < mergedCells.length; ++i) {
        const range = mergedCells[i];
        const a = range.split(":");
        let topLeft = a[0];
        if (topLeft === ref) {
            let bottomRight = a[1];
            topLeft = parseRef(topLeft);
            bottomRight = parseRef(bottomRight);
            return {
                rowSpan: bottomRight.row - topLeft.row + 1,
                colSpan: bottomRight.col - topLeft.col + 1
            };
        }
    }
}

function parseRef(ref) {
    function getcol(str) {
        let upperStr = str.toUpperCase();
        let col = 0;
        for (let i = 0; i < upperStr.length; ++i) {
            col = col * 26 + upperStr.charCodeAt(i) - 64;
        }
        return col - 1;
    }

    function getrow(str) {
        return parseInt(str, 10) - 1;
    }

    const m = /^([a-z]+)(\d+)$/i.exec(ref);
    return {
        row: getrow(m[2]),
        col: getcol(m[1])
    };
}

function pixelsToExcel(px) {
    return Math.round(px * 9525);
}

function fillCells(data, ctx) {
    const row = data._source;
    const rowIndex = data.index;
    const cells = row.cells;
    const cellData = data.cells;

    if (!cells) {
        return;
    }

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i] || EMPTY_CELL;

        let rowSpan = cell.rowSpan || 1;
        let colSpan = cell.colSpan || 1;

        const cellIndex = insertCell(cellData, cell);
        const topLeftRef = ref(rowIndex, cellIndex);

        if (rowSpan === 1 && colSpan === 1) {
            // could still be merged: the spreadsheet does not send
            // rowSpan/colSpan, but mergedCells is already populated.
            // https://github.com/telerik/kendo-ui-core/issues/2401
            const tmp = getSpan(ctx.mergedCells, topLeftRef);
            if (tmp) {
                colSpan = tmp.colSpan;
                rowSpan = tmp.rowSpan;
            }
        }

        spanCell(cell, cellData, cellIndex, colSpan);

        if (rowSpan > 1 || colSpan > 1) {
            pushUnique(ctx.mergedCells,
                       topLeftRef + ":" + ref(rowIndex + rowSpan - 1,
                                              cellIndex + colSpan - 1));
        }

        if (rowSpan > 1) {
            for (let ri = rowIndex + 1; ri < rowIndex + rowSpan; ri++) {
                let nextRow = ctx.rowsByIndex[ri];
                if (!nextRow) {
                    nextRow = ctx.rowsByIndex[ri] = { index: ri, cells: [] };
                    ctx.rowData.push(nextRow);
                }

                spanCell(cell, nextRow.cells, cellIndex - 1, colSpan + 1);
            }
        }
    }
}

function insertCell(data, cell) {
    let index;

    if (typeof cell.index === "number") {
        index = cell.index;
        insertCellAt(data, cell, cell.index);
    } else {
        index = appendCell(data, cell);
    }

    return index;
}

function insertCellAt(data, cell, index) {
    data[index] = cell;
}

function appendCell(data, cell) {
    let index = data.length;

    for (let i = 0; i < data.length + 1; i++) {
        if (!data[i]) {
            data[i] = cell;
            index = i;
            break;
        }
    }

    return index;
}

function spanCell(cell, row, startIndex, colSpan) {
    for (let i = 1; i < colSpan; i++) {
        const tmp = {
            borderTop    : cell.borderTop,
            borderRight  : cell.borderRight,
            borderBottom : cell.borderBottom,
            borderLeft   : cell.borderLeft
        };
        insertCellAt(row, tmp, startIndex + i);
    }
}

const SPREADSHEET_FILTERS = ({ ref, columns, generators }) => `
<autoFilter ref="${ref}">
  ${foreach(columns, (col) => `
    <filterColumn colId="${col.index}">
      ${generators[col.filter](col)}
    </filterColumn>
  `)}
</autoFilter>`;

const SPREADSHEET_CUSTOM_FILTER = ({ logic, criteria }) => `
<customFilters ${logic === 'and' ? 'and="1"' : ''}>
${foreach(criteria, (f) => {
    let op = spreadsheetFilters.customOperator(f);
    let val = spreadsheetFilters.customValue(f);
    return `<customFilter ${op ? `operator="${op}"` : ''} val="${val}"/>`;
})}
</customFilters>`;

const SPREADSHEET_DYNAMIC_FILTER = ({ type }) =>
`<dynamicFilter type="${spreadsheetFilters.dynamicFilterType(type)}" />`;

const SPREADSHEET_TOP_FILTER = ({ type, value }) =>
`<top10 percent="${/percent$/i.test(type) ? 1 : 0}"
       top="${/^top/i.test(type) ? 1 : 0}"
       val="${value}" />`;

const SPREADSHEET_VALUE_FILTER = ({ blanks, values }) =>
  `<filters ${blanks ? 'blank="1"' : ''}>
    ${foreach(values, (value) => `
      <filter val="${value}" />`)}
  </filters>`;

function spreadsheetFilters(filter) {
    return SPREADSHEET_FILTERS({
        ref: filter.ref,
        columns: filter.columns,
        generators: {
            custom  : SPREADSHEET_CUSTOM_FILTER,
            dynamic : SPREADSHEET_DYNAMIC_FILTER,
            top     : SPREADSHEET_TOP_FILTER,
            value   : SPREADSHEET_VALUE_FILTER
        }
    });
}

spreadsheetFilters.customOperator = function(f) {
    return {
        eq  : "equal",
        gt  : "greaterThan",
        gte : "greaterThanOrEqual",
        lt  : "lessThan",
        lte : "lessThanOrEqual",
        ne  : "notEqual",

        // These are not in the spec, but seems to be how Excel does
        // it (see customValue below).  For the non-negated versions,
        // the operator attribute is missing completely.
        doesnotstartwith: "notEqual",
        doesnotendwith: "notEqual",
        doesnotcontain: "notEqual",
        doesnotmatch: "notEqual"
    }[f.operator.toLowerCase()];
};

function quoteSheet(name) {
    if (/^\'/.test(name)) { // assume already quoted, the Spreadsheet does it.
        return name;
    }
    if (/^[a-z_][a-z0-9_]*$/i.test(name)) {
        return name;        // no need to quote it
    }
    return "'" + name.replace(/\x27/g, "\\'") + "'";
}

spreadsheetFilters.customValue = function(f) {
    function esc(str) {
        return str.replace(/([*?])/g, "~$1");
    }

    switch (f.operator.toLowerCase()) {
        case "startswith":
        case "doesnotstartwith":
            return esc(f.value) + "*";

        case "endswith":
        case "doesnotendwith":
            return "*" + esc(f.value);

        case "contains":
        case "doesnotcontain":
            return "*" + esc(f.value) + "*";

        default:
            return f.value;
    }
};

spreadsheetFilters.dynamicFilterType = function(type) {
    return {
        quarter1  : "Q1",
        quarter2  : "Q2",
        quarter3  : "Q3",
        quarter4  : "Q4",
        january   : "M1",
        february  : "M2",
        march     : "M3",
        april     : "M4",
        may       : "M5",
        june      : "M6",
        july      : "M7",
        august    : "M8",
        september : "M9",
        october   : "M10",
        november  : "M11",
        december  : "M12"
    }[type.toLowerCase()] || type;
};

export {
    Workbook,
    Worksheet
};
