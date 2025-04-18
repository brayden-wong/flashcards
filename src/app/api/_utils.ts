export interface Request<T> {
  json: () => Promise<T>;
}
