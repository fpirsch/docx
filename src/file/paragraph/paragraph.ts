// http://officeopenxml.com/WPparagraph.php
import { FootnoteReferenceRun } from "file/footnotes/footnote/run/reference-run";
import { Image } from "file/media";
import { Num } from "file/numbering/num";
import { XmlComponent } from "file/xml-components";

import { Alignment, AlignmentType } from "./formatting/alignment";
import { Bidirectional } from "./formatting/bidirectional";
import { IBorderOptions, ThematicBreak } from "./formatting/border";
import { IIndentAttributesProperties, Indent } from "./formatting/indent";
import { KeepLines, KeepNext } from "./formatting/keep";
import { PageBreak, PageBreakBefore } from "./formatting/page-break";
import { ContextualSpacing, ISpacingProperties, Spacing } from "./formatting/spacing";
import { HeadingLevel, Style } from "./formatting/style";
import { CenterTabStop, LeaderType, LeftTabStop, MaxRightTabStop, RightTabStop } from "./formatting/tab-stop";
import { NumberProperties } from "./formatting/unordered-list";
import { Bookmark, Hyperlink, OutlineLevel } from "./links";
import { ParagraphProperties } from "./properties";
import { PictureRun, Run, SequentialIdentifier, TextRun } from "./run";

interface ITabStopOptions {
    readonly position: number;
    readonly leader?: LeaderType;
}

export interface IParagraphOptions {
    readonly text?: string;
    readonly border?: IBorderOptions;
    readonly spacing?: ISpacingProperties;
    readonly outlineLevel?: number;
    readonly alignment?: AlignmentType;
    readonly heading?: HeadingLevel;
    readonly bidirectional?: boolean;
    readonly thematicBreak?: boolean;
    readonly pageBreakBefore?: boolean;
    readonly contextualSpacing?: boolean;
    readonly indent?: IIndentAttributesProperties;
    readonly keepLines?: boolean;
    readonly keepNext?: boolean;
    readonly tabStop?: {
        readonly left?: ITabStopOptions;
        readonly right?: ITabStopOptions;
        readonly maxRight?: {
            readonly leader?: LeaderType;
        };
        readonly center?: ITabStopOptions;
    };
    readonly style?: string;
    readonly bullet?: {
        readonly level: number;
    };
    readonly numbering?: {
        readonly num: Num;
        readonly level: number;
        readonly custom?: boolean;
    };
    readonly children?: Array<TextRun | PictureRun | Hyperlink>;
}

export class Paragraph extends XmlComponent {
    private readonly properties: ParagraphProperties;

    constructor(options: string | PictureRun | IParagraphOptions) {
        super("w:p");

        if (typeof options === "string") {
            this.properties = new ParagraphProperties({});
            this.root.push(this.properties);
            this.root.push(new TextRun(options));
            return;
        }

        if (options instanceof PictureRun) {
            this.properties = new ParagraphProperties({});
            this.root.push(this.properties);
            this.root.push(options);
            return;
        }

        this.properties = new ParagraphProperties({
            border: options.border,
        });

        this.root.push(this.properties);

        if (options.text) {
            this.root.push(new TextRun(options.text));
        }

        if (options.spacing) {
            this.properties.push(new Spacing(options.spacing));
        }

        if (options.outlineLevel !== undefined) {
            this.properties.push(new OutlineLevel(options.outlineLevel));
        }

        if (options.alignment) {
            this.properties.push(new Alignment(options.alignment));
        }

        if (options.heading) {
            this.properties.push(new Style(options.heading));
        }

        if (options.bidirectional) {
            this.properties.push(new Bidirectional());
        }

        if (options.thematicBreak) {
            this.properties.push(new ThematicBreak());
        }

        if (options.pageBreakBefore) {
            this.properties.push(new PageBreakBefore());
        }

        if (options.contextualSpacing) {
            this.properties.push(new ContextualSpacing(options.contextualSpacing));
        }

        if (options.indent) {
            this.properties.push(new Indent(options.indent));
        }

        if (options.keepLines) {
            this.properties.push(new KeepLines());
        }

        if (options.keepNext) {
            this.properties.push(new KeepNext());
        }

        if (options.tabStop) {
            if (options.tabStop.left) {
                this.properties.push(new LeftTabStop(options.tabStop.left.position, options.tabStop.left.leader));
            }

            if (options.tabStop.right) {
                this.properties.push(new RightTabStop(options.tabStop.right.position, options.tabStop.right.leader));
            }

            if (options.tabStop.maxRight) {
                this.properties.push(new MaxRightTabStop(options.tabStop.maxRight.leader));
            }

            if (options.tabStop.center) {
                this.properties.push(new CenterTabStop(options.tabStop.center.position, options.tabStop.center.leader));
            }
        }

        if (options.style) {
            this.properties.push(new Style(options.style));
        }

        if (options.bullet) {
            this.properties.push(new Style("ListParagraph"));
            this.properties.push(new NumberProperties(1, options.bullet.level));
        }

        if (options.numbering) {
            if (!options.numbering.custom) {
                this.properties.push(new Style("ListParagraph"));
            }
            this.properties.push(new NumberProperties(options.numbering.num.id, options.numbering.level));
        }

        if (options.children) {
            for (const child of options.children) {
                this.root.push(child);
            }
        }
    }

    public addRun(run: Run): Paragraph {
        this.root.push(run);
        return this;
    }

    public addHyperLink(hyperlink: Hyperlink): Paragraph {
        this.root.push(hyperlink);
        return this;
    }

    public addBookmark(bookmark: Bookmark): Paragraph {
        // Bookmarks by spec have three components, a start, text, and end
        this.root.push(bookmark.start);
        this.root.push(bookmark.text);
        this.root.push(bookmark.end);
        return this;
    }

    public addImage(image: Image): PictureRun {
        const run = image.Run;
        this.addRun(run);

        return run;
    }

    public pageBreak(): Paragraph {
        this.root.push(new PageBreak());
        return this;
    }

    public referenceFootnote(id: number): Paragraph {
        this.root.push(new FootnoteReferenceRun(id));
        return this;
    }

    public addRunToFront(run: Run): Paragraph {
        this.root.splice(1, 0, run);
        return this;
    }

    public addSequentialIdentifier(identifier: string): Paragraph {
        this.root.push(new SequentialIdentifier(identifier));
        return this;
    }
}
