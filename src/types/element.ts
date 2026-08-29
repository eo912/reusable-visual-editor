export type ElementId = string;

export type Capabilities = {
  position?: true;
  scale?: true;
  rotation?: true;
  opacity?: true;
  size?: true;
};

export type EditableElementDef<TContent = unknown> = {
  id: ElementId;
  kind: string;
  capabilities: Capabilities;
  defaultContent?: TContent;
};
