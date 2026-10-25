// 올린 이미지를 작게 줄인다. 큰 사진도 빠르게 저장·로딩되도록 한다.
function resize(file: File, maxSize: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 올릴 수 있어요."));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 읽을 수 없어요. 다른 파일로 해보세요."));
    };
    img.src = url;
  });
}

export async function fileToDataUrl(file: File, maxSize = 640): Promise<string> {
  return (await resize(file, maxSize)).toDataURL("image/jpeg", 0.85);
}

export async function fileToJpegBlob(file: File, maxSize = 640): Promise<Blob> {
  const canvas = await resize(file, maxSize);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("이미지를 변환할 수 없어요."))), "image/jpeg", 0.85),
  );
}
