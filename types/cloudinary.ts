export interface CloudinaryUploadResult {
  asset_id?: string;
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | "raw";
  width?: number;
  height?: number;
  duration?: number;
}
