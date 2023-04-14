export enum NodeKind {
  Unkonown = 0,

  InputNode = 1 << 1,

  CommandNode = 1 << 2,

  AnswerNode = 1 << 3,
}
