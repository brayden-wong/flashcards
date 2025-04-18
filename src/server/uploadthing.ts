"use server";

import { UTApi } from "uploadthing/server";

const utApi = new UTApi();

export async function deleteFiles(keys: string[]) {
  const result = await utApi.deleteFiles(keys);

  return result.success;
}
