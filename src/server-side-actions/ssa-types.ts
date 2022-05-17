export interface ServerSideAction<
  P extends object,
  R extends void | Promise<void>
> {
  id: string;
  readonly url: string;
  run(params: P): R;
}
