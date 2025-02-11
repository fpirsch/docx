# Headers and Footers

!> Headers and Footers requires an understanding of [Sections](usage/sections.md).

## Example

Creating Headers and footers is simple. Access the `Header` and `Footer` by doing so like this:

```ts
doc.Header;
doc.Footer;
```

You can call the same methods as you would with a `File`:

```ts
doc.Header.createParagraph("Header text");
doc.Footer.createParagraph("Footer text");
```

Even add images:

```ts
doc.Header.createImage([BUFFER_OF_YOUR_IMAGE]);
doc.Footer.createImage([BUFFER_OF_YOUR_IMAGE]);
```

Refer to [`demo8.ts`](https://github.com/dolanmiu/docx/blob/master/demo/demo8.ts) for more information.

## Multiple Headers and Footers

Also all the supported section properties are implemented according to: http://officeopenxml.com/WPsection.php

### Example

```ts
    const header = this.document.createHeader();
    const footer = this.document.createFooter();

    // Add new section with another header and footer
    doc.addSection({
      headers: {
        default: header
      },
      footers: {
        default: footer
      },
      pageNumberStart: 1,
      pageNumberFormatType: docx.PageNumberFormat.DECIMAL,
    });
```


