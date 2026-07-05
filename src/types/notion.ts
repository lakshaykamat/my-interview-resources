export type NotionRichText = {
  id: string;
  plainText: string;
  href: string | null;
  bold: boolean;
  italic: boolean;
  code: boolean;
  strikethrough: boolean;
  underline: boolean;
};

export type NotionTextBlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "toggle"
  | "quote"
  | "callout";

export type NotionTextBlock = {
  id: string;
  type: NotionTextBlockType;
  text: NotionRichText[];
  children: NotionContentBlock[];
};

export type NotionCodeBlock = {
  id: string;
  type: "code";
  language: string;
  text: NotionRichText[];
};

export type NotionDividerBlock = {
  id: string;
  type: "divider";
};

export type NotionChildPageBlock = {
  id: string;
  type: "child_page";
  title: string;
  children: NotionContentBlock[];
};

export type NotionTableRow = {
  id: string;
  cells: NotionRichText[][];
};

export type NotionTableBlock = {
  id: string;
  type: "table";
  hasColumnHeader: boolean;
  hasRowHeader: boolean;
  rows: NotionTableRow[];
};

export type NotionUnsupportedBlock = {
  id: string;
  type: "unsupported";
  blockType: string;
};

export type NotionContentBlock =
  | NotionTextBlock
  | NotionCodeBlock
  | NotionDividerBlock
  | NotionChildPageBlock
  | NotionTableBlock
  | NotionUnsupportedBlock;

export type NotionPageContent = {
  title: string;
  blocks: NotionContentBlock[];
};

export type NotionSetupState = {
  status: "setup";
  missingVariables: string[];
};

export type NotionSuccessState = {
  status: "success";
  page: NotionPageContent;
};

export type NotionErrorState = {
  status: "error";
  message: string;
};

export type NotionLoadState =
  | NotionSetupState
  | NotionSuccessState
  | NotionErrorState;
