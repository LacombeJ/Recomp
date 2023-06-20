export const readBlob = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = (_progress: ProgressEvent<FileReader>) => {
      const result = reader.result.toString();
      resolve(result);
    };
  });
};
